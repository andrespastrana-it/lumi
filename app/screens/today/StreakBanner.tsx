'use client';

import { IconChip, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export function StreakBanner({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ padding: '14px 22px 0' }}>
      <div onClick={() => go('forecast')} style={{ ...S.pillowSm, background: C.greenLt, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
        <IconChip tone="greenSolid" size={44}><Icon name="flame" color="#fff" size={22} /></IconChip>
        <div style={{ flex: 1 }}>
          <div style={{ ...S.eyebrow, color: C.green }}>Streak</div>
          <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2, letterSpacing: '-.4px' }}>21 days · −2.6 kg</div>
        </div>
        <Icon name="add" color={C.green} size={18} />
      </div>
    </div>
  );
}
