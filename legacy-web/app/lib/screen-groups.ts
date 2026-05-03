export type ScreenEntry = { route: string; label: string };
export type ScreenGroup = { label: string; screens: ScreenEntry[] };

export const GROUPS: ScreenGroup[] = [
  {
    label: 'Onboarding',
    screens: [
      { route: 'welcome', label: 'Welcome' },
      { route: 'goal', label: 'Goal' },
      { route: 'body', label: 'Body' },
      { route: 'activityLevel', label: 'Activity Level' },
      { route: 'diet', label: 'Diet' },
      { route: 'schedule', label: 'Schedule' },
      { route: 'compute', label: 'Compute' },
      { route: 'planReveal', label: 'Plan Reveal' },
      { route: 'permissions', label: 'Permissions' },
      { route: 'paywall', label: 'Paywall' },
    ],
  },
  {
    label: 'Today',
    screens: [
      { route: 'today', label: 'Today' },
    ],
  },
  {
    label: 'Plan & Cook',
    screens: [
      { route: 'plan', label: 'Meal Plan' },
      { route: 'recipe', label: 'Recipe' },
      { route: 'shopping', label: 'Shopping List' },
    ],
  },
  {
    label: 'Coach',
    screens: [
      { route: 'coach', label: 'Coach Chat' },
    ],
  },
  {
    label: 'Log',
    screens: [
      { route: 'logChoose', label: 'Log — Choose' },
      { route: 'logVoice', label: 'Log — Voice' },
      { route: 'logPhoto', label: 'Log — Photo' },
      { route: 'logBarcode', label: 'Log — Barcode' },
      { route: 'logSearch', label: 'Log — Search' },
      { route: 'logConfirm', label: 'Log — Confirm' },
    ],
  },
  {
    label: 'Weekly',
    screens: [
      { route: 'weighIn', label: 'Weigh-In' },
      { route: 'weighInResult', label: 'Weigh-In Result' },
      { route: 'forecast', label: 'Forecast' },
      { route: 'milestone', label: 'Milestone' },
      { route: 'plateau', label: 'Plateau' },
      { route: 'badDay', label: 'Bad Day' },
    ],
  },
  {
    label: 'Activity & Me',
    screens: [
      { route: 'activity', label: 'Activity' },
      { route: 'profile', label: 'Profile' },
      { route: 'profileEdit', label: 'Edit Profile' },
      { route: 'notifications', label: 'Notifications' },
      { route: 'coachTone', label: 'Coach Tone' },
      { route: 'units', label: 'Units' },
      { route: 'integrations', label: 'Integrations' },
      { route: 'privacy', label: 'Privacy' },
      { route: 'subscription', label: 'Subscription' },
      { route: 'help', label: 'Help' },
      { route: 'profileSettings', label: 'Settings' },
    ],
  },
  {
    label: 'Mascot',
    screens: [
      { route: 'mascotGallery', label: 'Pip Gallery' },
    ],
  },
];

export const ALL_SCREENS: ScreenEntry[] = GROUPS.flatMap(g => g.screens);
