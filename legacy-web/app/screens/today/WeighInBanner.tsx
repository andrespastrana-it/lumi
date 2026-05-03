'use client';

import { S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export function WeighInBanner({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ padding: '16px 22px 0' }}>
      <div onClick={() => go('weighIn')} style={{ ...S.pillow, background: C.apricot, color: C.paper, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="scale" color="#fff" size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...S.eyebrow, color: 'rgba(255,246,238,.85)' }}>Sunday ritual</div>
          <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, marginTop: 2 }}>Step on the scale</div>
        </div>
        <Icon name="add" color="#fff" size={18} />
      </div>
    </div>
  );
}
