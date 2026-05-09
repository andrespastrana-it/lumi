# App Audit Order

Use this order when polishing Lumi from backend to frontend:

1. **Database model** - schema, relationships, ownership, lifecycle, migrations.
2. **Backend API contracts** - Convex queries, mutations, actions, auth, DTOs, errors.
3. **Core product flows** - onboarding, today, logging, plan, stats, profile.
4. **AI layer** - prompts, structured outputs, fallbacks, cost/telemetry.
5. **Frontend data wiring** - replace mock/local server state with real backend data.
6. **UX polish** - loading, empty, error, offline, permission, and navigation states.
7. **Release readiness** - tests, lint, Sentry/PostHog, push, privacy, App Store checks.

Rule: finish lower layers before polishing higher layers.

## Layer 3 verdict (2026-05-09)

- **Voice logging E2E** — `app/log/voice.tsx` now uploads via `api.upload.{generate,claim}` and calls `api.logsActions.draftFromVoice`, then routes to `confirm.tsx` with `logId`. Idempotent on `assetId` per Layer 2.
- **Permissions persistence** — `app/onboarding/permissions.tsx` calls `api.permissionGrants.set({ key, value })` on every toggle. Backend now reflects user intent.
- **Search → confirm** — `app/log/search.tsx` calls new `api.logs.draftSearchPick` mutation (food bounds enforced) and routes to `confirm.tsx` with `logId`. Same UX as photo/voice/barcode now.
- **Confirm error surface** — `app/log/confirm.tsx` (and photo/voice/barcode/search) catch errors and render code-aware messages via `lib/clientError.ts:describeConvexError`. First client consumer of the Layer 2 `error.data.code` contract.
- **Test barcode button** — gated behind `__DEV__` in `app/log/barcode.tsx`.
- **Today meal-row dead end** — removed press handler that routed to `/(tabs)/plan`. Meal rows are read-only until a detail screen exists.
- **Onboarding step order**, **today/log/onboarding flows** — wired end-to-end through Convex.
- **Me tab** — `app/(tabs)/me/index.tsx` reads `api.me.get` (notifPrefs/integrations counts, coachTone, units, privacy). Avatar + first name come from Clerk's `useUser()`. Sign-out wired to Clerk's `useAuth().signOut()` + redirect to `/auth/sign-in`. Subscription label still in `AppContext` (no billing backend yet — kept).
- **Me settings batch** — `me/edit.tsx` (read-only display from `api.me.get` + Clerk), `me/coach-tone.tsx` (`profile.patch({ coachTone })`), `me/units.tsx` (`profile.patch({ units })`), `me/privacy.tsx` (toggle → `profile.patch({ privacy })`), `me/notifications.tsx` (toggle → `notifPrefs.set({ partial })`), `me/integrations.tsx` (toggle → `integrations.toggle({ provider, enabled })`). All persist server-side; errors via `describeConvexError`. UI provider keys mapped to backend literals (`appleHealth`, `googleFit`, etc.).
- **Plan tab** — `plan/index.tsx`, `recipe.tsx`, `shopping.tsx` all wired to `api.plan.active`. Today's meals filtered by `(Date.now() - plan.activeFrom) / DAY % 7`. `markRecipeDone` (long-press), `addToShopping`, `toggleRecipeFavorite`, `logRecipe`, `toggleShoppingItem` all wired with `describeConvexError` on failure.
- **Stats core** — `stats/weigh-in.tsx` calls `api.weighIns.create({ weightKg, source: 'manual' })` (bounds enforced backend-side). `stats/index.tsx` chart now renders real `api.weighIns.recent` points; "Lost" / "To go" / "Weigh-ins" stats computed from `api.me.get` profile + recent weigh-ins. Empty state when no weigh-ins logged. Forecast curve still placeholder until backend snapshot producer ships (Layer 4).
- **Stats post-weigh-in screens** — `stats/weigh-in-result.tsx` computes weekly delta from last two `api.weighIns.recent` entries; switches headline by direction (lost / flat / gained). `stats/milestone.tsx` shows real `kg down` from `me.profile.startWeightKg − latest weighIn`, real streak from `today.streakDays`. `stats/bad-day.tsx` reads yesterday's `api.logs.byDate` and compares to `me.activePlan.dailyKcal`; recovery distribution `−ceil(over/5) kcal/day × 5 days` is pure client math (explanatory, doesn't actually rewrite the plan).
- **`me/help.tsx`** — version + build pulled from `Constants.expoConfig` (`expo-constants`); no more hardcoded `v1.4.2`.
- **`me/settings.tsx`** — deleted; was an orphaned duplicate of `coach-tone.tsx` + `notifications.tsx` with no inbound links.
- Out of scope, deferred:
  - **Stats sub-screens** — `weigh-in-result.tsx`, `plateau.tsx`, `milestone.tsx`, `bad-day.tsx`, `mascot-gallery.tsx`, `activity.tsx` are informational and remain mocked.
  - **Forecast snapshot producer** — Layer 4 (AI/cron) work; once shipped, `stats/index.tsx` can replace the linear-projection chart with actual model output.
  - **Account deletion / data export** — backend has `users.softDelete` (internal) but no public client mutation; `me/privacy.tsx` UI shows the buttons as placeholders.
  - **`me/{subscription,settings,help}.tsx`** — informational, no Convex hookup needed.
  - **Inline editing** of profile fields on `me/edit.tsx` — read-only display for now; per-field sub-screens or modal forms deferred.
  - **Audio playback in confirm screen for voice drafts** — Layer 6 (UX polish).
  - **Meal detail screen + edit-existing-log flow** — out of scope.
  - **Push notifications actually firing** — Layer 7 (release).

