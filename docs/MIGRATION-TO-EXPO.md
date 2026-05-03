# Lumi → Expo Migration Plan

**Branch:** `migration-to-expo`
**Source stack:** Next.js 16.2.4 + React 19 (interactive wireframe, web-only)
**Target stack:** Expo SDK 54 + React Native 0.81 + Expo Router 5 (iOS + Android, web optional)

---

## 1. Context

Lumi is currently a 39-screen interactive wireframe built as a Next.js client-only app. It uses zero Next.js features beyond routing the React tree (no Server Components, Server Actions, API routes, `next/image`, `next/link`, or middleware), and zero third-party UI/state/animation libraries. Every screen is a `'use client'` component composed from HTML primitives (`div`, `button`, `h1`) with inline `CSSProperties`.

Goal: ship a **native** iOS + Android app from this same UX. The wireframe has done the design work; the migration is mostly a primitives swap (`div` → `View`, `button` → `Pressable`) plus a navigation rewrite, plus rebuilding 8 CSS keyframe animations in Reanimated. There is no real backend, no auth, and no data layer to port — those don't exist yet.

The migration is unusually tractable because the codebase is small, dependency-free, and already organized into per-screen files with clean prop signatures (`{ go, state?, set? }`).

---

## 2. Decisions (made up front, locked in)

| # | Decision | Why |
|---|---|---|
| D1 | **Greenfield Expo app, in-place** in this repo on `migration-to-expo` branch. Move existing Next.js code to `legacy-web/` as a reference, scaffold Expo at root. | Cleanest mental model; legacy stays diff-able for visual parity checks. Avoids monorepo tooling tax for a one-app project. |
| D2 | **Expo Router 5** (file-based, App Router-like) with `NativeTabs` for the 5-tab bottom bar and a native `Stack` per group. | Matches existing mental model from Next.js, gives native-feel iOS push transitions for free, and `NativeTabs` uses real `UITabBar` (iOS 26 liquid glass support). |
| D3 | **`react-native-svg` + `SvgXml`** for the 37 icons in `app/lib/icons.tsx`. | The current icon system stores raw SVG inner-markup (`<g>...<circle>...</g>`). `SvgXml` renders that markup verbatim — change one component, keep all icon definitions. |
| D4 | **Reanimated 3 + worklets** for the 8 CSS `@keyframes` and the Mascot. | Runs on UI thread, 60fps, idiomatic in Expo SDK 54+ (auto-includes `react-native-worklets`). |
| D5 | **No Tailwind / NativeWind.** Keep styles inline + a thin `StyleSheet.create` per file, mirroring how the wireframe is already organized. | Wireframe styles are short, screen-local, and don't share enough to justify a styling system. Adding Tailwind v4 + react-native-css now is gratuitous tooling. *Revisit only if* component reuse grows. |
| D6 | **AsyncStorage persistence** for `AppContext` via `@react-native-async-storage/async-storage`. SecureStore for nothing (no tokens yet). | Wireframe state is throw-away; the only reason to persist is preserving onboarding progress across reloads in dev. |
| D7 | **Hermes** (default), **New Architecture** (default in SDK 54+), **TypeScript strict** (already on). | All defaults — no opt-out is needed and none would be an upgrade. |
| D8 | **EAS Build + dev client** from day 1, no Expo Go. | The Mascot animations and `expo-haptics` work fine in Expo Go, but `expo-camera`/`expo-audio` (needed for `LogPhoto`/`LogVoice`) want a custom dev client. Going dev-client from the start avoids a re-bootstrap mid-port. |
| D9 | **iOS-first.** Get iOS feature-complete, then sweep Android. | Single-developer project; cheaper to nail one platform and diff than to context-switch. |

---

## 3. Approach: phase overview

