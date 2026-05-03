'use client';

import { Header, IconChip, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

const INT_ITEMS = [
  { k: 'apple',    l: 'Apple Health', d: 'Steps · workouts · sleep · weight', icon: 'heart',   tone: 'apricotSolid' as const },
  { k: 'google',   l: 'Google Fit',   d: 'Activity & body metrics',           icon: 'heart',   tone: 'green' as const },
  { k: 'strava',   l: 'Strava',       d: 'Auto-import runs & rides',          icon: 'flame',   tone: 'apricot' as const },
  { k: 'fitbit',   l: 'Fitbit',       d: 'Wearable + scale',                  icon: 'heart',   tone: 'butter' as const },
  { k: 'withings', l: 'Withings scale',d:'Auto-log weigh-ins',                icon: 'scale',   tone: 'greenSolid' as const },
  { k: 'glovo',    l: 'Glovo',        d: 'Order recipe ingredients',          icon: 'cart',    tone: 'cream' as const },
];

export default function Integrations({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const conn = state.integrations;
  const setConn = (updater: (c: Record<string, boolean>) => Record<string, boolean>) => set('integrations', updater(conn));
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Integrations</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillowSm, background: C.pillow, marginTop: 14, fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
          <span style={{ color: C.green, fontWeight: 600 }}>{Object.values(conn).filter(Boolean).length} connected.</span> Lumi reads what you allow. Disconnect anytime.
        </div>
        <div style={{ marginTop: 14, ...S.pillow, padding: 0 }}>
          {INT_ITEMS.map(({ k, l, d, icon, tone }, i) => {
            const on = conn[k];
            const solid = tone === 'apricotSolid' || tone === 'greenSolid';
            return (
              <div key={k} style={{ padding: '14px 18px', borderBottom: i < INT_ITEMS.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <IconChip tone={tone} size={36}><Icon name={icon} color={solid ? '#fff' : C.apricotDk} size={18} /></IconChip>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={() => setConn(c => ({ ...c, [k]: !c[k] }))} style={{ padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: on ? C.greenLt : C.surface, color: on ? C.green : C.dim, border: on ? 0 : `1px solid ${C.hair}`, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>{on ? '✓ Connected' : 'Connect'}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
