# Audit — Custom Diet Plan Generation

## Context

Full audit of how custom diet plan is generated: input/output params, data passed to AI agent, AI agent response shape. Read-only audit, not implementation plan — no code changes proposed.

Pipeline lives across one client screen, one Convex Node action, one provider router, and one internal mutation. Single entry point. No regenerate path today (plan rebuilt only on onboarding commit).

---

## End-to-end Flow

```
onboarding screens (welcome → body → goal → activity-level → diet → schedule)
    ↓ writes draft to AppContext
app/onboarding/compute.tsx           (client trigger)
    ↓ useAction(api.profileSetup.commit)({ draft })
convex/profileSetup.ts::commit       (Node action, 'use node')
    ├─ users.ensureMeFromIdentity    (idempotent user row)
    ├─ profile.create                (persist profile)
    ├─ onboarding.seedDefaults       (permissionGrants/notifPrefs/integrations)
    ├─ nutrition.dailyKcal + macros  (deterministic TDEE + macro split)
    ├─ ai.task('plan-gen').generateObject(...)   ← LLM CALL
    │     wrapped in withAiTelemetry (rate limit + aiCalls row)
    └─ plan.create (internalMutation)            (archive old, insert plan + planRecipes)
        ↓
app/onboarding/plan-reveal.tsx       (useQuery api.me.get → reads kcal/day)
app/(tabs)/plan/index.tsx            (useQuery api.plan.active → renders recipes)
```

---

## 1. Client Inputs (AppContext draft)

File: `app/onboarding/compute.tsx:74-86`. Pulls from `context/AppContext.tsx` state, applies two label→enum maps, sends one arg:

```ts
commit({ draft: {
  goal: GOAL_MAP[state.goal] ?? 'lose',          // 'lose'|'maintain'|'gain'
  weightKg: state.weight,                         // number
  targetKg: state.target,                         // number
  heightCm: state.height,                         // number
  age: state.age,                                 // number
  sex: state.sex,                                 // 'male'|'female'|'unspecified'
  activity: ACTIVITY_MAP[state.activity] ?? 'mod',// 'sed'|'light'|'mod'|'active'
  diet: state.diet,                               // string[]  e.g. ['vegetarian','no-pork']
  mealTimes: state.mealTimes,                     // { wake, breakfast, lunch, dinner, sleep }
  tz: getDeviceTimezone(),                        // IANA tz id
}})
```

Label maps (`compute.tsx:17-29`):
- `'Lose weight'→'lose'`, `'Maintain'→'maintain'`, `'Build muscle'→'gain'`, `'Eat better'→'maintain'`
- `sed→sed`, `lite→light`, `active→mod`, `athlete→active`

UX during wait (`compute.tsx:42-49, 102-106`): 4-step fake progress animation (`Calculating TDEE → Setting deficit → Choosing meals → Building 26-week curve`), 750ms per step. Real action runs in parallel `useEffect`. Navigates to `plan-reveal` only when both `actionDone && animDone`. Error → `Alert` "Plan generation failed" with Back button. No retry button. No "regenerate plan" UI anywhere in repo.

---

## 2. Server Input Validation

File: `convex/profileSetup.ts:11-31`. Convex `v.object` schema matches draft 1:1, all enums constrained via `v.union(v.literal(...))`. Auth: `ctx.auth.getUserIdentity()` required, throws `UNAUTHENTICATED` if missing (`profileSetup.ts:34-41`). No `userId` arg from client — derived from Clerk identity per `CLAUDE.md` rules.

---

## 3. Deterministic Pre-compute (no AI)

File: `convex/lib/nutrition.ts`. Pure math, no DB.

- **BMR** (Mifflin-St Jeor, `nutrition.ts:12-18`):
  `base = 10·kg + 6.25·cm − 5·age`
  male `+5`, female `−161`, unspecified `−78`
