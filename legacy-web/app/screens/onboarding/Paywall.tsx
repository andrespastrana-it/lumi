'use client';

import { Blob, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

const FEATURES = [
  { l: 'Voice + photo logging', icon: 'mic' },
  { l: 'AI coach (unlimited)',  icon: 'sparkle' },
  { l: '26-week forecast',      icon: 'trend' },
  { l: 'Recipes & shopping list', icon: 'cart' },
  { l: 'Weekly weigh-in & adjust', icon: 'scale' },
  { l: 'Apple Health sync',     icon: 'heart' },
];

export default function Paywall({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, background: `radial-gradient(circle at 80% 0%, #2D2620 0%, ${C.ink} 60%)`, color: C.paper, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Blob color={C.apricot} size={300} top={-80} right={-80} opacity={0.08} />
      <div style={{ padding: '40px 24px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ ...S.eyebrow, color: C.apricot }}>✦ Unlock Lumi</div>
        <h1 style={{ ...S.h1, color: C.paper, fontSize: 44, marginTop: 14 }}>
          <span style={{ color: C.apricot, fontStyle: 'italic', fontWeight: 300 }}>7 days</span><br />on the house
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,246,238,.65)', lineHeight: 1.55, marginTop: 14, maxWidth: 280 }}>
          Then €8.99/month. Cancel anytime, even mid-trial.
        </p>
      </div>
      <div style={{ padding: '8px 24px', flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,246,238,.06)', borderRadius: 22, padding: 18, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,246,238,.08)' }}>
          {FEATURES.map((f, i) => (
            <div key={f.l} style={{ padding: '12px 0', borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(255,246,238,.08)' : 0, fontSize: 14, display: 'flex', alignItems: 'center', gap: 14, color: C.paper }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(232,120,78,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={f.icon} color={C.apricot} size={16} />
              </div>
              {f.l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 22px 22px', position: 'relative', zIndex: 1 }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Start free trial</button>
        <button style={{ ...S.ctaLine, color: 'rgba(255,246,238,.55)' }} onClick={() => go('today')}>Maybe later</button>
      </div>
    </div>
  );
}
