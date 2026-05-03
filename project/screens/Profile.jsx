// 10 · Profile
function Profile({ density = 'comfy' }) {
  const Row = ({ label, value, danger, last }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${T.hairline}` }}>
      <div style={{ flex: 1, fontSize: 14, color: danger ? T.red : T.text }}>{label}</div>
      {value && <div style={{ fontSize: 13, color: T.textDim }}>{value}</div>}
      <Icon d="M9 6l6 6-6 6" size={14} sw={1.6}/>
    </div>
  );

  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', padding: '58px 0 100px' }}>
        <div style={{ padding: '8px 24px 22px' }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5 }}>Profile</div>
        </div>

        <div style={{ padding: '0 16px 18px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar size={56}>M</Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>Marco Ríos</div>
                <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>34 · 178 cm</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <Chip>Day 23 / 182</Chip>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
              {[
                { l: 'Start', v: '85.0' },
                { l: 'Now',   v: '82.4' },
                { l: 'Goal',  v: '68.0' },
              ].map(s => (
                <div key={s.l} style={{ padding: 12, borderRadius: 10, background: T.bgInset }}>
                  <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>{s.l.toUpperCase()}</div>
                  <div className="num" style={{ fontSize: 17, fontWeight: 600, marginTop: 4 }}>{s.v}<span style={{ fontSize: 10, color: T.textDim, fontWeight: 400 }}> kg</span></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ padding: '0 24px 8px', fontSize: 12, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>PLAN</div>
        <div style={{ padding: '0 16px 16px' }}>
          <Card padded={false}>
            <Row label="Goal weight" value="68.0 kg"/>
            <Row label="Pace" value="0.65 kg / wk"/>
            <Row label="Goal date" value="Oct 14"/>
            <Row label="Daily calories" value="1,860 kcal"/>
            <Row label="Recalibrate plan" last/>
          </Card>
        </div>

        <div style={{ padding: '0 24px 8px', fontSize: 12, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>COACH</div>
        <div style={{ padding: '0 16px 16px' }}>
          <Card padded={false}>
            <Row label="Lumi's tone" value="Playful"/>
            <Row label="Reminders" value="On"/>
            <Row label="Voice logging" value="On" last/>
          </Card>
        </div>

        <div style={{ padding: '0 24px 8px', fontSize: 12, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>ACCOUNT</div>
        <div style={{ padding: '0 16px 16px' }}>
          <Card padded={false}>
            <Row label="Personal info"/>
            <Row label="Subscription" value="Pro"/>
            <Row label="Connected apps" value="Apple Health"/>
            <Row label="Sign out" danger last/>
          </Card>
        </div>

        <div style={{ textAlign: 'center', fontSize: 10, color: T.textMute, padding: '0 0 16px' }}>Lumi v2.4</div>
      </div>
      <TabBar active="me"/>
    </Phone>
  );
}
window.Profile = Profile;
