// 03 · Daily meal plan
function Plan({ density = 'comfy' }) {
  const meals = [
    { time: '07:30', kind: 'BREAKFAST', name: 'Greek yogurt parfait', kcal: 340, p: 28, c: 38, f: 9, emoji: '🥣', portion: '200g yogurt · 40g granola · 1 banana', done: true },
    { time: '10:30', kind: 'SNACK',     name: 'Apple + almond butter', kcal: 180, p: 5, c: 22, f: 9, emoji: '🍎', portion: '1 apple · 15g almond butter', done: true },
    { time: '13:00', kind: 'LUNCH',     name: 'Chicken & quinoa bowl', kcal: 520, p: 42, c: 48, f: 14, emoji: '🍗', portion: '150g chicken · 80g quinoa · greens', done: false, next: true },
    { time: '16:00', kind: 'SNACK',     name: 'Protein shake', kcal: 160, p: 25, c: 8, f: 3, emoji: '🥤', portion: '1 scoop · 250ml almond milk', done: false },
    { time: '19:30', kind: 'DINNER',    name: 'Salmon, sweet potato, asparagus', kcal: 580, p: 38, c: 52, f: 22, emoji: '🐟', portion: '160g salmon · 200g sweet potato', done: false },
  ];
  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', padding: '58px 0 100px' }}>
        <div style={{ padding: '8px 24px 18px' }}>
          <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600 }}>Today's plan</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5, marginTop: 2 }}>5 meals · 1,780 kcal</div>
        </div>

        <div className="hide-sb" style={{ display: 'flex', gap: 8, padding: '0 16px 18px', overflowX: 'auto' }}>
          {[
            { d: 'Sun', n: 26 }, { d: 'Mon', n: 27 }, { d: 'Tue', n: 28, on: true },
            { d: 'Wed', n: 29 }, { d: 'Thu', n: 30 }, { d: 'Fri', n: 1 }, { d: 'Sat', n: 2 },
          ].map((d,i) => (
            <div key={i} style={{
              flex: '0 0 auto', minWidth: 48, padding: '10px 4px', borderRadius: 12,
              background: d.on ? T.text : 'transparent',
              border: `1px solid ${d.on ? T.text : T.hairline}`,
              textAlign: 'center', color: d.on ? '#fff' : T.text,
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: d.on ? 'rgba(255,255,255,0.6)' : T.textMute }}>{d.d.toUpperCase()}</div>
              <div className="num" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{d.n}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          {meals.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 22, paddingTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {m.done ? (
                  <div style={{ width: 18, height: 18, borderRadius: 9, background: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon d="M5 12l4 4L19 7" size={10} sw={3}/>
                  </div>
                ) : m.next ? (
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${T.text}`, background: '#fff', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -3, borderRadius: 12, border: `1px solid ${T.text}`, animation: 'lumi-pulse 1.6s infinite' }}/>
                  </div>
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${T.hairlineStrong}` }}/>
                )}
                {i < meals.length - 1 && <div style={{ flex: 1, width: 1, background: T.hairline, marginTop: 4, minHeight: 60 }}/>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: m.next ? T.text : T.textMute, fontWeight: 600, letterSpacing: 0.3, marginBottom: 6 }}>
                  {m.time} · {m.kind}{m.next ? ' · NEXT' : ''}
                </div>
                <Card padded={false} style={{
                  display: 'flex', overflow: 'hidden',
                  borderColor: m.next ? T.text : T.hairline,
                  borderWidth: m.next ? 1.5 : 1,
                  opacity: m.done ? 0.55 : 1,
                }}>
                  <div style={{ width: 56, background: T.bgInset, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{m.emoji}</div>
                  <div style={{ flex: 1, padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, textDecoration: m.done ? 'line-through' : 'none' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{m.portion}</div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: T.textMute }}>
                      <span className="num" style={{ color: T.text, fontWeight: 600 }}>{m.kcal} kcal</span>
                      <span className="num">{m.p}P</span><span className="num">{m.c}C</span><span className="num">{m.f}F</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="plan"/>
    </Phone>
  );
}
window.Plan = Plan;
