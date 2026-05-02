// Profile & settings
function ProfileScreen() {
  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }}>
        {/* Profile header */}
        <div style={{ padding: '60px 22px 0', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
            <div style={{
              width: 92, height: 92, borderRadius: 32, background: 'linear-gradient(135deg,#FFB547,#F472B6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, color: '#0B1020',
              border: `3px solid ${T.bg}`, boxShadow: '0 0 0 2px rgba(123,97,255,0.4)',
            }}>M</div>
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderRadius: 10, background: T.grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${T.bg}` }}>
              <Icon d="M12 5v14M5 12h14" size={13} color="#0B1020" sw={2.6}/>
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Marco Vento</div>
          <div style={{ fontSize: 13, color: T.textDim, marginTop: 2 }}>Day 28 · Week 4 of 26 · Going strong 🔥</div>
        </div>

        {/* Stats grid */}
        <div style={{ padding: '20px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <PStat label="Lost" v="−3.4" u="kg" color={T.green}/>
          <PStat label="Streak" v="12" u="days" color={T.amber}/>
          <PStat label="To go" v="13.6" u="kg" color={T.cyan}/>
        </div>

        {/* Achievements */}
        <Section title="ACHIEVEMENTS" style={{ marginTop: 22 }} action={<div style={{ fontSize: 12, fontWeight: 600, color: T.cyan }}>See all →</div>}>
          <div className="hide-scroll" style={{ padding: '0 22px', display: 'flex', gap: 10, overflowX: 'auto' }}>
            {[
              { e: '🥗', t: 'First week clean', d: 'Day 7', got: true },
              { e: '🔥', t: '10-day streak', d: 'Day 17', got: true },
              { e: '⚖️', t: '−3 kg milestone', d: 'Day 23', got: true },
              { e: '💪', t: 'Iron weeks', d: 'Day 35', got: false },
              { e: '🏆', t: '−10 kg', d: 'Soon', got: false },
            ].map((a, i) => (
              <div key={i} style={{
                flexShrink: 0, width: 100,
                background: a.got ? T.bgElev : 'rgba(255,255,255,0.02)',
                borderRadius: 18, padding: 12, textAlign: 'center',
                border: `1px solid ${a.got ? T.hairlineStrong : T.hairline}`,
                opacity: a.got ? 1 : 0.45,
              }}>
                <div style={{ fontSize: 30, marginBottom: 6, filter: a.got ? 'none' : 'grayscale(1)' }}>{a.e}</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>{a.t}</div>
                <div style={{ fontSize: 10, color: T.textMute, marginTop: 3 }}>{a.d}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Settings rows */}
        <Section title="GOAL & PLAN">
          <SettingsCard rows={[
            { icon: 'M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z', l: 'Target weight', v: '68 kg', c: T.violet },
            { icon: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z', l: 'Pace', v: '0.65 kg / wk', c: T.cyan },
            { icon: 'M14 2l-3 9h6l-3 9', l: 'Activity level', v: 'Moderate', c: T.amber, last: true },
          ]}/>
        </Section>

        <Section title="COACH & NUDGES">
          <SettingsCard rows={[
            { icon: 'M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z', l: 'Lumi tone', v: 'Playful', c: T.pink },
            { icon: 'M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5', l: 'Notifications', v: '3 daily', c: T.cyan },
            { icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', l: 'Diet style', v: 'Mediterranean', c: T.green, last: true },
          ]}/>
        </Section>

        <Section title="DATA">
          <SettingsCard rows={[
            { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3', l: 'Export data', v: '', c: T.textDim },
            { icon: 'M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', l: 'Connected apps', v: '2', c: T.violet, last: true },
          ]}/>
        </Section>
      </div>

      <TabBar active="me"/>
    </div>
  );
}

function PStat({ label, v, u, color }) {
  return (
    <div style={{ background: T.bgElev, borderRadius: 16, padding: 12, border: `1px solid ${T.hairline}`, textAlign: 'center' }}>
      <div className="num" style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: -0.4 }}>{v}</div>
      <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600 }}>{u}</div>
      <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SettingsCard({ rows }) {
  return (
    <div style={{ padding: '0 22px' }}>
      <div style={{ background: T.bgElev, borderRadius: 18, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            padding: '14px',
            display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: r.last ? 'none' : `1px solid ${T.hairline}`,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.c }}>
              <Icon d={r.icon} size={16} sw={2}/>
            </div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{r.l}</div>
            {r.v && <div style={{ fontSize: 13, color: T.textDim, fontWeight: 500 }}>{r.v}</div>}
            <Icon d="M9 6l6 6-6 6" size={14} color={T.textMute}/>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
