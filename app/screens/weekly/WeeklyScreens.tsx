'use client';

import { useState } from 'react';
import Mascot from '@/app/components/Mascot';
import { Header, IconChip, Ring, Blob, TabBar, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C, PILLOW_SHADOW_SM } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

// ── WeighIn ───────────────────────────────────────────────────────
export function WeighIn({ go, set }: { go: (r: string) => void; set: (k: keyof AppState, v: AppState[keyof AppState]) => void }) {
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

// ── WeighInResult ─────────────────────────────────────────────────
export function WeighInResult({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Pip&apos;s take</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14, fontSize: 44 }}><Em>5 days</Em><br />ahead</h1>
        <p style={{ ...S.body, marginTop: 14 }}>You lost 0.7 kg this week — 0.05 above target. Beautiful.</p>
      </div>
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={48}><Icon name="trend" color="#fff" size={24} /></IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Adjustment</div>
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 30, color: C.green, marginTop: 4, fontWeight: 300, letterSpacing: '-1px' }}>+80 kcal/day</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 16, fontStyle: 'italic', fontFamily: '"Fraunces", serif', maxWidth: 280, lineHeight: 1.45, paddingTop: 12, borderTop: '1px solid rgba(61,90,74,.18)' }}>
            &ldquo;Do not burn out the gas tank — we have 22 weeks ahead.&rdquo;
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('forecast')}>Apply &amp; see forecast</button>
        <button style={S.ctaLine} onClick={() => go('milestone')}>Skip — celebrate first</button>
      </div>
    </div>
  );
}

// ── Forecast ─────────────────────────────────────────────────────
export function Forecast({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Forecast · 26 weeks</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}><Em>68 kg</Em> · Oct 14</h1>
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, padding: 20 }}>
          <svg viewBox="0 0 320 160" style={{ width: '100%', height: 160 }}>
            <defs>
              <linearGradient id="curve" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={C.apricot} stopOpacity=".25" />
                <stop offset="100%" stopColor={C.apricot} stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="120" x2="320" y2="120" stroke={C.hair} />
            <line x1="0" y1="60"  x2="320" y2="60"  stroke={C.hair} strokeDasharray="2 4" />
            <path d="M0,20 Q80,40 160,80 T320,140 L320,160 L0,160 Z" fill="url(#curve)" />
            <path d="M0,20 Q80,40 160,80 T320,140" stroke={C.apricot} strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="80" cy="50" r="6" fill="#fff" stroke={C.apricot} strokeWidth="2.5" />
            <text x="86" y="42" fontSize="10" fill={C.ink} fontFamily="DM Sans" fontWeight="600">today · 82.4</text>
            <circle cx="320" cy="140" r="6" fill={C.green} stroke="#fff" strokeWidth="2" />
            <text x="260" y="135" fontSize="10" fill={C.green} fontFamily="DM Sans" textAnchor="end" fontWeight="600">68 kg goal</text>
          </svg>
        </div>
      </div>
      <div style={{ padding: '16px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { l: 'Lost',      v: '−2.6', u: 'kg',   icon: 'trend',   tone: 'greenSolid' as const },
          { l: 'To go',     v: '14.4', u: 'kg',   icon: 'target',  tone: 'apricot' as const },
          { l: 'Days early',v: '14',   u: 'days', icon: 'sparkle', tone: 'butter' as const },
        ].map(({ l, v, u, icon, tone }) => (
          <div key={l} style={{ ...S.pillowSm, padding: 14, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <IconChip tone={tone} size={32}><Icon name={icon} color={tone === 'greenSolid' ? '#fff' : C.apricotDk} size={16} /></IconChip>
            </div>
            <div style={{ ...S.eyebrow, fontSize: 9 }}>{l}</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 24, color: C.apricot, marginTop: 4, fontWeight: 300, letterSpacing: '-.5px' }}>{v}</div>
            <div style={{ fontSize: 10, color: C.dim }}>{u}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('milestone')}>View milestones</button>
        <button style={S.ctaLine} onClick={() => go('plateau')}>What if I plateau?</button>
      </div>
      <TabBar active="stats" go={go} />
    </div>
  );
}

