'use client';

import { Header, FoodPlate, TabBar, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

const MEALS = [
  { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, p: 'P 18 · C 32 · F 8',  done: true,  next: false, tone: 'apricot' as const, icon: 'breakfast' },
  { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, p: 'P 4 · C 22 · F 9',   done: true,  next: false, tone: 'butter'  as const, icon: 'snack' },
  { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, p: 'P 38 · C 48 · F 18', done: false, next: true,  tone: 'green'   as const, icon: 'dinner' },
  { l: 'Protein shake',          t: '16:00', kcal: 220, p: 'P 28 · C 12 · F 4',  done: false, next: false, tone: 'cream'   as const, icon: 'breakfast' },
  { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, p: 'P 42 · C 50 · F 22', done: false, next: false, tone: 'sky'     as const, icon: 'lunch' },
];

export default function Plan({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Plan · Today</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}>5 meals · <Em>1,780</Em></h1>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MEALS.map((m, i) => (
            <div key={i} onClick={() => go('recipe')} style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', opacity: m.done ? 0.55 : 1, background: m.next ? C.apricotLt : C.pillow, border: m.next ? `1.5px solid ${C.apricot}40` : '1.5px solid transparent' }}>
              <FoodPlate tone={m.tone} icon={<Icon name={m.icon} color={m.tone === 'green' ? C.green : C.apricotDk} size={26} />} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontFamily: '"Fraunces",serif', color: m.next ? C.apricot : C.ink, fontWeight: 400 }}>{m.l}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>{m.t} · {m.p}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: C.ink, fontWeight: 400 }}>{m.kcal}</div>
                {m.done && <div style={{ fontSize: 9, color: C.green, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>✓ done</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('coach')}>Swap a meal with Pip</button>
        <button style={S.ctaLine} onClick={() => go('shopping')}>This week&apos;s shopping list →</button>
      </div>
      <TabBar active="plan" go={go} />
    </div>
  );
}