- **TDEE** = `BMR × activityMult` (`nutrition.ts:5-10`): sed 1.2, light 1.375, mod 1.55, active 1.725
- **Goal adjustment** (`nutrition.ts:30`): lose `−500`, gain `+400`, maintain `0`
- **Macro split** 30/40/30 P/C/F (`nutrition.ts:34-40`): protein g = kcal·0.30/4, carb g = kcal·0.40/4, fat g = kcal·0.30/9
- **weeksToTarget** = `ceil(|delta|/0.5)` (0.5 kg/week)

Result: `dk` (number kcal), `m = { proteinG, carbG, fatG }`. These pass to AI AND to `plan.create` mutation directly — AI does NOT compute kcal/macros, only picks recipes that hit those numbers.

---

## 4. AI Call

File: `convex/profileSetup.ts:79-106`.

### Output Zod schema (what AI must return)

```ts
RecipeOut = z.object({
  day: z.number().int().min(0).max(6),
  slot: z.enum(['breakfast','lunch','dinner','snack']),
  name: z.string(),
  kcal: z.number(),
  proteinG: z.number(),
  carbG: z.number(),
  fatG: z.number(),
  ingredients: z.array(z.object({ name: z.string(), qty: z.string() })).min(1),
  method: z.array(z.string()).min(1),
})
ResultSchema = z.object({ recipes: z.array(RecipeOut).min(14).max(28) })
```

No `heroTone`, no `isFavorite`, no `doneAt` from AI — those are post-hoc fields added downstream.

### System prompt (verbatim)

> You build personal weekly meal plans. You MUST output exactly 21 recipes covering days 0,1,2,3,4,5,6 with slots breakfast, lunch, dinner for each day (3 recipes per day). Do not stop until all 21 recipes are emitted. Respect dietary tags strictly. Recipes must be simple, real-world. Use metric ingredient quantities (g, ml, count).

### User prompt template (verbatim)

> Daily target: `${dk}` kcal · `${m.proteinG}`g P / `${m.carbG}`g C / `${m.fatG}`g F.
> Dietary tags: `${draft.diet.join(', ') || 'none'}`.
> Meal times: `${JSON.stringify(draft.mealTimes)}`.
> Return the full 7-day plan now (21 recipes total, days 0-6, each with breakfast+lunch+dinner).

Inconsistency: schema allows snack + 14-28 recipes, prompt demands exactly 21 with no snack. Schema is the validator; prompt is advisory. Net effect: if model returns 14-20 or includes snacks, Zod passes but UI may break (plan tab assumes 3 slots/day, `plan/index.tsx:54-57`).

### Provider routing

File: `convex/ai/index.ts`. Task `'plan-gen'` resolves via `resolveModelId` → `process.env.AI_PLAN_GEN_MODEL ?? DEFAULTS['plan-gen']`. Default: **`google:gemini-3-flash-preview`** (`ai/index.ts:31`). Provider registry covers anthropic / openai / groq / google / free (NVIDIA NIM, `ai/index.ts:18-24`).

Settings for plan-gen (`ai/index.ts:69-74, 78-82`):
- Google: `maxOutputTokens: 32000`, `thinkingLevel: 'low'`, temperature default 1.0 (Gemini-recommended)
- Free (NVIDIA Nemotron): `temperature: 0.2`, `maxOutputTokens: 16384`, thinking disabled
- Anthropic / OpenAI / Groq: no special settings, default SDK behavior

NIM bypass (`ai/index.ts:161-226`): NVIDIA OpenAI-compatible endpoint can't do `response_format:json_schema`, so `generateObject` is routed through a forced tool call (`tool({ name:'answer', inputSchema: schema })`) with up to 3 levels of double-JSON-decode fallback. Other providers use native `generateObject`.

### Telemetry + rate limit wrapper

