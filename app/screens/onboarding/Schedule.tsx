'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import type { ToneName } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

const MEALS: [string, string, ToneName, string, string][] = [
  ['Wake',      '07:00', 'butter',  'sparkle',   C.apricotDk],
  ['Breakfast', '07:30', 'apricot', 'breakfast', C.apricotDk],
  ['Lunch',     '13:00', 'green',   'dinner',    C.green],
  ['Dinner',    '20:00', 'apricot', 'lunch',     C.apricotDk],
  ['Sleep',     '23:30', 'sky',     'sleep',     C.green],
];

export default function Schedule({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="diet" go={go}>Step 5 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>When do<br />you <Em>eat</Em>?</h1>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MEALS.map(([l, t, tone, icon, color]) => (
            <div key={l} style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconChip tone={tone} size={40}><Icon name={icon as string} color={color as string} size={20} /></IconChip>
              <span style={{ flex: 1, fontSize: 15, color: C.ink, fontWeight: 500 }}>{l}</span>
              <span style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: C.apricot }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('compute')}>Continue</button>
      </div>
    </div>
  );
}
