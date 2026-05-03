import { useRouter } from 'expo-router';

const ROUTE_MAP: Record<string, string> = {
  // Onboarding
  welcome:        '/onboarding/welcome',
  goal:           '/onboarding/goal',
  body:           '/onboarding/body',
  activityLevel:  '/onboarding/activity-level',
  diet:           '/onboarding/diet',
  schedule:       '/onboarding/schedule',
  compute:        '/onboarding/compute',
  planReveal:     '/onboarding/plan-reveal',
  permissions:    '/onboarding/permissions',
  paywall:        '/onboarding/paywall',

  // Daily tabs
  today:          '/(tabs)/today',
  plan:           '/(tabs)/plan',
  recipe:         '/(tabs)/plan/recipe',
  shopping:       '/(tabs)/plan/shopping',
  coach:          '/(tabs)/coach',
  activity:       '/(tabs)/stats/activity',
  mascotGallery:  '/(tabs)/stats/mascot-gallery',

  // Log modal
  logChoose:      '/log/choose',
  logVoice:       '/log/voice',
  logPhoto:       '/log/photo',
  logBarcode:     '/log/barcode',
  logSearch:      '/log/search',
  logConfirm:     '/log/confirm',

  // Weekly (lives under stats)
  weighIn:        '/(tabs)/stats/weigh-in',
  weighInResult:  '/(tabs)/stats/weigh-in-result',
  forecast:       '/(tabs)/stats',
  milestone:      '/(tabs)/stats/milestone',
  plateau:        '/(tabs)/stats/plateau',
  badDay:         '/(tabs)/stats/bad-day',

  // Profile / Me
  profile:         '/(tabs)/me',
  profileEdit:     '/(tabs)/me/edit',
  coachTone:       '/(tabs)/me/coach-tone',
  units:           '/(tabs)/me/units',
  integrations:    '/(tabs)/me/integrations',
  privacy:         '/(tabs)/me/privacy',
  subscription:    '/(tabs)/me/subscription',
  notifications:   '/(tabs)/me/notifications',
  help:            '/(tabs)/me/help',
  profileSettings: '/(tabs)/me/settings',
};

export function useGo() {
  const router = useRouter();
  return (legacyRoute: string) => {
    const path = ROUTE_MAP[legacyRoute] ?? legacyRoute;
    router.push(path as never);
  };
}

export { ROUTE_MAP };
