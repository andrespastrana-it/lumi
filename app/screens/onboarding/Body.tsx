'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

const PILLOW_SHADOW_SM = '0 1px 4px -2px rgba(122,69,32,.08)';

export default function Body({ go, state }: { go: (r: string) => void; state: AppState }) {
  const fields = [
    { k: 'weight', label: 'Current weight', v: state.weight, suffix: 'kg',  icon: <IconChip tone="apricot" size={40}><Icon name="scale" color={C.apricotDk} size={20} /></IconChip> },
    { k: 'height', label: 'Height',         v: state.height, suffix: 'cm',  icon: <IconChip tone="green" size={40}><Icon name="trend" color={C.green} size={20} /></IconChip> },
    { k: 'age',    label: 'Age',            v: state.age,    suffix: 'yrs', icon: <IconChip tone="butter" size={40}><Icon name="sparkle" color={C.apricotDk} size={20} /></IconChip> },
    { k: 'target', label: 'Target weight',  v: state.target, suffix: 'kg',  icon: <IconChip tone="apricotSolid" size={40}><Icon name="target" color="#fff" size={20} /></IconChip> },
  ];
  return (
    <div style={S.page}>
      <Header back="goal" go={go}>Step 2 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>Tell me<br />about <Em>you</Em></h1>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fields.map(f => (
            <div key={f.k} style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14 }}>
              {f.icon}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: C.muted, letterSpacing: '.04em' }}>{f.label}</div>
              </div>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 26, color: C.ink, fontWeight: 400 }}>
                {f.v} <span style={{ fontSize: 12, color: C.dim, fontFamily: '"DM Sans"' }}>{f.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('activity')}>Continue</button>
      </div>
    </div>
  );
}
