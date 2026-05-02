'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface AppState {
  weight: number;
  height: number;
  age: number;
  target: number;
  goal: string | null;
  activity: string | null;
  diet: string[];
  weighInDue: boolean;
  lastWeight: number | null;
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
  weighInDue: true,
  lastWeight: null,
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
    setState(s => ({ ...s, weighInDue: true }));
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
