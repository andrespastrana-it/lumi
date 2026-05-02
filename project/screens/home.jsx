// 02 · Today / Home
function Home({ density = 'comfy' }) {
  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', padding: '58px 0 100px' }}>
        <div style={{ padding: '8px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600 }}>Tuesday, Apr 28</div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5, marginTop: 2 }}>Morning, Marco</div>
          </div>
          <Avatar size={38}>M</Avatar>
        </div>

        {/* Hero */}
        <div style={{ padding: '0 24px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Ring size={108} stroke={6} value={0.62}>
              <div className="num" style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1 }}>1,108</div>
              <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>of 1,780 kcal</div>
            </Ring>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600 }}>Journey</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <span className="num" style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>−2.6</span>
                <span style={{ color: T.textDim, fontSize: 14 }}>kg</span>
              </div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>of 17 kg · on track</div>
              <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.06)' }}>
                <div style={{ width: '15%', height: '100%', background: T.text, borderRadius: 2 }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div style={{ padding: '0 16px 16px' }}>
          <Card>
            <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14 }}>MACROS</div>
            <div style={{ display: 'flex', gap: 18 }}>
              {[
                { l: 'Protein', cur: 78, max: 130 },
                { l: 'Carbs',   cur: 96, max: 180 },
                { l: 'Fat',     cur: 38, max: 60 },
              ].map(m => (
                <div key={m.l} style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: T.textDim }}>{m.l}</div>
                  <div className="num" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{m.cur}<span style={{ color: T.textMute, fontWeight: 400 }}>/{m.max}g</span></div>
                  <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: 'rgba(0,0,0,0.06)' }}>
                    <div style={{ width: `${m.cur/m.max*100}%`, height: '100%', background: T.text, borderRadius: 2 }}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Eat / Burn */}
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>EAT</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>1,108 <span style={{ fontSize: 11, color: T.textMute, fontWeight: 400 }}>/ 1,780</span></div>
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>672 kcal left</div>
          </Card>
          <Card style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>BURN</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>342 <span style={{ fontSize: 11, color: T.textMute, fontWeight: 400 }}>/ 480</span></div>
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>138 kcal to go</div>
          </Card>
        </div>

        {/* Lumi nudge */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ padding: 14, borderRadius: 14, background: T.bgInset, display: 'flex', gap: 12 }}>
            <Avatar size={28}>L</Avatar>
            <div style={{ fontSize: 13, lineHeight: 1.5, flex: 1 }}>
              Yesterday you closed at <b>−180 kcal</b> under target. Protein lunch coming up — keep it going.
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>Up next</div>
          <div style={{ fontSize: 13, color: T.textDim }}>See plan</div>
        </div>
        <div style={{ padding: '0 16px 12px' }}>
          <Card padded={false} style={{ display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: 80, background: T.bgInset, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🍗</div>
            <div style={{ flex: 1, padding: 14 }}>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>LUNCH · 13:00</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Chicken & quinoa bowl</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>520 kcal · 42P · 48C · 14F</div>
            </div>
          </Card>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card padded={false} style={{ display: 'flex', overflow: 'hidden', alignItems: 'center', padding: '14px' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: T.bgInset, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏃</div>
            <div style={{ flex: 1, paddingLeft: 14 }}>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>WORKOUT · 18:30</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Zone 2 run · 35 min</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Burns ~280 kcal</div>
            </div>
            <Icon d="M9 6l6 6-6 6" size={18} sw={1.6}/>
          </Card>
        </div>

        <div style={{ padding: '0 16px' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 22 }}>🔥</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>14-day streak</div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>Sunday is weigh-in</div>
            </div>
          </Card>
        </div>
      </div>
      <TabBar active="home"/>
    </Phone>
  );
}
window.Home = Home;
