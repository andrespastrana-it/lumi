# Performance Notes

Snapshot of bundle size and render-cost decisions made during the migration. Refresh by running `npx expo export -p web --output-dir dist` and re-measuring.

## Web bundle size (current)

```
dist/                                      12 MB total
├── _expo/static/js/web/entry-*.js          2.6 MB raw / 665 KB gzipped
├── _expo/static/js/web/index-*.js          48 KB
├── _expo/static/css/native-tabs.module-*.css   2.5 KB
└── assets/                                 9.0 MB
    └── (almost entirely @expo-google-fonts files: Fraunces + DM Sans
        in woff, woff2, and ttf — multiple weights)
```

**Verdict.** Web bundle is fine for the scope. 2.6 MB / 665 KB gzipped is in the normal band for an RN-on-web app of this surface area. Most of the heft is React, RN, react-native-svg, react-native-reanimated, and Expo Router.

**Caveat.** This is the **web** bundle. The native bundle is smaller and structured differently:

- Hermes precompiles JS to bytecode → ~30–40% smaller than the web JS bundle.
- Fonts ship as `.ttf` only (the woff/woff2 variants are web-only) — drops ~6 MB.
- Native assets ship as `@1x/2x/3x` PNGs from `expo-asset`; web includes all variants.

Expect **native iOS install size** to be ~25–35 MB once the EAS build completes (Hermes runtime + JSI binaries dominate, not the JS bundle).

## How to remeasure

```bash
# Web (Metro web bundler)
npx expo export -p web --output-dir dist
du -sh dist
gzip -c dist/_expo/static/js/web/entry-*.js | wc -c

# iOS (Hermes bytecode) — needs Mac or EAS cloud build
# After `eas build -p ios --profile preview`, the build artifact in EAS
# shows the .ipa size. Gold-standard number for "what users download."
```

## Render-cost decisions made

| Component | Decision | Why |
|---|---|---|
| `Mascot` | Wrapped in `React.memo` | 8 Reanimated shared values + multi-track liveness per instance. Rendered inside Coach (re-renders on every TextInput keystroke), MascotGallery (12 instances). Memo short-circuits the rebuild when sibling state changes. |
| `Icon` (`lib/icons.tsx`) | Wrapped in `React.memo` | Called dozens of times per dense screen. All-primitive props. Default shallow comparator suffices. |
| `MealsList` rows in Today | Inline JSX, NOT `FlatList` | Only 5 rows. The `FlatList` virtualization tax (cell measuring, recycler) costs more than 5 cheap renders save. Switch to `FlatList` if the list ever grows past ~20. |
| Mascot inner accents | `useAnimatedProps` on raw SVG attrs (cy, opacity, transform) | Runs on the UI thread, no JS bridge crossings. Legacy used SMIL `<animate>` which RN can't run; this is the closest equivalent. |
| `Blob` | Plain `<View>` with solid color + opacity | Legacy was `radial-gradient` + `blur(8px)`. RN doesn't have radial-gradient as a CSS-style prop; using `expo-blur` + `expo-linear-gradient` for every Blob would mean ~5 native views per screen with no real visual win. |
| Splash screen | `expo-splash-screen` plugin, cream bg | Avoids the white-flash before `Gate` releases. |
| Fonts | `expo-font` via `@expo-google-fonts/*` | Fonts are blocking — `<Gate>` keeps splash up until they load. Without this, headlines flash in fallback fonts on cold start. |
| AsyncStorage hydration | Render-gated in `<Gate>` | App can't render until hydrated, otherwise screens read default state and route the user to Welcome instead of Today on relaunch. |

## What's NOT yet optimized

These are deferrals, not bugs. Address when (and only when) profiling shows they're hot.

- **Coach `<ScrollView>` for chat messages.** Should be `<FlatList>` once messages can grow past ~30. For wireframe-stage demo where the chat is 4 messages, `<ScrollView>` is fine.
- **Mascot ground-shadow ellipse.** The shadow group runs `useAnimatedProps` even on the static moods that don't move. Cost is one worklet call per render — negligible. Could skip when `m.anim === 'breathe'` etc.
- **`SvgXml` parses a string per render in `Icon`.** When the colored XML changes (different `color` prop), the underlying parser re-runs. Could swap to direct `<Svg>` + `<Path>` JSX for the icons that animate (none currently — all icon usage is static).
- **`<RadialGradient>` in `FoodPlate` and Mascot.** SVG gradients on iOS use Core Graphics; on Android they go through a software path. If MealsList scrolling drops below 60fps on Android, the FoodPlate radial is the first suspect.
- **Bundle-level code-splitting.** Expo Router supports lazy routes (`.lazy.tsx` suffix) on web. Not yet used. Would shrink initial entry by deferring less-used routes (Onboarding flow, Subscription) until navigation. Untouched in this migration since web isn't the primary target.

## How to spot regressions

```bash
# Re-export and diff sizes
npx expo export -p web --output-dir dist-new
du -sh dist dist-new
# If dist-new is >10% bigger, something heavy got added — check the
# entry-*.js for unfamiliar import paths.

# In dev, React DevTools "Highlight updates when components render" is
# the cheapest profile. Walk the suspect screen, see what flashes.
# Anything flashing per keystroke that doesn't depend on the keystroke
# is a memo candidate.
```

## Profiling guides (device-side)

For the real perf story, profile on a phone:

- **JS thread (FPS, callback time):** `npx expo start`, press `j` in Metro, open the Performance tab in React Native DevTools. Record a walk through a heavy screen. Long tasks > 16ms are the budget eater.
- **Native render (UI-thread frame drops):** Xcode Instruments → Time Profiler on the iOS dev client. The Reanimated UI runtime shows up as a separate thread.
- **Memory:** Xcode → Memory Graph; or `adb shell dumpsys meminfo com.axora.lumi` on Android.
