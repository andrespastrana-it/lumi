'use client';

import { Header, IconChip, Ring, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function Activity({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header back="today" go={go}>Activity</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}><Em>Workouts</Em><br />&amp; steps</h1>
      </div>
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Ring pct={0.62} size={84} stroke={8} color={C.green} track="rgba(255,255,255,.4)" label="62%" />
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Today</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 32, color: C.green, marginTop: 4, fontWeight: 300, letterSpacing: '-1px' }}>8,420</div>
            <div style={{ fontSize: 12, color: C.green, marginTop: 2, fontWeight: 500 }}>steps · +340 kcal earned</div>
          </div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 24, marginBottom: 10 }}>This week</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { d: 'Mon',   w: 'Push', t: '45 min', k: '420 kcal', tone: 'apricot' as const, icon: 'flame' },
            { d: 'Wed',   w: 'Pull', t: '40 min', k: '380 kcal', tone: 'green' as const,   icon: 'sparkle' },
            { d: 'Today', w: 'Legs', t: '—',      k: 'planned 18:00', tone: 'butter' as const, icon: 'steps' },
          ].map(({ d, w, t, k, tone, icon }) => (
            <div key={d} style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconChip tone={tone} size={40}><Icon name={icon} color={tone === 'green' ? C.green : C.apricotDk} size={20} /></IconChip>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 17, color: C.ink, fontWeight: 400 }}>{w}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{d} · {t}</div>
              </div>
              <div style={{ fontSize: 13, color: C.green, fontFamily: '"Fraunces", serif', textAlign: 'right' }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Add a workout</button>
      </div>
    </div>
  );
}
