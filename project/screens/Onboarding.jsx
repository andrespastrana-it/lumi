// 01 · Onboarding
function Onboarding({ density = 'comfy' }) {
  return (
    <Phone>
      <div style={{ padding: '60px 24px 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {[1,1,1,0].map((on,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
              background: on ? T.text : 'rgba(0,0,0,0.08)' }}/>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMute, letterSpacing: 0.2, marginBottom: 14 }}>Step 3 of 4</div>
        <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.8, marginBottom: 10 }}>
          Where are we headed,<br/>Marco?
        </div>
        <div style={{ fontSize: 15, color: T.textDim, lineHeight: 1.5, marginBottom: 30 }}>
          Pin a target weight — I'll plan every meal and check-in around it.
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <Card style={{ flex: 1, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textMute, letterSpacing: 0.3 }}>Now</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
              <div className="num" style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>85.0</div>
              <div style={{ fontSize: 13, color: T.textDim }}>kg</div>
            </div>
          </Card>
          <Card style={{ flex: 1, padding: 16, background: T.text, borderColor: T.text }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3 }}>Goal</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6, color: '#fff' }}>
              <div className="num" style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1 }}>68.0</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>kg</div>
            </div>
          </Card>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ position: 'relative', height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.06)', marginBottom: 10 }}>
            <div style={{ position: 'absolute', left: '20%', right: '15%', top: 0, bottom: 0, borderRadius: 2, background: T.text }}/>
            <div style={{ position: 'absolute', left: 'calc(85% - 9px)', top: -7, width: 18, height: 18, borderRadius: 9, background: '#fff', border: `2px solid ${T.text}` }}/>
            <div style={{ position: 'absolute', left: 'calc(20% - 9px)', top: -7, width: 18, height: 18, borderRadius: 9, background: T.text }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.textMute }}>
            <span>60 kg</span><span>100 kg</span>
          </div>
        </div>

        <div style={{ padding: 16, borderRadius: 14, background: T.bgInset }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textMute, letterSpacing: 0.2, marginBottom: 6 }}>Lumi recommends</div>
          <div style={{ fontSize: 14, lineHeight: 1.55 }}>
            Drop <b>17 kg over 26 weeks</b> at <b>0.65 kg / week</b>. Real enough to feel, gentle enough to keep.
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <Chip>by Oct 14</Chip>
            <Chip tone="green">sustainable</Chip>
          </div>
        </div>

        <div style={{ flex: 1 }}/>
        <PrimaryButton style={{ marginBottom: 12 }}>Lock in my plan</PrimaryButton>
        <button style={{ background: 'transparent', color: T.textDim, border: 'none', padding: '10px', fontSize: 14, fontFamily: T.font, marginBottom: 24 }}>Adjust pace manually</button>
      </div>
    </Phone>
  );
}
window.Onboarding = Onboarding;
