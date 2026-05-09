# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Expo SDK 55 (RN 0.83, React 19.2, Hermes, New Architecture, React Compiler enabled in `app.json`) + Convex backend + Clerk auth. TypeScript strict. expo-router with `typedRoutes`. Path alias `@/*` → repo root.

`README.md` is **not** about this app — it's an unrelated handoff bundle from `claude.ai/design` referencing `legacy-web/`. Ignore it. The Expo app lives at the repo root; `legacy-web/` is excluded from TS, EAS, and expo-router.

## Commands

```bash
npm start                # Metro w/ --dev-client (custom dev client required, not Expo Go)
npm run ios | android | web
npm run lint             # expo lint (eslint flat config)
npm run typecheck        # tsc --noEmit
npm test                 # vitest watch (convex/**/*.test.ts, edge-runtime env)
npm run test:once        # vitest run
npx vitest run convex/modelContracts.test.ts -t "pattern"   # single test
npx convex dev           # backend dev server, regenerates convex/_generated
npx expo-doctor          # expect 18/18
```

EAS profiles in `eas.json`: `development` (custom dev client, internal), `preview` (signed sideload), `production` (auto-incremented store build). See `docs/OPERATIONS.md` for full build/submit/OTA flow. Windows host = no local iOS build, must use EAS cloud.

## Architecture

`docs/ARCHITECTURE.md` is the source of truth (mermaid diagrams + per-screen flow). Quick map:

- **`app/`** — expo-router routes. `_layout.tsx` wires `ClerkProvider` → `ConvexProviderWithClerk` → `KeyboardProvider` → `AppProvider` → `Gate` (blocks render until `hydrated && fontsLoaded`, calls `api.users.ensureMe` once on auth). Route groups: `(tabs)/` (today/plan/stats/me/coach), `onboarding/`, `auth/`, `log/` (presented modal).
- **`convex/`** — backend. `schema.ts` defines ~17 tables, all `userId`-scoped with `by_user*` indexes. Files split by domain (`logs`, `plan`, `today`, `forecast`, `chat`, `weighIns`, `profile`, `users`, …). `lib/` = shared helpers (`auth.ts` resolves Clerk identity → user row; `nutrition.ts`, `plans.ts`, `singleton.ts`). `ai/index.ts` is a task-keyed provider router (`coach|vision|stt|embed|plan-gen`) over the Vercel AI SDK with Anthropic/OpenAI/Groq adapters; **only callable from `'use node'` actions**, never queries/mutations. `http.ts` handles the Clerk webhook (svix-verified). Tests live next to code (`*.test.ts`) and run under `convex-test` + `@edge-runtime/vm`.
- **`context/AppContext.tsx`** — onboarding draft + UI prefs only, persisted to AsyncStorage at `lumi:state:v1`. **Not** the source of truth for user data. Server state always comes through Convex hooks (`useQuery` / `useMutation` / `useAction`); the client auto-subscribes via WebSocket. No TanStack Query, no manual cache, no offline replay queue.
- **`lib/`** — `convex.ts` (singleton client), `tokens.ts` / `styles.ts` (design tokens), `icons.tsx`, `strings.ts` + `locale.ts` (i18n via `expo-localization`), `health.ts` (HealthKit stub, iOS-only, gated on custom dev client), `permissions.ts`, `data/` (typed query helpers).
- **`components/`** — flat presentational set; index re-exports.

### Data flow rules

- Mutations are transactional, no external I/O. Anything hitting an LLM, Expo Push, OFF, or Nutritionix goes in an action (`'use node'`) which calls queries/mutations internally.
- Per-row auth: every query/mutation derives the user via `ctx.auth.getUserIdentity()` → `users.by_clerk` lookup (see `convex/lib/auth.ts`); never trust a `userId` arg from the client.
- AI provider is overridable per task via `AI_<TASK>_PROVIDER` env var (e.g. `AI_COACH_PROVIDER=openai`). Defaults: Anthropic for coach/vision/plan-gen, Groq Whisper for stt, OpenAI embeddings.

## Review order

When asked to review or improve Lumi, work backend → frontend (do not jump to UI polish while lower layers are unresolved):

1. DB model (`convex/schema.ts`) → 2. Backend API contracts (`convex/*.ts`) → 3. Core flows (today, log, plan, weigh-in) → 4. AI layer (`convex/ai/`) → 5. Frontend state + Convex wiring → 6. UX polish → 7. Observability + release.

Lead findings with file references, end with concrete next steps.

## Conventions

- Don't introduce TanStack Query, Drizzle, Postgres, or Vercel Functions — Convex owns server state. Don't add an offline replay queue at the app level (Convex client already reconnects + replays mutations).
- Auth is Clerk via `@clerk/expo` + `ConvexProviderWithClerk`. JWT is verified server-side; `auth.config.ts` registers the issuer.
- Env: `EXPO_PUBLIC_CONVEX_URL` (managed by `npx convex dev` in `.env.local`), `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`. Convex deployment env (Anthropic/OpenAI/Groq keys, `CLERK_WEBHOOK_SECRET`) lives in the Convex dashboard, not local `.env`.
- Fonts: Fraunces (display) + DM Sans (text), loaded in `_layout.tsx`; do not add more font families without trimming the bundle (see `docs/PERF.md`).
- Apple Health is a stub today (`lib/health.ts`); the `permissions.health` toggle in `AppContext` is wireframe-only.
- Bun is **not** used; only `legacy-web/` ships a `bun.lock`. Use npm at the root.

## Reference docs

`docs/ARCHITECTURE.md` (schema + flows), `docs/OPERATIONS.md` (build/submit/OTA), `docs/PERF.md` (bundle decisions), `docs/VISUAL-DIFF.md` (device-side review log). Convex sub-skills under `skills/convex*` and `.agents/skills/` (Expo, EAS, Convex).
