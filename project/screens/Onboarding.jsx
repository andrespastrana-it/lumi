// Onboarding — goal & body data setup. Single-frame summary state.
function OnboardingScreen() {
  const weight = 85;
  const goal = 68;
  const lossPerWeek = 0.65;
  const weeks = Math.round((weight - goal) / lossPerWeek);

  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div style={{ position: 'absolute', inset: 0, padding: '70px 24px 100px', display: 'flex', flexDirection: 'column' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[1,1,1,0,0].map((on, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2,
              background: on ? T.grad : 'rgba(255,255,255,0.08)' }}/>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, color: T.cyan, marginBottom: 8 }}>STEP 3 OF 5</div>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 8 }}>
          Here's your<br/><span className="grad-text">forecast.</span>
        </div>
        <div style={{ fontSize: 15, color: T.textDim, lineHeight: 1.5, marginBottom: 24 }}>
          Based on what you told me, this is the safest path to 68 kg — without losing muscle.
        </div>

        {/* Forecast hero card */}
        <div style={{
          background: T.bgElev, borderRadius: 24, padding: 22,
          border: `1px solid ${T.hairline}`, marginBottom: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -20, width: 180, height: 180, background: T.gradSoft, borderRadius: '50%', filter: 'blur(40px)' }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: T.textDim, textTransform: 'uppercase' }}>Today</div>
              <div className="num" style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.8 }}>85.0<span style={{ fontSize: 16, color: T.textDim, marginLeft: 4 }}>kg</span></div>
            </div>
            <div style={{ flex: 1, padding: '0 14px', position: 'relative', height: 50, marginTop: 6 }}>
              <svg viewBox="0 0 120 40" width="100%" height="40" preserveAspectRatio="none">
                <defs><linearGradient id="ofg" x1="0" x2="1"><stop offset="0%" stopColor="#7B61FF"/><stop offset="100%" stopColor="#22D3EE"/></linearGradient></defs>
                <path d="M0 8 Q 60 18, 120 32" stroke="url(#ofg)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="4 4"/>
              </svg>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: T.textDim, textTransform: 'uppercase' }}>Goal</div>
              <div className="num grad-text" style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.8 }}>68.0<span style={{ fontSize: 16, marginLeft: 4 }}>kg</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
            <Chip color={T.text} bg="rgba(255,255,255,0.08)">−17 kg total</Chip>
            <Chip color={T.text} bg="rgba(255,255,255,0.08)">{lossPerWeek} kg/week</Chip>
          </div>
        </div>

        {/* ETA */}
        <div style={{
          background: T.bgElev, borderRadius: 24, padding: 22,
          border: `1px solid ${T.hairline}`, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: T.gradSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.cyan }}>
            <Icon d="M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: T.textDim, fontWeight: 600, letterSpacing: 0.4 }}>ESTIMATED FINISH</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>Sun, May 24, 2026</div>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 1 }}>~{weeks} weeks · 6 month plan</div>
          </div>
        </div>

        {/* Daily targets */}
        <div style={{ background: T.bgElev, borderRadius: 24, padding: 18, border: `1px solid ${T.hairline}`, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.textDim, fontWeight: 600, letterSpacing: 0.4, marginBottom: 12 }}>YOUR DAILY TARGETS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { v: '1,820', u: 'kcal', l: 'Eat' },
              { v: '420', u: 'kcal', l: 'Burn' },
              { v: '142g', u: '', l: 'Protein' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12 }}>
                <div className="num" style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>{m.v}<span style={{ fontSize: 11, color: T.textDim, fontWeight: 500, marginLeft: 2 }}>{m.u}</span></div>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 2, fontWeight: 600 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        {/* CTA */}
        <button style={{
          background: T.grad, color: '#0B1020', fontWeight: 700,
          borderRadius: 999, border: 'none', padding: '17px 22px', fontSize: 16,
          letterSpacing: -0.2, fontFamily: T.font, boxShadow: '0 12px 36px rgba(123,97,255,0.45)',
        }}>
          Looks good — let's go
        </button>
      </div>
    </div>
  );
}

window.OnboardingScreen = OnboardingScreen;
