// Progress / weight forecast chart screen
function ForecastScreen() {
  // Synthetic data: actual (4 weeks) + forecast (rest)
  const W = 320, H = 220;
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

  // path coords — actual
  const actual = "M 0 10 L 26 18 L 52 26 L 78 38 L 104 48";
  // forecast envelope (lower/upper bounds)
  const forecast = "M 104 48 Q 180 90, 260 140 L 320 175";
  const upper = "M 104 48 Q 180 80, 260 120 L 320 155";
  const lower = "M 104 48 Q 180 100, 260 158 L 320 195";

  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }}>
        <div style={{ padding: '60px 22px 0' }}>
          <div style={{ fontSize: 13, color: T.textDim, fontWeight: 600 }}>Progress</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, marginTop: 2 }}>Forecast</div>
        </div>

        {/* Range tabs */}
        <div className="hide-scroll" style={{ display: 'flex', gap: 6, padding: '16px 22px 0', overflowX: 'auto' }}>
          {['1W', '1M', '3M', '6M', '1Y', 'All'].map((r, i) => (
            <div key={r} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999,
              background: i === 3 ? T.grad : T.bgElev,
              color: i === 3 ? '#0B1020' : T.textDim,
              fontSize: 12, fontWeight: 700,
              border: i === 3 ? 'none' : `1px solid ${T.hairline}`,
            }}>{r}</div>
          ))}
        </div>

        {/* Chart card */}
        <div style={{ padding: '16px 22px 0' }}>
          <div style={{
            background: T.bgElev, borderRadius: 24, padding: 20,
            border: `1px solid ${T.hairline}`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: T.textDim, fontWeight: 700, letterSpacing: 0.4 }}>PROJECTED · MAY 24</div>
                <div className="num" style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginTop: 4 }}>
                  68.0<span style={{ fontSize: 16, color: T.textDim, fontWeight: 500, marginLeft: 4 }}>kg</span>
                </div>
                <div style={{ fontSize: 12, color: T.green, fontWeight: 600, marginTop: 2 }}>↓ 17.0 kg from start</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: T.textDim, fontWeight: 700, letterSpacing: 0.4 }}>CONFIDENCE</div>
                <div className="num grad-text" style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, marginTop: 4 }}>87%</div>
              </div>
            </div>

            {/* Chart */}
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
              <defs>
                <linearGradient id="actStroke" x1="0" x2="1"><stop offset="0%" stopColor="#fff" stopOpacity="0.95"/><stop offset="100%" stopColor="#7B61FF"/></linearGradient>
                <linearGradient id="fcStroke" x1="0" x2="1"><stop offset="0%" stopColor="#7B61FF"/><stop offset="100%" stopColor="#22D3EE"/></linearGradient>
                <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.05"/>
                </linearGradient>
              </defs>

              {/* gridlines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="0" y1={(H * (i+0.2)) / 5} x2={W} y2={(H * (i+0.2)) / 5}
                      stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4"/>
              ))}

              {/* y-axis labels */}
              {[85, 80, 75, 70, 68].map((v, i) => (
                <text key={v} x={4} y={[10, 60, 110, 160, 200][i]} fill={v === 68 ? '#22D3EE' : '#5E6685'}
                      fontSize="9.5" fontFamily={T.font} fontWeight={v === 68 ? 700 : 500}>{v}</text>
              ))}

              {/* goal line */}
              <line x1="0" y1="200" x2={W} y2="200" stroke="#22D3EE" strokeDasharray="4 4" strokeWidth="1.2"/>
              <rect x="270" y="188" width="46" height="16" rx="8" fill="rgba(34,211,238,0.18)" stroke="#22D3EE" strokeWidth="1"/>
              <text x="280" y="199" fill="#22D3EE" fontSize="9.5" fontWeight="700" fontFamily={T.font}>68 kg</text>

              {/* forecast band (upper/lower) */}
              <path d={`${upper} L 320 195 L 260 158 Q 180 100, 104 48 Z`} fill="url(#bandFill)"/>

              {/* actual */}
              <path d={actual} stroke="url(#actStroke)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

              {/* dots on actual */}
              {[[0,10],[26,18],[52,26],[78,38],[104,48]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r={i === 4 ? 5 : 3} fill="#0B1020" stroke="#7B61FF" strokeWidth="2"/>
              ))}

              {/* forecast (dashed) */}
              <path d={forecast} stroke="url(#fcStroke)" strokeWidth="2.5" fill="none" strokeDasharray="5 5" strokeLinecap="round"/>

              {/* now marker */}
              <line x1="104" y1="0" x2="104" y2={H} stroke="rgba(255,255,255,0.15)" strokeDasharray="2 3"/>
              <circle cx="104" cy="48" r="7" fill="none" stroke="#7B61FF" strokeOpacity="0.4" strokeWidth="2"/>

              {/* x-axis labels */}
              {months.map((m, i) => (
                <text key={m} x={i * (W / 6)} y={H - 4} fill="#5E6685" fontSize="9.5" fontFamily={T.font} fontWeight="500">{m}</text>
              ))}
            </svg>

            {/* legend */}
            <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11, color: T.textDim }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 16, height: 2.5, background: T.violet, borderRadius: 2 }}/> Actual
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 16, height: 2.5, background: T.cyan, borderRadius: 2, opacity: 0.7,
                  backgroundImage: `repeating-linear-gradient(90deg, ${T.cyan} 0 4px, transparent 4px 7px)` }}/> Forecast
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(34,211,238,0.2)' }}/> Range
              </div>
            </div>
          </div>
        </div>

        {/* Insight cards */}
        <Section title="INSIGHTS" style={{ marginTop: 22 }}>
          <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Insight color={T.green}
              icon="M5 12l5 5L20 7"
              title="On track to finish 2 weeks early"
              body="At the current rate (0.85 kg/wk vs. 0.65 plan) you'll hit 68 kg by May 10."/>
            <Insight color={T.amber}
              icon="M12 9v4M12 17h.01M10.3 4.5l-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0z"
              title="Plateau watch · week 6"
              body="Models predict a stall around 78 kg. Lumi will refeed for 3 days when it happens."/>
          </div>
        </Section>

        {/* Body comp split */}
        <Section title="BODY COMPOSITION (EST.)">
          <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <CompCard label="Fat mass" v="22.4" u="kg" delta="−2.9" color={T.amber}/>
            <CompCard label="Lean mass" v="59.2" u="kg" delta="−0.5" color={T.cyan}/>
          </div>
        </Section>
      </div>

      <TabBar active="stats"/>
    </div>
  );
}

function Insight({ color, icon, title, body }) {
  return (
    <div style={{ background: T.bgElev, borderRadius: 18, padding: 14, border: `1px solid ${T.hairline}`,
      display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        <Icon d={icon} size={16} sw={2.2}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color: T.textDim, marginTop: 3, lineHeight: 1.45 }}>{body}</div>
      </div>
    </div>
  );
}

function CompCard({ label, v, u, delta, color }) {
  return (
    <div style={{ background: T.bgElev, borderRadius: 18, padding: 14, border: `1px solid ${T.hairline}` }}>
      <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, letterSpacing: 0.3 }}>{label.toUpperCase()}</div>
      <div className="num" style={{ fontSize: 22, fontWeight: 700, marginTop: 4, letterSpacing: -0.4 }}>{v}<span style={{ fontSize: 12, color: T.textDim, fontWeight: 500, marginLeft: 3 }}>{u}</span></div>
      <div className="num" style={{ fontSize: 11, color, fontWeight: 700, marginTop: 4 }}>{delta} kg this month</div>
    </div>
  );
}

window.ForecastScreen = ForecastScreen;
