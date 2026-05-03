# Lumi · Next Steps Playbook

Detailed runbook for moving the `migration-to-expo` branch from "code complete" to "running on a real device, reviewed, and merged." Seven steps, each with prereqs, commands, verification, and recovery.

**Current state (snapshot):**
- Branch `migration-to-expo`, last commit `c973df4` covers Phases 0–3.
- Phases 4–11 are **done but uncommitted** — 53 changed files (37 screen ports, Mascot, helpers, EAS config, docs).
- Phase 12 (Android sweep) blocked behind step 5.
- Mac runtime currently broken with a Metro `InvalidPackageError` on `expo-notifications` — fixed in step 2.

---

## Step 1 — Commit Phases 4–11

**Goal.** Snapshot the screen ports + Mascot + native APIs + EAS config so the work is durable and can be diff-reviewed.

**Why now.** 53 modified/new files is a lot to lose to one bad rebase. Get them in the history before any further `npm install`, branch fork, or remote push.

**Prerequisites.**
- Working tree dirty; `git status` lists ~30 modified screens + `eas.json`, `.easignore`, `docs/OPERATIONS.md`, `lib/permissions.ts`, `lib/styles.ts`, several new components, the rewritten `Mascot.tsx`.
- Repo type-checks clean (`npx tsc --noEmit` exit 0).
- `npx expo-doctor` reports 18/18.

**Decision: bundled vs split.**

| Option | When |
|---|---|
| **Single commit** (recommended) | If you want one diff-able unit ("port screens + native APIs"). Easiest to review. Easiest to revert. |
| **One commit per phase** (4, 5, 6, 7, 8, 9, 10, 11) | If you want git history that mirrors the migration plan exactly. More work to stage; more atomic to bisect. |

Default: bundled. You can always split later via interactive rebase if review feedback demands it.

**Commands (bundled).**
```bash
# Sanity-check before staging
npx tsc --noEmit && echo "OK"
npx expo-doctor

# Stage explicit paths — never `git add .` (avoids surprise binaries / .env)
git add app components context lib eas.json .easignore docs

# Confirm what's staged
git diff --cached --stat | tail -20

# Commit
git commit -m "Port 39 screens, Mascot, native APIs; add EAS config

Phase 4: 10 onboarding screens (Welcome → Paywall) wired to AppContext.
Phase 5: 7 daily screens (Today, Plan, Recipe, Shopping, Coach, Activity,
  MascotGallery). Coach uses TextInput + KeyboardAvoidingView; Today
  embeds 5 sub-cards (Greeting, Calories, Streak, Meals, WeighIn).
Phase 6: 6 logging screens with Reanimated mic pulse + scan bar.
Phase 7: 6 weekly screens; Forecast chart in react-native-svg.
Phase 8: 11 me/* screens; native <Switch> toggles.
Phase 9: Full 13-mood Mascot — react-native-svg body + Reanimated outer
  animations (bob/breathe/breatheSlow/jump/lean/wave). 8 SMIL inner
  keyframes dropped (RN doesn't support them); body shape preserved.
Phase 10: expo-camera in LogPhoto/LogBarcode, expo-audio in LogVoice,
  expo-notifications in onboarding/permissions. Permission-denied
  fallbacks with Open-Settings deep link.
Phase 11: eas.json (development/preview/production), .easignore,
  docs/OPERATIONS.md runbook.

Helpers: lib/styles.ts, lib/permissions.ts, components/{Em,CtaButton,
SelectCard,CheckBadge,FoodPlate,ScreenStub}." -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

**Verification.**
```bash
git log --oneline -2
# Expect: <hash> Port 39 screens, Mascot, native APIs; add EAS config
#         c973df4 Bootstrap Expo migration: scaffold Expo Router + AppContext + 39 stub routes

