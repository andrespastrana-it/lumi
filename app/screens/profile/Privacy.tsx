'use client';

import { Header, IconChip, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

export default function Privacy({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const perm = state.privacy;
  const setPerm = (updater: (p: AppState['privacy']) => AppState['privacy']) => set('privacy', updater(perm));
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Privacy</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.greenLt, marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconChip tone="greenSolid" size={44}><Icon name="veg" color="#fff" size={22} /></IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Your data</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: C.green, marginTop: 2, letterSpacing: '-.3px' }}>Encrypted &amp; yours.</div>
          </div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>What you share</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[
            { k: 'analytics', l: 'Anonymous analytics',             d: 'Helps us improve Pip' },
            { k: 'share',     l: 'Share progress with friends',     d: 'Off · only you can see your data' },
            { k: 'research',  l: 'Contribute to nutrition research', d: 'De-identified, opt-out anytime' },
          ].map(({ k, l, d }, i, arr) => {
            const on = perm[k as keyof typeof perm];
            return (
              <div key={k} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={() => setPerm(p => ({ ...p, [k]: !p[k as keyof typeof p] }))} style={{ width: 44, height: 26, borderRadius: 999, background: on ? C.apricot : C.hair, border: 0, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, background: '#fff', borderRadius: 999, boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'left .2s' }} />
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Your data, your control</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ ...S.ctaLine, color: C.ink }}>Export my data (.csv)</button>
          <button style={{ ...S.ctaLine, color: C.ink }}>Privacy policy</button>
          <button style={{ ...S.ctaLine, color: '#B43E2A' }}>Delete my account</button>
        </div>
      </div>
    </div>
  );
}
