# Plan-Gen Improvement Plan

> Companion to `PLAN-GEN-AUDIT.md`. Sequenced engineering plan to take the
> diet-plan generator from "AI free-runs and we hope" to "AI is constrained,
> validated, scaled, and falls back gracefully."

## Headline metric

Today: AI output is type-checked only. No guarantee that recipes sum to
target kcal, hit macros, respect dietary tags, or fill all 21 slots.

Target: kcal-target accuracy within ±5% per day in 95% of generations,
with a deterministic fallback that never strands a user on the error screen.

---

## Phase 0 — Safety floors (ship within 2-3 days)

Cheap, defensive changes that close the most dangerous gaps. No architecture
change.

### 0.1 Clamp `dailyKcal` to safe minima (fixes G9)

**File:** `convex/lib/nutrition.ts`

```ts
const MIN_KCAL = { male: 1500, female: 1200, unspecified: 1350 };
const MAX_DEFICIT_PCT = 0.25;
const MAX_SURPLUS_PCT = 0.15;

export function dailyKcal(p) {
  const tdee = bmr(p) * ACTIVITY[p.activity];
  let dk = tdee + GOAL_DELTA[p.goal];

  if (p.goal === 'lose') {
    dk = Math.max(dk, tdee * (1 - MAX_DEFICIT_PCT), MIN_KCAL[p.sex]);
  }
  if (p.goal === 'gain') {
    dk = Math.min(dk, tdee * (1 + MAX_SURPLUS_PCT));
  }
  return Math.round(dk);
}
```

Also add an out-of-range guard on inputs (BMI < 16 or > 50 throws an
`appError('INPUT_OUT_OF_RANGE')` with a clear message instead of building a
700 kcal plan).

**Effort:** S · **Impact:** prevents clinically unsafe plans for petite users.

### 0.2 Tighten the Zod schema to match the prompt (fixes G1)

**File:** `convex/profileSetup.ts:79-101`

```ts
const RecipeOut = z.object({
  day: z.number().int().min(0).max(6),
  slot: z.enum(['breakfast', 'lunch', 'dinner']),   // drop 'snack'
  name: z.string().min(3).max(120),
  kcal: z.number().int().min(150).max(1500),
  proteinG: z.number().min(0).max(150),
  carbG: z.number().min(0).max(200),
  fatG: z.number().min(0).max(100),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    qty: z.string().min(1),
  })).min(1).max(20),
  method: z.array(z.string().min(3)).min(1).max(15),
});

const ResultSchema = z.object({
  recipes: z.array(RecipeOut).length(21),
}).refine(r => {
  const seen = new Set(r.recipes.map(x => `${x.day}-${x.slot}`));
  return seen.size === 21;
}, { message: 'Each (day, slot) must appear exactly once' });
```

Now non-conforming output triggers a retry instead of breaking the plan tab
silently.

**Effort:** S · **Impact:** eliminates the schema/prompt mismatch class of
bugs entirely.

### 0.3 Kill the stale doc reference (fixes G4)

Delete or correct `docs/AI-FIXES-PLAN.md:19`. No-op for users, but stops the
next engineer from chasing a fallback that doesn't exist.

---

## Phase 1 — Accuracy core (week 1-2)

The single biggest lever. After this phase, the kcal you display matches the
kcal the user actually eats.

### 1.1 Per-slot budgets in the prompt

**File:** `convex/profileSetup.ts:79-106`

Pre-compute per-slot targets and inject them explicitly:

```ts
const SLOT_SPLIT = { breakfast: 0.25, lunch: 0.40, dinner: 0.35 };

const perSlot = Object.fromEntries(
  Object.entries(SLOT_SPLIT).map(([slot, pct]) => [slot, {
    kcal: Math.round(dk * pct),
    p: Math.round(m.proteinG * pct),
    c: Math.round(m.carbG * pct),
    f: Math.round(m.fatG * pct),
  }])
);
```

