'use client';

import Mascot from '@/app/components/Mascot';
import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function Plateau({ go }: { go: (r: string) => void }) {
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
