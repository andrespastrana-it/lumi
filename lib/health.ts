import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// HealthKit (iOS) / Health Connect (Android) hookup.
//
// Status: STUB. Real reads/writes need:
//   1. A custom dev client. The HealthKit native module isn't bundled
//      in Expo Go, so any call here from Expo Go will silently no-op
//      (we detect that via Constants.executionEnvironment).
//   2. One of:
//      - `@kingstinct/react-native-healthkit` (iOS only, has Expo
//        config plugin — recommended).
//      - `react-native-health` (older but more battle-tested; needs
//        a manual config plugin step).
//      - `react-native-health-connect` for Android Health Connect.
//
// To wire HealthKit later:
//   npm i @kingstinct/react-native-healthkit
//   # add to app.json `plugins`:
//   #   ["@kingstinct/react-native-healthkit", {
//   #     "healthSharePermission": "Lumi reads weight & activity to personalize your plan.",
//   #     "healthUpdatePermission": "Lumi writes weigh-ins back to Apple Health."
//   #   }]
//   # then run `eas build -p ios --profile development` for a new dev client.
//
// Then replace the body of requestHealthPermission below with a real
// `requestPermission([HKQuantityTypeIdentifierBodyMass, ...])` call.

interface HealthPermissionResult {
  granted: boolean;
  /** True when the request never reached the OS (Expo Go, web, missing module). */
  unsupported: boolean;
}

function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/**
 * Request read+write access to Apple Health (iOS) or Health Connect (Android).
 * Currently a stub: returns `granted: false, unsupported: true` everywhere
 * except a real iOS dev client where it would call into the native module.
 *
 * The onboarding/permissions screen treats `unsupported` as "wireframe-only"
 * and lets the toggle flip to true without calling this — see permissions.tsx
 * for the gating logic.
 */
export async function requestHealthPermission(): Promise<HealthPermissionResult> {
  if (Platform.OS !== 'ios') {
    // Android Health Connect requires `react-native-health-connect`. Wire later.
    return { granted: false, unsupported: true };
  }

  if (isExpoGo()) {
    // Expo Go can't bundle HealthKit. Return unsupported so the caller
    // can decide whether to flip the wireframe toggle anyway.
    return { granted: false, unsupported: true };
  }

  // Custom dev client path. Until the native module is installed,
  // pretend the request is unsupported.
  //
  // TODO: when @kingstinct/react-native-healthkit lands:
  //   const { requestAuthorization } = await import('@kingstinct/react-native-healthkit');
  //   const ok = await requestAuthorization(
  //     ['HKQuantityTypeIdentifierBodyMass',
  //      'HKQuantityTypeIdentifierStepCount',
  //      'HKQuantityTypeIdentifierActiveEnergyBurned'],
  //     ['HKQuantityTypeIdentifierBodyMass']
  //   );
  //   return { granted: ok, unsupported: false };
  return { granted: false, unsupported: true };
}

export type { HealthPermissionResult };
