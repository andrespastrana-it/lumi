# AI Layer Fixes — Implementation Plan

## Context

`convex/ai/index.ts` was refactored to a provider registry (Option B). All three language-model tasks (`coach`, `vision`, `plan-gen`) now default to `free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` via NVIDIA NIM through `@ai-sdk/openai-compatible`. `FREE_API_KEY` is set on dev deployment `dynamic-wolverine-543`. Anthropic / OpenAI / Groq are still wired and ready behind env-var overrides.

This plan addresses six follow-ups uncovered while wiring the registry. Phases are ordered by risk and dependency — start at Phase 0 and only proceed to a phase if the prior one's verification passes (or its fix is unnecessary).

## Phase 0 — Smoke test (DONE — see findings below)

**How:** built `convex/smoke.ts` with three internalActions (`testCoach`, `testVision`, `testPlanGen`) that mirror the exact frontend call shape from `logsActions.ts:64-77`, `:164-169`, and `profileSetup.ts:95-99`. Ran each via `npx convex run smoke:test*`.

**Findings (2026-05-09 against `dev:dynamic-wolverine-543`):**

| Task | Result | Latency | Reliability | Output sample |
|---|---|---|---|---|
| `coach` | ✓ | ~2s | reliable | `{name: "grilled chicken wrap with avocado and side salad", kcal:550, proteinG:35, ...}` for "grilled chicken wrap with avocado and a side salad" |
| `vision` | ✓ | ~2s | reliable | `{name: "Salad Bowl with Tofu, Eggs, and Vegetables", kcal:550, proteinG:25, ...}` for an Unsplash food photo |
| `plan-gen` | ⚠ | ~3 min | ~50% pass rate | When it works: 21 recipes with proper structure; when it doesn't: ZodError or bare CLI "Error" (likely action timeout). Pre-existing fallback at `profileSetup.ts:101-114` already produces a stub plan on failure, so onboarding doesn't break. |

**Issues uncovered + fixed in `convex/ai/index.ts`:**

1. **AI SDK v6 dropped `mode: 'tool'` from `generateObject`.** Without forced tool calling, the model emitted snake_case fields (`protein_g` instead of `proteinG`) or echoed the system prompt as text content. **Fix:** when provider is `free`, route `generateObject` through `generateText` with a forced tool call (`toolChoice: { type: 'tool', toolName: 'answer' }`) and parse the tool args. See `generateObjectViaTool` in `convex/ai/index.ts`.
2. **NVIDIA NIM returns tool args as a JSON string, sometimes double-encoded.** **Fix:** loop `JSON.parse` until the value stops being a string (max 3 levels).
3. **Thinking mode (`enable_thinking: true`) breaks structured output.** It emits a long chain-of-thought into the content channel before the answer, which the AI SDK can't parse. **Fix:** `chat_template_kwargs.enable_thinking: false` for all tasks via `TASK_SETTINGS`.
4. **`top_k: 1` makes the model degenerate** (echoed system prompt as a `{type:'text', text:'...'}` object). **Fix:** dropped `top_k` from settings; rely on `temperature: 0.2` alone for determinism.
5. **AI SDK auto-downloads remote image URLs before sending.** Wikimedia hot-link blocked it (400). Worked fine with Unsplash. Convex storage URLs from `ctx.storage.getUrl()` are signed and should be hot-linkable, but worth watching for the first real photo log in production.

**Status of telemetry fix (Phase 1):** the `aiUsage` table now records `providerModel: visionTask.modelId` which resolves to `free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` (or whatever the env override sets). Verified during smoke runs.

**Goal:** confirm current state works end-to-end on `free` before fixing anything that may not be broken.

**Steps:**
1. Restart `npx convex dev` so the latest module is pushed.
2. Trigger each task with a real call and check logs:
   - `plan-gen`: complete onboarding → plan-reveal screen.
   - `vision`: open log → photo flow → snap a meal.
   - `coach`: voice log flow (records audio → transcript → coach parses macros) at `logsActions.ts:122` (`draftFromVoice`).
3. Tail logs: `npx convex logs --tail`.

**Pass criteria:**
- `plan-gen` returns ≥14 recipes (no fallback stub at `profileSetup.ts:104`).
- `vision` returns a `FoodEstimate` with realistic kcal/macros.
- `coach` returns a parsed estimate.
- No `[ERROR]` lines mentioning AI calls.

**Fail criteria + which phase to jump to:**
- "invalid x-api-key" → `FREE_API_KEY` regression. Fix env, retry.
- 4xx with "model not found" → model id typo. Verify NVIDIA NIM hosts `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` exactly.
- 4xx "JSON output not supported" / malformed JSON returned → Phase 3.
- 4xx on image input → Phase 3.
- Empty / very short responses, hallucinated content → Phase 2 (params).
- 429 rate limit → Phase 4 (resilience).

