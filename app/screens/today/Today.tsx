'use client';

import Mascot from '@/app/components/Mascot';
import { Blob, IconChip, Ring, FoodPlate, TabBar, FAB, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

const MEALS = [
  { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, done: true,  next: false, tone: 'apricot' as const, icon: 'breakfast' },
  { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, done: true,  next: false, tone: 'butter'  as const, icon: 'snack' },
  { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, done: false, next: true,  tone: 'green'   as const, icon: 'dinner' },
  { l: 'Protein shake',          t: '16:00', kcal: 220, done: false, next: false, tone: 'cream'   as const, icon: 'breakfast' },
  { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, done: false, next: false, tone: 'sky'     as const, icon: 'lunch' },
];
const MACROS = [['Protein', 88, 142, 'g', C.apricot], ['Carbs', 142, 220, 'g', C.butter], ['Fat', 42, 60, 'g', C.greenMd]] as const;
const EATEN = 1108, TOTAL = 1780;

export default function Today({ go, state }: { go: (r: string) => void; state: AppState }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110, background: C.creamHi }}>
      <div style={{ padding: '22px 22px 14px', position: 'relative' }}>
        <Blob color={C.apricotMd} size={180} top={-30} right={-30} opacity={0.12} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative', zIndex: 1 }}>
          <div style={{ marginTop: -16, marginLeft: -10, flexShrink: 0 }}>
            <Mascot mood="happy" size={92} trackCursor />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <div style={S.eyebrow}>Tuesday · Apr 28</div>
            <h1 style={{ ...S.h1, fontSize: 30, marginTop: 6 }}>Morning, <Em>Marco</Em></h1>
            <div style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: '"Fraunces",serif', marginTop: 8, lineHeight: 1.4 }}>
              &ldquo;Today is a chicken-and-<br />quinoa kind of day.&rdquo;
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Ring pct={EATEN / TOTAL} size={88} stroke={8} color={C.apricot} track={C.apricotWash} label={EATEN.toLocaleString()} sublabel="eaten" />
            <div style={{ flex: 1 }}>
              <div style={S.eyebrow}>Calories</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 32, color: C.ink, fontWeight: 300, letterSpacing: '-1px' }}>{TOTAL - EATEN}</div>
                <div style={{ fontSize: 12, color: C.dim }}>kcal left</div>
              </div>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green }} />
                On pace · {TOTAL.toLocaleString()} target
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

      <div style={{ padding: '14px 22px 0' }}>
        <div onClick={() => go('forecast')} style={{ ...S.pillowSm, background: C.greenLt, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
          <IconChip tone="greenSolid" size={44}><Icon name="flame" color="#fff" size={22} /></IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Streak</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2, letterSpacing: '-.4px' }}>21 days · −2.6 kg</div>
          </div>
          <Icon name="add" color={C.green} size={18} />
        </div>
      </div>

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

      {state.weighInDue && (
        <div style={{ padding: '16px 22px 0' }}>
          <div onClick={() => go('weighIn')} style={{ ...S.pillow, background: C.apricot, color: C.paper, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="scale" color="#fff" size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...S.eyebrow, color: 'rgba(255,246,238,.85)' }}>Sunday ritual</div>
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, marginTop: 2 }}>Step on the scale</div>
            </div>
            <Icon name="add" color="#fff" size={18} />
          </div>
        </div>
      )}

      <button style={{ ...S.ctaLine, marginTop: 12 }} onClick={() => go('badday')}>Had a rough day yesterday</button>

      <FAB go={go} />
      <TabBar active="today" go={go} />
    </div>
  );
}
