'use client';

import Mascot from '@/app/components/Mascot';
import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function BadDay({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Yesterday</Header>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Mascot mood="oops" size={80} />
          <h1 style={{ ...S.h1, fontSize: 28, margin: 0 }}>Tomorrow<br />we <Em>adjust</Em></h1>
        </div>
      </div>
      <div style={S.pad}>
        <p style={{ ...S.body, marginTop: 18 }}>One bad day does not undo a week of good ones. Pip will spread it out — gently.</p>
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconChip tone="apricotSolid" size={40}><Icon name="flame" color="#fff" size={20} /></IconChip>
          <div style={{ flex: 1 }}>
            <div style={S.eyebrow}>Yesterday</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.apricot, fontWeight: 300, marginTop: 2 }}>+ 520 kcal over</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={44}><Icon name="sparkle" color="#fff" size={22} /></IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Pip&apos;s plan</div>
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2, fontWeight: 300, letterSpacing: '-.4px' }}>−104 kcal/day × 5 days</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 16, fontStyle: 'italic', fontFamily: '"Fraunces",serif', paddingTop: 12, borderTop: '1px solid rgba(61,90,74,.18)' }}>
            No drama. No skipping meals. Forecast unchanged.
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Resume the plan</button>
      </div>
    </div>
  );
}
