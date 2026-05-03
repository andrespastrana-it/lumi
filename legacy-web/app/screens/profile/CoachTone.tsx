'use client';

import Mascot from '@/app/components/Mascot';
import type { MoodType } from '@/app/components/Mascot';
import { Header, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';
import type { CoachToneType } from '@/app/context/AppContext';

const TONES: { l: CoachToneType; d: string; m: MoodType }[] = [
  { l: 'Warm',        d: 'Like a thoughtful friend. Default.',   m: 'happy' },
  { l: 'Direct',      d: 'No fluff. Says it straight.',          m: 'thinking' },
  { l: 'Cheerleader', d: 'Hype every win, no matter how small.', m: 'cheering' },
  { l: 'Stoic',       d: 'Calm, sparing, philosophical.',        m: 'curious' },
];

export default function CoachTone({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const pick = state.coachTone;
  const setPick = (t: CoachToneType) => set('coachTone', t);
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Coach tone</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How should<br /><Em>Pip</Em> talk to you?</h1>
        <div style={{ fontSize: 14, color: C.dim, marginTop: 10, lineHeight: 1.5 }}>You can change this anytime. Pip will quietly adapt across all messages.</div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TONES.map(t => {
            const on = pick === t.l;
            return (
              <div key={t.l} onClick={() => setPick(t.l)} style={{ ...S.pillow, padding: 16, cursor: 'pointer', background: on ? C.apricotWash : C.surface, border: on ? `1.5px solid ${C.apricot}` : `1px solid ${C.hair}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: on ? '#fff' : C.pillow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mascot mood={t.m} size={44} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, color: on ? C.apricotDk : C.ink, fontWeight: 500 }}>{t.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 3, lineHeight: 1.4 }}>{t.d}</div>
                </div>
                {on && <div style={{ width: 24, height: 24, borderRadius: 999, background: C.apricot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" color="#fff" size={14} /></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save</button>
      </div>
    </div>
  );
}
