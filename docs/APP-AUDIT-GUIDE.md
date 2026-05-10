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

## Layer 6 verdict (2026-05-10)

Layer 6 (UX polish — loading / empty / error / offline / permission / navigation states) — **done**. Three-pronged: shared state components, global offline banner, coach tab wired to real backend.

- **Coach tab now real** — `convex/chatActions.ts:send` (`'use node'`) appends user message via `internal.chat.appendMessage`, reads last 12 messages via `internal.chat.recentForThread`, calls `ai.task('coach')` (Gemini Flash) wrapped in `withAiTelemetry` with a structured `{ reply, action? }` schema where `action.to` is constrained to a known route allow-list. Assistant replies persist as `chatMessages` rows with `toolCalls.action`. Public surface: `convex/chat.ts:ensureThread` + `sendUserMessage` + existing `messages` query. `app/(tabs)/coach.tsx` rewritten — drops the `PROMPTS` mock + `setTimeout` fake reply. Starter prompts now seed real send calls into the empty-state. Errors via `describeConvexError`.
- **4 shared state components** — `components/{ScreenLoading,ScreenEmpty,ScreenError,OfflineBanner}.tsx`. Re-exported from `components/index.ts`.
  - `<ScreenLoading label?>` — centered ActivityIndicator, optional label.
  - `<ScreenEmpty mascot title body? cta? secondaryCta?>` — Mascot + title + body + 1-2 CtaButtons.
  - `<ScreenError title? error onRetry?>` — Mascot `oops` + title + `describeConvexError(error)` + retry button.
  - `<OfflineBanner>` — pinned below safe-area insets, subscribes to `convex.subscribeToConnectionState`. Animates in via Reanimated when `isWebSocketConnected === false` (gated on `hasEverConnected` to avoid cold-start flash). Mounted once in `app/_layout.tsx` `Gate`.
- **17 screens migrated** to shared components — `today.tsx`, `(tabs)/stats/{index,weigh-in-result,milestone,bad-day,activity}.tsx`, `(tabs)/me/{index,edit,coach-tone,units,privacy,notifications,integrations}.tsx`, `(tabs)/plan/{index,recipe,shopping}.tsx`, `log/confirm.tsx`. Each ad-hoc loading/empty block replaced with the shared shape. Camera/audio permission UIs in `log/{photo,voice,barcode}.tsx` left bespoke (dark-themed, fits the camera viewfinder context better than the generic component).
- **Specific gaps closed**:
  - `app/onboarding/compute.tsx` now uses `describeConvexError` (was `e?.message`), so plan-gen failures surface as `AI_FAILED` user-facing copy instead of raw error.
  - `app/onboarding/permissions.tsx` no longer swallows `setGrant` failures with `.catch(() => {})`; surfaces `Alert` with `describeConvexError`.
  - `app/(tabs)/me/index.tsx` now branches on `me === null` (account deleted / not synced) — calls `signOut` + renders `<ScreenEmpty mascot="oops">` with sign-in CTA. No more infinite spinner.
- **Backend additions**:
  - `convex/chat.ts` — `ensureThread` (mutation), `sendUserMessage` (mutation w/ `assertRange`-style length validation), `recentForThread` (internalQuery), `threadOwnerCheck` (internalQuery).
  - `convex/chatActions.ts` (new, `'use node'`) — single `send` action.
- **Verification (live)**:
  - `npm run typecheck` exit 0.
  - `npm run test:once` 28/28 (unchanged from Layer 5; no new tests added — coach send is exercised in-app).
  - `npm run lint` exit 0 with 8 pre-existing warnings (baseline preserved).
  - `npx convex dev --once` push successful — chat schema, mutations, action all deployed.
  - `npx convex run smoke:testCoach` hit Gemini free-tier rate limit (`limit: 20/min`) during repeated runs in this session — transient, not a code issue.
- **Out of scope, deferred:**
  - Streaming chat replies (token-by-token) — current UX renders the full reply once. Acceptable for v1.
  - Coach tools (function-calling to mutate plan, etc.) — only nav-action suggestions for now.
  - Migrating the bespoke camera permission UIs in `log/{photo,voice,barcode}.tsx` to `<ScreenError>` — kept separate by design.

