'use client';

import { ReactNode, CSSProperties } from 'react';
import { C, PILLOW_SHADOW, PILLOW_SHADOW_SM, BTN_SHADOW } from '@/app/lib/tokens';
import { Icon } from '@/app/lib/icons';

// ── Header ──────────────────────────────────────────────────────
export function Header({ children, back, go, mode = 'cream' }: {
  children?: ReactNode; back?: string; go?: (r: string) => void; mode?: string;
}) {
  const fg = mode === 'dark' ? 'rgba(255,246,238,.6)' : C.dim;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 22px 6px' }}>
      {back && go && (
        <button onClick={() => go(back)} style={{ background: 'rgba(0,0,0,.04)', border: 0, width: 34, height: 34, borderRadius: 999, fontSize: 18, color: fg, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>‹</button>
      )}
      <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: fg, textTransform: 'uppercase', letterSpacing: '.18em' }}>{children}</div>
    </div>
  );
}

// ── IconChip ─────────────────────────────────────────────────────
export type ToneName = 'apricot' | 'apricotSolid' | 'green' | 'greenSolid' | 'butter' | 'sky' | 'cream';
const TONES: Record<ToneName, { bg: string; color: string }> = {
  apricot:      { bg: C.apricotWash, color: C.apricotDk },
  apricotSolid: { bg: C.apricot, color: '#fff' },
  green:        { bg: C.greenLt, color: C.green },
  greenSolid:   { bg: C.green, color: '#fff' },
  butter:       { bg: C.butterLt, color: C.apricotDk },
  sky:          { bg: C.skyLt, color: C.green },
  cream:        { bg: C.cream, color: C.apricotDk },
};

export function IconChip({ tone = 'apricot', size = 44, children }: { tone?: ToneName; size?: number; children: ReactNode }) {
  const t = TONES[tone] || TONES.apricot;
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: 999, background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: PILLOW_SHADOW_SM }}>
      <div style={{ width: size * 0.5, height: size * 0.5 }}>{children}</div>
    </div>
  );
}

// ── Blob ─────────────────────────────────────────────────────────
export function Blob({ color, size = 240, top, left, right, bottom, opacity = 0.55 }: {
  color: string; size?: number; top?: number | string; left?: number | string; right?: number | string; bottom?: number | string; opacity?: number;
}) {
  return (
    <div style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity, pointerEvents: 'none', top, left, right, bottom, filter: 'blur(8px)' }} />
  );
}

// ── Ring ─────────────────────────────────────────────────────────
export function Ring({ pct = 0.5, size = 44, stroke = 4, color = C.apricot, track = C.apricotWash, label, sublabel }: {
  pct?: number; size?: number; stroke?: number; color?: string; track?: string; label?: string; sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - pct * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      {label && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces",serif', fontSize: size * 0.3, fontWeight: 400, color: C.ink, lineHeight: 1 }}>
          {label}
          {sublabel && <div style={{ fontSize: 8, color: C.dim, fontFamily: '"DM Sans"', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 1 }}>{sublabel}</div>}
        </div>
      )}
    </div>
  );
}

// ── Row ──────────────────────────────────────────────────────────
export function Row({ label, value, onClick, selected, dense, icon, sub }: {
  label: string; value?: ReactNode; onClick?: () => void; selected?: boolean; dense?: boolean; icon?: ReactNode; sub?: string;
}) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: dense ? '10px 0' : '16px 0', borderBottom: `1px solid ${C.hair}`, cursor: onClick ? 'pointer' : 'default' }}>
      {icon && <div style={{ flexShrink: 0 }}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: selected ? 600 : 500, color: selected ? C.apricot : C.ink }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 13, color: selected ? C.apricot : C.dim }}>{value}</div>
    </div>
  );
}

