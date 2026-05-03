# Visual Drift Catalog

Known places where the RN port likely diverges from the legacy Next.js wireframe. Built from notes during the screen ports — these are the candidates worth eyeballing first when you do the side-by-side review (step 6 of `docs/NEXT-STEPS.md`).

Run both side by side:

```bash
# Terminal 1 — legacy
cd legacy-web
bun install
bun run dev               # → http://localhost:3000 (open Chrome DevTools, iPhone 14 Pro size)

# Terminal 2 — Expo (any host)
cd ..
npx expo start            # scan QR with iPhone Camera + Expo Go
```

For each row below, walk to the listed route in both and compare. P0 items are likely to look broken; P1 are visible but acceptable; P2 are pixel-level.

## P0 — Likely visibly broken

| Where | What | Why |
|---|---|---|
| `app/onboarding/paywall.tsx` | Dark background — legacy uses `radial-gradient(circle at 80% 0%, #2D2620 0%, ink 60%)`; port uses `LinearGradient` start `(0.8, 0)` end `(0.2, 1)`. The corner-glow effect is approximated as a diagonal sweep. | The radial → linear approximation fundamentally can't reproduce a corner-anchored radial. Likely the brightest spot is in the wrong place. **Fix:** wrap a `react-native-svg` `RadialGradient` if it bothers you, or accept the linear sweep. |
| `app/(tabs)/plan/recipe.tsx` Hero | Nested radial-gradient plates (cream outer 200×200, green inner 110×110) are the most ornate visual in the app. Port uses `react-native-svg` `RadialGradient` with `cx="0.35" cy="0.35" r="0.65"` — close but not perfect. | Verify centering, gradient stop positions, and that the green inner doesn't bleed past the cream outer. Easy P1 if anything. |
| `components/Blob.tsx` | Legacy `Blob` is `radial-gradient(circle, color 0%, transparent 70%)` blurred 8px. Port is a flat `View` with `opacity` and no blur. | Hard edge instead of soft glow. **Fix if needed:** wrap in `expo-blur` `BlurView` or use `react-native-svg` `RadialGradient` defs in the component. |
| `app/log/voice.tsx` | Pulse rings — port uses three staggered Reanimated `withRepeat` cycles. Legacy CSS keyframes had specific easing curves. | Verify timing feels alive, not jerky. |

## P1 — Visible drift, probably acceptable

| Where | What | Why |
|---|---|---|
| `components/Mascot.tsx` | The 13 mood animations are a faithful but not-pixel-perfect port. Legacy used CSS `cubic-bezier`, port uses Reanimated `Easing` presets (`Easing.out(Easing.sin)`, `Easing.inOut(Easing.quad)`, etc.). The deep-liveness rework added asymmetric inhale-hold-exhale curves that the legacy never had. | New version is *better* than legacy — but it's different. Visual diff will show breath rhythm differences. |
| `components/Mascot.tsx` accents | `confetti`, `hearts`, `dots`, `sleepZ`, `sweat` re-port with `useAnimatedProps`. Legacy used SVG SMIL `<animate>` tags. | RN has no SMIL; the Reanimated equivalents track translateY/opacity but the timing curves differ slightly. |
| All screens with shadows | Every `boxShadow` in the codebase is the CSS string format. RN 0.76+ supports it, but Android renders shadows differently from iOS regardless. On Android they often look flatter or get clipped at corners. | Accept platform convention. Don't fight it. |
| `app/(tabs)/coach.tsx` chat input dock | Legacy uses `backdrop-filter: blur(10px)` on the bottom dock. Port uses solid `rgba(255,251,241,.92)` — no blur. | Port looks slightly less glassy. **Fix if it bothers you:** swap the dock View for `BlurView` from `expo-blur`. |
| `app/(tabs)/today.tsx` `WeighInBanner` | The white `rgba(255,255,255,.2)` icon background should look smooth on iOS. On Android may look slightly more opaque due to backdrop differences. | Cosmetic. |
| `app/log/voice.tsx`, `app/log/photo.tsx`, `app/log/barcode.tsx` | Dark camera UIs with `LinearGradient` overlays. Status bar contrast on Android may be wrong (we use a global `<StatusBar style="dark" />` in `_layout.tsx` for the cream theme). | **Fix:** add per-route `<StatusBar style="light" />` to the camera screens. |
| `app/(tabs)/plan/index.tsx` "Up next" pill | Tiny apricot pill on next meal. Vertical centering of the text inside might be off by 1–2px. | Tune `paddingVertical` if it looks misaligned. |

## P2 — Pixel-level / kerning

| Where | What |
|---|---|
| Headlines using `Em` | Italic apricot inline emphasis. Fraunces italic kerning vs the Roman text might not match exactly. |
| `app/(tabs)/today.tsx` `CaloriesCard` | `1,108` formatted via `toLocaleString()` — locale-dependent thousands separator. iOS in EN-US uses `,`, in some other locales `.`. |
| `app/(tabs)/me/index.tsx` profile avatar | The hardcoded `M` initial — Fraunces 28pt italic. Vertical centering inside the round bg is approximate. |
| `app/onboarding/welcome.tsx` "Pip" wordmark | 88pt italic display. Line-height tuning (`lineHeight: 88`) may need a -2 or +2 nudge. |
| All `S.h1` headlines with `{'\n'}` line breaks | RN line-break rendering handles `\n` fine, but the second line may render with slightly different baseline than CSS would. |

## P3 — Functional drift, not visual

These are behavioural drifts to spot-check during the smoke walk, not pixel issues:

- `app/onboarding/permissions.tsx` toggle: legacy was wireframe-only state. Port now requests real OS permissions for cam / mic / notif. The first time you toggle each, the OS dialog appears. After that, toggling off doesn't revoke (iOS only lets you do that from Settings).
- `app/log/photo.tsx`: real camera preview behind the wireframe overlay. On simulator, the camera view shows a checkerboard placeholder.
- `app/log/voice.tsx`: real audio recorder. Pulse rings are decorative — they don't track audio amplitude. Pure cosmetic.
- `app/log/barcode.tsx`: real barcode scanner. Point at any product packaging — `onBarcodeScanned` fires.
- `app/(tabs)/coach.tsx`: chat is local-only. No real Pip, no LLM. Replies are hardcoded strings.

## How to log a finding

When you spot something, copy this template into a GitHub issue:

```
**Severity:** P0 / P1 / P2
**Route:** /(tabs)/...
**File:** app/...
**What's different:** [one sentence]
**Screenshot:** [paste]
**Suggested fix:** [optional, defer to designer if visual]
```

## Non-drift things that look weird but are intentional

- **No back button on first onboarding screen** (Welcome) — by design; navigation stack has nothing to pop.
- **Today's date and greeting change every refresh** — `HeaderGreeting` reads `new Date()` directly. Morning before noon, Afternoon noon-6, Evening after.
- **Mascot blinks at random intervals** — every 2–6 seconds, with a 40% chance of double-blink. Not a glitch.
- **Mascot in chat bubbles is static** (`animate={false}`) — reads as a small inline avatar, not a second living mascot.
- **Subscription "Trial" pillow on the subscription screen** — the visible plan picker below is wireframe-only; tapping doesn't actually change billing.

## Performance check (no device needed)

While doing the visual diff, also have these open:

- **Metro logs**: any "Possible Unhandled Promise Rejection" or "Warning:" lines worth investigating
- **React DevTools** (`j` in Metro): re-render highlighter on. After the recent memo pass, Coach screen typing in TextInput should re-render only the input + Mascot if `pipTyping` flips. Today screen scrolling should re-render only what scrolled into view.
