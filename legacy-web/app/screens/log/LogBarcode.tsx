'use client';

import { S } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';

export default function LogBarcode({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, background: '#1a1a1a', height: '100%', position: 'relative', padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #2a241e 0%, #0f0f0f 70%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 30, right: 30, height: 160, transform: 'translateY(-50%)', borderRadius: 16, border: '2px solid rgba(255,255,255,.3)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 20, bottom: 20, left: 20, right: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-around', opacity: 0.6 }}>
          {[3,1,2,4,1,3,2,1,4,2,3,1,2].map((w,i) => <div key={i} style={{ width: w, height: '100%', background: '#fff' }} />)}
        </div>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.apricot}, transparent)`, animation: 'scan 1.5s infinite', boxShadow: `0 0 16px ${C.apricot}` }} />
      </div>
      <div style={{ position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
        <div style={{ ...S.eyebrow, color: 'rgba(255,255,255,.7)' }}>Scan barcode</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 8, fontStyle: 'italic', fontFamily: '"Fraunces",serif' }}>Center the code in the frame</div>
      </div>
      <div style={{ position: 'absolute', top: 18, left: 22 }}>
        <button onClick={() => go('logChoose')} style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', border: 0, width: 38, height: 38, borderRadius: 999, fontSize: 18, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>‹</button>
      </div>
      <button onClick={() => go('logConfirm')} style={{ ...S.ctaApricot, position: 'absolute', bottom: 40, left: 22, right: 22 }}>Simulate scan</button>
    </div>
  );
}