// ── TabBar ───────────────────────────────────────────────────────
export function TabBar({ active, go }: { active: string; go: (r: string) => void }) {
  const tabs = [
    { id: 'today', route: 'today',   label: 'Today', icon: 'today' },
    { id: 'plan',  route: 'plan',    label: 'Plan',  icon: 'plan' },
    { id: 'coach', route: 'coach',   label: 'Coach', icon: 'coach' },
    { id: 'stats', route: 'forecast',label: 'Stats', icon: 'stats' },
    { id: 'me',    route: 'profile', label: 'Me',    icon: 'me' },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'space-around', background: 'rgba(255,251,241,.92)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${C.hair}`, padding: '10px 8px 26px', zIndex: 5 }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => go(t.route)} style={{ background: 'none', border: 0, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Icon name={t.icon} color={on ? C.apricot : C.dim} size={22} />
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, color: on ? C.apricot : C.dim, letterSpacing: on ? '.04em' : 0 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── FAB ──────────────────────────────────────────────────────────
export function FAB({ go }: { go: (r: string) => void }) {
  return (
    <button onClick={() => go('logChoose')} style={{ position: 'absolute', right: 22, bottom: 92, height: 56, paddingLeft: 18, paddingRight: 22, background: C.apricot, color: C.paper, border: 0, fontSize: 14, fontWeight: 700, letterSpacing: '.02em', cursor: 'pointer', zIndex: 6, fontFamily: 'inherit', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 14px 28px -10px rgba(232,120,78,.6), 0 4px 0 rgba(122,69,32,.18), 0 1px 0 rgba(255,255,255,.4) inset' }}>
      <span style={{ fontSize: 22, lineHeight: '20px' }}>+</span>
      Log meal
    </button>
  );
}

// ── FoodPlate ────────────────────────────────────────────────────
type PlateTone = 'apricot' | 'green' | 'butter' | 'cream' | 'sky';
const PLATE_GRADIENTS: Record<PlateTone, string> = {
  apricot: `radial-gradient(circle at 30% 30%, #FBE0CC, #F4B690 70%, #E8784E)`,
  green:   `radial-gradient(circle at 30% 30%, #E8F0EA, #B5CEBC 70%, #7FA088)`,
  butter:  `radial-gradient(circle at 30% 30%, #FCEDC4, #F5C56A 70%, #D9A23E)`,
  cream:   `radial-gradient(circle at 30% 30%, #FFF5E0, #F2E0BB 70%, #D9C28C)`,
  sky:     `radial-gradient(circle at 30% 30%, #EAF1F6, #BDD2DE 70%, #88A8BD)`,
};

export function FoodPlate({ tone = 'apricot', icon, size = 64 }: { tone?: PlateTone; icon: ReactNode; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 999, background: PLATE_GRADIENTS[tone] || PLATE_GRADIENTS.apricot, flexShrink: 0, boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 8px 16px -10px rgba(122,69,32,.35), 0 2px 4px -2px rgba(122,69,32,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.92)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: size * 0.5, height: size * 0.5, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.15))' }}>{icon}</div>
    </div>
  );
}

// ── Style helpers ────────────────────────────────────────────────
export const S = {
  page:      { background: C.creamHi, minHeight: '100%', fontFamily: '"DM Sans", system-ui', position: 'relative' } as CSSProperties,
  pad:       { padding: '0 22px' } as CSSProperties,
  eyebrow:   { fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: C.dim, textTransform: 'uppercase' } as CSSProperties,
  h1:        { fontFamily: '"Fraunces", serif', fontWeight: 400, fontSize: 38, lineHeight: 1.02, letterSpacing: '-1.2px', color: C.ink, margin: 0 } as CSSProperties,
  h2:        { fontFamily: '"Fraunces", serif', fontWeight: 400, fontSize: 26, lineHeight: 1.05, letterSpacing: '-.6px', color: C.ink, margin: 0 } as CSSProperties,
  body:      { fontSize: 15, lineHeight: 1.55, color: C.muted, margin: 0 } as CSSProperties,
  display:   { fontFamily: '"Fraunces", serif', fontWeight: 300, color: C.apricot, lineHeight: 0.9, letterSpacing: '-3px' } as CSSProperties,
  pillow:    { background: C.pillow, borderRadius: 22, boxShadow: PILLOW_SHADOW, padding: 20 } as CSSProperties,
  pillowSm:  { background: C.pillow, borderRadius: 18, boxShadow: PILLOW_SHADOW_SM, padding: 16 } as CSSProperties,
  cta:       { display: 'block', width: '100%', textAlign: 'center', background: C.ink, color: C.paper, border: 0, padding: '17px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '.02em', boxShadow: '0 4px 12px -4px rgba(31,27,23,.25)' } as CSSProperties,
  ctaApricot:{ display: 'block', width: '100%', textAlign: 'center', background: C.apricot, color: C.paper, border: 0, padding: '17px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '.02em', boxShadow: BTN_SHADOW } as CSSProperties,
  ctaLine:   { display: 'block', width: '100%', textAlign: 'center', background: 'transparent', color: C.muted, border: 0, padding: '14px', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' } as CSSProperties,
};

export function Em({ children }: { children: ReactNode }) {
  return <em style={{ color: C.apricot, fontStyle: 'italic', fontWeight: 400 }}>{children}</em>;
}