## Layer 4 partial verdict (2026-05-09)

Layer 4 (AI: prompts / structured outputs / fallbacks / cost telemetry) — partially done. See `docs/AI-FIXES-PLAN.md` for the full phase plan and `docs/PLAN-GEN-RELIABILITY-ISSUE.md` for the open issue.

- **Provider registry expanded** — `convex/ai/index.ts` adds a `free` provider (NVIDIA NIM via `@ai-sdk/openai-compatible`) alongside anthropic / openai / groq. All three language-model tasks (`coach`, `vision`, `plan-gen`) default to `free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning`; flip per task with `AI_<TASK>_MODEL=<provider>:<model>` on Convex env.
- **Structured-output workaround** — AI SDK v6 dropped `generateObject({ mode: 'tool' })`. `generateObjectViaTool` routes through `generateText` + forced tool call when provider is `free`, with iterative `JSON.parse` to handle NIM's double-encoded tool args.
- **Per-task settings** — `TASK_SETTINGS` map applies temperature / topP / maxOutputTokens / providerOptions per task (e.g. disables `chat_template_kwargs.enable_thinking` to keep reasoning models from breaking structured output).
- **Telemetry: real model id** — `convex/logsActions.ts` records `providerModel: visionTask.modelId` (no longer hardcoded `'anthropic:claude-sonnet-4-6'`).
- **Smoke tests** — `convex/smoke.ts` exposes `testCoach` / `testVision` / `testPlanGen` internal actions for `npx convex run` verification of each task in isolation.
- **Fail-fast key validation** — module-load assertion catches missing/placeholder API keys with a clear message instead of leaking a vendor 401 mid-request.
- **Open issues, not yet fixed:**
  - **Rate-limit telemetry gap** — only `draftFromPhoto` writes `aiCalls` rows. `draftFromVoice`, `draftFromSearch`, `profileSetup.commit` still skip the insert, so the rate limiter sees count=0 for `coach`/`stt`/`plan-gen` and never throttles those tasks. Highest-value fix.
  - **Plan-gen reliability** — ~50% pass rate against NVIDIA NIM (see `docs/PLAN-GEN-RELIABILITY-ISSUE.md`). Existing fallback at `profileSetup.ts:101-114` masks failures with a stub plan; users get a silently degraded "personalized" plan. Resolution options: tighter temp + retry / split schema by day / switch plan-gen to anthropic.
  - **Fallback chain** — no automatic retry on 429 / 5xx with a backup provider.
  - **Cost telemetry summaries** — `aiCalls` rows are written but no aggregation / monthly-spend report.

## Layer 1 verdict (2026-05-09)

- **Schema** — 18 tables, all userId-scoped except `users`, `mediaAssets` (handled separately in soft-delete), `cronRuns` (system jobs allowed). Stable.
- **Cascade** — `users.softDelete` consumes `convex/lib/ownership.ts:OWNED_TABLES` so adding a userId-scoped table is a one-line registry update.
- **Lifecycle / retention** — daily crons (`convex/crons.ts`) hard-delete: `aiCalls` (90d), `forecastSnapshots` (30d), `foodLogDiagnostics` (30d / `expiresAt`), `cronRuns` (30d), `plans.status='archived'` (90d, cascading `planRecipes`), `foodLogs.status='deleted'` (30d, cascading `foodLogDiagnostics` + `mediaAssets` + storage). Each handler claims a `cronRuns` row first via `convex/lib/cronGuard.ts:claimCronRun` so re-fires are no-ops.
- Out of scope, deferred: `integrations.tokens` consolidation into `integrationSecrets` (Layer 4), `@convex-dev/migrations` framework (only needed for non-additive schema changes).

## Layer 2 verdict (2026-05-08)

- **Auth pattern** — `requireUser` / `getUserOrNull` (`convex/lib/auth.ts`) wired into every public query/mutation. Done.
- **DTOs** — locked by `convex/modelContracts.test.ts` (no `userId` / tokens / `rawAi` / `toolCalls` leak). Done.
- **Structured errors** — `ConvexError({ code, message })` via `convex/lib/errors.ts:appError`. Done.
- **Index coverage** — every `.collect()` in production code is `withIndex`-scoped. Zero full scans. Verified.
- **Action / mutation purity** — `fetch` and external HTTP only in `'use node'` action files. `ctx.storage.*` in mutations is the Convex storage primitive, not external network. Verified.
- **Numeric arg bounds** — `convex/lib/bounds.ts:assertRange` applied to `weighIns.create`, `logs.confirm{,Manual}`, `profile.patch`. Done.
- **AI idempotency** — `logsActions.draftFromPhoto` / `draftFromVoice` short-circuit when a draft already exists for the asset (`internal.logs.findDraftByAsset`). Done.
- **AI rate limits** — fixed-window per-user cap via `convex/lib/rateLimit.ts:checkAiRateLimit` over the `aiCalls` table. Done.
- Out of scope, deferred: validator tightening on `v.any()` columns (internal-only), client UI for `error.data.code` (owned by layer 6), AI provider failover/telemetry (owned by layer 4).
