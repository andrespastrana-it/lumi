'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

const GROUPS = [
  { g: 'Produce', tone: 'green' as const, icon: 'veg', items: [['Cucumber','× 2'],['Red onion','× 1'],['Lemons','× 4'],['Berries','· 250g'],['Spinach','· 200g']] },
  { g: 'Protein', tone: 'apricot' as const, icon: 'lunch', items: [['Chicken breast','· 600g'],['Salmon fillet','· 400g'],['Greek yogurt','· 1kg']] },
  { g: 'Pantry',  tone: 'butter' as const, icon: 'breakfast', items: [['Quinoa','· 500g'],['Olive oil','· 500ml'],['Almonds','· 200g']] },
];

export default function Shopping({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header back="plan" go={go}>This week</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}>Shopping<br /><Em>list</Em></h1>
        <div style={{ marginTop: 22, ...S.pillow, background: C.greenLt, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconChip tone="greenSolid" size={48}><Icon name="cart" color="#fff" size={24} /></IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Estimated total</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 28, color: C.green, fontWeight: 300, marginTop: 2 }}>~€42</div>
          </div>
          <div style={{ fontSize: 11, color: C.green, opacity: 0.7, fontStyle: 'italic' }}>15 items</div>
        </div>
      </div>
      <div style={S.pad}>
        {GROUPS.map(({ g, tone, icon, items }) => (
          <div key={g} style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <IconChip tone={tone} size={28}><Icon name={icon} color={tone === 'green' ? C.green : C.apricotDk} size={14} /></IconChip>
              <div style={S.eyebrow}>{g}</div>
            </div>
            <div style={{ ...S.pillow, padding: 0 }}>
              {items.map(([name, qty], i) => (
                <div key={name} style={{ padding: '14px 18px', borderBottom: i < items.length - 1 ? `1px solid ${C.hair}` : 0, fontSize: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${C.hair}`, background: C.creamHi }} />
                  <span style={{ flex: 1, color: C.ink }}>{name}</span>
                  <span style={{ color: C.dim, fontSize: 12 }}>{qty}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Order via Glovo</button>
      </div>
    </div>
  );
}