## Phase 1 — Telemetry: drop the hardcoded model id (DONE)

**Goal:** `aiUsage` rows reflect the actual model used, not a stale string.

**Files:**
- `convex/ai/index.ts` — expose the resolved `modelId` from `ai.task(t)`.
- `convex/logsActions.ts:82,92,164,170,246,252` — replace hardcoded `'anthropic:claude-sonnet-4-6'` with the value from `ai.task(t)`.
- `convex/profileSetup.ts` — same if `logAi` is called there with a hardcoded model (check at implementation time).

**Change shape in `convex/ai/index.ts`:**
```ts
export const ai = {
  task(t: Task) {
    const modelId = resolveModelId(t);
    // ...validation + model construction
    return {
      modelId, // expose for telemetry
      generate: ...,
      stream: ...,
      generateObject: ...,
    };
  },
};
```

**Change shape at call sites:**
```ts
const task = ai.task('vision');
const result = await task.generateObject({ ... });
await logAi(ctx, {
  ...
  providerModel: task.modelId, // was 'anthropic:claude-sonnet-4-6'
  ...
});
```

**Verify:** trigger one of each task, query `aiUsage` table — `providerModel` column should show `free:nvidia/...`, not anthropic.

## Phase 2 — Bake NVIDIA recommended params (DONE)

**Goal:** apply nemotron's recommended thinking-mode params per task type.

**Per the model card (Thinking mode):** `temperature=0.6, top_p=0.95, max_tokens=20480, reasoning_budget=16384, chat_template_kwargs={enable_thinking:true}, grace_period=1024`.

**File:** `convex/ai/index.ts`

**Add a per-task default settings map and merge into call options:**
```ts
const TASK_SETTINGS: Partial<Record<Task, {
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  providerOptions?: Record<string, any>;
}>> = {
  'plan-gen': {
    temperature: 0.6,
    topP: 0.95,
    maxOutputTokens: 20480,
    providerOptions: {
      free: {
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 16384,
      },
    },
  },
  vision: { /* tune separately if needed */ },
  coach: { /* tune separately if needed */ },
};
```

Merge `TASK_SETTINGS[t]` into the opts passed to `generateText` / `generateObject` / `streamText`. Caller-supplied opts win (spread caller after the defaults).

**Caveat:** `providerOptions: { free: ... }` only takes effect when the resolved provider is `free`. If a task gets overridden to `openai:gpt-4o` via env, the NVIDIA-specific keys are ignored — desired behavior, no change needed.

**Verify:** trigger plan-gen, check that `aiUsage.outputTokens` is meaningfully > 0 and the recipe descriptions look detailed (reasoning improves quality).

**Skip this phase if:** Phase 0 output already looks good. Don't tune for tuning's sake.

## Phase 3 — Compatibility shims (only if Phase 0 reveals format issues)

**Goal:** fix any breakage in vision input or JSON output through the openai-compatible adapter.

**Vision (`logsActions.ts:64-77`):** current shape uses `{ type: 'image', image: new URL(url) }` (AI-SDK standard, multimodal content array). The adapter converts to OpenAI's `image_url` shape, which NVIDIA NIM accepts.

**If 4xx on image input:**
- Check NIM logs in the response body for the actual rejection.
- Possible fix: pre-fetch the image from Convex storage and pass it as a `Uint8Array` (`{ type: 'image', image: <bytes> }`) instead of a URL — NIM may not be able to fetch the signed Convex URL within its window.

**If `generateObject` returns malformed/empty JSON:**
- Switch the failing task to `generateText` + `z.parse(JSON.parse(text))` as a manual fallback at the call site. Keep `schema` in the prompt as instructions instead of relying on the structured output mode.
- Don't rip out `generateObject` globally — it works on Anthropic/OpenAI, only swap the failing task.

**Verify:** re-trigger the failing flow, confirm round-trip.

**Skip this phase if:** Phase 0 vision + plan-gen returned valid objects.

## Phase 4 — Resilience: fallback chain (only if Phase 0 hits 429/5xx)

**Goal:** if NVIDIA NIM is rate-limited or down, automatically retry on Anthropic/OpenAI without dropping the user.

**Approach:** wrap the registry with `wrapProvider` (or a small custom middleware) from `ai` v6.

**File:** `convex/ai/index.ts`