git status
# Expect: nothing to commit, working tree clean
```

**Recovery.**
- If the commit message fails to format (Windows PowerShell + multi-line `-m`): switch to a heredoc (`git commit -m "$(cat <<'EOF' ... EOF)"`) or write the message to `.git/COMMIT_EDITMSG` and use `git commit -F`.
- If `git add` accidentally stages a `.env` or other secret: `git restore --staged <file>`.

**Time:** 5 minutes.

---

## Step 2 — Fix the Mac runtime

**Goal.** Get `npx expo start` actually serving the app on the Mac so you can scan the QR with a dev client (or simulator) and walk the screens.

**Symptom.** Metro `InvalidPackageError` resolving `expo-notifications/build/index.js/index(.web.ts|.ts|...)`.

**Diagnosis.** Two likely causes, both Mac-side:
1. **Cross-platform `node_modules`** — Windows install copied via Dropbox/iCloud or git (it isn't tracked, but USB transfer or accidental commit could). Native bindings ship per-platform; `*-win32-*` binaries on Mac break Metro's resolver upstream.
2. **Stale Metro cache** — `expo-notifications` was added mid-session; Metro's pre-existing cache doesn't know about it.

**Prerequisites.**
- Repo cloned to `/Users/andre/Desktop/Axora/lumi` on the Mac.
- Node ≥ 20, npm, watchman optional.
- Step 1 commit pushed (or unpushed, doesn't matter for this step).

**Commands.**
```bash
cd /Users/andre/Desktop/Axora/lumi

# 1. Nuke install + caches
rm -rf node_modules package-lock.json .expo
watchman watch-del-all 2>/dev/null || true   # safe if watchman not installed

# 2. Reinstall fresh on Mac (resolves correct platform binaries)
npm install

# 3. Verify SDK alignment hasn't drifted
npx expo install --fix
npx expo-doctor                # expect 18/18

# 4. Start Metro with cache cleared
npx expo start -c
```

**Verification.**
- Metro prints `Logs for your project will appear below.` and the QR.
- Press `j` → React Native DevTools open without errors.
- No "Unable to resolve" lines in the Metro stream.

**Recovery — if `expo-notifications` keeps erroring after the clean reinstall:**

Option A (preferred — pin notifications to a known-good version):
```bash
npm install expo-notifications@~0.31.0   # SDK 55 baseline
npx expo start -c
```

Option B (rip it out — notifications aren't needed for any rendered UI):
```bash
# In lib/permissions.ts: replace the import with a stub
# import * as Notifications from 'expo-notifications';
# →
# const Notifications = {
#   getPermissionsAsync:    async () => ({ granted: false, canAskAgain: false }),
#   requestPermissionsAsync: async () => ({ granted: false }),
# };
npm uninstall expo-notifications
# Remove "expo-notifications" plugin from app.json if present
npx expo start -c
```
The `Permissions` toggle for `notif` will then no-op (always reports denied), but the rest of the app runs unchanged. You can re-add notifications later when wiring real push.

**Recovery — if Metro fails on a different package after reinstall:**
- Read the Metro error closely: it always names the importing file ("While trying to resolve module X from file Y"). That file is the entry point — the dependency chain to investigate.
- Run `node -e "console.log(require.resolve('<pkg>'))"` to confirm the package is reachable from Node's perspective.
- If the package is for the New Architecture and your build is on the old one: `cd ios && pod install --repo-update` (only relevant if `ios/` directory exists; bare workflow only).

**Time:** 5 minutes for a clean reinstall, plus 2 minutes for Metro to warm up the first build.

---

## Step 3 — Push the branch to remote

**Goal.** Get the work onto GitHub so EAS cloud builds, code review, and PRs can find it.

**Prerequisites.**
- Step 1 done (commits exist locally).
- A remote configured (`git remote -v` shows `origin`).
- GitHub credentials (PAT or SSH key) set up — `gh auth status` confirms.

**Commands.**
```bash
# Sanity: confirm you're on the right branch
git branch --show-current   # → migration-to-expo

