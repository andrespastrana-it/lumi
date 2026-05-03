'use client';

import { Header, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C, BTN_SHADOW, PILLOW_SHADOW_SM } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

const TAGS = ['Mediterranean','Omnivore','Vegetarian','High protein','No dairy','No gluten','Loves coffee','Loves pasta'];

export default function Diet({ go, state, set }: { go: (r: string) => void; state: AppState; set: (k: keyof AppState, v: AppState[keyof AppState]) => void }) {
  const toggle = (t: string) => {
    const cur = state.diet || [];
    set('diet', cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
  };
  return (
    <div style={S.page}>
      <Header back="activity" go={go}>Step 4 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>What do you<br /><Em>love</Em>?</h1>
        <p style={{ ...S.body, marginTop: 10 }}>Pick all that apply.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
          {TAGS.map(t => {
            const on = (state.diet || []).includes(t);
            return (
              <button key={t} onClick={() => toggle(t)} style={{ padding: '12px 18px', borderRadius: 999, border: 0, background: on ? C.apricot : C.pillow, color: on ? C.paper : C.ink, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', boxShadow: on ? BTN_SHADOW : PILLOW_SHADOW_SM, display: 'flex', alignItems: 'center', gap: 6 }}>
                {on && <Icon name="check" color="#fff" size={12} />}
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '40px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('schedule')}>Continue</button>
      </div>
    </div>
  );
}
