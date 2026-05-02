// Weekly weigh-in & AI adjustment screen
function WeighInScreen() {
  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }}>
        <div style={{ padding: '62px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, color: T.cyan, fontWeight: 700, letterSpacing: 0.4 }}>SUNDAY · WEEK 4</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, marginTop: 4 }}>Time to weigh in</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bgElev, border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d="M18 6L6 18M6 6l12 12" size={16}/>
          </div>
        </div>

        {/* Big input */}
        <div style={{ padding: '28px 22px 0' }}>
          <div style={{
            background: T.bgElev, borderRadius: 28, padding: '32px 22px',
            border: `1px solid ${T.hairline}`, position: 'relative', overflow: 'hidden',
            textAlign: 'center',
          }}>
            <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 280, height: 200, background: T.gradSoft, borderRadius: '50%', filter: 'blur(50px)' }}/>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: T.textDim, position: 'relative' }}>YOUR WEIGHT TODAY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginTop: 14, position: 'relative' }}>
              <div className="num grad-text" style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>81.6</div>
              <div style={{ fontSize: 22, color: T.textDim, fontWeight: 500 }}>kg</div>
            </div>

            {/* Tick ruler */}
            <div style={{ position: 'relative', marginTop: 20, height: 50 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 16, display: 'flex', justifyContent: 'space-between' }}>
                {Array.from({ length: 21 }).map((_, i) => {
                  const mid = i === 10;
                  const major = i % 5 === 0;
                  return <div key={i} style={{
                    width: mid ? 2 : 1,
                    height: mid ? 26 : (major ? 18 : 10),
                    background: mid ? '#22D3EE' : (major ? T.textDim : T.textMute),
                    opacity: mid ? 1 : (major ? 0.7 : 0.4),
                  }}/>;
                })}
              </div>
              <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)' }}>
                <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 10L0 0h14z" fill="#22D3EE"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Δ from last week */}
        <div style={{ padding: '14px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <DeltaCard label="vs last week" value="−0.7" unit="kg" color={T.green} subtitle="On pace 🎯"/>
          <DeltaCard label="total lost" value="−3.4" unit="kg" color={T.violet} subtitle="of 17 kg"/>
        </div>

        {/* Lumi feedback */}
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{
            background: T.bgElev, borderRadius: 24, padding: 18,
            border: `1px solid ${T.hairline}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: T.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#0B1020"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/></svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: T.textDim }}>LUMI'S READ</div>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: T.text }}>
              You're <span style={{ color: T.green, fontWeight: 700 }}>0.05 kg ahead</span> of plan. Energy and protein were on point this week — let's keep the same intake but bump strength training to <span style={{ color: T.cyan, fontWeight: 700 }}>3×/week</span> to protect lean mass.
            </div>

            {/* Adjustment row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <Adj icon="↑" label="Strength" delta="2 → 3 / wk" color={T.cyan}/>
              <Adj icon="=" label="Calories" delta="1,820 kcal" color={T.textDim}/>
              <Adj icon="↑" label="Protein" delta="142 → 150g" color={T.violet}/>
            </div>
          </div>
        </div>

        {/* History strip */}
        <Section title="LAST 6 WEIGH-INS" style={{ marginTop: 22 }}>
          <div style={{ padding: '0 22px' }}>
            <div style={{ background: T.bgElev, borderRadius: 22, padding: 18, border: `1px solid ${T.hairline}` }}>
              <svg viewBox="0 0 280 100" width="100%" height="100">
                <defs>
                  <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="wstroke" x1="0" x2="1"><stop offset="0%" stopColor="#7B61FF"/><stop offset="100%" stopColor="#22D3EE"/></linearGradient>
                </defs>
                <path d="M0 10 L 56 22 L 112 30 L 168 40 L 224 52 L 280 60 L 280 100 L 0 100 Z" fill="url(#wfill)"/>
                <path d="M0 10 L 56 22 L 112 30 L 168 40 L 224 52 L 280 60" stroke="url(#wstroke)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {[10, 22, 30, 40, 52, 60].map((y, i) => (
                  <circle key={i} cx={i * 56} cy={y} r={i === 5 ? 5 : 3} fill="#0B1020" stroke="#22D3EE" strokeWidth="2"/>
                ))}
              </svg>
              <div className="num" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: T.textMute }}>
                <span>85.0</span><span>83.6</span><span>82.9</span><span>82.3</span><span>82.1</span><span style={{ color: T.cyan, fontWeight: 700 }}>81.6</span>
              </div>
            </div>
          </div>
        </Section>

        <div style={{ padding: '20px 22px 0' }}>
          <button style={{
            width: '100%', background: T.grad, color: '#0B1020', fontWeight: 700,
            borderRadius: 999, border: 'none', padding: '17px', fontSize: 16,
            letterSpacing: -0.2, fontFamily: T.font, boxShadow: '0 12px 36px rgba(123,97,255,0.45)',
          }}>
            Apply this week's plan
          </button>
        </div>
      </div>

      <TabBar active="stats"/>
    </div>
  );
}

function DeltaCard({ label, value, unit, color, subtitle }) {
  return (
    <div style={{ background: T.bgElev, borderRadius: 18, padding: 14, border: `1px solid ${T.hairline}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: 0.3 }}>{label.toUpperCase()}</div>
      <div className="num" style={{ fontSize: 24, fontWeight: 700, color, marginTop: 4, letterSpacing: -0.4 }}>
        {value}<span style={{ fontSize: 13, color: T.textDim, fontWeight: 500, marginLeft: 4 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{subtitle}</div>
    </div>
  );
}

function Adj({ icon, label, delta, color }) {
  return (
    <div style={{
      flex: '1 1 auto', minWidth: 90,
      background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px',
      border: `1px solid ${T.hairline}`,
    }}>
      <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color }}>{icon}</span> <span>{delta}</span>
      </div>
    </div>
  );
}

window.WeighInScreen = WeighInScreen;
