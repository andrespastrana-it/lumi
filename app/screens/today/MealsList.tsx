'use client';

import { FoodPlate, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

const MEALS = [
  { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, done: true,  next: false, tone: 'apricot' as const, icon: 'breakfast' },
  { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, done: true,  next: false, tone: 'butter'  as const, icon: 'snack' },
  { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, done: false, next: true,  tone: 'green'   as const, icon: 'dinner' },
  { l: 'Protein shake',          t: '16:00', kcal: 220, done: false, next: false, tone: 'cream'   as const, icon: 'breakfast' },
  { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, done: false, next: false, tone: 'sky'     as const, icon: 'lunch' },
];

export function MealsList({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ padding: '22px 22px 8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, padding: '0 4px' }}>
        <div style={S.eyebrow}>Today&apos;s meals</div>
        <span style={{ fontSize: 11, color: C.dim }}>5 planned</span>
      </div>
      <div style={{ ...S.pillow, padding: 0 }}>
        {MEALS.map((m, i) => (
          <div key={i} onClick={() => go('plan')} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < MEALS.length - 1 ? `1px solid ${C.hair}` : 'none', cursor: 'pointer', opacity: m.done ? 0.55 : 1, background: m.next ? C.apricotLt : 'transparent' }}>
            <FoodPlate tone={m.tone} icon={<Icon name={m.icon} color={m.tone === 'green' ? C.green : C.apricotDk} size={24} />} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: m.next ? 600 : 500, color: m.next ? C.apricot : C.ink, fontFamily: '"Fraunces", serif' }}>{m.l}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                <span style={{ fontSize: 11, color: C.dim }}>{m.t}</span>
                {m.next && <span style={{ fontSize: 9, color: C.apricot, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700, background: C.apricotLt, padding: '2px 6px', borderRadius: 4 }}>Up next</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, color: C.ink, fontFamily: '"Fraunces",serif', fontWeight: 400 }}>{m.kcal}</div>
              <div style={{ fontSize: 9, color: C.dim, letterSpacing: '.1em', textTransform: 'uppercase' }}>kcal</div>
            </div>
            {m.done && <div style={{ width: 22, height: 22, borderRadius: 999, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" color="#fff" size={12} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