File: `convex/lib/aiTelemetry.ts`. `withAiTelemetry` calls `checkAiRateLimit` first (`rateLimit.ts:14`: **5 plan-gen calls per user per 24h**), times the call, writes one row to `aiCalls` table via `internal.logs.recordAiCall` with `{ task, providerModel, inputTokens, outputTokens, ms, ok, costUsd }`. Cost from `convex/ai/pricing.ts::estimateCostUsd`. On throw, writes `ok:false` row with `errorCode` then re-throws.

Wrapped via `aiTelemetry.ts:9-13`:
```ts
withAiTelemetry(ctx, { userId, task: 'plan-gen', modelId: planTask.modelId }, async () => {
  const result = await planTask.generateObject({ schema, system, prompt });
  return { value: result.object.recipes, usage: result.usage };
});
```

### Error handling

`profileSetup.ts:107-112`: any throw caught, logged `console.error('plan-gen failed', err)`, rethrown as `appError('AI_FAILED', 'Plan generation failed, please retry', { detail: ... })`. No retry, no fallback stub (despite `docs/AI-FIXES-PLAN.md:19` referencing a "pre-existing fallback at profileSetup.ts:101-114" — no such fallback exists in current code; doc is stale).

---

## 5. Persistence

File: `convex/plan.ts:157-219` — `internal.plan.create`.

1. Archive any existing active plan: `status:'archived', activeTo:now` (`plan.ts:170-173`)
2. Insert into `plans` table (`plan.ts:175-187`): `{ userId, dailyKcal, proteinG, carbG, fatG, recipes, shopping:[], generator:'llm', activeFrom:now, activeTo:now+7d, status:'active' }`. Recipes embedded as denormalized array.
3. ALSO insert one row per recipe into `planRecipes` table (`plan.ts:189-207`) — same data, normalized, keyed by `planId`, with `legacyRecipeId` = the synthesized string id `${tz}-${idx}-${day}-${slot}` from `profileSetup.ts:122`.
4. Patch `profile.activePlanId = planId` (`plan.ts:209-215`).

Dual storage = legacy embedded array + new normalized table. `lib/plans.ts::getPlanRecipes` prefers `planRecipes` rows (sorted by day, slot, _creationTime); falls back to embedded `plan.recipes` if no rows (`plans.ts:31-60`).

`commit` return value (`profileSetup.ts:140-144`): `{ userId, dailyKcal, weeksToFinish }`. Client doesn't use the return — relies on Convex subscription replay via `useQuery(api.me.get)` and `useQuery(api.plan.active)` to refetch.

---

## 6. Read Path

- `api.plan.active` (`plan.ts:30-37`) → `toActivePlanDto` (`plans.ts:62-78`) returns `{ id, dailyKcal, proteinG, carbG, fatG, recipes, shopping, generator, activeFrom, activeTo, status }`
- `plan-reveal.tsx:21` uses `api.me.get` to surface `activePlan.dailyKcal`
- `(tabs)/plan/index.tsx:36` subscribes to `api.plan.active`, filters by `dayInPlan = floor((now − activeFrom)/86_400_000) % 7`, sorts by `SLOT_ORDER`. Hard-codes 3 slots only — confirms 21-recipe assumption.
- Mutations on plan: `markRecipeDone`, `toggleRecipeFavorite`, `addToShopping`, `toggleShoppingItem` — all per-recipe, no regeneration.

---

## 7. Gaps + Risks (findings)

