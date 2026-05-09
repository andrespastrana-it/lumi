# Plan-gen Reliability Issue

**Status:** open — affects ~50% of `profileSetup:commit` calls in dev
**Severity:** medium — pre-existing fallback at `convex/profileSetup.ts:101-114` produces a stub plan, so onboarding does not break, but the user's "personalized plan" is silently degraded
**First observed:** 2026-05-09 against `dev:dynamic-wolverine-543`, after switching plan-gen default to `free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`
**Owner:** unassigned

## Summary

When plan-gen runs against NVIDIA NIM's nemotron, it produces a valid 21-recipe weekly plan roughly half the time. The other half it returns a `ZodError` (output doesn't match `ResultSchema` at `convex/profileSetup.ts:91`) or a bare CLI-level "Error" (likely a Convex action timeout — calls take ~3 minutes when they succeed). The other two AI tasks (`coach`, `vision`) are reliable on the same provider; only plan-gen is affected.

## Reproduction

```powershell
npx convex dev --once
npx convex run smoke:testPlanGen   # implemented in convex/smoke.ts
```

Run 5×. Expect ~2-3 successes, ~2-3 failures.

The smoke action mirrors the exact call shape in `convex/profileSetup.ts:95-99` (same schema, same system prompt, same prompt template) so behavior matches what real onboarding sees.

## Symptoms

Three distinct failure modes seen during smoke testing:

1. **ZodError at root level**
   ```
   "expected": "object",
   "code": "invalid_type",
   "path": [],
   "message": "Invalid input: expected object, received string"
   ```
   Tool call args came back as a JSON string the schema couldn't validate as an object. **Fixed** in `convex/ai/index.ts` `generateObjectViaTool` with iterative `JSON.parse` (up to 3 levels). Should no longer occur, but watch for it.

2. **ZodError at nested path** — model emits the right top-level shape but a recipe field has the wrong type or is missing. Sample observation: `recipes[N].kcal` returned as a string `"350"` instead of number 350. Not yet hardened against.

3. **Convex CLI bare "Error"** — the `npx convex run` invocation prints just `✖ Failed to run function "smoke:testPlanGen": Error` with no further detail. The action's try/catch never fires. Hypothesis: action exceeded its execution-time budget while waiting for NIM, Convex killed it.

## What has already been fixed (do not re-investigate)

These were tracked down during Phase 0 smoke testing and applied in `convex/ai/index.ts`:

