'use client';

import Mascot from '@/app/components/Mascot';
import { Blob, S } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';

export default function Welcome({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, height: '100%', display: 'flex', flexDirection: 'column', background: C.creamHi, position: 'relative', overflow: 'hidden' }}>
      <Blob color={C.apricotMd} size={300} top={-60} right={-80} opacity={0.18} />
      <Blob color={C.butterLt} size={240} bottom={120} left={-60} opacity={0.08} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <Mascot mood="wave" size={170} trackCursor />
        <h1 style={{ ...S.h1, fontSize: 56, marginTop: 20 }}>Hi, I&apos;m</h1>
        <h1 style={{ ...S.h1, fontSize: 88, color: C.apricot, fontStyle: 'italic', fontWeight: 300, marginTop: -6 }}>Pip</h1>
        <p style={{ ...S.body, fontSize: 15, marginTop: 18, maxWidth: 280 }}>Your weight-loss partner.<br />Warm. Specific. On your side.</p>
      </div>
      <div style={{ padding: '0 22px 28px', position: 'relative', zIndex: 1 }}>
        <button style={S.ctaApricot} onClick={() => go('goal')}>Let&apos;s begin</button>
        <button style={S.ctaLine} onClick={() => go('today')}>I have an account</button>
      </div>
    </div>
  );
}
