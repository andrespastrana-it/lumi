'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

const PILLOW_SHADOW = '0 2px 8px -4px rgba(122,69,32,.10), 0 1px 2px rgba(122,69,32,.05)';

export default function Goal({ go, state, set }: { go: (r: string) => void; state: AppState; set: (k: keyof AppState, v: AppState[keyof AppState]) => void }) {
  const opts = [
    { label: 'Lose weight',  icon: <IconChip tone="apricotSolid"><Icon name="target" color="#fff" size={22} /></IconChip> },
    { label: 'Build muscle', icon: <IconChip tone="greenSolid"><Icon name="sparkle" color="#fff" size={22} /></IconChip> },
    { label: 'Maintain',     icon: <IconChip tone="butter"><Icon name="heart" color={C.apricotDk} size={22} /></IconChip> },
    { label: 'Eat better',   icon: <IconChip tone="green"><Icon name="veg" color={C.green} size={22} /></IconChip> },
  ];
  return (
    <div style={S.page}>
      <Header>Step 1 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>What do you<br />want to <Em>change</Em>?</h1>
        <p style={{ ...S.body, marginTop: 10 }}>Pick one. You can shift later.</p>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {opts.map(o => {
            const on = state.goal === o.label;
            return (
              <div key={o.label} onClick={() => set('goal', o.label)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: on ? C.pillow : 'rgba(255,251,241,.5)', borderRadius: 18, boxShadow: on ? PILLOW_SHADOW : 'none', border: on ? `1.5px solid ${C.apricot}` : '1.5px solid transparent', cursor: 'pointer' }}>
                {o.icon}
                <span style={{ flex: 1, fontSize: 16, fontWeight: on ? 600 : 500, color: C.ink, fontFamily: '"Fraunces",serif' }}>{o.label}</span>
                {on && <div style={{ width: 24, height: 24, borderRadius: 999, background: C.apricot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" color="#fff" size={14} /></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={{ ...S.ctaApricot, opacity: state.goal ? 1 : 0.35 }} disabled={!state.goal} onClick={() => go('body')}>Continue</button>
      </div>
    </div>
  );
}
