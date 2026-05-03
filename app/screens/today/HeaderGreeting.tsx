'use client';

import Mascot from '@/app/components/Mascot';
import { Blob, S, Em } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';

export function HeaderGreeting() {
  return (
    <div style={{ padding: '22px 22px 14px', position: 'relative' }}>
      <Blob color={C.apricotMd} size={180} top={-30} right={-30} opacity={0.12} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative', zIndex: 1 }}>
        <div style={{ marginTop: -16, marginLeft: -10, flexShrink: 0 }}>
          <Mascot mood="happy" size={92} trackCursor />
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
          <div style={S.eyebrow}>Tuesday · Apr 28</div>
          <h1 style={{ ...S.h1, fontSize: 30, marginTop: 6 }}>Morning, <Em>Marco</Em></h1>
          <div style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: '"Fraunces",serif', marginTop: 8, lineHeight: 1.4 }}>
            &ldquo;Today is a chicken-and-<br />quinoa kind of day.&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
}
