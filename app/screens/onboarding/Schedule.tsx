'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import type { ToneName } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

type MealKey = keyof AppState['mealTimes'];

const MEALS: { k: MealKey; label: string; tone: ToneName; icon: string; color: string }[] = [
  { k: 'wake',      label: 'Wake',      tone: 'butter',  icon: 'sparkle',   color: C.apricotDk },
  { k: 'breakfast', label: 'Breakfast', tone: 'apricot', icon: 'breakfast', color: C.apricotDk },
  { k: 'lunch',     label: 'Lunch',     tone: 'green',   icon: 'dinner',    color: C.green },
  { k: 'dinner',    label: 'Dinner',    tone: 'apricot', icon: 'lunch',     color: C.apricotDk },
  { k: 'sleep',     label: 'Sleep',     tone: 'sky',     icon: 'sleep',     color: C.green },
];

function bumpTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10) + 15;
  if (m >= 60) { m -= 60; h += 1; }
  if (h >= 24) { h = 0; }
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export default function Schedule({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const tap = (k: MealKey) => {
    set('mealTimes', { ...state.mealTimes, [k]: bumpTime(state.mealTimes[k]) });
  };

  return (
    <div style={S.page}>
      <Header back="diet" go={go}>Step 5 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>When do<br />you <Em>eat</Em>?</h1>
        <div style={{ fontSize: 12, color: C.dim, marginTop: 10 }}>Tap a time to nudge it +15 min.</div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MEALS.map(m => (
            <div key={m.k} style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconChip tone={m.tone} size={40}><Icon name={m.icon} color={m.color} size={20} /></IconChip>
              <span style={{ flex: 1, fontSize: 15, color: C.ink, fontWeight: 500 }}>{m.label}</span>
              <button
                onClick={() => tap(m.k)}
                style={{
                  background: C.cream, border: 0, padding: '6px 14px', borderRadius: 999,
                  fontFamily: '"Fraunces",serif', fontSize: 18, color: C.apricot,
                  cursor: 'pointer', fontWeight: 400,
                }}
              >
                {state.mealTimes[m.k]}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('compute')}>Continue</button>
      </div>
    </div>
  );
}
