'use client';

import { Header, IconChip, FoodPlate, S, Em, Blob } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C, BTN_SHADOW, PILLOW_SHADOW_SM } from '@/app/lib/tokens';

// ── LogChoose ────────────────────────────────────────────────────
export function LogChoose({ go }: { go: (r: string) => void }) {
  const modes = [
    { k: 'logVoice',   l: 'Voice',   d: '"Two eggs and a coffee"', icon: 'mic',     tone: 'apricotSolid' as const },
    { k: 'logPhoto',   l: 'Photo',   d: 'Snap your plate',          icon: 'camera',  tone: 'greenSolid' as const },
    { k: 'logBarcode', l: 'Barcode', d: 'Scan packaging',           icon: 'barcode', tone: 'butter' as const },
    { k: 'logSearch',  l: 'Search',  d: 'Type-ahead, 250k foods',   icon: 'search',  tone: 'apricot' as const },
  ];
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Log a meal</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How will<br />you <Em>log</Em>?</h1>
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {modes.map(m => {
            const solid = m.tone === 'apricotSolid' || m.tone === 'greenSolid';
            return (
              <div key={m.k} onClick={() => go(m.k)} style={{ ...S.pillow, padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, minHeight: 140 }}>
                <IconChip tone={m.tone} size={48}><Icon name={m.icon} color={solid ? '#fff' : C.apricotDk} size={24} /></IconChip>
                <div>
                  <div style={{ fontFamily: '"Fraunces",serif', fontSize: 20, color: C.ink, fontWeight: 400 }}>{m.l}</div>
                  <div style={{ fontSize: 11, color: C.dim, marginTop: 4, lineHeight: 1.3 }}>{m.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── LogVoice ─────────────────────────────────────────────────────
export function LogVoice({ go }: { go: (r: string) => void }) {
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

// ── LogPhoto ─────────────────────────────────────────────────────
export function LogPhoto({ go }: { go: (r: string) => void }) {
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

// ── LogBarcode ───────────────────────────────────────────────────
export function LogBarcode({ go }: { go: (r: string) => void }) {
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

// ── LogSearch ────────────────────────────────────────────────────
const FOOD_ITEMS = [
  ['Greek yogurt','100g · 59 kcal','apricot','breakfast'],
  ['Banana','1 medium · 105 kcal','butter','snack'],
  ['Chicken breast','100g · 165 kcal','green','dinner'],
  ['Almonds','12 nuts · 84 kcal','cream','snack'],
  ['Olive oil','1 tbsp · 119 kcal','butter','breakfast'],
  ['Salmon','100g · 208 kcal','apricot','lunch'],
  ['Quinoa','60g cooked · 71 kcal','green','breakfast'],
  ['Espresso','1 shot · 3 kcal','cream','flame'],
] as const;

export function LogSearch({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="logChoose" go={go}>Search foods</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillowSm, marginTop: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="search" color={C.apricot} size={18} />
          <input autoFocus placeholder="Search 250k foods…" style={{ flex: 1, padding: 0, border: 0, fontSize: 16, fontFamily: '"Fraunces", serif', fontStyle: 'italic', background: 'transparent', outline: 'none', color: C.ink }} />
        </div>
        <div style={{ ...S.eyebrow, marginTop: 24 }}>Recents</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {FOOD_ITEMS.map(([name, sub, tone, icon], i) => (
            <div key={name} onClick={() => go('logConfirm')} style={{ padding: '12px 18px', borderBottom: i < FOOD_ITEMS.length - 1 ? `1px solid ${C.hair}` : 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <IconChip tone={tone as 'apricot'|'butter'|'green'|'cream'} size={36}><Icon name={icon} color={C.apricotDk} size={18} /></IconChip>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: C.ink, fontFamily: '"Fraunces",serif', fontWeight: 400 }}>{name}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{sub}</div>
              </div>
              <Icon name="add" color={C.dim} size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LogConfirm ───────────────────────────────────────────────────
export function LogConfirm({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Confirm</Header>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconChip tone="greenSolid" size={44}><Icon name="check" color="#fff" size={22} /></IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Pip recognized</div>
              <h1 style={{ ...S.h2, color: C.green, marginTop: 4, fontSize: 22 }}>Two eggs + espresso</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            {[['~180','kcal'],['13','P'],['1','C'],['13','F']].map(([v, l]) => (
              <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,.45)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: C.green, fontWeight: 400 }}>{v}</div>
                <div style={{ fontSize: 9, color: C.green, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 24, marginBottom: 10 }}>Looks right?</div>
        <div style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FoodPlate tone="butter" icon={<Icon name="snack" color="#fff" size={24} />} size={48} />
          <div style={{ flex: 1, fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: '"Fraunces",serif' }}>
            Pip&apos;s confidence: <span style={{ color: C.green, fontWeight: 600, fontStyle: 'normal' }}>92%</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Add to today</button>
        <button style={S.ctaLine} onClick={() => go('logSearch')}>Edit details</button>
      </div>
    </div>
  );
}
