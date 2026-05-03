'use client';

import { useState } from 'react';
import { Header, Blob, S, Em } from '@/app/components/ui';
import { C, PILLOW_SHADOW_SM } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

export default function WeighIn({ go, set }: { go: (r: string) => void; set: (k: keyof AppState, v: AppState[keyof AppState]) => void }) {
  const [w, setW] = useState(82.4);
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Sunday weigh-in · Week 4</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>What does the<br /><Em>scale</Em> say?</h1>
      </div>
      <div style={{ padding: '32px 22px', textAlign: 'center', position: 'relative' }}>
        <Blob color={C.apricotMd} size={260} top={-20} left="50%" opacity={0.08} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ ...S.display, fontSize: 140 }}>{w.toFixed(1)}</div>
          <div style={{ ...S.eyebrow, marginTop: 8 }}>kilograms</div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36 }}>
            <button onClick={() => setW(v => Math.round((v - 0.1) * 10) / 10)} style={{ width: 60, height: 60, borderRadius: 999, border: 0, background: C.pillow, fontSize: 26, cursor: 'pointer', color: C.ink, fontFamily: 'inherit', boxShadow: PILLOW_SHADOW_SM }}>−</button>
            <button onClick={() => setW(v => Math.round((v + 0.1) * 10) / 10)} style={{ width: 60, height: 60, borderRadius: 999, border: 0, background: C.apricot, fontSize: 26, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>+</button>
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => { set('lastWeight', w); set('weighInDue', false); go('weighInResult'); }}>Confirm</button>
      </div>
    </div>
  );
}
