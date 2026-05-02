// Daily meal plan with portions & timings
function MealPlanScreen() {
  const meals = [
    {
      time: '07:30', name: 'Breakfast', emoji: '🥣',
      title: 'Greek yogurt + berries + walnuts',
      portion: '200g yogurt · 80g berries · 15g walnuts',
      kcal: 340, prot: 24, carb: 32, fat: 14, done: true,
      tag: 'Quick · 5 min',
    },
    {
      time: '10:30', name: 'Snack', emoji: '🍎',
      title: 'Apple + 12 almonds',
      portion: '1 medium apple (180g) · 12 almonds',
      kcal: 180, prot: 5, carb: 24, fat: 9, done: true,
      tag: 'No prep',
    },
    {
      time: '13:00', name: 'Lunch', emoji: '🥗',
      title: 'Mediterranean chicken bowl',
      portion: '150g chicken · 80g quinoa · 200g veg · 15g feta',
      kcal: 520, prot: 42, carb: 48, fat: 18, done: false, current: true,
      tag: '18 min · Mid prep',
    },
    {
      time: '16:30', name: 'Snack', emoji: '🥤',
      title: 'Whey protein shake',
      portion: '30g whey · 250ml almond milk · 1/2 banana',
      kcal: 220, prot: 28, carb: 18, fat: 4, done: false,
      tag: 'Quick · 2 min',
    },
    {
      time: '19:30', name: 'Dinner', emoji: '🐟',
      title: 'Baked salmon + roasted veg',
      portion: '160g salmon · 250g mixed veg · 1 tbsp olive oil',
      kcal: 560, prot: 38, carb: 24, fat: 32, done: false,
      tag: '25 min · Easy',
    },
  ];

  const totals = meals.reduce((a, m) => ({ kcal: a.kcal + m.kcal, prot: a.prot + m.prot }), { kcal: 0, prot: 0 });

  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '60px 22px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.textDim }}>Today's plate</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.6, marginTop: 4 }}>
              <span className="num">{totals.kcal}</span> <span style={{ fontSize: 16, color: T.textDim, fontWeight: 500 }}>/ 1,820 kcal</span>
            </div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: T.bgElev, border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d="M3 6h18M5 6l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 10v6M15 10v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" size={17}/>
          </div>
        </div>

        {/* Day pills */}
        <div className="hide-scroll" style={{ display: 'flex', gap: 8, padding: '20px 22px 4px', overflowX: 'auto' }}>
          {[
            { d: 'Mon', n: 24 }, { d: 'Tue', n: 25, on: true }, { d: 'Wed', n: 26 },
            { d: 'Thu', n: 27 }, { d: 'Fri', n: 28 }, { d: 'Sat', n: 29 }, { d: 'Sun', n: 30 },
          ].map(d => (
            <div key={d.d} style={{
              flexShrink: 0, padding: '10px 14px', minWidth: 56,
              borderRadius: 16,
              background: d.on ? T.grad : T.bgElev,
              color: d.on ? '#0B1020' : T.text,
              border: d.on ? 'none' : `1px solid ${T.hairline}`,
              boxShadow: d.on ? '0 8px 22px rgba(123,97,255,0.35)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, opacity: d.on ? 0.8 : 0.6 }}>{d.d.toUpperCase()}</div>
              <div className="num" style={{ fontSize: 17, fontWeight: 700, marginTop: 1 }}>{d.n}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, padding: '14px 22px 4px' }}>
          <ActionBtn icon="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" label="Shop list"/>
          <ActionBtn icon="M12 5v14M5 12h14" label="Swap meal"/>
          <ActionBtn icon="M4 6h16M4 12h16M4 18h7" label="Reorder"/>
        </div>

        {/* Meal timeline */}
        <div style={{ padding: '14px 22px 0', position: 'relative' }}>
          {/* vertical line */}
          <div style={{ position: 'absolute', left: 38, top: 30, bottom: 30, width: 2,
            background: 'linear-gradient(180deg, rgba(123,97,255,0.4) 0%, rgba(34,211,238,0.4) 100%)' }}/>

          {meals.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10, position: 'relative' }}>
              <div style={{ width: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
                <div className="num" style={{ fontSize: 11, fontWeight: 700, color: T.textDim, marginBottom: 6 }}>{m.time}</div>
                <div style={{
                  width: 14, height: 14, borderRadius: 7,
                  background: m.done ? T.grad : (m.current ? T.bg : T.bg),
                  border: m.done ? 'none' : `2px solid ${m.current ? T.cyan : T.textMute}`,
                  boxShadow: m.current ? '0 0 0 4px rgba(34,211,238,0.18)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {m.done && <Icon d="M5 12l5 5L20 7" size={9} sw={3.5} color="#0B1020"/>}
                </div>
              </div>
              <div style={{
                flex: 1,
                background: m.current ? T.gradSoft : T.bgElev,
                borderRadius: 22, padding: 16,
                border: m.current ? `1px solid ${T.hairlineStrong}` : `1px solid ${T.hairline}`,
                opacity: m.done ? 0.65 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14,
                    background: i === 2 ? 'linear-gradient(135deg,#FFB547,#F472B6)'
                      : i === 4 ? 'linear-gradient(135deg,#22D3EE,#7B61FF)'
                      : i === 0 ? 'linear-gradient(135deg,#84E1A5,#22D3EE)'
                      : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {m.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: T.textDim }}>{m.name.toUpperCase()}</div>
                      <div className="num" style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{m.kcal} kcal</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{m.title}</div>
                    <div style={{ fontSize: 11.5, color: T.textMute, lineHeight: 1.4 }}>{m.portion}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10, alignItems: 'center' }}>
                      <Chip dense color={T.violet} bg="rgba(123,97,255,0.15)">P {m.prot}g</Chip>
                      <Chip dense color={T.cyan} bg="rgba(34,211,238,0.15)">C {m.carb}g</Chip>
                      <Chip dense color={T.pink} bg="rgba(244,114,182,0.15)">F {m.fat}g</Chip>
                      <div style={{ flex: 1 }}/>
                      <div style={{ fontSize: 10.5, color: T.textMute }}>{m.tag}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="plan"/>
    </div>
  );
}

function ActionBtn({ icon, label }) {
  return (
    <div style={{ flex: 1, background: T.bgElev, borderRadius: 14, padding: '10px 12px',
      border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon d={icon} size={15} color={T.cyan}/>
      <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

window.MealPlanScreen = MealPlanScreen;
