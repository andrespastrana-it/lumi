'use client';

import { Header, IconChip, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';

export default function LogChoose({ go }: { go: (r: string) => void }) {
  const modes = [
    { k: 'logVoice',   l: 'Voice',   d: '"Two eggs and a coffee"', icon: 'mic',     tone: 'apricotSolid' as const },
    { k: 'logPhoto',   l: 'Photo',   d: 'Snap your plate',          icon: 'camera',  tone: 'greenSolid' as const },
    { k: 'logBarcode', l: 'Barcode', d: 'Scan packaging',           icon: 'barcode', tone: 'butter' as const },
    { k: 'logSearch',  l: 'Search',  d: 'Type-ahead, 250k foods',   icon: 'search',  tone: 'apricot' as const },
  ];
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Log a meal</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How will<br />you <Em>log</Em>?</h1>
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {modes.map(m => {
            const solid = m.tone === 'apricotSolid' || m.tone === 'greenSolid';
            return (
              <div key={m.k} onClick={() => go(m.k)} style={{ ...S.pillow, padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, minHeight: 140 }}>
                <IconChip tone={m.tone} size={48}><Icon name={m.icon} color={solid ? '#fff' : C.apricotDk} size={24} /></IconChip>
                <div>
                  <div style={{ fontFamily: '"Fraunces",serif', fontSize: 20, color: C.ink, fontWeight: 400 }}>{m.l}</div>
                  <div style={{ fontSize: 11, color: C.dim, marginTop: 4, lineHeight: 1.3 }}>{m.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
