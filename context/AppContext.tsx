import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export type CoachToneType = 'Warm' | 'Direct' | 'Cheerleader' | 'Stoic';
export type SubscriptionTier = 'annual' | 'monthly' | 'lifetime';

export interface AppState {
  weight: number;
  height: number;
  age: number;
  target: number;
  goal: string | null;
  activity: string | null;
  diet: string[];
  mealTimes: { wake: string; breakfast: string; lunch: string; dinner: string; sleep: string };
  permissions: Record<'notif' | 'health' | 'cam' | 'mic', boolean>;
  weighInDue: boolean;
  lastWeight: number | null;
  coachTone: CoachToneType;
  units: { mass: string; height: string; energy: string; volume: string; firstDay: string; lang: string };
  integrations: Record<string, boolean>;
  privacy: { analytics: boolean; share: boolean; research: boolean };
  subscription: SubscriptionTier;
  notifPrefs: Record<string, boolean>;
}

interface AppContextType {
  hydrated: boolean;
  state: AppState;
  set: (key: keyof AppState, value: AppState[keyof AppState]) => void;
  restart: () => void;
}

const AppContext = createContext<AppContextType | null>(null);
const STORAGE_KEY = 'lumi:state:v1';

const initialState: AppState = {
  weight: 85,
  height: 178,
  age: 34,
  target: 68,
  goal: null,
  activity: null,
  diet: [],
  mealTimes: { wake: '07:00', breakfast: '07:30', lunch: '13:00', dinner: '20:00', sleep: '23:30' },
  permissions: { notif: false, health: false, cam: false, mic: false },
  weighInDue: true,
  lastWeight: null,
  coachTone: 'Warm',
  units: { mass: 'kg', height: 'cm', energy: 'kcal', volume: 'L', firstDay: 'Monday', lang: 'English' },
  integrations: { apple: true, glovo: true, strava: false, google: false, fitbit: false, withings: true },
  privacy: { analytics: true, share: false, research: true },
  subscription: 'annual',
  notifPrefs: { summary: true, mealNudge: true, weighIn: true, wins: true, plateauAlert: false, weekly: true, quiet: true },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (raw) {
          try {
            setState({ ...initialState, ...JSON.parse(raw) });
          } catch {
            // corrupt cache; ignore and fall back to initial
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const set: AppContextType['set'] = (key, value) => {
    setState(s => ({ ...s, [key]: value }));
  };

  const restart = () => {
    setState(initialState);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    router.replace('/onboarding/welcome');
  };

  return (
    <AppContext.Provider value={{ hydrated, state, set, restart }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
