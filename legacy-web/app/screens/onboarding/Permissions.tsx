'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

type PermKey = keyof AppState['permissions'];

const ITEMS: { k: PermKey; l: string; d: string; icon: string; tone: 'apricot' | 'green' | 'butter' | 'apricotSolid' }[] = [
  { k: 'notif',  l: 'Notifications', d: 'Gentle nudges. Never spam.', icon: 'bell',   tone: 'apricot' },
  { k: 'health', l: 'Health app',    d: 'Steps + workouts auto-sync.', icon: 'heart',  tone: 'green' },
  { k: 'cam',    l: 'Camera',        d: 'Photo + barcode logging.',    icon: 'camera', tone: 'butter' },
  { k: 'mic',    l: 'Microphone',    d: 'Voice logging.',              icon: 'mic',    tone: 'apricotSolid' },
];

export default function Permissions({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  return (
    <div style={S.page}>
      <Header>Permissions</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>A few quick<br /><Em>asks</Em></h1>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ITEMS.map(item => {
            const on = state.permissions[item.k];
            const iconColor = item.tone === 'apricotSolid' ? '#fff' : C.apricotDk;
            return (
              <div
                key={item.k}
                onClick={() => set('permissions', { ...state.permissions, [item.k]: !on })}
                style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: on ? C.greenLt : C.pillow }}
              >
                <IconChip tone={item.tone} size={44}><Icon name={item.icon} color={iconColor} size={22} /></IconChip>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: C.ink, fontFamily: '"Fraunces", serif' }}>{item.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{item.d}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: on ? C.green : 'transparent', border: on ? 0 : `1.5px solid ${C.dim}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <Icon name="check" color="#fff" size={16} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('paywall')}>Continue</button>
      </div>
    </div>
  );
}
