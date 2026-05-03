// 07 · Chat
function Chat({ density = 'comfy' }) {
  const Bubble = ({ from, children, suggestions, kind }) => (
    <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'flex-end',
      flexDirection: from === 'me' ? 'row-reverse' : 'row' }}>
      {from === 'lumi' && <Avatar size={26}>L</Avatar>}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: kind === 'card' ? 0 : '11px 14px',
          borderRadius: 16,
          borderBottomLeftRadius: from === 'lumi' ? 4 : 16,
          borderBottomRightRadius: from === 'me' ? 4 : 16,
          background: from === 'me' ? T.text : T.bgInset,
          color: from === 'me' ? '#fff' : T.text,
          fontSize: 14, lineHeight: 1.45,
          overflow: 'hidden',
        }}>{children}</div>
        {suggestions && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {suggestions.map((s,i) => (
              <div key={i} style={{ padding: '7px 12px', borderRadius: 999,
                background: '#fff', border: `1px solid ${T.hairlineStrong}`,
                fontSize: 12, fontWeight: 500, color: T.text }}>{s}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Phone>
      <div style={{ padding: '58px 0 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${T.hairline}` }}>
          <Avatar size={38}>L</Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Lumi</div>
            <div style={{ fontSize: 11, color: T.textDim }}>Your AI coach · online</div>
          </div>
          <Icon d="M12 5v14M5 12h14" size={18}/>
        </div>

        <div className="hide-sb" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
          <div style={{ textAlign: 'center', fontSize: 11, color: T.textMute, marginBottom: 12 }}>TODAY · 14:22</div>

          <Bubble from="lumi">
            Hey 👋 You're 62% through your calorie budget and lunch is in 38 min. Want me to swap dinner to something lighter so you can grab tapas with friends tonight?
          </Bubble>

          <Bubble from="me">Yes! Going out at 8.</Bubble>

          <Bubble from="lumi" kind="card">
            <div style={{ padding: '12px 14px 6px' }}>Locked in. Here's the swap:</div>
            <div style={{ margin: '0 14px 14px', padding: 12, borderRadius: 10, background: '#fff' }}>
              <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>DINNER · 19:30 → TAPAS</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Tapas budget: 580 kcal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 12, color: T.textDim }}>
                <div>· 2× pintxos · padrón peppers (share)</div>
                <div>· 1 glass red wine</div>
                <div>· Grilled octopus over patatas</div>
              </div>
            </div>
          </Bubble>

          <Bubble from="lumi" suggestions={['What about a beer?', '+30-min walk', 'Show full plan']}>
            Stick to that and you'll still hit a <b>−420 kcal deficit</b> today.
          </Bubble>

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 14 }}>
            <Avatar size={26}>L</Avatar>
            <div style={{ padding: '11px 14px', borderRadius: 16, borderBottomLeftRadius: 4,
              background: T.bgInset, display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: T.textMute,
                  animation: `lumi-pulse 1.4s ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px 92px', borderTop: `1px solid ${T.hairline}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 8px 8px 16px', borderRadius: 22, background: T.bgInset }}>
            <div style={{ flex: 1, fontSize: 14, color: T.textMute }}>Ask Lumi anything…</div>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2" size={14}/>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: T.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d="M22 2L11 13M22 2l-7 20-4-9-9-4z" size={14} sw={2}/>
            </div>
          </div>
        </div>
      </div>
      <TabBar active="chat"/>
    </Phone>
  );
}
window.Chat = Chat;
