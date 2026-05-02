// AI chat coach — Lumi conversation
function ChatScreen() {
  const messages = [
    { who: 'lumi', t: '9:02 AM', text: 'Morning, Marco ☀️ Ready to crush week 4? You\'re 0.7 kg ahead of pace.' },
    { who: 'me', t: '9:03 AM', text: 'Going out for dinner tonight — Italian. What should I order?' },
    { who: 'lumi', t: '9:03 AM', text: 'Got you 🍝 Stick to grilled fish or chicken, skip the bread basket, share a pasta instead of solo. I\'ll save you ~600 kcal in dinner budget.', chips: ['See suggestions', 'Adjust today'] },
    { who: 'me', t: '9:05 AM', text: 'Also feeling sore from yesterday' },
    { who: 'lumi', t: '9:05 AM', text: 'That\'s the squats talking 💪 I\'m swapping today\'s strength for a 25-min mobility flow + walk. Recovery counts.', card: 'workout' },
  ];

  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 56, paddingBottom: 12, zIndex: 20,
        background: 'linear-gradient(180deg, rgba(11,16,32,0.95) 60%, rgba(11,16,32,0))',
      }}>
        <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: T.grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 22px rgba(123,97,255,0.45)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0B1020"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/></svg>
            </div>
            <div style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, background: T.green, borderRadius: 999, border: `2px solid ${T.bg}` }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.2 }}>Lumi</div>
            <div style={{ fontSize: 11, color: T.cyan, fontWeight: 600 }}>● Your AI coach · always on</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: T.bgElev, border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d="M12 5v.01M12 12v.01M12 19v.01" size={18} sw={2.5}/>
          </div>
        </div>
      </div>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, paddingTop: 110, paddingBottom: 180, overflowY: 'auto' }}>
        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ textAlign: 'center', fontSize: 11, color: T.textMute, fontWeight: 600 }}>TODAY</div>

          {messages.map((m, i) => m.who === 'me' ? (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '78%' }}>
              <div style={{
                background: T.grad, color: '#0B1020',
                borderRadius: '20px 20px 4px 20px',
                padding: '11px 14px', fontSize: 14, fontWeight: 500, lineHeight: 1.4,
                boxShadow: '0 8px 20px rgba(123,97,255,0.25)',
              }}>{m.text}</div>
              <div style={{ fontSize: 10, color: T.textMute, marginTop: 4, textAlign: 'right' }}>{m.t}</div>
            </div>
          ) : (
            <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
              <div style={{
                background: T.bgElev,
                borderRadius: '20px 20px 20px 4px',
                padding: '12px 14px', fontSize: 14, lineHeight: 1.45,
                border: `1px solid ${T.hairline}`,
              }}>{m.text}</div>
              {m.chips && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {m.chips.map(c => (
                    <div key={c} style={{
                      padding: '7px 12px', borderRadius: 999,
                      background: T.gradSoft, border: `1px solid ${T.hairlineStrong}`,
                      fontSize: 12, fontWeight: 600, color: T.text,
                    }}>{c}</div>
                  ))}
                </div>
              )}
              {m.card === 'workout' && (
                <div style={{
                  marginTop: 8, background: T.bgElev, borderRadius: 18,
                  border: `1px solid ${T.hairline}`, overflow: 'hidden',
                }}>
                  <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12,
                      background: 'linear-gradient(135deg,#22D3EE,#7B61FF)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B1020' }}>
                      <Icon d="M14 2l-3 9h6l-3 9" size={18} sw={2.4}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.cyan, letterSpacing: 0.4 }}>SWAPPED FOR TODAY</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1 }}>25-min mobility flow</div>
                      <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>+ 15-min outdoor walk · ~120 kcal</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', borderTop: `1px solid ${T.hairline}` }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: 12, fontWeight: 700, color: T.text, borderRight: `1px solid ${T.hairline}` }}>Apply</div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: 12, fontWeight: 600, color: T.textDim }}>Show me</div>
                  </div>
                </div>
              )}
              <div style={{ fontSize: 10, color: T.textMute, marginTop: 4 }}>{m.t}</div>
            </div>
          ))}

          {/* Typing indicator */}
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 14px', background: T.bgElev, borderRadius: 18,
            border: `1px solid ${T.hairline}` }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: T.cyan,
                opacity: 0.5 + i * 0.2 }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 100, zIndex: 25 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto' }} className="hide-scroll">
          {['Plan tomorrow', 'I cheated 🙃', 'I\'m hungry', 'Late dinner'].map(s => (
            <div key={s} style={{
              flexShrink: 0, padding: '7px 12px', borderRadius: 999,
              background: T.bgElev, border: `1px solid ${T.hairline}`,
              fontSize: 12, fontWeight: 600, color: T.textDim,
            }}>{s}</div>
          ))}
        </div>
        <div style={{
          background: 'rgba(18, 26, 51, 0.86)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderRadius: 24, padding: '8px 8px 8px 16px',
          border: `1px solid ${T.hairlineStrong}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M3 7h18M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" size={18} color={T.textMute}/>
          <input style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: T.text, fontSize: 14, fontFamily: T.font, padding: '10px 0',
          }} placeholder="Ask Lumi anything…"/>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: T.grad, color: '#0B1020',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(123,97,255,0.4)' }}>
            <Icon d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3" size={17} sw={2.2}/>
          </div>
        </div>
      </div>

      <TabBar active="chat"/>
    </div>
  );
}

window.ChatScreen = ChatScreen;
