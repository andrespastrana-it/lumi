'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type CoachToneType = 'Warm' | 'Direct' | 'Cheerleader' | 'Stoic';
export type SubscriptionTier = 'annual' | 'monthly' | 'lifetime';

export interface AppState {
  // Body
  weight: number;
  height: number;
  age: number;
  target: number;
  // Onboarding selections
  goal: string | null;
  activity: string | null;
  diet: string[];
  mealTimes: { wake: string; breakfast: string; lunch: string; dinner: string; sleep: string };
  permissions: Record<'notif' | 'health' | 'cam' | 'mic', boolean>;
  // Weigh-in
  weighInDue: boolean;
  lastWeight: number | null;
  // Profile / settings
  coachTone: CoachToneType;
  units: { mass: string; height: string; energy: string; volume: string; firstDay: string; lang: string };
  integrations: Record<string, boolean>;
  privacy: { analytics: boolean; share: boolean; research: boolean };
  subscription: SubscriptionTier;
  notifPrefs: Record<string, boolean>;
}

interface AppContextType {
  route: string;
  history: string[];
  state: AppState;
  navigate: (route: string) => void;
  goBack: () => void;
  set: (key: keyof AppState, value: AppState[keyof AppState]) => void;
  restart: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

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
  const [route, setRoute] = useState('welcome');
  const [history, setHistory] = useState<string[]>(['welcome']);
  const [state, setState] = useState<AppState>(initialState);

  const navigate = (r: string) => {
    setRoute(r);
    setHistory(h => [...h, r]);
    setTimeout(() => {
      const v = document.getElementById('device-viewport');
      if (v) v.scrollTop = 0;
    }, 10);
  };

  const goBack = () => {
    if (history.length > 1) {
      const h = [...history];
      h.pop();
      setHistory(h);
      setRoute(h[h.length - 1]);
    }
  };

  const set = (key: keyof AppState, value: AppState[keyof AppState]) => {
    setState(s => ({ ...s, [key]: value }));
  };

  const restart = () => {
    setRoute('welcome');
    setHistory(['welcome']);
    setState(initialState);
  };

  return (
    <AppContext.Provider value={{ route, history, state, navigate, goBack, set, restart }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