**Sketch:**
```ts
import { wrapLanguageModel } from 'ai';

function withFallback(primary: LanguageModel, fallback: LanguageModel): LanguageModel {
  return wrapLanguageModel({
    model: primary,
    middleware: {
      wrapGenerate: async ({ doGenerate }) => {
        try { return await doGenerate(); }
        catch (e: any) {
          if (e?.statusCode === 429 || (e?.statusCode >= 500 && e?.statusCode < 600)) {
            return await fallback.doGenerate(/* same args */);
          }
          throw e;
        }
      },
      wrapStream: /* similar */,
    },
  });
}
```

**Wire:** if a task's primary is `free` and `ANTHROPIC_API_KEY` is set, wrap with anthropic fallback. Otherwise no wrap. Decision happens inside `task()`.

**Prerequisite:** real `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) on Convex deployment, otherwise the fallback is paper-only.

**Verify:** force a 429 by hammering the action in a tight loop, confirm the second attempt lands on the fallback provider (`aiUsage.providerModel` shows the fallback id).

**Skip this phase if:** Phase 0 didn't show rate limits. Don't pre-build resilience that isn't needed.

## Phase 5 — Security: rotate leaked keys (anytime, low effort)

**Goal:** revoke the two NVIDIA API keys that were pasted into chat history.

**Steps:**
1. build.nvidia.com → API Keys.
2. Revoke `nvapi-FPjDW...0o5bA5V` and `nvapi-6VK64...G1Noy`.
3. Mint one fresh key.
4. `npx convex env set FREE_API_KEY <new-key>` (overwrites existing).
5. `npx convex env list` — confirm the value changed.

**Verify:** re-trigger any task, expect success. If it 401s, the new key wasn't propagated.

**Skip this phase only if:** you've decided the risk is acceptable (these are trial keys with metered usage; abuse is bounded). Recommend doing it anyway.

## Phase 6 — Plan-gen reliability hardening (NEW — recommend before relying on plan-gen in onboarding)

**Goal:** make plan-gen pass on first try ≥95% of the time, and finish in under 60 seconds.

**Current symptoms (from Phase 0):**
- ~50% pass rate when run repeatedly
- ~3 minutes per call when it works
- Failures: schema-parse failures (model emits invalid output) or Convex action timeouts
- Existing fallback at `profileSetup.ts:101-114` papers over failures with a stub plan, but the user's "personalized plan" is just placeholder text — quietly degraded experience

**Options (pick one or stack):**

**A. Tighten generation parameters.** Drop `temperature` to `0` (deterministic decoding) for plan-gen specifically. Trade-off: every user gets the same plan unless inputs differ. Acceptable for v1 since macros + dietary tags vary per user.

**B. Add a router-level retry on parse failure.** Wrap `generateObjectViaTool` so a Zod or "no tool call" failure triggers one retry with a stricter system prompt ("emit valid JSON only, no commentary"). Limit to 1 retry to keep latency bounded.

**C. Split the schema.** 21-recipe payload may exceed the model's reliable structured-output ceiling. Generate one day at a time (3 recipes per call, 7 calls total). Slower wall-clock for the user but each call is small and reliable. Run them in parallel with `Promise.all` to claw back time.

**D. Switch plan-gen to a stronger model.** Set `AI_PLAN_GEN_MODEL=anthropic:claude-sonnet-4-6` (need real `ANTHROPIC_API_KEY`). Anthropic supports native structured output; nemotron's tool-calling is fine for small schemas but flaky for large nested ones. Cost trade-off: ~$0.10-0.20 per onboarding versus $0 on free.

**Recommended order:** A → B → if still flaky, D for plan-gen specifically while keeping free for coach + vision.

**Verify per option:** run `npx convex run smoke:testPlanGen` 5 times, count passes. Target ≥4/5 before declaring done.

## Out of scope

- Migrating `embed` / `stt` tasks into the router (currently bypass it via direct fetch — fine until either becomes hot).
- Cost telemetry / monthly spend reports — would require tracking input/output token unit cost per provider; not yet wired.
- Per-user provider routing (e.g., paid tier → anthropic, free tier → free) — needs auth-derived input to `task()`, currently router doesn't take a user.

## Verification (cross-phase)

After all in-scope phases land:

```powershell
npm run typecheck
npm run lint
npx convex dev
# trigger each of: plan-gen, vision, coach
npx convex logs --tail
```

Expected: every action succeeds, `aiUsage` rows show the actual resolved model id, no hardcoded `'anthropic:claude-sonnet-4-6'` strings remain in the codebase, no placeholder env values trigger the fail-fast assertion at call time.

```powershell
# confirm no stale hardcoded model ids
git grep "anthropic:claude-sonnet-4-6" -- 'convex/**/*.ts'
```
Expected output: only the `DEFAULTS` map reference (or zero if user has overridden all defaults).
