'use client';

import { Header, IconChip, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

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

export default function LogSearch({ go }: { go: (r: string) => void }) {
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