Prompt becomes:

```
Daily target: 2259 kcal (169g P / 226g C / 75g F).

Each breakfast: 565 kcal ±10%, 42g P / 56g C / 19g F.
Each lunch:     904 kcal ±10%, 68g P / 90g C / 30g F.
Each dinner:    790 kcal ±10%, 59g P / 79g C / 26g F.

Return exactly 21 recipes — days 0..6, each with breakfast/lunch/dinner.
Each recipe MUST stay within ±10% of its slot's kcal target.
```

**Why:** models follow per-item targets much better than amortized totals.
This alone typically halves the kcal drift.

**Effort:** S · **Impact:** large.

### 1.2 Validator-retry loop

**File:** `convex/profileSetup.ts` (new helper) and a new
`convex/lib/planValidation.ts`.

```ts
// convex/lib/planValidation.ts
export function computeDrift(recipes, perSlot, dailyMacros, dk) {
  const byDaySlot = {};
  for (const r of recipes) byDaySlot[`${r.day}-${r.slot}`] = r;

  const missing = [];
  const slotErrors = [];
  let weekKcal = 0;

  for (let d = 0; d < 7; d++) {
    for (const slot of ['breakfast', 'lunch', 'dinner']) {
      const r = byDaySlot[`${d}-${slot}`];
      if (!r) { missing.push({ day: d, slot }); continue; }
      const t = perSlot[slot];
      const err = (r.kcal - t.kcal) / t.kcal;
      weekKcal += r.kcal;
      if (Math.abs(err) > 0.10) slotErrors.push({ day: d, slot, err, kcal: r.kcal, target: t.kcal });
    }
  }
  return {
    missing,
    slotErrors,
    weekKcalError: (weekKcal - dk * 7) / (dk * 7),
    needsRetry: missing.length > 0 || slotErrors.length > 3,
  };
}
```

In the action:

```ts
let result = await planTask.generateObject({ schema, system, prompt });
let drift = computeDrift(result.object.recipes, perSlot, m, dk);

if (drift.needsRetry) {
  const correctionPrompt = buildCorrectionPrompt(result.object.recipes, drift, perSlot);
  const retry = await planTask.generateObject({ schema, system, prompt: correctionPrompt });
  const retryDrift = computeDrift(retry.object.recipes, perSlot, m, dk);
  if (retryDrift.slotErrors.length < drift.slotErrors.length) {
    result = retry;
    drift = retryDrift;
  }
}
```

The correction prompt sends back the deltas:

```
Your previous plan had these issues. Fix only these slots, keep the rest:
- Day 2 lunch: 1340 kcal, target 904 (48% over)
- Day 4 dinner: missing
- Day 6 breakfast: 380 kcal, target 565 (33% under)
```

Cap at one retry. Burn ≤2 calls per generation. Log retry count in
`aiCalls`.

**Effort:** M · **Impact:** large. Closes G10.

### 1.3 Algorithmic scaler as the backstop

**File:** new `convex/lib/recipeScaler.ts`

After validation, scale ingredient quantities to close the residual gap.
Only kick in for small drifts (`0.85 < factor < 1.15`); larger drifts already
went through retry.

```ts
export function scaleRecipe(recipe, target) {
  const factor = target.kcal / recipe.kcal;
  if (factor < 0.85 || factor > 1.15) return recipe;     // out of range, leave alone

  return {
    ...recipe,
    kcal:     Math.round(recipe.kcal * factor),
    proteinG: Math.round(recipe.proteinG * factor),
    carbG:    Math.round(recipe.carbG * factor),
    fatG:     Math.round(recipe.fatG * factor),
    ingredients: recipe.ingredients.map(i => ({
      ...i,
      qty: scaleQuantityString(i.qty, factor),           // "150g" -> "141g", "2 eggs" -> "2 eggs"
    })),
  };
}
```