# Confirm remote
git remote -v
# → origin  git@github.com:<owner>/lumi.git (fetch)
# → origin  git@github.com:<owner>/lumi.git (push)

# Push, set upstream
git push -u origin migration-to-expo
```

**If the remote doesn't exist yet** (no `origin`):
```bash
gh repo create <owner>/lumi --private --source . --remote origin --push
# Or manually:
# git remote add origin git@github.com:<owner>/lumi.git
# git push -u origin migration-to-expo
```

**Verification.**
```bash
gh pr list --state open --head migration-to-expo
# (empty is fine — we haven't opened a PR yet)

git log origin/migration-to-expo -1 --oneline
# Should match your local HEAD
```

**Recovery.**
- **Push rejected (non-fast-forward)**: someone (or a previous you) pushed to this branch already. `git fetch origin && git log HEAD..origin/migration-to-expo` to see what's there. Don't `--force` without confirming you own the branch.
- **Auth fails**: `gh auth login` or fix your SSH key. Avoid `https://` URLs with PATs in them — they leak in logs.

**Time:** 1 minute.

---

## Step 4 — First TestFlight build (iOS dev client)

**Goal.** Get a custom dev client onto your iPhone via TestFlight so you can run the actual native app — not just simulator screenshots — and iterate via Metro.

**Prerequisites.**
- Apple Developer Program membership ($99/yr) on `hugo.calloway@kavrentech.com` (or another Apple ID).
- 2FA recovery codes for the Apple ID — EAS will prompt during cert setup.
- Step 3 done (branch on GitHub) — EAS uploads the working tree, but having git history aligned helps with debugging.
- Mac runtime works (step 2) — at minimum, `npx expo-doctor` passes.

**Steps.**

### 4a. Bootstrap EAS

```bash
# Sign in to your Expo account
npx eas login

# Link this repo to a new EAS project. Writes the projectId into app.json.
npx eas init
```