## Layer 5 verdict (2026-05-09)

Layer 5 (frontend data wiring — replace mock/local state with real backend) — **done**. Most of Layer 5 was delivered alongside Layer 3; this round closed the remaining gaps.

- **Forecast snapshot producer shipped** — `convex/forecastActions.ts` (`'use node'`) exposes `generateForUser({ userId })` (per-user) and `produceSnapshotsDaily()` (cron). `produceSnapshotsDaily` is registered at `convex/crons.ts` for `04:00 UTC` daily, claims a `cronRuns` row via `internal.forecast.claimProducerRun` for idempotency, then iterates `internal.users.listActive` (cap 1000) and calls `generateForUser` per user.
- **Forecast math** — weekly delta from last 4 weigh-ins, 12-week linear projection, ETA week ISO if goal direction matches. Deterministic; no AI for the numbers.
- **AI-augmented narrative** — `generateForUser` calls `ai.task('coach')` (currently `gemini-3-flash-preview`) wrapped in `withAiTelemetry` for a 2-field structured output `{ headline ≤ 100, detail ≤ 200 }`. Cost lands in `aiCalls` per user per day. Falls back to a deterministic headline/detail pair on AI failure so the snapshot still writes.
- **Snapshot consumer** — `app/(tabs)/stats/index.tsx` reads `api.forecast.get({ range: '30d' })`. When present, the chart renders past weigh-ins (solid) plus the 12-week projection (dashed) extending past the latest dot, and a narrative pillow (mascot mood `proud` if on-track else `curious`) appears above the CTA buttons. When `null`, the screen falls back to its previous client-side linear render — no regression for users with insufficient data.
- **New internal queries** — `internal.users.listActive`, `internal.profile.getForUser`, `internal.weighIns.recentForUser`. Each `withIndex`-scoped, cap-bounded.
- **Schema unchanged** — `forecastSnapshots` already existed; no migration. Retention cron at `convex/retention.ts:purgeForecastSnapshotsDaily` already prunes after 30d.
- **Activity tab honest** — `app/(tabs)/stats/activity.tsx` no longer ships hardcoded fake workouts. Reads `api.me.get` → `permissionGrants.health` + `integrations.appleHealth`/`googleFit`, branches between three honest empty states (no permission / permission but unlinked / linked but stub-pending). CTA points at `/(tabs)/me/integrations`. HealthKit real wiring deferred to Layer 7 per CLAUDE.md (`lib/health.ts` is still a stub).
- **Plateau orphan deleted** — `app/(tabs)/stats/plateau.tsx` was unreachable (zero inbound `router.push`); removed. Re-create with real plateau-detection backend later if a flow needs it.
- **Mascot gallery kept** — `app/(tabs)/stats/mascot-gallery.tsx` is a 12-mood design reference linked from "Meet Pip" on `me/index.tsx`. Static is correct; not user-state.
- **Verification (live)**:
  - `npm run typecheck` exit 0.
  - `npm run test:once` 28/28 passes.
  - `npm run lint` exit 0 (only pre-existing warnings).
  - `npx convex dev --once` push successful.
  - `npx convex run forecastActions:produceSnapshotsDaily` → `{ ran: 0, skipped: 3, failed: 0 }` against current dev DB (3 active user rows, none with profile + weigh-ins yet — all hit the `no_profile` skip path).
  - `npx convex run forecastActions:generateForUser '{"userId":"..."}'` → `{ skipped: "no_profile" }` confirms the early-return contract.
- **Out of scope, deferred:**
  - Seeded test user → live AI-narrative E2E run. Drive any one user through onboarding + 2 weigh-ins, then re-trigger producer to populate `forecastSnapshots` and `aiCalls` for the `coach` task.
  - Real HealthKit / Google Fit pull — Layer 7.
  - Plateau detection + recreated screen — future, pending real signal.

## Layer 4 verdict (2026-05-09)