`scaleQuantityString` parses metric quantities and integer counts. Anything
it can't parse passes through unchanged.

**Why:** guarantees that the kcal shown to the user equals the kcal in the
ingredient list. Today they can diverge silently.

**Effort:** M · **Impact:** medium-high. Makes the displayed numbers
trustworthy.

### 1.4 Goal-aware macro splits

**File:** `convex/lib/nutrition.ts:34-40`

```ts
const MACRO_RATIOS = {
  lose:     { p: 0.40, c: 0.35, f: 0.25 },   // higher P preserves LBM in deficit
  maintain: { p: 0.30, c: 0.40, f: 0.30 },
  gain:     { p: 0.30, c: 0.45, f: 0.25 },   // more C for training fuel
};

export function macros(kcal, goal) {
  const r = MACRO_RATIOS[goal];
  return {
    proteinG: Math.round(kcal * r.p / 4),
    carbG:    Math.round(kcal * r.c / 4),
    fatG:     Math.round(kcal * r.f / 9),
  };
}
```

**Effort:** S · **Impact:** medium. Aligns with evidence-based nutrition.

### 1.5 Anchor protein to bodyweight (advanced)

**File:** `convex/lib/nutrition.ts`

Override the ratio-based protein with a per-kg target, then back-solve
carbs/fat from the residual:

```ts
const PROTEIN_PER_KG = { lose: 2.0, maintain: 1.8, gain: 1.8 };

export function macros(kcal, goal, weightKg) {
  const proteinG = Math.round(weightKg * PROTEIN_PER_KG[goal]);
  const proteinKcal = proteinG * 4;
  const residualKcal = Math.max(kcal - proteinKcal, 0);

  // split residual: 60% C / 40% F for lose, 70/30 for gain, 60/40 for maintain
  const carbPct = goal === 'gain' ? 0.70 : 0.60;
  return {
    proteinG,
    carbG: Math.round(residualKcal * carbPct / 4),
    fatG:  Math.round(residualKcal * (1 - carbPct) / 9),
  };
}
```

This is how a sports nutritionist would program. Scales naturally with body
size and goal in one move.

**Effort:** S · **Impact:** medium. Optional — pick 1.4 OR 1.5, not both.

---

## Phase 2 — Personalization (week 2-3)

Better recipes for the same numeric targets.

### 2.1 Pass qualitative context to the AI

The model currently sees only numbers. Add the qualitative framing:

```ts
const userContext = `
Building a 7-day plan for a ${age}-year-old ${sex} user.
Goal: ${describeGoal(goal)}.
Body: ${weightKg}kg, ${heightCm}cm, ${describeActivity(activity)}.
Dietary preferences: ${diet.join(', ') || 'none'}.
Schedule: wakes ${mealTimes.wake}, eats breakfast ${mealTimes.breakfast},
lunch ${mealTimes.lunch}, dinner ${mealTimes.dinner}, sleeps ${mealTimes.sleep}.
`.trim();
```

Inject before the numeric targets. Recipe selection becomes meaningfully
different at the same targets — leaner proteins for `lose`, denser meals
for `gain`, quicker prep when wake→breakfast is short, etc.

**Effort:** S · **Impact:** medium-high. Free quality lift.

### 2.2 Use `mealTimes` for slot kcal distribution (fixes G7)

**File:** `convex/lib/nutrition.ts` (new export)

```ts
export function slotSplitFor(mealTimes) {
  const gapBL = minutes(mealTimes.breakfast, mealTimes.lunch);
  const gapLD = minutes(mealTimes.lunch, mealTimes.dinner);
  const wakeBfast = minutes(mealTimes.wake, mealTimes.breakfast);
  const dinnerSleep = minutes(mealTimes.dinner, mealTimes.sleep);

  // base
  let split = { breakfast: 0.25, lunch: 0.40, dinner: 0.35 };

  // short wake→breakfast: lighter breakfast
  if (wakeBfast < 30) split = shift(split, 'breakfast', -0.05, 'lunch');
  // late dinner: lighter dinner
  if (dinnerSleep < 120) split = shift(split, 'dinner', -0.05, 'lunch');
  // long lunch→dinner gap: bigger lunch
  if (gapLD > 360) split = shift(split, 'dinner', -0.05, 'lunch');

  return split;
}
```

