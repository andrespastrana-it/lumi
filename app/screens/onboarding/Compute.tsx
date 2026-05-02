'use client';

import { useEffect, useState } from 'react';
import Mascot from '@/app/components/Mascot';
import { Blob, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

const STEPS = ['Calculating TDEE', 'Setting deficit', 'Choosing meals', 'Building 26-week curve'];

export default function Compute({ go }: { go: (r: string) => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step < STEPS.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 750);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => go('plan_reveal'), 1000);
      return () => clearTimeout(t);
    }
  }, [step, go]);

  return (
    <div style={{ ...S.page, background: C.creamHi, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      <Blob color={C.apricotMd} size={280} top={-40} left={-80} opacity={0.18} />
      <Blob color={C.butterLt} size={220} bottom={80} right={-60} opacity={0.08} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Mascot mood="thinking" size={170} />
        <h1 style={{ ...S.h2, fontSize: 30, marginTop: 14 }}>Pip is <Em>thinking</Em></h1>
        <div style={{ marginTop: 28, width: 280, ...S.pillow, padding: 0, overflow: 'hidden' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ padding: '14px 18px', fontSize: 13, color: i <= step ? C.ink : C.dim, opacity: i <= step ? 1 : 0.35, transition: 'opacity .3s', borderBottom: i < STEPS.length - 1 ? `1px solid ${C.hair}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ textAlign: 'left' }}>{s}</span>
              <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i < step ? (
                  <div style={{ width: 18, height: 18, borderRadius: 999, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" color="#fff" size={12} /></div>
                ) : i === step ? (
                  <div style={{ width: 10, height: 10, borderRadius: 999, background: C.apricot, animation: 'pulse 1s ease-in-out infinite' }} />
                ) : (
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: C.hair }} />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
