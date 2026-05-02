// 06 · Forecast
function Forecast({ density = 'comfy' }) {
  const W = 320, H = 170;
  const wks = 26;
  const pts = [];
  for (let i=0; i<=wks; i++) {
    const t = i/wks;
    const w = 85 - 17 * (1 - Math.pow(1-t, 1.6));
    pts.push({ x: 20 + t * (W-40), y: 20 + ((w-66)/(86-66)) * (H-40) });
  }
  const real = [
    { x: 20, y: 20 + ((85.0-66)/(86-66))*(H-40) },
    { x: 20 + (1/wks)*(W-40), y: 20 + ((84.4-66)/(86-66))*(H-40) },
    { x: 20 + (2/wks)*(W-40), y: 20 + ((83.7-66)/(86-66))*(H-40) },
    { x: 20 + (3/wks)*(W-40), y: 20 + ((83.1-66)/(86-66))*(H-40) },
    { x: 20 + (4/wks)*(W-40), y: 20 + ((82.4-66)/(86-66))*(H-40) },
  ];

  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', padding: '58px 0 100px' }}>
        <div style={{ padding: '8px 24px 18px' }}>
          <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600 }}>Forecast · 26 weeks</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5, marginTop: 2 }}>68.0 kg by Oct 14</div>
          <div style={{ fontSize: 13, color: T.green, marginTop: 4, fontWeight: 500 }}>14 days ahead of plan</div>
        </div>

        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ display: 'flex', gap: 6, padding: 4, borderRadius: 10, background: T.bgInset }}>
            {['1M','3M','6M','All','Goal'].map((r,i) => (
              <div key={r} style={{ flex: 1, padding: '7px', textAlign: 'center', borderRadius: 7,
                background: i === 4 ? '#fff' : 'transparent',
                color: T.text,
                fontSize: 12, fontWeight: i === 4 ? 600 : 500,
                boxShadow: i === 4 ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}>{r}</div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card>
            <svg viewBox={`0 0 ${W} ${H+10}`} width="100%" style={{ display: 'block' }}>
              {[0,1,2,3].map(i => {
                const y = 20 + i * ((H-40)/3);
                return <line key={i} x1="20" x2={W-20} y1={y} y2={y} stroke="rgba(0,0,0,0.05)"/>;
              })}
              {[85,80,75,70].map((v,i) => {
                const y = 20 + i * ((H-40)/3);
                return <text key={i} x="0" y={y+3} fontSize="9" fill={T.textMute}>{v}</text>;
              })}
              {/* forecast band */}
              <polyline points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                stroke={T.textMute} strokeWidth="1.5" fill="none" strokeDasharray="3 4"/>
              {/* real area */}
              <path d={`M ${real[0].x},${H} L ${real.map(p => `${p.x},${p.y}`).join(' L ')} L ${real[real.length-1].x},${H} Z`} fill="rgba(0,0,0,0.04)"/>
              {/* real line */}
              <polyline points={real.map(p => `${p.x},${p.y}`).join(' ')}
                stroke={T.text} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx={real[real.length-1].x} cy={real[real.length-1].y} r="5" fill={T.text} stroke="#fff" strokeWidth="2"/>
              <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="4" fill={T.textMute}/>
              {['Apr','May','Jun','Jul','Aug','Sep','Oct'].map((m,i) => {
                const x = 20 + (i/6) * (W-40);
                return <text key={i} x={x} y={H+5} fontSize="9" fill={T.textMute} textAnchor="middle">{m}</text>;
              })}
            </svg>
          </Card>
        </div>

        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { l: 'Lost', v: '2.6', u: 'kg' },
            { l: 'Avg/wk', v: '0.65', u: 'kg' },
            { l: 'To goal', v: '14.4', u: 'kg' },
          ].map(s => (
            <Card key={s.l} style={{ padding: 14 }}>
              <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>{s.l.toUpperCase()}</div>
              <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{s.v}<span style={{ fontSize: 11, color: T.textDim, fontWeight: 400 }}> {s.u}</span></div>
            </Card>
          ))}
        </div>

        <div style={{ padding: '0 24px 8px', fontSize: 14, fontWeight: 600 }}>Milestones</div>
        <div style={{ padding: '0 16px' }}>
          <Card padded={false}>
            {[
              { kg: '80 kg', sub: 'in ~3 weeks · May 18' },
              { kg: '75 kg', sub: 'mid-July · halfway' },
              { kg: '70 kg', sub: 'September · ~24 wks' },
              { kg: '68 kg', sub: 'Oct 14 · GOAL', on: true },
            ].map((m,i,a) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < a.length-1 ? `1px solid ${T.hairline}` : 'none',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: m.on ? T.text : T.bgInset, color: m.on ? '#fff' : T.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }} className="num">{m.kg.split(' ')[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.kg}</div>
                  <div style={{ fontSize: 11, color: T.textDim, marginTop: 1 }}>{m.sub}</div>
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
window.Forecast = Forecast;
