'use client';

import { Header, IconChip, TabBar, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function Forecast({ go }: { go: (r: string) => void }) {
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
