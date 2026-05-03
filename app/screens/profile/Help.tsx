'use client';

import { useState } from 'react';
import Mascot from '@/app/components/Mascot';
import { Header, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

const FAQS = [
  ['How does Pip\'s plan adjust?','Every weekly weigh-in, Pip recalculates your calorie & macro target based on actual loss vs. predicted.'],
  ['Can I eat out?','Yes. Snap a photo or describe verbally — Pip estimates calories within ±10%.'],
  ['What if I plateau?','After 14 flat days Pip suggests a refeed, deload, or adjustment.'],
  ['Is my data private?','End-to-end encrypted. Never sold. You can export or delete anytime.'],
  ['Does it work without Apple Health?','Yes — but syncing improves accuracy. Manual logging is fine.'],
];

export default function Help({ go }: { go: (r: string) => void }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Help &amp; FAQ</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.apricotWash, marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => go('coach')}>
          <Mascot mood="wave" size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.apricotDk }}>Need a hand?</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, color: C.apricotDk, marginTop: 2, letterSpacing: '-.3px' }}>Ask Pip directly</div>
          </div>
          <Icon name="add" color={C.apricotDk} size={14} />
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Frequently asked</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {FAQS.map(([q, a], i) => {
            const on = open === i;
            return (
              <div key={q} onClick={() => setOpen(on ? -1 : i)} style={{ padding: '16px 18px', borderBottom: i < FAQS.length - 1 ? `1px solid ${C.hair}` : 0, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 500, flex: 1 }}>{q}</span>
                  <Icon name="add" color={C.dim} size={16} />
                </div>
                {on && <div style={{ fontSize: 13, color: C.dim, marginTop: 8, lineHeight: 1.55 }}>{a}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Contact us</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ ...S.ctaLine, color: C.ink }}>support@lumi.app</button>
          <button style={{ ...S.ctaLine, color: C.ink }}>Rate Lumi on the App Store</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 11, color: C.dim, letterSpacing: '.06em' }}>Lumi · v1.4.2 · Build 824</div>
      </div>
    </div>
  );
}
