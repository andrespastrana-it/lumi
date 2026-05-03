'use client';

import { Header, IconChip, FoodPlate, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function LogConfirm({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Confirm</Header>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconChip tone="greenSolid" size={44}><Icon name="check" color="#fff" size={22} /></IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Pip recognized</div>
              <h1 style={{ ...S.h2, color: C.green, marginTop: 4, fontSize: 22 }}>Two eggs + espresso</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            {[['~180','kcal'],['13','P'],['1','C'],['13','F']].map(([v, l]) => (
              <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,.45)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: C.green, fontWeight: 400 }}>{v}</div>
                <div style={{ fontSize: 9, color: C.green, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 24, marginBottom: 10 }}>Looks right?</div>
        <div style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FoodPlate tone="butter" icon={<Icon name="snack" color="#fff" size={24} />} size={48} />
          <div style={{ flex: 1, fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: '"Fraunces",serif' }}>
            Pip&apos;s confidence: <span style={{ color: C.green, fontWeight: 600, fontStyle: 'normal' }}>92%</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Add to today</button>
        <button style={S.ctaLine} onClick={() => go('logSearch')}>Edit details</button>
      </div>
    </div>
  );
}
