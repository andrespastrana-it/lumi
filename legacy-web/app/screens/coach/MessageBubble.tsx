'use client';

import Mascot from '@/app/components/Mascot';
import { Icon } from '@/app/lib/icons';
import { C, BTN_SHADOW, PILLOW_SHADOW_SM } from '@/app/lib/tokens';

export interface Msg { from: 'lumi' | 'me'; text: string; action?: { label: string; go: string } }

export default function MessageBubble({ m, showMascot, go }: { m: Msg; showMascot: boolean; go: (r: string) => void }) {
  return (
    <div style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: '85%' }}>
      {m.from === 'lumi' && showMascot && <div style={{ marginBottom: -2 }}><Mascot mood="happy" size={32} animate={false} /></div>}
      <div style={{ padding: '12px 16px', background: m.from === 'me' ? C.ink : C.apricotLt, color: m.from === 'me' ? C.paper : C.ink, fontSize: 14, lineHeight: 1.5, borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', boxShadow: PILLOW_SHADOW_SM }}>
        {m.text}
        {m.action && (
          <button onClick={() => go(m.action!.go)} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, background: C.apricot, color: C.paper, border: 0, padding: '8px 14px', borderRadius: 999, fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: BTN_SHADOW }}>
            <Icon name="check" color="#fff" size={12} />
            {m.action.label}
          </button>
        )}
      </div>
    </div>
  );
}
