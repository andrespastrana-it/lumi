'use client';

import { Header, S } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';

export default function ProfileSettings({ go }: { go: (r: string) => void }) {
  const tones = ['Warm (default)', 'Direct', 'Cheerleader', 'Stoic'];
  const notifs = ['Daily summary · 09:00', 'Meal nudge · 12:30', 'Weigh-in · Sun 09:00', 'Win moments'];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Settings</Header>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 14 }}>Coach tone</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {tones.map((t, i, arr) => {
            const on = t.includes('Warm');
            return (
              <div key={t} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: on ? 0 : `1.5px solid ${C.dim}`, background: on ? C.apricot : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#fff' }} />}
                </div>
                <span style={{ flex: 1, fontSize: 14, color: on ? C.apricot : C.ink, fontWeight: on ? 600 : 500 }}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28, marginBottom: 10 }}>Notifications</div>
        <div style={{ ...S.pillow, padding: 0 }}>
          {notifs.map((t, i, arr) => (
            <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0 }}>
              <span style={{ fontSize: 14, color: C.ink }}>{t}</span>
              <div style={{ width: 40, height: 22, background: C.apricot, borderRadius: 999, position: 'relative' }}>
                <div style={{ position: 'absolute', right: 2, top: 2, width: 18, height: 18, background: '#fff', borderRadius: 999, boxShadow: '0 1px 3px rgba(0,0,0,.25)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