After `eas init`, your `app.json` will gain:
```json
"extra": { "eas": { "projectId": "xxxx-xxxx-..." } }
```
**Commit this change** (it's required for the build to find the project).

### 4b. Configure iOS credentials

```bash
npx eas credentials
# Select: ios → development → set up new
```

EAS handles:
- Apple Distribution certificate
- Provisioning profile (development for dev client)
- Push notification key (if you opt in)

If you have existing certs in your Apple developer account, EAS will offer to reuse them.

### 4c. Build + auto-submit

```bash
npx eas build -p ios --profile development --auto-submit
```

What happens:
1. EAS uploads your source to a Linux+macOS build farm (~30 sec).
2. Builds the iOS app with your dev client embedded (~12-18 min).
3. Auto-submits to App Store Connect.
4. Sends you an email when it lands in TestFlight (~5 min after build finishes).

You can also do this in three commands if you want to inspect the build first:
```bash
npx eas build -p ios --profile development          # build only
# inspect at https://expo.dev/accounts/<you>/projects/lumi/builds
npx eas submit -p ios --latest                       # submit to TestFlight
```

### 4d. Install on iPhone

1. Open the **TestFlight** app on your iPhone.
2. Sign in with the same Apple ID that owns the developer account.
3. Accept the test invite (auto-sent to your Apple ID email).
4. Install "Lumi" — the icon shows up next to your existing apps.
5. Launch it. The dev client UI shows: "Enter a URL manually" or scan a QR.

### 4e. Connect Metro

Back on the Mac:
```bash
npx expo start --dev-client
```

On your phone, in the dev client launcher:
- Either scan the QR shown in the terminal
- Or tap "Enter URL" and type `exp+lumi://expo-development-client/?url=http://<your-mac-LAN-ip>:8081`

The phone connects, Metro bundles, the app boots into your code. Any save reloads.

**Verification (the real smoke test).**
1. Cold launch → splash → either Welcome (first launch) or Today (if onboarding done before).
2. Walk Welcome → Goal → Body (tap +/-) → ActivityLevel → Diet (multi-tag) → Schedule → Compute (auto-advances) → PlanReveal → Permissions (grant camera + mic when prompted — real OS dialogs!) → Paywall → Today.
3. Tap each of the 5 tabs. Bottom bar uses iOS native `UITabBar`.
4. Tap Log FAB. Try each of: Voice (mic activates, audio meter drives bars), Photo (real camera preview), Barcode (real scanner — point at any product packaging), Search, Confirm.
5. Stats → Weigh-in → enter weight → see Result + Forecast (SVG chart).
6. Me → walk every settings sub-screen, toggle every Switch, force-quit app, relaunch — values persist (AsyncStorage).
7. From any screen: swipe-from-edge back gesture works.
8. Mascot animates at 60fps on the Welcome / Today / Compute / Coach screens.

**Common failures.**
- **"Bundle Identifier already exists"** during cert setup → `app.json` `ios.bundleIdentifier` is `com.axora.lumi`; if someone else's Apple ID already registered that, change to `com.<yourorg>.lumi` and rebuild.
- **TestFlight rejects build for missing usage strings** → already configured in `app.json` `ios.infoPlist` (NSCameraUsageDescription, NSMicrophoneUsageDescription, NSPhotoLibraryUsageDescription, NSHealthShareUsageDescription). If TestFlight still complains, re-read its specific error — Apple sometimes wants `NSUserTrackingUsageDescription` if any analytics SDK is installed (we have none).
- **Dev client can't reach Metro** (phone says "Could not connect") → Mac and phone must be on the same Wi-Fi. If they are, your Mac firewall is blocking port 8081. System Settings → Network → Firewall → allow incoming for `node`.
- **App launches but white-screens** → check Metro terminal. Likely a runtime import error from a screen we ported. Reload (shake phone → "Reload") and read the JS error.

**Time:** 30 minutes first time (mostly waiting on the cloud build). 5 minutes for subsequent dev client rebuilds.

---

## Step 5 — Phase 12 — Android sweep

**Goal.** Get every screen rendering correctly on Android. iOS-first means Android has accumulated drift; this step is the cleanup pass.

**Prerequisites.**
- Android Studio installed with at least one AVD (Pixel 7, API 34 recommended).
- `adb` on PATH (`adb devices` should list the emulator).
- Mac runtime working (step 2). On Windows, this works too — Android development is cross-platform.
- Optional: a physical Android device for performance testing (emulator FPS is unreliable).

**Steps.**

### 5a. First boot

```bash
# Start the emulator in one terminal
emulator @Pixel_7_API_34            # adjust AVD name to yours

# In another terminal, build + install + start dev client
npx expo run:android
```

`expo run:android` does what `eas build` does on EAS, but locally — Gradle compiles the app, installs the APK on the running emulator, and connects Metro automatically. Takes 5-10 minutes the first time, ~30 seconds for subsequent JS-only changes.

### 5b. Walk every screen

For each route, snapshot the iOS screen (camera or simulator screenshot) and the Android screen, side by side. Note divergences. Common Android-specific issues to expect:

| Issue | Where | Fix |
|---|---|---|
| Shadows look flat or boxy | Anywhere using `boxShadow` (CtaButton, IconChip, FAB, all `S.pillow*`) | Accept platform convention. Optionally add `elevation` for paper-like rise. |
| `BlurView` (Coach input dock) shows opaque | Android only | `<BlurView experimentalBlurMethod="dimezisBlurView">` |
| Status bar contrast wrong | Onboarding screens with cream bg, Paywall with dark bg | `<StatusBar style="dark" />` vs `"light"` per route. Currently global in `_layout.tsx`. Add a per-route `<StatusBar>` if needed. |
| Fraunces italic doesn't render | All `Em` + headline accents | The font loads on both platforms via expo-font — verify by checking dev client logs for "fonts loaded". If still wrong, reinstall `@expo-google-fonts/fraunces`. |
| Native tabs label cut off | `(tabs)/_layout.tsx` | Android NativeTabs sizes labels differently. Either shorten labels ("Today" → "Today" already short, this is mostly fine) or set `labelVisibilityMode="labeled"`. |
| Camera preview mirrored | LogPhoto / LogBarcode | Default `facing="back"` is correct; verify on device. |
| Switch colors weird | Profile screens | RN `<Switch>` `trackColor.true` works on both, `thumbColor` differs. Add per-platform thumb if needed. |
| ScrollView eats safe-area | Any `(tabs)/*` route | We use `contentInsetAdjustmentBehavior="automatic"` everywhere; that's iOS-only. On Android, wrap top of content in `paddingTop: useSafeAreaInsets().top`. |
| Reanimated dropping frames | Mascot, especially in MascotGallery (12 mascots × continuous animations) | Build a release APK to test perf — debug builds are 2-3× slower. `npx expo run:android --variant release` |

### 5c. Fix per-screen, not globally

Resist the urge to write `Platform.OS === 'android' ? ... : ...` everywhere. Most Android-specific styling diverges in *one* component (Header back button, FAB shadow) — fix it once in the component file, not at every callsite.

### 5d. Build a preview APK for sideload testing

```bash
npx eas build -p android --profile preview
# Outputs an APK download URL — install on any Android phone via:
#   adb install lumi-preview.apk
# or open the URL on the phone directly.
```

**Verification.**
- Walk the same 8-step iPhone flow from step 4 on Android. Every screen renders, every nav works, no crashes.
- `adb logcat | grep -E "ReactNative|FATAL"` is quiet during the walk.

**Time:** 4-8 hours, including fixes. Budget a full day for the first Android pass.

---

## Step 6 — Visual diff against legacy

**Goal.** Catch screens where the RN port drifted from the wireframe's intent. This is the design QA pass.

**Why now.** The Mascot, gradients (Recipe hero, Paywall background), and SVG charts (Forecast) are the highest-risk areas because they involved RN-specific approximations of CSS effects.

**Prerequisites.**
- Legacy Next.js app still runnable from `legacy-web/`.
- iOS sim or dev client running (step 4).
- Mac with two screens, or a phone-in-hand + browser side-by-side.

**Setup.**
```bash
# Terminal 1 — legacy web
cd legacy-web
bun install
bun run dev   # → http://localhost:3000
# Open in Chrome at iPhone 14 Pro size (DevTools → Toggle device toolbar)

# Terminal 2 — Expo dev client
cd ..
npx expo start --dev-client
# Connect phone or sim
```

**Walk and diff.** Open each route in both, take a screenshot, drop into a Notion / Figma / paper diff doc. Specifically check:

| Screen | What to compare |
|---|---|
| Welcome | Mascot wave animation rhythm; "Pip" giant italic kerning |
| Today | Calorie ring proportions; macro mini-rings; food plate radial gradients |
| Plan / Recipe | Recipe hero — the nested radial-gradient plate (cream outer, green inner) is the trickiest port; verify center alignment |
| Coach | Chat bubble corner radii; mascot mood transitions when first message arrives |
| Compute | Step list pulse animation timing; mascot "thinking" pose |
| Forecast | SVG chart curve smoothness; gradient fill below the curve; data point label positions |
| Milestone | Confetti — currently STATIC dots in RN port, animated in legacy. Note for follow-up. |
| Paywall | Dark radial-gradient background — RN uses LinearGradient as approximation; corner darkness will differ |
| LogVoice | Pulse rings (3 staggered) and audio bars driven by recorder metering |
| LogBarcode | Scan bar sweep timing |
| Mascot Gallery | All 12 moods — eyes/mouth/brow/arm/leg combinations match per mood |

**Output.** A list of "drift items" prioritised by severity:
- **P0** — visually broken or ugly (scan rings clipping, wrong color)
- **P1** — visibly different but acceptable (Android shadow flatness, gradient corner)
- **P2** — pixel-level only (kerning, 1px borders)

Fix P0 immediately. Bundle P1 into a follow-up commit. Defer P2 unless a designer flags them.

**Recovery.**
- If something looks completely wrong (e.g., Recipe hero plates at wrong position): re-read the legacy file under `legacy-web/app/screens/<...>` and compare to your port. Most drifts are positioning math (`top: -32` on web flex vs RN absolute) or `lineHeight` interpretation.

**Time:** 2-4 hours for the diff pass + however long the P0 fixes take.

---

## Step 7 — Open PR to main

**Goal.** Land the migration on `main`. This closes the migration project.

**Prerequisites.**
- Steps 1, 3 done (commits, pushed).
- Steps 2, 4 done (you've actually launched the app and walked it).
- Step 5 done (Android works) OR explicitly out-of-scope.
- Step 6 done (visual drifts triaged).
- The `legacy-web/` directory either kept (as historic reference) or scheduled for a cleanup PR.

**Steps.**

### 7a. Final pre-flight on the branch

```bash
# Pull latest main into this branch (catch any drift while you were working)
git fetch origin
git rebase origin/main
# Or merge if you prefer history preserved:
# git merge origin/main

# Resolve conflicts if any. main has been quiet on this repo, expect zero.

# Re-verify
npx tsc --noEmit
npx expo-doctor
git push --force-with-lease    # only if you rebased; --force-with-lease (not --force) is safer
```

### 7b. Create the PR

```bash
gh pr create --base main --head migration-to-expo \
  --title "Migrate Lumi from Next.js wireframe to Expo" \
  --body "$(cat <<'EOF'
## Summary

Migrates the 39-screen Lumi wireframe from Next.js + DOM primitives to a native Expo SDK 55 app. The old web wireframe stays under `legacy-web/` as a visual-diff reference and is excluded from the Expo build via `.easignore` and from TypeScript via `tsconfig.json#exclude`.

The full plan, decisions, and risk register live in [`docs/MIGRATION-TO-EXPO.md`](docs/MIGRATION-TO-EXPO.md). Day-to-day operations are in [`docs/OPERATIONS.md`](docs/OPERATIONS.md).

### What's in
- **Phase 0** — Repo restructure + Expo bootstrap (root scaffold, deps pinned to SDK 55).
- **Phase 1** — Foundations: tokens (verbatim), icons (`SvgXml` swap, 37 paths reused), fonts (Fraunces + DM Sans via `@expo-google-fonts`).
- **Phase 1b** — Header, IconChip, Blob, Ring, Row, FAB, Em, CtaButton, SelectCard, CheckBadge, FoodPlate, ScreenStub.
- **Phase 2** — Expo Router 5 navigation: 5-tab `NativeTabs`, sub-stacks for plan/stats/me, `formSheet` modal stack for `/log/*`, 39 routes total.
- **Phase 3** — `AppContext` ported, routing logic stripped (Expo Router owns nav now), AsyncStorage persistence with splash-screen gate on hydration.
- **Phases 4–8** — Screen body ports for all 39 screens (10 onboarding, 7 daily, 6 logging, 6 weekly, 11 me).
- **Phase 9** — Full 13-mood Mascot in `react-native-svg` + Reanimated outer animations (bob/breathe/breatheSlow/jump/lean/wave). SMIL inner animations (confetti, hearts, dots) dropped — they need a separate Reanimated pass.
- **Phase 10** — Native APIs: `expo-camera` (LogPhoto, LogBarcode), `expo-audio` (LogVoice), `expo-notifications` (onboarding/permissions). Permission-denied fallback screens with deep-link to OS settings.
- **Phase 11** — `eas.json` (development/preview/production profiles), `.easignore`, ops runbook.

### What's out (intentional)
- Real backend / API / auth / database
- RevenueCat / StoreKit
- Push notification server (UI toggle only)
- Apple Health hookup
- Tests (visual/manual review only for this migration)
- Web target via Expo Router web (legacy Next.js app stays the web canonical until web rebuild is scoped)

### Risk register
See [`docs/MIGRATION-TO-EXPO.md` §13](docs/MIGRATION-TO-EXPO.md#13-risk-register). Highlights:
- Android `boxShadow` parity (accept platform convention).
- Mascot confetti/dots animations not yet ported (deferred follow-up).
- `react-native-keyboard-controller` may be needed for Coach screen on Android (current `KeyboardAvoidingView` is iOS-tuned).

## Test plan

- [ ] `npm install` on a fresh checkout succeeds.
- [ ] `npx tsc --noEmit` exit 0.
- [ ] `npx expo-doctor` reports 18/18.
- [ ] `npx expo start -c` boots without Metro errors.
- [ ] iOS dev client (TestFlight) — full 8-step smoke walk passes (see `docs/OPERATIONS.md`).
- [ ] Android emulator — every screen renders without crash.
- [ ] AsyncStorage persistence — set goal, force-quit, relaunch, value persists.
- [ ] Camera permission flow — accept on first LogPhoto entry, deny in Settings, re-enter, fallback screen + Open-Settings deep link works.
- [ ] Mic permission flow — same as camera, on LogVoice.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

The PR URL is printed. Open it.

### 7c. Self-review

Don't merge same-day. Walk away, come back, re-read the diff. Especially scrutinise:
- The 53-file commit from step 1 — is the same pattern (View, Text, Pressable, S.pillow, etc.) used everywhere or are there one-off divergences?
- `app.json` — bundle identifiers, permission strings, EAS project ID.
- `eas.json` — autoIncrement: true on production is correct; if you hand-bumped versions before, this might collide.

### 7d. Optional code review

```bash
# Trigger an automated multi-agent review
/ultrareview
# (Slash command — multi-agent cloud review of the current branch.)
```
Or assign a human reviewer.

### 7e. Merge

When ready:
```bash
gh pr merge --squash --delete-branch
# Or "merge commit" if you want history preserved exactly. Squash is cleaner for a migration PR.
```

After merge:
```bash
git checkout main
git pull
# Optionally delete legacy-web/ in a separate commit on main once you're confident:
# git rm -r legacy-web/
# git commit -m "Remove legacy web wireframe — migration to Expo complete"
```

**Verification.**
- PR shows green checks (no CI here, but `gh pr checks` shouldn't list red).
- Merging puts the migration commit on `main`.
- A fresh clone of `main` runs `npm install && npx expo start` cleanly.

**Time:** 1 hour for the PR + self-review. Plus however long external review takes.

---

## Decision tree (one screen, what to do next)

```
Mac runtime broken? ─yes→ Step 2.
        │
       no
        ↓
53 files uncommitted? ─yes→ Step 1.
        │
       no
        ↓
Branch unpushed? ─yes→ Step 3.
        │
       no
        ↓
Never run on a real device? ─yes→ Step 4.
        │
       no
        ↓
Android untested? ─yes→ Step 5.
        │
       no
        ↓
Visual drifts unchecked? ─yes→ Step 6.
        │
       no
        ↓
Step 7 — open the PR.
```

---

## Time budget summary

| Step | Time |
|---|---|
| 1 — Commit | 5 min |
| 2 — Mac runtime | 10 min |
| 3 — Push | 1 min |
| 4 — TestFlight build + install | 30 min (mostly waiting) |
| 5 — Android sweep | 4–8 hours (one full day) |
| 6 — Visual diff | 2–4 hours + fix time |
| 7 — PR + merge | 1 hour |

**Critical path to "running on iPhone":** steps 1, 2, 3, 4. About 45 minutes of your time + 15 minutes of cloud build wait.
