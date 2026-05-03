'use client';

import Mascot from '@/app/components/Mascot';
import { IconChip, Blob, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function Milestone({ go }: { go: (r: string) => void }) {
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
