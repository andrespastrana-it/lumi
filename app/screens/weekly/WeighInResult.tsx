'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function WeighInResult({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Pip&apos;s take</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14, fontSize: 44 }}><Em>5 days</Em><br />ahead</h1>
        <p style={{ ...S.body, marginTop: 14 }}>You lost 0.7 kg this week — 0.05 above target. Beautiful.</p>
      </div>
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={48}><Icon name="trend" color="#fff" size={24} /></IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Adjustment</div>
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 30, color: C.green, marginTop: 4, fontWeight: 300, letterSpacing: '-1px' }}>+80 kcal/day</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 16, fontStyle: 'italic', fontFamily: '"Fraunces", serif', maxWidth: 280, lineHeight: 1.45, paddingTop: 12, borderTop: '1px solid rgba(61,90,74,.18)' }}>
            &ldquo;Do not burn out the gas tank — we have 22 weeks ahead.&rdquo;
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('forecast')}>Apply &amp; see forecast</button>
        <button style={S.ctaLine} onClick={() => go('milestone')}>Skip — celebrate first</button>
      </div>
    </div>
  );
}
