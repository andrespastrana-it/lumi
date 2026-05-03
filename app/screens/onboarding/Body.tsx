'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

type NumKey = 'weight' | 'height' | 'age' | 'target';

const FIELDS: { k: NumKey; label: string; suffix: string; min: number; max: number; step: number; tone: 'apricot' | 'green' | 'butter' | 'apricotSolid'; icon: string; iconColor: (c: typeof C) => string }[] = [
  { k: 'weight', label: 'Current weight', suffix: 'kg',  min: 35,  max: 250, step: 0.5, tone: 'apricot',      icon: 'scale',   iconColor: c => c.apricotDk },
  { k: 'height', label: 'Height',         suffix: 'cm',  min: 120, max: 220, step: 1,   tone: 'green',        icon: 'trend',   iconColor: c => c.green },
  { k: 'age',    label: 'Age',            suffix: 'yrs', min: 13,  max: 99,  step: 1,   tone: 'butter',       icon: 'sparkle', iconColor: c => c.apricotDk },
  { k: 'target', label: 'Target weight',  suffix: 'kg',  min: 35,  max: 250, step: 0.5, tone: 'apricotSolid', icon: 'target',  iconColor: () => '#fff' },
];

const fmt = (v: number) => (Number.isInteger(v) ? v.toString() : v.toFixed(1));

export default function Body({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const bump = (k: NumKey, delta: number, min: number, max: number) => {
    const next = Math.min(max, Math.max(min, state[k] + delta));
    set(k, Math.round(next * 2) / 2);
  };

  const stepBtn = (label: string, onClick: () => void, disabled: boolean) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: 999, border: 0,
        background: disabled ? C.surface : C.cream,
        color: disabled ? C.dim : C.apricotDk,
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 18, fontWeight: 500, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={S.page}>
      <Header back="goal" go={go}>Step 2 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>Tell me<br />about <Em>you</Em></h1>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FIELDS.map(f => {
            const v = state[f.k];
            return (
              <div key={f.k} style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 12 }}>
                <IconChip tone={f.tone} size={40}><Icon name={f.icon} color={f.iconColor(C)} size={20} /></IconChip>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, color: C.muted, letterSpacing: '.04em' }}>{f.label}</div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 24, color: C.ink, fontWeight: 400, marginTop: 2 }}>
                    {fmt(v)} <span style={{ fontSize: 12, color: C.dim, fontFamily: '"DM Sans"' }}>{f.suffix}</span>
                  </div>
                </div>
                {stepBtn('−', () => bump(f.k, -f.step, f.min, f.max), v <= f.min)}
                {stepBtn('+', () => bump(f.k,  f.step, f.min, f.max), v >= f.max)}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('activityLevel')}>Continue</button>
      </div>
    </div>
  );
}
