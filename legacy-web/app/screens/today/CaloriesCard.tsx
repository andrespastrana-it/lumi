'use client';

import { Ring, S } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';

const MACROS = [['Protein', 88, 142, 'g', C.apricot], ['Carbs', 142, 220, 'g', C.butter], ['Fat', 42, 60, 'g', C.greenMd]] as const;

export function CaloriesCard({ eaten, total }: { eaten: number; total: number }) {
  return (
    <div style={{ padding: '8px 22px 0' }}>
      <div style={{ ...S.pillow, background: C.pillow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Ring pct={eaten / total} size={88} stroke={8} color={C.apricot} track={C.apricotWash} label={eaten.toLocaleString()} sublabel="eaten" />
          <div style={{ flex: 1 }}>
            <div style={S.eyebrow}>Calories</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 32, color: C.ink, fontWeight: 300, letterSpacing: '-1px' }}>{total - eaten}</div>
              <div style={{ fontSize: 12, color: C.dim }}>kcal left</div>
            </div>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green }} />
              On pace · {total.toLocaleString()} target
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.hair}` }}>
          {MACROS.map(([l, a, b, u, color]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Ring pct={a / b} size={36} stroke={3.5} color={color} track={`${color}33`} />
              <div>
                <div style={{ fontSize: 9, color: C.dim, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>{l}</div>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 16, color: C.ink, marginTop: 1, fontWeight: 400 }}>{a}<span style={{ fontSize: 10, color: C.dim, fontFamily: '"DM Sans"' }}>/{b}{u}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