Layer 4 (AI: prompts / structured outputs / fallbacks / cost telemetry) — **done**. Full smoke transcript + 0-100 scoring at `docs/LAYER4-SMOKE-VERDICT.md` (aggregate **92/100**). Original phase plan at `docs/AI-FIXES-PLAN.md`; plan-gen issue resolved per `docs/PLAN-GEN-RELIABILITY-ISSUE.md`.

- **Provider — Gemini Flash** — `convex/ai/index.ts` defaults all three language-model tasks (`coach`, `vision`, `plan-gen`) to `google:gemini-3-flash-preview`. Has free tier; per-1M pricing $0.50 in / $3 out. Override per task with `AI_<TASK>_MODEL=<provider>:<model>`. NVIDIA NIM (`free`) + Anthropic + OpenAI + Groq remain registered for opt-in fallback.
- **Pro deferred** — `gemini-3.1-pro-preview` has no Gemini-API free tier (`limit: 0`); blocks until billing is linked at https://aistudio.google.com/app/apikey. Live test confirmed 429 on coach/vision/plan-gen against the current key (see `LAYER4-SMOKE-VERDICT.md` comparison section).
- **Per-task settings** — `settingsFor(task, provider)` in `convex/ai/index.ts`. For Google: `thinkingLevel: low` everywhere (Gemini 3 reasons in-band; low keeps latency tight); plan-gen also gets `maxOutputTokens: 32000`. Temperature left at 1.0 default per Gemini-3 migration guidance — lower values caused looping/under-generation in early tests. Nemotron knobs preserved as a fallback when `provider === 'free'`.
- **Structured output** — Gemini handles `generateObject` natively; the openai-compatible `generateObjectViaTool` workaround is now gated to `provider === 'free'` only.
- **Plan-gen reliability** — `convex/smoke.ts:testPlanGenRepeat '{"n":5}'` → **5/5 pass, avg 19.4s**, 21 recipes per run. Stub fallback at `profileSetup.ts:101-114` removed; `appError('AI_FAILED', ...)` thrown on real failure. Mobile client maps `AI_FAILED` via `lib/clientError.ts`.
- **Telemetry helper** — `convex/lib/aiTelemetry.ts:withAiTelemetry` wraps every action call: pre-flight `checkAiRateLimit`, post-call `recordAiCall` with `costUsd` from `convex/ai/pricing.ts:estimateCostUsd`. Wired at `convex/logsActions.ts:draftFromPhoto|Voice|Search` (covers `vision` + `stt` + `coach`) and `convex/profileSetup.ts:commit` (covers `plan-gen`). Closes the rate-limit gap that previously blinded the limiter for voice/search/onboarding.
- **Cost rollup** — `convex/aiCalls.ts:summarizeSpend({ since, groupBy })` groups `aiCalls` by `task | user | model`; sums calls/tokens/USD. Run via `npx convex run aiCalls:summarizeSpend '{"since":0,"groupBy":"task"}'`. No UI / cron yet — Layer 7.
- **Schema migration** — `aiCalls.costUsd: v.optional(v.number())` added to `convex/schema.ts:280`. Additive, no backfill needed.
- **Smoke tests** — `convex/smoke.ts` exposes `testCoach` / `testVision` / `testPlanGen` / `testPlanGenRepeat`. Last live run (Flash): coach **95/100**, vision **91/100**, plan-gen **91/100**.
- **Out of scope, deferred:**
  - **Phase 4 fallback chain** — `wrapLanguageModel` middleware to fall back to Anthropic on 429/5xx. Re-enable when `ANTHROPIC_API_KEY` lands on Convex env.
  - **Pro upgrade** — link billing on the Google API key, then `npx convex env set AI_PLAN_GEN_MODEL google:gemini-3.1-pro-preview` and re-run the smoke battery. Flash already at 92/100 so no urgency.
  - **Cron-rolled `aiSpendSnapshots`** — Layer 7 work.
  - **Per-user provider routing** (paid tier → anthropic, free tier → gemini) — needs user-aware router, deferred.

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
