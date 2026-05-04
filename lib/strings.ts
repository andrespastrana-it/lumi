// Lumi · localized copy (scaffolding)
//
// Status: English-only, schema established. Add more locales by adding a
// sibling object (es, pt, it, …) and switching `t` based on
// expo-localization's getLocales(). Full i18next integration is overkill
// for the wireframe stage — once we have ≥ 2 locales we can swap to
// react-i18next behind the same `t.x.y` lookup pattern.
//
// Conventions:
// - Group by domain (cta, eyebrow, onboarding, today, ...) so a screen's
//   strings live next to one another.
// - Sentence case unless the source design clearly uses Title Case.
// - Keep punctuation in the strings (`'` curly, `…` ellipsis) so the
//   call sites don't need to format.
// - Interpolation: ((value)) tokens, replaced via fmt() below.

import { getLocales } from 'expo-localization';

export const en = {
  // Buttons that appear on multiple screens
  cta: {
    continue: 'Continue',
    save: 'Save',
    confirm: 'Confirm',
    back: 'Go back',
    cancel: 'Cancel',
    tryAgain: 'Try again',
    addToToday: 'Add to today',
    editDetails: 'Edit details',
    haveAccount: 'I have an account',
    letsBegin: "Let's begin",
    iAmIn: "I'm in",
    upgradeNow: 'Upgrade now',
    restorePurchase: 'Restore purchase',
    cancelSubscription: 'Cancel subscription',
    deleteAccount: 'Delete my account',
    exportData: 'Export my data (.csv)',
    privacyPolicy: 'Privacy policy',
    rateOnAppStore: 'Rate Lumi on the App Store',
    contactEmail: 'support@lumi.app',
    startTrial: 'Start free trial',
    maybeLater: 'Maybe later',
    backToToday: 'Back to today',
    share: 'Share',
    addWorkout: 'Add a workout',
    orderViaGlovo: 'Order via Glovo',
    swapMealWithPip: 'Swap a meal with Pip',
    weekShoppingList: "This week's shopping list →",
    addToShoppingList: 'Add to shopping list',
    iMadeThisLogIt: 'I made this — log it',
    applyForOneWeek: 'Apply for one week',
    talkToPipInstead: 'Talk to Pip instead',
    applyAndSeeForecast: 'Apply & see forecast',
    skipCelebrateFirst: 'Skip — celebrate first',
    resumePlan: 'Resume the plan',
    viewMilestones: 'View milestones',
    whatIfPlateau: 'What if I plateau?',
    saveChanges: 'Save changes',
    changePhoto: 'Change photo',
    stopAndLog: 'Stop & log',
    simulateScan: 'Simulate scan',
    openSettings: 'Open settings',
    allowCamera: 'Allow camera',
    logMeal: 'Log meal',
    logAMeal: 'Log a meal',
    rough: 'Had a rough day yesterday',
  },

  // Eyebrow / section headers
  eyebrow: {
    yourPlan: 'Your plan',
    estimatedFinish: 'Estimated finish',
    estimatedTotal: 'Estimated total',
    streak: 'Streak',
    sundayRitual: 'Sunday ritual',
    todaysMeals: "Today's meals",
    calories: 'Calories',
    photoLog: 'Photo log',
    scanBarcode: 'Scan barcode',
    coachTone: 'Coach tone',
    notifications: 'Notifications',
    aboutYou: 'About you',
    goal: 'Goal',
    bodyWeight: 'Body weight',
    height: 'Height',
    energy: 'Energy',
    liquids: 'Liquids',
    weekStartsOn: 'Week starts on',
    language: 'Language',
    yourData: 'Your data',
    whatYouShare: 'What you share',
    yourDataYourControl: 'Your data, your control',
    chooseYourPlan: 'Choose your plan',
    needAHand: 'Need a hand?',
    frequentlyAsked: 'Frequently asked',
    contactUs: 'Contact us',
    listening: 'Listening',
    typing: 'Typing…',
    today: 'Today',
    thisWeek: 'This week',
    twelveMoods: 'Twelve moods',
    pickedFromSearch: 'Picked from search',
    pipRecognized: 'Pip recognized',
    pipHeard: 'Pip heard',
    looksRight: 'Looks right?',
    onPace: 'On pace',
    upNext: 'Up next',
    done: 'Done',
    bestValue: 'BEST VALUE',
    currentPlan: 'Current plan',
    allFeaturesUnlocked: 'All features unlocked',
    unlockLumi: '✦ Unlock Lumi',
    permissions: 'Permissions',
    coach: 'Coach',
    me: 'Me',
    integrations: 'Integrations',
    privacy: 'Privacy',
    subscription: 'Subscription',
    helpAndFAQ: 'Help & FAQ',
    activity: 'Activity',
    yesterday: 'Yesterday',
    pipsTake: "Pip's take",
    plateau: 'Plateau',
    settings: 'Settings',
    editProfile: 'Edit profile',
    unitsAndLocale: 'Units & locale',
    pipYourCoach: 'Pip · your coach',
  },

  onboarding: {
    welcomeHi: "Hi, I'm",
    welcomeName: 'Pip',
    welcomeTagline: 'Your weight-loss partner.\nWarm. Specific. On your side.',
    step: 'Step ((n)) / 6',
  },

  errors: {
    title: 'Something went sideways.',
    body: 'Pip tripped on something unexpected. Tap below to start over.',
  },

  permissions: {
    cameraTitle: 'Camera permission needed',
    cameraBodyPhoto: 'Lumi uses the camera so you can log meals by photo.',
    cameraBodyBarcode: 'Lumi uses the camera to scan packaging barcodes.',
    micTitle: 'Microphone permission needed',
    micBody: 'Lumi uses the microphone so you can describe meals by voice.',
  },
};

type Strings = typeof en;
type Locale = 'en';

const all: Record<Locale, Strings> = { en };

function pickLocale(): Locale {
  // expo-localization may not be available during module load on web.
  try {
    const tag = getLocales()[0]?.languageCode;
    if (tag && tag in all) return tag as Locale;
  } catch {
    // fall through
  }
  return 'en';
}

const active: Locale = pickLocale();

/** The localized strings table. Use `t.cta.continue`, `t.eyebrow.streak`, etc. */
export const t: Strings = all[active];

/** Replace ((token)) placeholders. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\(\(([^)]+)\)\)/g, (_, k) => String(vars[k.trim()] ?? `((${k}))`));
}
