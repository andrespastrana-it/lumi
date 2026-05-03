# Lumi · Operations

Day-to-day commands for running the Expo app locally and shipping builds via EAS. Assumes you've already run `npm install` once.

## Local development

```bash
# Start Metro bundler
npm start

# iOS simulator (Mac only — needs Xcode)
npm run ios

# Android emulator (needs Android Studio + AVD)
npm run android

# Web preview
npm run web

# Type-check
npm run typecheck

# Lint
npm run lint
```

`npm start` boots Metro and opens the dev menu. From the menu:

- **i** — open iOS simulator
- **a** — open Android emulator
- **j** — open React Native DevTools (replaces the old Chrome debugger)
- **r** — reload the app

If you've installed a custom dev client (see "EAS dev client" below), append `--dev-client`:
```bash
npm start -- --dev-client
```

## EAS — first-time setup

```bash
# 1. Sign in to your Expo account (creates one if needed).
npx eas login

# 2. Link this project to an EAS project. Writes the projectId to app.json.
npx eas init

# 3. Configure iOS credentials (handles certificates + provisioning).
npx eas credentials
```

You'll need an Apple Developer Program membership ($99/yr) to ship to TestFlight or the App Store, and a Google Play Console account ($25 one-time) for Play Store.

## Builds

`eas.json` defines three profiles:

| Profile     | Use                             | Distribution        |
|-------------|---------------------------------|---------------------|
| development | Custom dev client w/ Metro link | Internal (TestFlight / Internal Testing track) |
| preview     | Production-like signed build    | Internal sideload (`.apk` / TestFlight)        |
| production  | Store-ready                     | Auto-increment build number; for store submit  |

### EAS dev client (recommended workflow)

A "dev client" is your custom Expo Go — it ships your `app.json` config and any native modules (camera, audio) but still loads the JS bundle from Metro. You install it once, then iterate via `npm start`.

```bash
# iOS — submits to TestFlight on completion
npx eas build -p ios --profile development --auto-submit

# iOS simulator (no submit, downloadable .app for `xcrun simctl install`)
npx eas build -p ios --profile development

# Android — outputs APK
npx eas build -p android --profile development
```

### Preview builds

For one-off testing without going through the dev-client flow:

```bash
npx eas build -p ios --profile preview
npx eas build -p android --profile preview
```

### Production build

```bash
npx eas build --platform all --profile production
```

After the production build finishes:

```bash
# iOS → App Store Connect
npx eas submit -p ios --latest

# Android → Play Console
npx eas submit -p android --latest
```

## OTA updates

`development` and `preview` channels are wired in `eas.json`. Push a JS-only update to a channel without rebuilding native:

```bash
npx eas update --channel preview --message "Fix typo on welcome"
```

Read update health metrics:

```bash
# Latest update group on production
GROUP=$(npx eas update:list --branch production --json --non-interactive | jq -r '.currentPage[0].group')
npx eas update:insights "$GROUP"
```

## Doctor

Sanity-check the project state:

```bash
npx expo-doctor
```

Should report **18/18 checks passed**. If a peer dep drifts, run `npx expo install --fix` and re-check.

## Notes

- **Bun is not used.** The legacy Next.js wireframe under `legacy-web/` ships with `bun.lock`; the new Expo project uses npm. Don't swap — Expo CLI assumes npm/yarn/pnpm.
- **`legacy-web/` is excluded** from EAS uploads via `.easignore`, from TypeScript via `tsconfig.json`, and from Expo Router (which only scans the root `app/`).
- **Windows hosts can't build iOS** locally — you must use EAS cloud builds (`npx eas build` without `--local`). Android local builds work on Windows once Android Studio + JDK are installed.
- **Apple Health** is not yet integrated. The `permissions.health` toggle is wireframe-only state; wiring real HealthKit will land in a follow-up via `react-native-health` or a custom Expo module.