- AI SDK v6 dropped `generateObject({ mode: 'tool' })`. Without forced tool calling, the model emitted snake_case fields (`protein_g` not `proteinG`) or echoed the system prompt as plain text. Workaround: `generateObjectViaTool` routes through `generateText` + forced tool call when provider is `free`.
- NIM's tool-call args arrive as a JSON-encoded string, sometimes double-encoded for deeply nested schemas. Workaround: iterative `JSON.parse` in `generateObjectViaTool`.
- Thinking mode (`chat_template_kwargs.enable_thinking: true`) emits chain-of-thought into the content channel and breaks structured-output parsing. Disabled for all tasks via `TASK_SETTINGS`.
- `top_k: 1` (model card's "instruct mode" recommendation) caused degenerate output where the model echoed the system prompt as `{type: 'text', text: '...'}`. Removed; rely on `temperature: 0.2` alone.

## What's still flaky

Even with all the above, plan-gen variance remains. Likely causes:

- **Schema scale.** Coach and vision return one small object (~7 fields). Plan-gen returns `{ recipes: [...] }` with 14-28 entries, each containing nested arrays (`ingredients`, `method`). Model's tool-call adherence appears to degrade as the schema grows — open-source models are typically tuned more on simple structured outputs than on large nested ones.
- **Latency vs Convex timeout.** A 3-minute generation is uncomfortably close to Convex action execution budgets when combined with retries or queue waits. Some failures are likely killed mid-stream, not invalid output.
- **NIM rate limits / trial throttling.** Free trial endpoint may queue or partially fail under load — no rate-limit headers seen yet, but worth monitoring.
- **Temperature 0.2 still allows variance.** Lowering further may stabilize, at the cost of identical plans for users with similar inputs.

## Resolution options

Pick one or stack. Cheapest-first ordering:

### A. Tighten temperature to 0
Edit `NEMOTRON_LONG` in `convex/ai/index.ts` — set `temperature: 0`. Deterministic decoding eliminates one variance source.
**Cost:** users with identical macros + dietary tags get identical plans. Acceptable for v1.
**Effort:** 1 line.
**Estimated lift:** small — model still hallucinates field types occasionally even at temp 0.

### B. Retry once on parse failure
Wrap `generateObjectViaTool` to catch Zod / "no tool call" errors and retry once with a tightened system prompt ("Emit only valid JSON matching the schema. Do not include commentary or markdown.").
**Cost:** ~2× latency on failures only.
**Effort:** ~20 lines in `convex/ai/index.ts`.
**Estimated lift:** moderate — covers transient model misfires but not systemic schema-scale issues.

### C. Split the schema (one day per call)
Generate Mon-Sun separately: 7 calls, 3 recipes each. Run with `Promise.all`. Each call is small (3 recipes ≈ ~600 output tokens) which is well within the size where nemotron's tool-calling is reliable (per coach + vision evidence).
**Cost:** 7× provider calls instead of 1; could hit free-tier rate limits if many users onboard simultaneously. Wall-clock latency may improve (parallel fan-out) or worsen (rate-limit queueing).
**Effort:** ~40 lines refactoring `convex/profileSetup.ts:80-100` plus stitching the 7 results back into the schema shape.
**Estimated lift:** large — the fundamental scale problem is removed.

### D. Switch plan-gen to anthropic
Keep coach + vision on free (they work). Add a real `ANTHROPIC_API_KEY` to Convex env and set `AI_PLAN_GEN_MODEL=anthropic:claude-sonnet-4-6`. Anthropic's structured output is rock-solid for large nested schemas.
**Cost:** ~$0.10-0.20 per onboarding (rough — depends on token volume).
**Effort:** 2 commands (`npx convex env set`).
**Estimated lift:** complete — solves the issue immediately.

## Recommendation

If keeping plan-gen on the free tier matters: try **A + B** first (low effort, partial improvement), then **C** if still flaky. If the cost is acceptable, **D** is the fastest path to reliable onboarding — go straight there and revisit free-tier later when nemotron's structured-output reliability improves or when the schema is split for other reasons.

Coach + vision should stay on free regardless; they work reliably and represent the majority of AI calls per active user (every photo log, every voice log, every search).

## Verifying any fix

```powershell
# Run the smoke 5 times, count "ok": true vs "ok": false
1..5 | ForEach-Object {
  npx convex run smoke:testPlanGen 2>&1 | Select-String -Pattern '"ok": (true|false)'
}
```
Target: ≥4/5 passes. Sub-60s latency per call would be a stretch goal once the schema is split.

## Appendix — successful response shape (excerpt)

```json
{
  "ok": true,
  "modelId": "free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
  "ms": 164933,
  "recipeCount": 21,
  "sample": [
    {
      "day": 0,
      "slot": "breakfast",
      "name": "Greek Yogurt Power Bowl",
      "kcal": 350,
      "proteinG": 25,
      "carbG": 35,
      "fatG": 8,
      "ingredients": [
        { "name": "Greek yogurt", "qty": "200g" },
        { "name": "Mixed berries", "qty": "100g" },
        { "name": "Chia seeds", "qty": "10g" },
        { "name": "Honey", "qty": "10g" },
        { "name": "Almonds", "qty": "15g" }
      ],
      "method": [
        "Layer yogurt with berries",
        "Sprinkle chia seeds and almonds",
        "Drizzle honey on top"
      ]
    }
  ]
}
```

Output quality when it lands is high — recipes are sensible, macros add up, ingredients are realistic, methods are concise. The reliability problem is binary (succeeds-fully / fails-fully), not a quality problem.

## Related files

- `convex/ai/index.ts` — `generateObjectViaTool`, `TASK_SETTINGS`, `NEMOTRON_LONG`
- `convex/profileSetup.ts:80-115` — call site + existing fallback stub
- `convex/smoke.ts` — `testPlanGen` action used to reproduce
- `docs/AI-FIXES-PLAN.md` — Phase 6 lists the same options for tracking purposes
- `docs/AI-PROVIDER-SWAPPING.md` — how to set `AI_PLAN_GEN_MODEL` if Option D is chosen