| # | Finding | File:line | Severity |
|---|---------|-----------|----------|
| G1 | Prompt says "21 recipes, breakfast/lunch/dinner only" but schema allows snack + 14-28. UI assumes 3 slots/day. Mismatch = silent under/over-generation passes Zod, breaks plan tab. | profileSetup.ts:90,101 vs plan/index.tsx:54 | medium |
| G2 | No regenerate button anywhere. Plan only built once on commit; archive flag exists but no path to fire `internal.plan.create` again. | repo-wide | medium |
| G3 | `AI_FAILED` is fatal — no fallback rules-based generator despite schema supporting `generator:'rules'` (plan.ts:165). User stuck on error screen. | profileSetup.ts:107-112 | medium |
| G4 | Stale doc claim of fallback at profileSetup.ts:101-114. Doesn't exist. | docs/AI-FIXES-PLAN.md:19 | low (doc) |
| G5 | Dual storage (embedded `plan.recipes` + `planRecipes` table) — risk of drift if mutations only patch one side. `markRecipeDone` patches `planRecipes` when `planRecipeId` given, embedded array otherwise. | plan.ts:43-67 | low |
| G6 | Recipe `id` is `${tz}-${idx}-${day}-${slot}` — not stable across regenerations, contains user tz. Fine today (no regen) but couples ids to onboarding context. | profileSetup.ts:122 | low |
| G7 | `mealTimes` is sent to AI as raw JSON in prompt but unused for scheduling — AI is told slots are b/l/d, times never feed slot timing. plan tab hardcodes `SLOT_TIME`. | profileSetup.ts:102 vs plan/index.tsx:15-20 | low |
| G8 | Rate limit 5/day — onboarding retry budget is tight if first call fails. | rateLimit.ts:14 | low |
| G9 | `dailyKcal` adjustment is fixed −500/+400 — no clamp for very small users, could produce sub-1200 kcal targets for petite "lose" users. | nutrition.ts:30-31 | medium |
| G10 | No validation that `recipes[].kcal` sum approximates `dailyKcal × 7` — AI free to drift wildly from targets. Zod only checks types. | profileSetup.ts:79-90 | medium |

---

## 8. Summary Table — Inputs/Outputs

| Layer | In | Out |
|-------|-----|-----|
| `compute.tsx` | AppContext state (height/weight/target/age/sex/activity/goal/diet/mealTimes) | `{ userId, dailyKcal, weeksToFinish }` (unused) |
| `profileSetup.commit` action | `{ draft: {goal, weightKg, targetKg, heightCm, age, sex, activity, diet[], mealTimes, tz} }` | Same as above |
| `nutrition.dailyKcal` + `macros` | weight/height/age/sex/activity/goal | `dk` number, `{proteinG, carbG, fatG}` |
| `ai.task('plan-gen').generateObject` | system + prompt + Zod schema | `{ recipes: Recipe[] }` 14-28 items |
| `internal.plan.create` | userId, kcal, macros, recipes[], generator | planId; writes `plans` + `planRecipes` rows |
| `api.plan.active` query | (auth) | Plan DTO with recipes joined |

---

## Critical files

- `convex/profileSetup.ts` — action, prompt, schema (the heart of plan-gen)
- `convex/plan.ts` — `create` mutation + read queries + per-recipe mutations
- `convex/lib/nutrition.ts` — deterministic kcal/macro math
- `convex/lib/plans.ts` — read-side dto + active plan resolver
- `convex/ai/index.ts` — provider registry, settings, NIM tool-call workaround
- `convex/lib/aiTelemetry.ts` — rate limit + aiCalls logging wrapper
- `convex/lib/rateLimit.ts` — plan-gen capped 5/day
- `app/onboarding/compute.tsx` — client trigger + fake progress UX
- `app/onboarding/plan-reveal.tsx` — post-gen reveal screen
- `app/(tabs)/plan/index.tsx` — daily render assuming 21 recipes (3 slots × 7 days)

## Verification

To exercise pipeline end-to-end:
1. `npx convex dev` (regenerate `_generated/api`)
2. `npm start` → custom dev client → complete onboarding (welcome → permissions)
3. Inspect Convex dashboard: `plans` row (status='active', 7-day window), `planRecipes` (21 rows expected), `aiCalls` (one row, task='plan-gen', ok=true, ms<60000, providerModel=`google:gemini-3-flash-preview` or override)
4. `npx vitest run convex/modelContracts.test.ts -t "plan"` — contract tests for plan queries
