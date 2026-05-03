'use client';

import { Header, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';
import type { SubscriptionTier } from '@/app/context/AppContext';

export default function Subscription({ go, state, set }: {
  go: (r: string) => void;
  state: AppState;
  set: (k: keyof AppState, v: AppState[keyof AppState]) => void;
}) {
  const plan = state.subscription;
  const setPlan = (p: SubscriptionTier) => set('subscription', p);
  const PLANS: { k: SubscriptionTier; l: string; p: string; s: string; best?: boolean }[] = [
    { k: 'annual',   l: 'Annual',   p: '€59.99/yr', s: '€5/mo billed yearly · save 50%', best: true },
    { k: 'monthly',  l: 'Monthly',  p: '€9.99/mo',  s: 'Cancel anytime' },
    { k: 'lifetime', l: 'Lifetime', p: '€199 once', s: 'Pay once. Yours forever.' },
  ];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Subscription</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.apricot, color: '#fff', marginTop: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...S.eyebrow, color: 'rgba(255,255,255,.75)' }}>Current plan</div>
          <div style={{ fontFamily: '"Fraunces",serif', fontSize: 28, marginTop: 4, letterSpacing: '-.4px' }}>Trial</div>
          <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>5 days left · then €59.99/year</div>
          <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(255,255,255,.18)', borderRadius: 12, fontSize: 11, color: '#fff', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="sparkle" color="#fff" size={12} />
            All features unlocked
          </div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Choose your plan</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PLANS.map(o => {
            const on = plan === o.k;
            return (
              <div key={o.k} onClick={() => setPlan(o.k)} style={{ ...S.pillow, padding: 16, cursor: 'pointer', background: on ? C.apricotWash : C.surface, border: on ? `1.5px solid ${C.apricot}` : `1px solid ${C.hair}`, display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                {o.best && <div style={{ position: 'absolute', top: -8, right: 14, background: C.green, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.12em', padding: '3px 8px', borderRadius: 6 }}>BEST VALUE</div>}
                <div style={{ width: 22, height: 22, borderRadius: 999, border: on ? 0 : `1.5px solid ${C.dim}`, background: on ? C.apricot : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#fff' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, color: on ? C.apricotDk : C.ink, fontWeight: 500 }}>{o.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{o.s}</div>
                </div>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 17, color: C.ink, fontWeight: 500 }}>{o.p}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={S.ctaApricot} onClick={() => go('profile')}>Upgrade now</button>
          <button style={{ ...S.ctaLine, color: C.dim }}>Restore purchase</button>
          <button style={{ ...S.ctaLine, color: '#B43E2A' }}>Cancel subscription</button>
        </div>
      </div>
    </div>
  );
}
