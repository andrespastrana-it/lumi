'use client';

import { useState } from 'react';
import Mascot from '@/app/components/Mascot';
import { Header, IconChip, TabBar, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C, BTN_SHADOW } from '@/app/lib/tokens';
import MessageBubble, { type Msg } from './MessageBubble';

const PROMPTS = [
  { q: 'Can I drink wine tonight?',           icon: 'heart',   a: () => ({ text: "A glass (150ml) is fine — that's ~120 kcal. I'll trim 100 kcal off dinner. Stick to one and water in between." }) },
  { q: 'Swap my lunch for something lighter', icon: 'lunch',   a: () => ({ text: 'How about a salmon poke bowl? 480 kcal, P 32 · C 50 · F 14. Tap to swap.', action: { label: 'Apply swap', go: 'plan' } }) },
  { q: 'Tapas with friends tonight, what do I order?', icon: 'sparkle', a: () => ({ text: "Get: pulpo a la gallega, gambas al ajillo, ensalada mixta. Skip: patatas bravas, chorizo. You'll land at ~620 kcal." }) },
];

export default function Coach({ go }: { go: (r: string) => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'lumi', text: "Hey Marco — what's on your mind?" }]);

  const send = (text: string, replyFn: () => { text: string; action?: { label: string; go: string } }) => {
    setMsgs(m => [...m, { from: 'me', text }]);
    setTimeout(() => {
      const reply = replyFn();
      setMsgs(m => [...m, { from: 'lumi', text: reply.text, action: reply.action }]);
    }, 500);
  };

  return (
    <div style={{ ...S.page, paddingBottom: 180 }}>
      <Header>Coach</Header>
      <div style={{ padding: '4px 22px 14px' }}>
        <div style={{ ...S.pillow, background: C.pillow, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Mascot mood={msgs.length > 1 ? 'happy' : 'wave'} size={64} trackCursor />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 22, color: C.ink, fontWeight: 400 }}>Pip</div>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: C.green, animation: 'pulse 1.4s ease-in-out infinite' }} />
              Listening
            </div>
          </div>
          <IconChip tone="apricot" size={36}><Icon name="sparkle" color={C.apricotDk} size={18} /></IconChip>
        </div>
      </div>

      <div style={{ padding: '4px 22px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => (
          <MessageBubble key={i} m={m} showMascot={i === msgs.length - 1} go={go} />
        ))}
      </div>

      <div style={{ padding: '18px 22px 8px' }}><div style={S.eyebrow}>Try asking</div></div>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PROMPTS.map(p => (
          <button key={p.q} onClick={() => send(p.q, p.a)} style={{ ...S.pillowSm, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', border: 0, width: '100%' }}>
            <IconChip tone="apricot" size={32}><Icon name={p.icon} color={C.apricotDk} size={16} /></IconChip>
            <span style={{ flex: 1, fontSize: 13.5, color: C.ink, fontStyle: 'italic', fontFamily: '"Fraunces", serif' }}>&ldquo;{p.q}&rdquo;</span>
            <Icon name="add" color={C.apricot} size={16} />
          </button>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 76, padding: '12px 22px', background: 'rgba(255,251,241,.92)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${C.hair}`, display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, ...S.pillowSm, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <input placeholder="Ask Pip anything…" style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'inherit' }} />
          <Icon name="mic" color={C.dim} size={18} />
        </div>
        <button onClick={() => go('logChoose')} style={{ background: C.apricot, color: C.paper, border: 0, width: 44, height: 44, borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: BTN_SHADOW }}>
          <Icon name="add" color="#fff" size={18} />
        </button>
      </div>
      <TabBar active="coach" go={go} />
    </div>
  );
}
