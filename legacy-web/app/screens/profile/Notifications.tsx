'use client';

import { Header, S } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

const NOTIF_ITEMS = [
  { k: 'summary',     l: 'Daily summary',    d: "9:00 AM · today's plan & yesterday's recap" },
  { k: 'mealNudge',   l: 'Meal nudges',      d: '12:30 PM · 7:00 PM · soft reminders' },
  { k: 'weighIn',     l: 'Weekly weigh-in',  d: 'Sun 9:00 AM' },
  { k: 'wins',        l: 'Win moments',      d: 'Streaks, milestones, plan adjustments' },
  { k: 'plateauAlert',l: 'Plateau alerts',   d: 'Off · only ping if 14+ days flat' },
  { k: 'weekly',      l: 'Weekly recap',     d: 'Sun evening · your week in numbers' },
  { k: 'quiet',       l: 'Quiet hours',      d: '22:00 — 07:00' },
];

export default function Notifications({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const pref = state.notifPrefs;
  const setPref = (updater: (p: Record<string, boolean>) => Record<string, boolean>) => set('notifPrefs', updater(pref));
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Notifications</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.pillow, marginTop: 14, fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
          We send <span style={{ color: C.apricotDk, fontWeight: 600 }}>3 reminders/day max</span> on default. You&apos;re in control.
        </div>
        <div style={{ marginTop: 14, ...S.pillow, padding: 0 }}>
          {NOTIF_ITEMS.map(({ k, l, d }, i) => {
            const on = pref[k];
            return (
              <div key={k} style={{ padding: '14px 18px', borderBottom: i < NOTIF_ITEMS.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={() => setPref(p => ({ ...p, [k]: !p[k] }))} style={{ width: 44, height: 26, borderRadius: 999, background: on ? C.apricot : C.hair, border: 0, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, background: '#fff', borderRadius: 999, boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'left .2s' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
