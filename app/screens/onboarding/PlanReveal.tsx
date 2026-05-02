'use client';

import Mascot from '@/app/components/Mascot';
import { Blob, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function PlanReveal({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, background: C.creamHi, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Blob color={C.apricotMd} size={320} top={-100} right={-100} opacity={0.18} />
      <Blob color={C.greenWash} size={240} bottom={140} left={-60} opacity={0.22} />
      <div style={{ paddingTop: 44, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Mascot mood="proud" size={140} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={S.eyebrow}>Your plan</div>
        <h1 style={{ ...S.h1, fontSize: 30, marginTop: 8 }}>26 weeks to <Em>68 kg</Em></h1>
        <div style={{ ...S.display, fontSize: 140, margin: '16px 0', letterSpacing: '-6px' }}>0.65</div>
        <div style={{ fontSize: 12, color: C.muted, letterSpacing: '.18em', textTransform: 'uppercase' }}>kg per week — safe, sustainable</div>
      </div>
      <div style={{ padding: '0 22px 22px', position: 'relative', zIndex: 1 }}>
        <div style={{ ...S.pillow, background: C.greenLt, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <IconChip tone="greenSolid" size={48}><Icon name="target" color="#fff" size={24} /></IconChip>
          <div style={{ flex: 1, marginLeft: 14, textAlign: 'left' }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Estimated finish</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2 }}>Oct 14, 2026</div>
          </div>
          <div style={{ fontSize: 11, color: C.green, opacity: 0.8, fontStyle: 'italic', fontFamily: '"Fraunces",serif' }}>~ 14 days early</div>
        </div>
        <button style={S.ctaApricot} onClick={() => go('permissions')}>I&apos;m in</button>
      </div>
    </div>
  );
}
