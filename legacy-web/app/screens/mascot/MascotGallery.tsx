'use client';

import Mascot from '@/app/components/Mascot';
import type { MoodType } from '@/app/components/Mascot';
import { Header, S, Em } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';

const MOODS: { m: MoodType; l: string; d: string }[] = [
  { m: 'happy',     l: 'Happy',     d: 'Default greeting' },
  { m: 'celebrate', l: 'Celebrate', d: 'Milestones, streak wins' },
  { m: 'proud',     l: 'Proud',     d: 'Plan reveal, recap' },
  { m: 'thinking',  l: 'Thinking',  d: 'AI computing' },
  { m: 'cheering',  l: 'Cheering',  d: 'You hit your goal' },
  { m: 'curious',   l: 'Curious',   d: 'Plateau, open question' },
  { m: 'oops',      l: 'Oops',      d: 'Bad day, recovery' },
  { m: 'sad',       l: 'Sad',       d: 'Missed weigh-in' },
  { m: 'sleepy',    l: 'Sleepy',    d: 'Late night nudge' },
  { m: 'love',      l: 'Love',      d: 'Share with friends' },
  { m: 'typing',    l: 'Typing',    d: 'Coach replying' },
  { m: 'wave',      l: 'Wave',      d: 'Hello / goodbye' },
];

export default function MascotGallery({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, paddingBottom: 60 }}>
      <Header back="today" go={go}>Pip · your coach</Header>
      <div style={{ padding: '4px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Mascot mood="wave" size={100} trackCursor />
          <div style={{ flex: 1 }}>
            <h1 style={{ ...S.h1, fontSize: 30, margin: 0 }}>Hi, I&apos;m <Em>Pip</Em></h1>
            <p style={{ ...S.body, margin: '6px 0 0', fontSize: 13 }}>A little peach with a big plan.</p>
          </div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 22, marginBottom: 10 }}>Twelve moods</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {MOODS.map(o => (
            <div key={o.m} style={{ ...S.pillowSm, padding: 14, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', height: 110, alignItems: 'flex-end' }}>
                <Mascot mood={o.m} size={84} />
              </div>
              <div style={{ fontFamily: '"Fraunces",serif', fontSize: 15, color: C.ink, marginTop: 8, fontWeight: 400 }}>{o.l}</div>
              <div style={{ fontSize: 10.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{o.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
