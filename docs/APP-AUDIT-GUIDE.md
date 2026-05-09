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
- Out of scope, deferred:
  - **Stats tab** — `stats/index.tsx` chart needs forecast snapshot producer in backend; sub-screens (`weigh-in`, `weigh-in-result`, `plateau`, `milestone`, `bad-day`, `mascot-gallery`, `activity`) still mocked.
  - **Settings batch** — `me/edit.tsx`, `me/coach-tone.tsx`, `me/units.tsx`, `me/privacy.tsx`, `me/notifications.tsx`, `me/integrations.tsx`, `me/subscription.tsx`, `me/settings.tsx`, `me/help.tsx`.
  - **Audio playback in confirm screen for voice drafts** — Layer 6 (UX polish).
  - **Meal detail screen + edit-existing-log flow** — out of scope.
  - **Push notifications actually firing** — Layer 7 (release).

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