// ── Milestone ─────────────────────────────────────────────────────
export function Milestone({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, background: C.creamHi, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Blob color={C.apricotMd} size={320} top={-100} right={-80} opacity={0.18} />
      <Blob color={C.greenWash} size={240} bottom={140} left={-80} opacity={0.08} />
      <div style={{ paddingTop: 44, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Mascot mood="celebrate" size={170} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={S.eyebrow}>Milestone unlocked ✦</div>
        <h1 style={{ ...S.h1, fontSize: 56, marginTop: 12 }}><Em>2.5 kg</Em></h1>
        <div style={{ fontFamily: '"Fraunces", serif', fontSize: 28, color: C.ink, fontWeight: 300, marginTop: -4 }}>down</div>
        <p style={{ ...S.body, marginTop: 20, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>The weight of 5 sticks of butter. Or one big cantaloupe. Either way — gone.</p>
      </div>
      <div style={{ padding: '0 22px 12px', position: 'relative', zIndex: 1 }}>
        <div style={{ ...S.pillow, background: C.greenLt, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconChip tone="greenSolid" size={44}><Icon name="flame" color="#fff" size={22} /></IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Streak</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 26, color: C.green, fontWeight: 300 }}>21 days</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 22px 22px', position: 'relative', zIndex: 1 }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Back to today</button>
        <button style={S.ctaLine} onClick={() => go('today')}>Share</button>
      </div>
    </div>
  );
}

// ── Plateau ───────────────────────────────────────────────────────
export function Plateau({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="forecast" go={go}>Plateau</Header>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Mascot mood="curious" size={80} />
          <h1 style={{ ...S.h1, fontSize: 28, margin: 0 }}>3 weeks<br /><Em>stuck</Em>?</h1>
        </div>
      </div>
      <div style={S.pad}>
        <p style={{ ...S.body, marginTop: 18 }}>Plateaus mean your body is recalibrating, not failing. Here&apos;s what works:</p>
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.apricotLt, padding: 20 }}>
          <div style={{ ...S.eyebrow, color: C.apricotDk }}>Try this week</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { x: '+ 20g protein/day',        icon: 'lunch',    tone: 'apricotSolid' as const },
              { x: '+ 1 extra walk (30 min)',   icon: 'steps',    tone: 'green' as const },
              { x: '− 100 kcal carbs at dinner',icon: 'breakfast',tone: 'butter' as const },
            ].map(({ x, icon, tone }) => (
              <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,.45)', borderRadius: 12 }}>
                <IconChip tone={tone} size={32}><Icon name={icon} color={tone === 'apricotSolid' ? '#fff' : tone === 'green' ? C.green : C.apricotDk} size={16} /></IconChip>
                <div style={{ flex: 1, color: C.apricotDk, fontSize: 14, fontFamily: '"Fraunces",serif' }}>{x}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('forecast')}>Apply for one week</button>
        <button style={S.ctaLine} onClick={() => go('coach')}>Talk to Pip instead</button>
      </div>
    </div>
  );
}

// ── BadDay ────────────────────────────────────────────────────────
export function BadDay({ go }: { go: (r: string) => void }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Yesterday</Header>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Mascot mood="oops" size={80} />
          <h1 style={{ ...S.h1, fontSize: 28, margin: 0 }}>Tomorrow<br />we <Em>adjust</Em></h1>
        </div>
      </div>
      <div style={S.pad}>
        <p style={{ ...S.body, marginTop: 18 }}>One bad day does not undo a week of good ones. Pip will spread it out — gently.</p>
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...S.pillowSm, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconChip tone="apricotSolid" size={40}><Icon name="flame" color="#fff" size={20} /></IconChip>
          <div style={{ flex: 1 }}>
            <div style={S.eyebrow}>Yesterday</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.apricot, fontWeight: 300, marginTop: 2 }}>+ 520 kcal over</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={44}><Icon name="sparkle" color="#fff" size={22} /></IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Pip&apos;s plan</div>
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2, fontWeight: 300, letterSpacing: '-.4px' }}>−104 kcal/day × 5 days</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 16, fontStyle: 'italic', fontFamily: '"Fraunces",serif', paddingTop: 12, borderTop: '1px solid rgba(61,90,74,.18)' }}>
            No drama. No skipping meals. Forecast unchanged.
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Resume the plan</button>
      </div>
    </div>
  );
}
