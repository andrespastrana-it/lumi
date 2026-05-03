'use client';

import { S, Blob } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function LogVoice({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, background: `radial-gradient(circle at 50% 30%, #2D2620, ${C.ink} 70%)`, color: C.paper, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, position: 'relative', overflow: 'hidden' }}>
      <Blob color={C.apricot} size={300} top={-50} left={-50} opacity={0.1} />
      <Blob color={C.apricot} size={260} bottom={-30} right={-50} opacity={0.08} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 28 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(232,120,78,.2)', animation: 'pulse-ring 1.6s ease-out infinite' }} />
          <div style={{ position: 'absolute', inset: 12, borderRadius: 999, background: 'rgba(232,120,78,.3)', animation: 'pulse-ring 1.6s ease-out .3s infinite' }} />
          <div style={{ position: 'absolute', inset: 24, borderRadius: 999, background: C.apricot, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 28px -8px rgba(232,120,78,.6)' }}>
            <Icon name="mic" color="#fff" size={36} />
          </div>
        </div>
        <div style={{ ...S.eyebrow, color: 'rgba(255,246,238,.5)' }}>Listening</div>
        <h1 style={{ ...S.h1, color: C.paper, textAlign: 'center', fontSize: 36, marginTop: 16, lineHeight: 1.05 }}>
          &ldquo;Two eggs &amp;<br /><span style={{ color: C.apricot, fontStyle: 'italic', fontWeight: 300 }}>a coffee</span>&rdquo;
        </h1>
        <div style={{ display: 'flex', gap: 5, marginTop: 32, alignItems: 'center', height: 60 }}>
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} style={{ width: 3, height: 8 + (i % 4) * 16, background: C.apricot, borderRadius: 999, animation: `bar ${0.6 + (i % 3) * 0.2}s ease-in-out ${i * 0.05}s infinite alternate` }} />
          ))}
        </div>
      </div>
      <button style={{ ...S.ctaApricot, marginTop: 60, maxWidth: 240, position: 'relative', zIndex: 1 }} onClick={() => go('logConfirm')}>Stop &amp; log</button>
    </div>
  );
}