```
Phase 0  Repo restructure + Expo bootstrap         (½ day)
Phase 1  Foundations: tokens, fonts, icons, ui     (1–2 days)
Phase 2  Navigation skeleton (5 tabs + 39 routes)  (1 day)
Phase 3  AppContext + AsyncStorage persistence     (½ day)
Phase 4  Onboarding flow (10 screens)              (2–3 days)
Phase 5  Daily flow (Today, Plan, Recipe, etc.)    (2–3 days)
Phase 6  Logging flow (camera + mic + barcode)     (2 days)
Phase 7  Weekly flow (charts, weigh-in)            (1–2 days)
Phase 8  Profile + Settings (11 screens)           (1–2 days)
Phase 9  Mascot + animations port                  (1–2 days)
Phase 10 Native APIs (haptics, perms, biometrics)  (1 day)
Phase 11 EAS dev client + TestFlight cut           (½ day)
Phase 12 Android sweep                             (1–2 days)
```

Total estimate: **15–22 working days** for one engineer, plus animation polish and store assets.

---

## 4. Phase 0 — Repo restructure + Expo bootstrap

### Files affected
Everything moves; nothing is deleted yet.

### Steps

1. Move current Next.js project under `legacy-web/`:
   ```bash
   mkdir legacy-web
   git mv app legacy-web/
   git mv public legacy-web/
   git mv next.config.ts legacy-web/
   git mv next-env.d.ts legacy-web/
   git mv tsconfig.json legacy-web/
   git mv package.json legacy-web/
   git mv bun.lock legacy-web/
   ```
   `project/`, `chats/`, `.agents/`, `.claude/`, `.trae/`, `skills-lock.json`, `README.md` stay at root.

2. Add `legacy-web/.next/`, `legacy-web/node_modules/`, etc. to root `.gitignore` if not already covered.

3. Scaffold Expo at root:
   ```bash
   npx create-expo-app@latest . --template default
   ```
   When prompted to overwrite, accept — `legacy-web/` is now isolated. Verify the new `package.json`, `app.json`, `tsconfig.json`, `app/_layout.tsx` land at root.

4. Add baseline deps:
   ```bash
   npx expo install \
     expo-router expo-font expo-haptics expo-status-bar \
     expo-secure-store expo-image expo-camera expo-audio \
     expo-blur expo-symbols \
     react-native-safe-area-context react-native-screens \
     react-native-svg react-native-reanimated react-native-gesture-handler \
     @react-native-async-storage/async-storage
   ```

5. Configure `tsconfig.json` `paths` to alias `@/*` → repo root (matches existing imports).

6. Sanity-check: `npx expo start`, scan with Expo Go, see the default welcome screen. Commit.

### Verification
- `legacy-web/` still type-checks under its own `tsconfig.json` (run `cd legacy-web && bun install && bun run build`).
- New Expo app boots in Expo Go on iOS simulator.

---

## 5. Phase 1 — Foundations

### 1a. Design tokens
**File:** `lib/tokens.ts` (copy verbatim from `legacy-web/app/lib/tokens.ts`).
- The `C` color object is fully portable as-is — RN accepts hex strings.
- `PILLOW_SHADOW` / `PILLOW_SHADOW_SM` / `BTN_SHADOW` are CSS shadow strings — port to RN `boxShadow` style strings (RN 0.76+ supports the CSS `boxShadow` prop natively, including inset). Keep the constant names.

### 1b. Fonts
Replace the Google Fonts CSS import with `expo-font`:

```ts
// app/_layout.tsx
import { useFonts, Fraunces_400Regular, Fraunces_300Italic } from '@expo-google-fonts/fraunces';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
```
Install `@expo-google-fonts/fraunces` and `@expo-google-fonts/dm-sans`. Block `<SplashScreen>` until fonts load (standard Expo pattern).

### 1c. Icons
**File:** `lib/icons.tsx`. The legacy `Icon` injects raw SVG inner-markup into a `<svg>` element via React's HTML-injection prop. RN has no DOM, so swap to `react-native-svg`'s `SvgXml`, which takes a complete SVG XML string:

