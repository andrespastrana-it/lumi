// 05 · Sunday weigh-in
function WeighIn({ density = 'comfy' }) {
  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', padding: '58px 0 32px' }}>
        <div style={{ padding: '8px 24px 18px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: T.textMute }}>Sun · Apr 27 · Week 4</div>
          <Icon d="M6 6l12 12M6 18L18 6" size={18}/>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.15 }}>
            Sunday weigh-in
          </div>
          <div style={{ fontSize: 14, color: T.textDim, marginTop: 6 }}>
            Step on the scale. I'll recalibrate from there.
          </div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card style={{ padding: '32px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>YOUR WEIGHT</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: T.bgInset, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d="M5 12h14" size={16} sw={2}/>
              </div>
              <div className="num" style={{ fontSize: 60, fontWeight: 600, letterSpacing: -2.4, lineHeight: 1 }}>82.4</div>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: T.text, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d="M5 12h14M12 5v14" size={16} sw={2}/>
              </div>
            </div>
            <div style={{ fontSize: 13, color: T.textDim, marginTop: 6 }}>kg</div>
          </Card>
        </div>

        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>VS LAST WEEK</div>
            <div className="num" style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>−0.7 kg</div>
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>Goal was −0.65</div>
          </Card>
          <Card style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>4-WEEK TOTAL</div>
            <div className="num" style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>−2.6 kg</div>
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>15% to goal</div>
          </Card>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card style={{ background: T.bgInset, border: 'none' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Avatar size={32}>L</Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>LUMI'S ADJUSTMENT</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
                  You're <b>5 days ahead</b> of pace. To avoid burnout I'm bumping calories <b>+80 kcal/day</b> and shifting one cardio day to mobility.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                  <div style={{ padding: 12, borderRadius: 10, background: '#fff' }}>
                    <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600 }}>NEW TARGET</div>
                    <div className="num" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>1,860 <span style={{fontSize:11,color:T.textDim, fontWeight: 400}}>kcal/d</span></div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: '#fff' }}>
                    <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600 }}>FORECAST</div>
                    <div className="num" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Oct 14</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button style={{ flex: 1, background: '#fff', border: `1px solid ${T.hairline}`, color: T.text, padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: T.font }}>Keep current</button>
                  <button style={{ flex: 1.4, background: T.text, border: 'none', color: '#fff', padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: T.font }}>Apply changes</button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Phone>
  );
}
window.WeighIn = WeighIn;
