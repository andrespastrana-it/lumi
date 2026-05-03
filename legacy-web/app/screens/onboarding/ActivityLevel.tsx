'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';
import { SelectCard, CheckBadge } from './_shared';

export default function ActivityLevel({ go, state, set }: { go: (r: string) => void; state: AppState; set: (k: keyof AppState, v: AppState[keyof AppState]) => void }) {
  const opts = [
    { k: 'sed',     l: 'Sedentary', d: 'Mostly sitting',   tone: 'cream' as const,        icon: <Icon name="sleep" color={C.dim} size={22} /> },
    { k: 'lite',    l: 'Light',     d: '2–3 workouts/wk',  tone: 'green' as const,        icon: <Icon name="steps" color={C.green} size={22} /> },
    { k: 'active',  l: 'Active',    d: 'Daily movement',   tone: 'greenSolid' as const,   icon: <Icon name="steps" color="#fff" size={22} /> },
    { k: 'athlete', l: 'Athlete',   d: 'Training hard',    tone: 'apricotSolid' as const, icon: <Icon name="flame" color="#fff" size={22} /> },
  ];
  return (
    <div style={S.page}>
      <Header back="body" go={go}>Step 3 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How <Em>active</Em><br />are you?</h1>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map(o => {
            const on = state.activity === o.k;
            return (
              <SelectCard key={o.k} selected={on} onClick={() => set('activity', o.k)}>
                <IconChip tone={o.tone} size={44}>{o.icon}</IconChip>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: on ? 600 : 500, color: on ? C.apricot : C.ink, fontFamily: '"Fraunces", serif' }}>{o.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{o.d}</div>
                </div>
                {on && <CheckBadge />}
              </SelectCard>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={{ ...S.ctaApricot, opacity: state.activity ? 1 : 0.35 }} disabled={!state.activity} onClick={() => go('diet')}>Continue</button>
      </div>
    </div>
  );
}