```tsx
import { SvgXml } from 'react-native-svg';

export function Icon({ name, color = 'currentColor', size = 24 }: IconProps) {
  const inner = PATHS[name];
  if (!inner) return null;
  const xml = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" stroke="${color}">${inner.replace(/currentColor/g, color)}</svg>`;
  return <SvgXml xml={xml} width={size} height={size} />;
}
```

- Drop the `className` prop (not meaningful in RN).
- Keep the `PATHS` object unchanged — all 37 icon path strings are reused untouched. (XSS surface: `PATHS` is an internal constant, not user input — same trust model as the current implementation.)

### 1d. Shared UI components
**Files:** `components/ui.tsx` → split into one component per file under `components/`:

| Web component (`legacy-web/app/components/ui.tsx`) | RN target | Notes |
|---|---|---|
| `Header` | `<View>` + `<Pressable>` for back | Replace `‹` button with `expo-symbols` `chevron.left`. |
| `IconChip` | `<View>` round-bg wrapper | 1:1, just primitives swap. |
| `Blob` | `<View>` with `position: absolute`, `borderRadius: size / 2` | Replace `radial-gradient` with `expo-linear-gradient` ring or simply a solid color + `opacity` (gradient was already 70% transparent — solid blur is close enough, otherwise use `expo-blur`). |
| `Ring` | `react-native-svg` `<Svg><Circle /></Svg>` | Direct port — same SVG primitives. |
| `Row` | `<Pressable>` + `<View>` rows | Drop `cursor`, use `onPress`. |
| `TabBar` | **DELETE** — replaced by `NativeTabs` in Phase 2. | The `TabBar` in `ui.tsx` is a JS reimplementation we no longer need. |
| `FAB` | `<Pressable>` absolutely positioned | Translate the multi-layer `boxShadow` string verbatim (RN 0.76+ supports it). |
| `S.*` style objects | Convert to `StyleSheet.create({...})` per-file inside each component | Web-only props to drop: `cursor`, `userSelect`, `backdropFilter` (use `expo-blur` `BlurView`), `background: 'linear-gradient(...)'` (use `expo-linear-gradient`). |

### 1e. Mascot
**File:** `legacy-web/app/components/Mascot.tsx` is the most animation-heavy component (8 keyframes target it). Defer the full port to **Phase 9**. For Phase 1, ship a static placeholder that renders the correct mood SVG — un-animated.

### Verification
- A throwaway `app/index.tsx` that renders `<Header>` + `<IconChip>` + `<Ring pct={0.6} label="42%" />` displays correctly on iOS simulator.

---

## 6. Phase 2 — Navigation skeleton

The goal: stand up all 39 routes as **empty stub screens** so navigation works end-to-end before any screen body is ported.

### 2a. Route map (Next.js → Expo Router)

The screens cluster naturally into the 5 tabs + an onboarding stack + a logging modal. Proposed file layout:

```
app/
├── _layout.tsx                       # Root: <Stack> with onboarding + (tabs)
├── index.tsx                         # Redirects: → /onboarding/welcome OR → /(tabs)/today
├── onboarding/
│   ├── _layout.tsx                   # Stack, headerShown: false
│   ├── welcome.tsx
│   ├── goal.tsx
│   ├── body.tsx
│   ├── activity-level.tsx
│   ├── diet.tsx
│   ├── schedule.tsx
│   ├── compute.tsx
│   ├── plan-reveal.tsx
│   ├── permissions.tsx
│   └── paywall.tsx
├── (tabs)/
│   ├── _layout.tsx                   # NativeTabs: today, plan, coach, stats, me
│   ├── today.tsx
│   ├── plan/
│   │   ├── _layout.tsx               # Stack
│   │   ├── index.tsx                 # ← legacy Plan
│   │   ├── recipe/[id].tsx
│   │   └── shopping.tsx
│   ├── coach.tsx
│   ├── stats/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 # ← legacy Forecast
│   │   ├── activity.tsx
│   │   ├── weigh-in.tsx
│   │   ├── weigh-in-result.tsx
│   │   ├── milestone.tsx
│   │   ├── plateau.tsx
│   │   ├── bad-day.tsx
│   │   └── mascot-gallery.tsx
│   └── me/
│       ├── _layout.tsx
│       ├── index.tsx                 # ← legacy Profile
│       ├── edit.tsx
│       ├── settings.tsx              # ProfileSettings
│       ├── coach-tone.tsx
│       ├── units.tsx
│       ├── integrations.tsx
│       ├── privacy.tsx
│       ├── subscription.tsx
│       ├── notifications.tsx
│       └── help.tsx
└── log/
    ├── _layout.tsx                   # presentation: 'modal'
    ├── choose.tsx
    ├── voice.tsx
    ├── photo.tsx
    ├── barcode.tsx
    ├── search.tsx
    └── confirm.tsx
