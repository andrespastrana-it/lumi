// Recipe / meal detail screen
function RecipeScreen() {
  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 110 }}>
        {/* Hero image area */}
        <div style={{
          height: 320, position: 'relative',
          background: 'linear-gradient(135deg, #FFB547 0%, #F472B6 60%, #7B61FF 100%)',
        }}>
          {/* Plate placeholder visualization */}
          <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)',
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 70%)',
            border: '8px solid rgba(255,255,255,0.18)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
            padding: 22, gap: 6,
          }}>
            <div style={{ background: '#34D399', borderRadius: 100, opacity: 0.85 }}/>
            <div style={{ background: '#fff', borderRadius: 100, opacity: 0.9 }}/>
            <div style={{ background: '#F59E0B', borderRadius: 100, opacity: 0.9 }}/>
            <div style={{ background: '#EF4444', borderRadius: 100, opacity: 0.85 }}/>
          </div>

          <div style={{ position: 'absolute', top: 60, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(11,16,32,0.55)',
              backdropFilter: 'blur(16px)', border: `1px solid rgba(255,255,255,0.18)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d="M15 18l-6-6 6-6" size={18} color="#fff"/>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(11,16,32,0.55)',
                backdropFilter: 'blur(16px)', border: `1px solid rgba(255,255,255,0.18)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" size={17} color="#fff"/>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(11,16,32,0.55)',
                backdropFilter: 'blur(16px)', border: `1px solid rgba(255,255,255,0.18)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M16 6l-4-4-4 4M12 2v13" size={17} color="#fff"/>
              </div>
            </div>
          </div>

          {/* gradient mask for content overlap */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(180deg, transparent, #0B1020)' }}/>
        </div>

        {/* Title & macros */}
        <div style={{ padding: '4px 22px 0' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <Chip color={T.cyan} bg="rgba(34,211,238,0.15)">Lunch</Chip>
            <Chip color={T.green} bg="rgba(52,211,153,0.15)">High-protein</Chip>
            <Chip color={T.amber} bg="rgba(245,158,11,0.15)">Mediterranean</Chip>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.2 }}>Mediterranean<br/>chicken bowl</div>
          <div style={{ fontSize: 13, color: T.textDim, marginTop: 6, lineHeight: 1.5 }}>
            Quinoa, herb-marinated chicken, charred peppers, cucumber, feta and lemon-olive dressing.
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Quick label="Time" value="18 min" icon="M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/>
            <Quick label="Difficulty" value="Easy" icon="M5 12l5 5L20 7"/>
            <Quick label="Serves" value="1" icon="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0"/>
          </div>

          {/* Macro ring + breakdown */}
          <div style={{
            background: T.bgElev, borderRadius: 22, padding: 18, border: `1px solid ${T.hairline}`,
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <GradRing size={92} stroke={9} value={0.85} gradId="recring">
              <div className="num" style={{ fontSize: 18, fontWeight: 700 }}>520</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: 0.3 }}>KCAL</div>
            </GradRing>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <MacroBar c={T.violet} l="Protein" v={42} t={50}/>
              <MacroBar c={T.cyan} l="Carbs" v={48} t={70}/>
              <MacroBar c={T.pink} l="Fat" v={18} t={30}/>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <Section title="INGREDIENTS · 1 SERVING" style={{ marginTop: 22 }}>
          <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Chicken breast', '150g'],
              ['Quinoa, cooked', '80g'],
              ['Bell peppers', '100g'],
              ['Cucumber', '70g'],
              ['Cherry tomatoes', '50g'],
              ['Feta cheese', '15g'],
              ['Olive oil', '1 tbsp'],
              ['Lemon, juiced', '½'],
            ].map(([n, q], i) => (
              <div key={i} style={{
                background: T.bgElev, borderRadius: 14, padding: '11px 14px',
                border: `1px solid ${T.hairline}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${T.textMute}` }}/>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{n}</div>
                <div className="num" style={{ fontSize: 13, color: T.cyan, fontWeight: 700 }}>{q}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Steps */}
        <Section title="STEPS · 18 MIN">
          <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Slice chicken into strips, season with salt, pepper, oregano.',
              'Heat pan on medium-high. Cook chicken 4 min per side until golden.',
              'Char peppers in same pan for 2 min while chicken rests.',
              'Build the bowl: quinoa base, vegetables, chicken on top, feta, dressing.',
            ].map((s, i) => (
              <div key={i} style={{
                background: T.bgElev, borderRadius: 16, padding: 14,
                border: `1px solid ${T.hairline}`,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 9, background: T.gradSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: T.cyan, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ fontSize: 14, lineHeight: 1.45, paddingTop: 4 }}>{s}</div>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ padding: '20px 22px 0', display: 'flex', gap: 10 }}>
          <button style={{
            flex: 1, background: 'rgba(255,255,255,0.06)', color: T.text, fontWeight: 700,
            borderRadius: 999, border: `1px solid ${T.hairlineStrong}`, padding: '15px',
            fontSize: 15, fontFamily: T.font,
          }}>Swap meal</button>
          <button style={{
            flex: 1.4, background: T.grad, color: '#0B1020', fontWeight: 700,
            borderRadius: 999, border: 'none', padding: '15px', fontSize: 15,
            fontFamily: T.font, boxShadow: '0 12px 28px rgba(123,97,255,0.4)',
          }}>I'm cooking this</button>
        </div>
      </div>
    </div>
  );
}

function Quick({ label, value, icon }) {
  return (
    <div style={{ flex: 1, background: T.bgElev, borderRadius: 14, padding: 12, border: `1px solid ${T.hairline}` }}>
      <Icon d={icon} size={14} color={T.cyan}/>
      <div style={{ fontSize: 10.5, color: T.textMute, fontWeight: 600, marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1 }}>{value}</div>
    </div>
  );
}

function MacroBar({ c, l, v, t }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: T.textDim }}>{l}</div>
        <div className="num" style={{ fontSize: 12, fontWeight: 700 }}>{v}<span style={{ color: T.textMute, fontWeight: 500 }}>/{t}g</span></div>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(v/t)*100}%`, background: c }}/>
      </div>
    </div>
  );
}

window.RecipeScreen = RecipeScreen;
