// Home / Today dashboard — central hub for the day
function HomeScreen() {
  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '60px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: T.textDim, fontWeight: 600 }}>Tuesday, Nov 25</div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>Hey, Marco 👋</div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: T.bgElev, border: `1px solid ${T.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.text }}>
              <Icon d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0" size={20} sw={1.7}/>
            </div>
            <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: T.cyan, borderRadius: 999, border: `2px solid ${T.bg}` }}/>
          </div>
        </div>

        {/* Hero — today's energy ring */}
        <div style={{ padding: '22px 22px 0' }}>
          <div style={{
            background: T.bgElev, borderRadius: 28, padding: 22,
            border: `1px solid ${T.hairline}`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, background: T.gradSoft, borderRadius: '50%', filter: 'blur(50px)' }}/>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
              <GradRing size={120} stroke={11} value={0.62}>
                <div className="num" style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>1,128</div>
                <div style={{ fontSize: 10.5, color: T.textDim, fontWeight: 600, letterSpacing: 0.4, marginTop: -2 }}>OF 1,820 KCAL</div>
              </GradRing>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Stat icon="M12 2c1.5 4 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-1 .5-2 1-3 0 2 2 2 2 0 0-2.5 0-4 1.5-6.5z" color={T.amber} label="Burned today" value="285" unit="kcal" target="of 420"/>
                <Stat icon="M5 12h14M5 6h14M5 18h10" color={T.cyan} label="Logged meals" value="2" unit="of 4"/>
                <Stat icon="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" color={T.green} label="Streak" value="12" unit="days"/>
              </div>
            </div>
          </div>
        </div>

        {/* Lumi nudge */}
        <div style={{ padding: '14px 22px 0' }}>
          <div style={{
            background: T.gradSoft, borderRadius: 20, padding: 14,
            border: `1px solid ${T.hairlineStrong}`, display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 11, background: T.grad, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(123,97,255,0.35)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0B1020"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.cyan, letterSpacing: 0.8 }}>LUMI · 2 min ago</div>
              <div style={{ fontSize: 14, color: T.text, lineHeight: 1.45, marginTop: 2 }}>
                You crushed yesterday 🔥 Drink water now — you're 600 ml behind. A short walk after lunch keeps the glucose curve flat.
              </div>
            </div>
          </div>
        </div>

        {/* Up next — meal */}
        <Section title="UP NEXT" style={{ marginTop: 22 }} action={
          <div style={{ fontSize: 12, fontWeight: 600, color: T.cyan }}>See plan →</div>
        }>
          <div style={{ padding: '0 22px' }}>
            <div style={{ background: T.bgElev, borderRadius: 22, padding: 16, border: `1px solid ${T.hairline}`,
              display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16,
                background: 'linear-gradient(135deg, #FFB547, #F472B6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                <span style={{ filter: 'grayscale(0)' }}>🥗</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: T.textDim }}>LUNCH · 13:00</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>Mediterranean chicken bowl</div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 3 }}>520 kcal · 42g protein · 18 min prep</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, color: '#0B1020',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d="M5 12l5 5L20 7" size={18} sw={2.6}/>
              </div>
            </div>
          </div>
        </Section>

        {/* Macros bar */}
        <Section title="MACROS LEFT TODAY">
          <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { l: 'Protein', v: 88, t: 142, c: T.violet, u: 'g' },
              { l: 'Carbs',   v: 124, t: 195, c: T.cyan, u: 'g' },
              { l: 'Fat',     v: 38,  t: 65,  c: T.pink, u: 'g' },
            ].map(m => (
              <div key={m.l} style={{ background: T.bgElev, borderRadius: 18, padding: 14, border: `1px solid ${T.hairline}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim }}>{m.l}</div>
                <div className="num" style={{ fontSize: 20, fontWeight: 700, marginTop: 4, letterSpacing: -0.3 }}>{m.v}<span style={{ fontSize: 11, color: T.textMute, fontWeight: 500 }}>/{m.t}{m.u}</span></div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(m.v/m.t)*100}%`, background: m.c }}/>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Move */}
        <Section title="MOVE">
          <div style={{ padding: '0 22px' }}>
            <div style={{ background: T.bgElev, borderRadius: 22, padding: 18, border: `1px solid ${T.hairline}`,
              display: 'flex', alignItems: 'center', gap: 16 }}>
              <GradRing size={64} stroke={7} value={0.68} gradId="moveg">
                <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>68%</div>
              </GradRing>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>30-min brisk walk</div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>~135 kcal · scheduled 18:30</div>
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.06)',
                fontSize: 12, fontWeight: 600, border: `1px solid ${T.hairlineStrong}` }}>Start</div>
            </div>
          </div>
        </Section>
      </div>

      <TabBar active="home"/>
    </div>
  );
}

function Stat({ icon, color, label, value, unit, target }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        <Icon d={icon} size={15} sw={2}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600 }}>{label}</div>
        <div className="num" style={{ fontSize: 14, fontWeight: 700 }}>
          {value} <span style={{ fontSize: 10.5, color: T.textDim, fontWeight: 500 }}>{unit}{target ? ` ${target}` : ''}</span>
        </div>
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
