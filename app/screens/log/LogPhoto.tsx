'use client';

import { S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';

export default function LogPhoto({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, background: '#1a1a1a', height: '100%', position: 'relative', padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, #4a3a2a 0%, #1a1a1a 70%)' }} />
      <div style={{ position: 'absolute', inset: 60, border: '2px solid rgba(255,255,255,.4)', borderRadius: 24, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #F4B690 0%, #B85530 60%, transparent 100%)', opacity: 0.6 }} />
        {([[0,0],[0,1],[1,0],[1,1]] as [number, number][]).map(([y,x],i) => (
          <div key={i} style={{ position: 'absolute', [y ? 'bottom' : 'top']: 12, [x ? 'right' : 'left']: 12, width: 24, height: 24, borderTop: y ? 0 : '3px solid #fff', borderBottom: y ? '3px solid #fff' : 0, borderLeft: x ? 0 : '3px solid #fff', borderRight: x ? '3px solid #fff' : 0 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: 18, left: 22 }}>
        <button onClick={() => go('logChoose')} style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', border: 0, width: 38, height: 38, borderRadius: 999, fontSize: 18, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>‹</button>
      </div>
      <div style={{ position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
        <div style={{ ...S.eyebrow, color: 'rgba(255,255,255,.7)' }}>Photo log</div>
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 28, alignItems: 'center' }}>
        <button style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', border: 0, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparkle" color="#fff" size={18} />
        </button>
        <button onClick={() => go('logConfirm')} style={{ width: 76, height: 76, borderRadius: 999, background: '#fff', border: '5px solid rgba(255,255,255,.3)', cursor: 'pointer', boxShadow: '0 0 0 1px rgba(0,0,0,.1), 0 8px 24px rgba(0,0,0,.4)' }} />
        <button style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', border: 0, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="flame" color="#fff" size={18} />
        </button>
      </div>
    </div>
  );
}
