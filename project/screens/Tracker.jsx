// Calorie & exercise tracker (input/log)
function TrackerScreen() {
  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 200 }}>
        <div style={{ padding: '60px 22px 0' }}>
          <div style={{ fontSize: 13, color: T.textDim, fontWeight: 600 }}>Track</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, marginTop: 2 }}>Log what you ate.</div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '20px 22px 0', display: 'flex', gap: 6 }}>
          {[
            { l: 'Food', on: true },
            { l: 'Exercise', on: false },
            { l: 'Water', on: false },
          ].map(t => (
            <div key={t.l} style={{
              padding: '8px 14px', borderRadius: 999,
              background: t.on ? T.grad : T.bgElev,
              color: t.on ? '#0B1020' : T.textDim,
              fontSize: 13, fontWeight: 700,
              border: t.on ? 'none' : `1px solid ${T.hairline}`,
            }}>{t.l}</div>
          ))}
        </div>

        {/* Calorie remaining hero */}
        <div style={{ padding: '18px 22px 0' }}>
          <div style={{
            background: T.bgElev, borderRadius: 24, padding: 20,
            border: `1px solid ${T.hairline}`, position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', gap: 18,
          }}>
            <div style={{ position: 'absolute', top: -50, right: -30, width: 180, height: 180, background: T.gradSoft, borderRadius: '50%', filter: 'blur(40px)' }}/>
            <GradRing size={92} stroke={9} value={0.62} gradId="trkring">
              <div className="num" style={{ fontSize: 18, fontWeight: 700 }}>692</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: 0.4 }}>LEFT</div>
            </GradRing>
            <div style={{ flex: 1, position: 'relative' }}>
              <Row label="Goal" value="1,820" color={T.text}/>
              <Row label="Eaten" value="1,128" color={T.cyan}/>
              <Row label="Burned" value="285" color={T.amber}/>
              <div style={{ height: 1, background: T.hairline, margin: '8px 0' }}/>
              <Row label="Remaining" value="977" color={T.green} bold/>
            </div>
          </div>
        </div>

        {/* Recently logged */}
        <Section title="LOGGED TODAY" style={{ marginTop: 22 }}>
          <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Greek yogurt + berries', time: '7:30 AM', kcal: 340, conf: 'planned' },
              { name: 'Apple + 12 almonds', time: '10:30 AM', kcal: 180, conf: 'planned' },
              { name: 'Espresso + oat milk', time: '11:45 AM', kcal: 38, conf: 'voice' },
              { name: '2 dark chocolate squares', time: '12:10 PM', kcal: 110, conf: 'voice' },
            ].map((it, i) => (
              <div key={i} style={{
                background: T.bgElev, borderRadius: 16, padding: '12px 14px',
                border: `1px solid ${T.hairline}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10,
                  background: it.conf === 'voice' ? 'rgba(34,211,238,0.15)' : 'rgba(123,97,255,0.15)',
                  color: it.conf === 'voice' ? T.cyan : T.violet,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={it.conf === 'voice' ? 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3' : 'M5 12l5 5L20 7'} size={16} sw={2}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>{it.time} · via {it.conf}</div>
                </div>
                <div className="num" style={{ fontSize: 14, fontWeight: 700 }}>{it.kcal}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Exercise log */}
        <Section title="MOVEMENT TODAY">
          <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ExCard color={T.amber} icon="M14 2l-3 9h6l-3 9" title="Walk" v="42" u="min" k="148"/>
            <ExCard color={T.violet} icon="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" title="Strength" v="22" u="min" k="137"/>
          </div>
        </Section>
      </div>

      {/* Voice/text logger floating */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 100, zIndex: 25 }}>
        <div style={{
          background: 'rgba(18, 26, 51, 0.86)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderRadius: 24, padding: '10px 12px 10px 18px',
          border: `1px solid ${T.hairlineStrong}`,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ flex: 1, fontSize: 14, color: T.textDim }}>
            "<span style={{ color: T.text }}>I had a flat white</span>..."
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.text }}>
            <Icon d="M3 12h13M16 7l5 5-5 5" size={18}/>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: T.grad, color: '#0B1020',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 22px rgba(123,97,255,0.5)' }}>
            <Icon d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3" size={18} sw={2.2}/>
          </div>
        </div>
      </div>

      <TabBar active="plan"/>
    </div>
  );
}

function Row({ label, value, color, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0' }}>
      <div style={{ fontSize: 12, color: T.textDim, fontWeight: 600 }}>{label}</div>
      <div className="num" style={{ fontSize: bold ? 18 : 14, fontWeight: 700, color, letterSpacing: -0.2 }}>{value}<span style={{ fontSize: 10, color: T.textMute, fontWeight: 500, marginLeft: 3 }}>kcal</span></div>
    </div>
  );
}

function ExCard({ color, icon, title, v, u, k }) {
  return (
    <div style={{ background: T.bgElev, borderRadius: 18, padding: 14, border: `1px solid ${T.hairline}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 10 }}>
        <Icon d={icon} size={16} sw={2}/>
      </div>
      <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600 }}>{title}</div>
      <div className="num" style={{ fontSize: 19, fontWeight: 700, marginTop: 1 }}>{v}<span style={{ fontSize: 11, color: T.textDim, fontWeight: 500, marginLeft: 2 }}>{u}</span></div>
      <div className="num" style={{ fontSize: 11, color: T.amber, fontWeight: 600, marginTop: 4 }}>−{k} kcal</div>
    </div>
  );
}

window.TrackerScreen = TrackerScreen;