```

### 2b. Replace string-route navigation

Existing screens call `go('today')`. Two paths:

- **Option A (recommended):** add a `useGo()` hook that maps the legacy route names to Expo Router paths, so screen bodies stay nearly identical during the port:
  ```ts
  // lib/use-go.ts
  const ROUTE_MAP: Record<string, string> = {
    welcome: '/onboarding/welcome',
    today: '/(tabs)/today',
    logChoose: '/log/choose',
    // ...all 39
  };
  export function useGo() {
    const router = useRouter();
    return (legacy: string) => router.push(ROUTE_MAP[legacy] ?? legacy);
  }
  ```
- **Option B:** rewrite every `go(...)` call to `router.push('/...')` during the port. Cleaner end-state, but doubles the per-screen edit surface.

Pick **A** for the port, then sweep to literal `router.push` in a follow-up commit before merging.

### 2c. Tab bar
Use `expo-router/unstable-native-tabs`:
```tsx
<NativeTabs>
  <NativeTabs.Trigger name="today"><Icon sf="circle.dashed" /><Label>Today</Label></NativeTabs.Trigger>
  <NativeTabs.Trigger name="plan"><Icon sf="calendar" /><Label>Plan</Label></NativeTabs.Trigger>
  <NativeTabs.Trigger name="coach"><Icon sf="bubble.left" /><Label>Coach</Label></NativeTabs.Trigger>
  <NativeTabs.Trigger name="stats"><Icon sf="chart.line.uptrend.xyaxis" /><Label>Stats</Label></NativeTabs.Trigger>
  <NativeTabs.Trigger name="me"><Icon sf="person" /><Label>Me</Label></NativeTabs.Trigger>
