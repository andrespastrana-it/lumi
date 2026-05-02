// 04 · Tracker
function Tracker({ density = 'comfy' }) {
  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', padding: '58px 0 100px' }}>
        <div style={{ padding: '8px 24px 18px' }}>
          <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600 }}>Tue, Apr 28</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5, marginTop: 2 }}>Log</div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card>
            <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3, marginBottom: 12 }}>QUICK LOG · SAY OR TYPE</div>
            <div style={{ padding: '14px 16px', borderRadius: 12, background: T.bgInset, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, fontSize: 14, color: T.textDim, fontStyle: 'italic' }}>"two scrambled eggs and a coffee"</div>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: T.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4" size={14}/>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: 12, borderRadius: 12, border: `1px solid ${T.hairline}` }}>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, marginBottom: 8 }}>LUMI HEARS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                <Chip>2× scrambled egg · 156 kcal</Chip>
                <Chip>Black coffee · 2 kcal</Chip>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, background: 'transparent', border: `1px solid ${T.hairline}`, color: T.text, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: T.font }}>Edit</button>
                <button style={{ flex: 1, background: T.text, border: 'none', color: '#fff', padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: T.font }}>Add</button>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>TODAY'S BALANCE</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.green }}>−438 kcal deficit</span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Ring size={76} stroke={5} value={0.62}>
                <div className="num" style={{ fontSize: 15, fontWeight: 600 }}>1,108</div>
                <div style={{ fontSize: 9, color: T.textMute }}>EATEN</div>
              </Ring>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { l: 'Target', v: '1,780' },
                  { l: 'Burned', v: '342' },
                  { l: 'Net',    v: '766', bold: true },
                ].map(r => (
                  <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: T.textDim }}>{r.l}</span>
                    <span className="num" style={{ fontWeight: r.bold ? 700 : 500 }}>{r.v} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div style={{ padding: '0 24px 8px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Logged</div>
          <div style={{ fontSize: 12, color: T.textDim }}>5 items</div>
        </div>
        <div style={{ padding: '0 16px' }}>
          <Card padded={false}>
            {[
              { icon: '🥣', t: 'Greek yogurt parfait', sub: '07:32 · breakfast', kcal: 340 },
              { icon: '🍎', t: 'Apple + almond butter', sub: '10:31 · snack', kcal: 180 },
              { icon: '🚶', t: 'Morning walk', sub: '08:10 · 28 min', kcal: -125 },
              { icon: '🥤', t: 'Black coffee × 2', sub: '09:00, 14:20', kcal: 4 },
              { icon: '☕', t: 'Latte (oat)', sub: '11:00 · voice', kcal: 140 },
            ].map((it, i, a) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderBottom: i < a.length - 1 ? `1px solid ${T.hairline}` : 'none',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: T.bgInset, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{it.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{it.t}</div>
                  <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>{it.sub}</div>
                </div>
                <div className="num" style={{ fontSize: 13, fontWeight: 600, color: it.kcal < 0 ? T.amber : T.text }}>
                  {it.kcal < 0 ? `${it.kcal}` : `+${it.kcal}`}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <TabBar active="stats"/>
    </Phone>
  );
}
window.Tracker = Tracker;