Schedule now actually influences the plan. Stops being a vestigial input.

**Effort:** M · **Impact:** medium.

### 2.3 Few-shot dietary tag examples

**File:** `convex/profileSetup.ts` system prompt.

Expand the system prompt with explicit failure modes:

```
Dietary tag handling:
- `no-pork`: exclude bacon, ham, prosciutto, chorizo, pepperoni, lard, gelatin (often porcine).
- `vegetarian`: no meat including fish/shellfish; dairy and eggs allowed.
- `vegan`: vegetarian + no dairy/eggs/honey/gelatin/whey.
- `gluten-free`: no wheat/barley/rye including soy sauce (use tamari), couscous, seitan.
- `dairy-free`: no milk/cheese/yogurt/butter/cream/whey.

Example compliant recipe for ['vegetarian', 'no-nuts']:
{
  "name": "Halloumi & Chickpea Bowl",
  "ingredients": [
    {"name": "halloumi", "qty": "120g"},
    {"name": "chickpeas (cooked)", "qty": "150g"},
    {"name": "cherry tomatoes", "qty": "100g"},
    {"name": "olive oil", "qty": "10ml"}
  ],
  "method": [...]
}
```

**Effort:** S · **Impact:** medium. Few-shot is the cheapest quality lever
in any prompt-based system.

### 2.4 Dietary tag validator

**File:** new `convex/lib/dietValidator.ts`

```ts
const BANNED = {
  vegetarian: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'bacon', /* ... */],
  vegan: [/* vegetarian list + */ 'milk', 'cheese', 'yogurt', 'butter', 'egg', 'honey'],
  'no-pork': ['pork', 'bacon', 'ham', 'prosciutto', 'chorizo', 'pepperoni'],
  'gluten-free': ['wheat', 'flour (white|all-purpose)', 'barley', 'rye', 'couscous', 'seitan'],
  // ...
};

export function validateDiet(recipe, tags) {
  const text = (recipe.name + ' ' + recipe.ingredients.map(i => i.name).join(' ')).toLowerCase();
  const violations = [];
  for (const tag of tags) {
    for (const term of BANNED[tag] || []) {
      if (text.includes(term)) violations.push({ tag, term, recipe: recipe.name });
    }
  }
  return violations;
}
```

Run after AI generation. Violations trigger a targeted regenerate for
just the offending recipes. Log violation rate per provider — useful
signal in 4.2.

**Effort:** M · **Impact:** medium. Defense in depth for the prompt.

---

## Phase 3 — Robustness (week 3-4)

Stop stranding users when the AI hiccups.

### 3.1 Rules-based fallback generator (fixes G3)

**File:** new `convex/lib/recipeLibrary.ts` + new `convex/lib/rulesPlanner.ts`

Curate a static library of 80-150 recipes, tagged with:

```ts
type LibraryRecipe = {
  id: string;
  name: string;
  slot: 'breakfast' | 'lunch' | 'dinner';
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  diet: string[];           // ['vegetarian', 'no-pork', ...]
  ingredients: { name: string; qty: string }[];
  method: string[];
  scalable: boolean;        // can we adjust qty to hit kcal?
};
```

Stored as a checked-in JSON. The planner:

