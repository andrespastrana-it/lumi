'use client';

import { Header, S } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

export default function Units({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const units = state.units;
  const setUnit = (k: keyof AppState['units'], v: string) => set('units', { ...units, [k]: v });
  const Group = ({ k, label, opts }: { k: keyof AppState['units']; label: string; opts: string[] }) => (
    <div>
      <div style={{ ...S.eyebrow, marginTop: 24 }}>{label}</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {opts.map(o => {
          const on = units[k] === o;
          return (
            <button key={o} onClick={() => setUnit(k, o)} style={{ padding: '10px 16px', borderRadius: 999, fontSize: 13, fontWeight: on ? 600 : 500, background: on ? C.apricot : C.surface, color: on ? '#fff' : C.ink, border: on ? 0 : `1px solid ${C.hair}`, cursor: 'pointer', fontFamily: 'inherit' }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Units &amp; locale</Header>
      <div style={S.pad}>
        <Group k="mass"     label="Body weight"    opts={['kg','lb','st']} />
        <Group k="height"   label="Height"         opts={['cm','ft / in']} />
        <Group k="energy"   label="Energy"         opts={['kcal','kJ']} />
        <Group k="volume"   label="Liquids"        opts={['mL','fl oz','L']} />
        <Group k="firstDay" label="Week starts on" opts={['Monday','Sunday']} />
        <Group k="lang"     label="Language"       opts={['English','Español','Português','Italiano']} />
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save</button>
      </div>
    </div>
  );
}