</NativeTabs>
```
Use SF Symbols for tab icons (Apple convention). Keep the custom Lumi-styled icons from `lib/icons.tsx` for in-screen use.

### Verification
- All 39 routes render a placeholder `<Text>` with their name.
- Bottom tab bar shows on `(tabs)/*`, hidden on `onboarding/*` and `log/*`.
- iOS push transitions feel native; back swipe works.
- Manual route table walk: open onboarding → Today → tap each tab → enter Log modal → dismiss.

---

## 7. Phase 3 — AppContext + persistence

**File:** `context/AppContext.tsx` — port from `legacy-web/app/context/AppContext.tsx`.

Three changes:

1. **Drop `route` and `history`.** Expo Router owns navigation now. Delete `navigate`, `goBack`, the `device-viewport` `scrollIntoView` hack. `restart()` becomes `router.replace('/onboarding/welcome')` + state reset.

2. **Persist with AsyncStorage:**
   ```ts
   useEffect(() => {
     AsyncStorage.getItem('lumi:state').then(s => {
       if (s) setState(JSON.parse(s));
       setHydrated(true);
     });
   }, []);
   useEffect(() => {
     if (hydrated) AsyncStorage.setItem('lumi:state', JSON.stringify(state));
   }, [state, hydrated]);
   ```
   Hold the splash screen until `hydrated`.

3. **Keep the rest.** `AppState`, `set()`, `useApp()` unchanged. Provider mounts in `app/_layout.tsx`.

### Verification
- Set a value (e.g. `goal`), close the app, reopen — value persists.
- Calling `restart()` clears AsyncStorage and routes to welcome.

---

## 8. Phases 4–8 — Screen porting playbook

Same recipe per screen:

1. Copy the legacy screen file from `legacy-web/app/screens/<flow>/<Screen>.tsx` into the new route file.
2. Mechanical replacements (consider an automated codemod if the same patterns repeat):
   - `<div>` → `<View>`
   - `<button onClick={...}>` → `<Pressable onPress={...}>`
   - `<h1> | <h2> | <p> | <span>` → `<Text>` (preserve `style` and copy)
   - `style={{ display: 'flex', flexDirection: 'column' }}` → drop (RN default)
   - `cursor: 'pointer'` → drop
   - `userSelect`, `WebkitTapHighlightColor`, `outline`, `appearance` → drop
   - `background: 'linear-gradient(...)'` → wrap with `<LinearGradient>` from `expo-linear-gradient`
   - `backdropFilter: 'blur(...)'` → wrap with `<BlurView>` from `expo-blur`
   - `position: 'fixed'` → `position: 'absolute'`
   - CSS `vh`/`vw` units → `Dimensions` or `useWindowDimensions`
   - `onChange` on inputs → `onChangeText` on `<TextInput>`; remember `value`, no `defaultValue`
3. Replace `go('foo')` calls with `useGo()('foo')` (Phase 2 Option A).
4. Wrap top-level scrollable content in `<ScrollView contentInsetAdjustmentBehavior="automatic">` for safe areas — preferred over `SafeAreaView`.
5. Copy + paste the test pass: open the legacy screen in a browser side-by-side with the iOS simulator and visually diff.

### Per-flow notes

#### Phase 4 — Onboarding (10 screens)
- Mostly text + radio-style selection rows. Easiest port. Does not need camera/mic.
- `Welcome.tsx` uses the Mascot (`mood="wave"`, `trackCursor`) — render a static mascot in this phase, finish in Phase 9.

#### Phase 5 — Daily (Today, Plan, Recipe, Shopping, Coach, Activity, MascotGallery)
- `Today.tsx` and `Plan.tsx` are the densest screens — many `Ring`s and `Row`s. Port these first to validate the components.
- `Coach.tsx` is a chat UI — `<FlatList>` not `<ScrollView>` for messages.
- `MascotGallery.tsx` will be empty until Phase 9.

#### Phase 6 — Logging (LogChoose, LogVoice, LogPhoto, LogBarcode, LogSearch, LogConfirm)
- Real native APIs needed:
  - `LogVoice` → `expo-audio` `useAudioRecorder` (NOT `expo-av`).
  - `LogPhoto` → `expo-camera` `<CameraView>`.
  - `LogBarcode` → `expo-camera` with `barcodeScannerSettings`.
- Permission prompts on first entry to each screen; route to the legacy `Permissions.tsx` flow if denied.
- Modal presentation (set in `app/log/_layout.tsx`): `presentation: 'formSheet'` + `sheetGrabberVisible: true` for iOS-native feel.

#### Phase 7 — Weekly (WeighIn, WeighInResult, Forecast, Milestone, Plateau, BadDay)
- `Forecast.tsx` likely has a chart — port the SVG-based one as-is using `react-native-svg`. If it grows, swap to `victory-native` later.
- `WeighIn.tsx` has a numeric input — use `<TextInput keyboardType="decimal-pad">`.

#### Phase 8 — Profile (11 screens)
- All toggle/list screens. Replace HTML `<input type="checkbox">` with `<Switch>` from `react-native`.
- `Subscription.tsx` is currently fake — wire to RevenueCat or Apple StoreKit later, not in this migration.

### Verification per phase
- Every screen in the phase reachable from another screen.
- All `useApp().set(...)` calls round-trip (set → navigate → return → value still there).
- iOS simulator smoke test: walk the full flow end-to-end.

---

## 9. Phase 9 — Mascot + animations

Replace 8 CSS `@keyframes` with Reanimated worklets. Mapping:

| CSS keyframe | Reanimated equivalent |
|---|---|
| `pip-breathe` (scaleY/scaleX 1→1.03→1) | `withRepeat(withTiming(1.03), -1, true)` |
| `pip-bob` (translateY 0→-6→0) | `withRepeat(withSequence(withTiming(-6), withTiming(0)), -1)` |
| `pip-jump` (4-step) | `withSequence` of 4 keyframes, `withRepeat(..., -1)` |
| `pip-wave` (rotate 0→22→-8→0) | `withSequence(withTiming(22), withTiming(-8), withTiming(0))` |
| `pip-blink` (scaleY pulse) | Same pattern |
| `pip-shine-rot` (rotate 360°) | `withRepeat(withTiming(360, { duration: ..., easing: linear }), -1)` |
| `pulse` (opacity + scale) | `useAnimatedStyle` combining both |
| `scan` (top: 16 → calc(100% - 20px)) | `withRepeat(withTiming(target), -1)` driven by `useSharedValue` |
| `compute-fill` (width 0→100%) | One-shot `withTiming` over computed duration |
| `shimmer` (background-position) | `LinearGradient` mask + animated `translateX` shared value |

Keep `Mascot.tsx` as a single component that exposes `mood` prop; internally select the right animation set per mood. Use `react-native-svg` `<G>` + animated transforms — Reanimated supports SVG props via `createAnimatedComponent`.

### Verification
- Side-by-side visual comparison with `legacy-web` running locally — animations should be perceptibly identical.
- Profile in Reanimated dev tools: confirm animations run on UI thread (FPS stays at 60 with Mascot visible).

---

## 10. Phase 10 — Native APIs

Map the wireframe's `permissions` state to real OS dialogs:

| `state.permissions` key | Library | Trigger point |
|---|---|---|
| `notif` | `expo-notifications` | `Permissions.tsx` toggle |
| `health` | `expo-health` (or `react-native-health`) | `Permissions.tsx` toggle |
| `cam` | `expo-camera` `requestCameraPermissionsAsync()` | First `LogPhoto` / `LogBarcode` entry |
| `mic` | `expo-audio` `requestRecordingPermissionsAsync()` | First `LogVoice` entry |

Add iOS Info.plist usage strings (camera/mic/notifications/health) via `app.json` `ios.infoPlist`. These are required for App Store submission.

Add `expo-haptics` to every primary CTA — the wireframe is silent on this, but native users expect it. Light impact on row taps, success notification on flow completion.

### Verification
- Each permission dialog appears once, persists denial, can be re-prompted from `Permissions.tsx`.
- Haptics fire on iOS device (simulator does not haptic).

---

## 11. Phase 11 — EAS dev client + TestFlight

1. `eas init` — links the project, writes `eas.json`.
2. `eas.json` profiles:
   ```json
   {
     "build": {
       "development": { "developmentClient": true, "distribution": "internal", "ios": { "simulator": true } },
       "preview":     { "distribution": "internal" },
       "production":  { "autoIncrement": true }
     }
   }
   ```
3. `eas build -p ios --profile development --submit` → custom dev client lands in TestFlight.
4. Internal testers (just you) install via TestFlight, scan QR from `npx expo start --dev-client`.

### Verification
- TestFlight install completes, dev client connects to local Metro, hot reload works.
- A production-profile build succeeds (don't submit yet).

---

## 12. Phase 12 — Android sweep

After iOS is feature-complete:

- Smoke-test every screen on an Android emulator (Pixel 7, API 34). Expect issues with: shadow rendering (Android `boxShadow` differs from iOS), `BlurView` (Android requires `experimentalBlurMethod: 'dimezisBlurView'`), font rendering on Fraunces italic, status bar contrast.
- Fix per-screen, not globally.
- `eas build -p android --profile preview` → APK for sideload testing.

---

## 13. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| `boxShadow` doesn't render identically on Android | High | Accept — Android shadows are platform convention; don't fight it. |
| Mascot animations look "off" vs CSS | Medium | Side-by-side visual diff in Phase 9; tune Reanimated easing curves. Budget extra day. |
| Camera/audio permissions break TestFlight review | Medium | Write clear `NSCameraUsageDescription` etc. strings *before* first TestFlight submission. |
| `LinearGradient` perf in `Blob` (4–6 per screen × 39 screens) | Low | Replace with solid colors + opacity if FPS drops; the original gradients are subtle. |
| Keyboard avoidance on `LogVoice` / `Coach` chat input | Medium | Use `react-native-keyboard-controller` (better than built-in `KeyboardAvoidingView`). |
| Bun lockfile vs npm/yarn in Expo land | Low | Drop bun for the new project — Expo CLI assumes npm/yarn/pnpm. Keep bun in `legacy-web/` only. |

---

## 14. Out of scope (intentionally)

- Real backend / API / auth / database
- RevenueCat / StoreKit (Subscription screen stays mocked)
- Push notification infrastructure (UI toggle only, no FCM/APNs server)
- Analytics
- Localization (English only; `units.lang` toggle is cosmetic)
- Web target via Expo Router web (the legacy Next.js app stays the web canonical until a web rebuild is scoped)
- Tests — the migration is visual/manual; adding Jest + RNTL is a follow-on task

---

## 15. Critical files (where the work actually happens)

| New path | Source | Type |
|---|---|---|
| `app/_layout.tsx` | new | Root stack + provider mounting |
| `app/(tabs)/_layout.tsx` | new | NativeTabs config |
| `app/onboarding/_layout.tsx` | new | Onboarding stack |
| `app/log/_layout.tsx` | new | Log modal stack |
| `lib/tokens.ts` | `legacy-web/app/lib/tokens.ts` | Verbatim copy |
| `lib/icons.tsx` | `legacy-web/app/lib/icons.tsx` | `Icon` rewritten, `PATHS` verbatim |
| `lib/use-go.ts` | new | Route name → Expo Router path map |
| `context/AppContext.tsx` | `legacy-web/app/context/AppContext.tsx` | Strip routing, add AsyncStorage |
| `components/Mascot.tsx` | `legacy-web/app/components/Mascot.tsx` | Reanimated rewrite (Phase 9) |
| `components/{Header,IconChip,Blob,Ring,Row,FAB}.tsx` | `legacy-web/app/components/ui.tsx` | Split + RN primitives |
| `app/onboarding/*.tsx` (×10) | `legacy-web/app/screens/onboarding/*` | Per-screen port |
| `app/(tabs)/today.tsx` etc. (×29) | `legacy-web/app/screens/**/*` | Per-screen port |
| `eas.json` | new | Build profiles |
| `app.json` | new (scaffolded) | Permissions strings, bundle ids, icons |

---

## 16. Verification — how to know it's done

End-to-end smoke test on an iPhone via TestFlight dev client:

1. Cold-launch app → splash → welcome (or Today if onboarding complete).
2. Walk full onboarding (Welcome → Goal → Body → … → Paywall) — verify every selection persists in AppContext.
3. Land on Today, tap each of 5 tabs.
4. Tap Log FAB → walk all 5 log methods (voice/photo/barcode/search/confirm). Confirm camera + mic prompts fire.
5. Pull down on Stats → trigger WeighIn → enter weight → see Result + Forecast.
6. Profile → enter every settings sub-screen, toggle every switch, confirm persistence after force-quit + relaunch.
7. From any screen, swipe back gesture works (iOS).
8. No JS errors in dev client console; no native crashes; no FPS drops below 55 with Mascot animating.

When all 8 pass on iOS + Android, the migration is done. The `legacy-web/` directory can then be deleted in a separate commit.