```ts
export function rulesPlan(perSlot, diet, library) {
  const pool = library.filter(r => diet.every(tag => r.diet.includes(tag)));
  const plan = [];
  for (let day = 0; day < 7; day++) {
    for (const slot of ['breakfast', 'lunch', 'dinner']) {
      const candidates = pool.filter(r => r.slot === slot);
      // pick the candidate closest to slot target, avoid duplicates within 3 days
      const recent = plan.slice(-9).map(r => r.id);
      const pick = pickClosest(candidates, perSlot[slot], recent);
      plan.push(scaleRecipe(pick, perSlot[slot]));
    }
  }
  return plan;
}
```

In `commit`:

```ts
try {
  recipes = await runAiPlanGen(...);
} catch (err) {
  console.error('plan-gen ai failed, falling back', err);
  recipes = rulesPlan(perSlot, draft.diet, RECIPE_LIBRARY);
  generator = 'rules';                            // already supported by schema
}
```

Then `plan.create` writes `generator: 'rules'`. UI can optionally surface a
banner ("Made from our cookbook — tap regenerate for a personalized AI
plan"), but it doesn't have to.

**Effort:** L (the recipe library is the work). · **Impact:** large. No
user ever stranded.

### 3.2 Regenerate path (fixes G2)

**File:** new `convex/plan.ts` mutations + new UI buttons.

Two flavors:

**Full regenerate** — new internal action that:
1. Reads the current `profile` and active plan
2. Reuses cached `(dailyKcal, macros)` — math is deterministic, no need to redo
3. Calls AI with the same inputs (or a "make it different" instruction with the previous recipes in context)
4. Calls `internal.plan.create`, which already archives the old plan

Counts against the 5/day rate limit. Maybe bump that to 10/day given the
retry budget consumed by Phase 1.2.

**Per-slot regenerate** — swap one recipe:

```ts
export const regenerateSlot = action({
  args: { planId: v.id('plans'), day: v.number(), slot: v.string() },
  handler: async (ctx, args) => {
    const plan = await ctx.runQuery(internal.plan.byId, { planId });
    const target = perSlotFromPlan(plan)[args.slot];
    const recipe = await runAiOneShot(target, plan.diet, plan.recipes);
    await ctx.runMutation(internal.plan.swapRecipe, { planId, day, slot, recipe });
  },
});
```

~1/21 the tokens. Doesn't touch macros math, doesn't archive the plan,
keeps the other 20 recipes' favorite/done state intact.

**Effort:** M · **Impact:** large UX win.

### 3.3 Stable, deterministic recipe IDs (fixes G6)

**File:** `convex/profileSetup.ts:122` and `convex/plan.ts:189-207`

Replace `${tz}-${idx}-${day}-${slot}` with a content-stable hash:

```ts
import { createHash } from 'crypto';

function recipeIdFor(planId, day, slot) {
  return createHash('sha1')
    .update(`${planId}:${day}:${slot}`)
    .digest('hex')
    .slice(0, 12);
}
```

No timezone leak, stable across regenerations of the *same* plan, unique
across different plans (because `planId` differs). Per-slot regenerate
in 3.2 keeps the other 20 ids stable, so favorites/completion survive.

**Effort:** S · **Impact:** small but unblocks 3.2 cleanly.

### 3.4 Consolidate dual storage (fixes G5)

Pick one as the source of truth. Recommendation: keep `planRecipes` (the
normalized table) and drop the embedded `recipes[]` array on the next
schema migration. Until migration:

- Make all per-recipe mutations write to BOTH and read from `planRecipes`.
- Add a Convex internal cron that nightly checks consistency and logs
  drift.

**Effort:** M (M+ if you want a full migration) · **Impact:** low risk
but real cleanup.

---

## Phase 4 — Measurement & iteration (ongoing)

You can't improve what you don't measure.

### 4.1 Drift metrics in `aiCalls`

**File:** `convex/lib/aiTelemetry.ts` + `convex/lib/planValidation.ts`

Extend the `aiCalls` row schema:

```ts
{
  // existing
  task, providerModel, inputTokens, outputTokens, ms, ok, costUsd, errorCode,
  // new for plan-gen
  retryCount: number,
  weekKcalErrorPct: number,
  maxSlotErrorPct: number,
  dietViolations: number,
  scaledRecipes: number,
  generator: 'llm' | 'llm-retry' | 'llm-scaled' | 'rules',
}
```

Dashboards: error rate by provider, drift distribution, fallback frequency.
This is the substrate for everything below.

**Effort:** S · **Impact:** high. Zero user-facing change, huge for the team.

### 4.2 A/B providers

Already supported by `resolveModelId` in `convex/ai/index.ts`. Add a
deterministic bucketing function on `userId`:

```ts
function pickProvider(userId, task) {
  const hash = simpleHash(userId + ':' + task);
  const variants = ['google:gemini-3-flash-preview', 'anthropic:claude-haiku-4-5', 'openai:gpt-4o-mini'];
  return variants[hash % variants.length];
}
```

Override `AI_PLAN_GEN_MODEL` per-user via the provider router. Compare 4.1
metrics across variants weekly. Roll forward to the winner.

**Effort:** S · **Impact:** medium-high. The framework is already there.

### 4.3 User feedback signals

Surface a thumbs-up/down on `plan-reveal` and per-recipe in the plan tab.
Log to a new `planFeedback` table joined to `aiCalls.id`. Pair quantitative
drift with qualitative satisfaction.

Combined with 4.2, you can pick providers on user preference, not just
math accuracy.

**Effort:** M · **Impact:** medium.

### 4.4 Caching layer (optional, only if costs spike)

Bucket users by `(kcal_bucket: 100-kcal bins, diet_tags_sorted, goal)`.
On `commit`, check if a cached plan exists for this bucket created in the
last 30 days. If yes, fork it (new ids, same recipes) and skip the AI
call. Refresh the cache weekly per bucket.

**Effort:** L · **Impact:** mostly a cost lever, modest accuracy effect.

---

## Housekeeping (anytime)

| # | Item | Effort |
|---|------|--------|
| H1 | Bump rate limit from 5/day to 10/day to account for retries in Phase 1.2 | S |
| H2 | Delete or correct `docs/AI-FIXES-PLAN.md:19` (G4) | S |
| H3 | Type-narrow the `recipeId` field on `planRecipes` once 3.3 ships | S |
| H4 | Add unit tests in `convex/lib/nutrition.test.ts` covering clamps, sex offsets, macro splits | S |
| H5 | Add contract tests for `computeDrift`, `scaleRecipe`, `rulesPlan` | M |

---

## Suggested rollout

| Week | Ships |
|------|-------|
| W1 | 0.1, 0.2, 0.3, H1, H2, H4 |
| W2 | 1.1, 1.2, 1.4 |
| W3 | 1.3, 2.1, 2.2 |
| W4 | 2.3, 2.4, 3.3 |
| W5 | 3.2 (regenerate path) |
| W6-7 | 3.1 (rules fallback — recipe library is the slow part) |
| W8+ | 3.4, 4.1, 4.2, 4.3 |

Each phase is independently shippable. Phase 0 alone is meaningful safety;
Phase 1 alone is meaningful accuracy. You don't need to commit to all of
it up front.

---

## Success criteria

After Phase 0+1:
- 0 plans with `dailyKcal < 1200`.
- 95% of plans within ±10% of target kcal/day.
- 0 plans with missing `(day, slot)` pairs reaching the client.

After Phase 2:
- Dietary tag violation rate < 1% (measured by 2.4 validator).
- Median user-reported satisfaction (4.3) ≥ 4/5.

After Phase 3:
- 0 users stranded on `AI_FAILED` error screen (fallback always serves a plan).
- Regenerate adoption ≥ 30% within first week of users completing onboarding.

After Phase 4:
- Provider picked on quantitative + qualitative data, not vibes.
- Cost per plan visible per provider in the dashboard.
