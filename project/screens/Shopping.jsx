// 09 · Shopping
function Shopping({ density = 'comfy' }) {
  const sections = [
    { name: 'Produce', emoji: '🥬', items: [
      { n: 'Mixed greens', q: '600 g' }, { n: 'Cherry tomatoes', q: '500 g', done: true },
      { n: 'Avocado', q: '4' }, { n: 'Sweet potato', q: '1 kg' },
      { n: 'Asparagus', q: '500 g' }, { n: 'Lemon', q: '3', done: true },
    ]},
    { name: 'Protein', emoji: '🍗', items: [
      { n: 'Chicken breast', q: '900 g' }, { n: 'Salmon fillet', q: '500 g' },
      { n: 'Greek yogurt 0%', q: '1 kg', done: true }, { n: 'Eggs', q: '12' },
    ]},
    { name: 'Pantry', emoji: '🌾', items: [
      { n: 'Quinoa', q: '500 g' }, { n: 'Almond butter', q: '1 jar' },
      { n: 'Granola, low-sugar', q: '500 g', done: true },
    ]},
  ];
  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', padding: '58px 0 100px' }}>
        <div style={{ padding: '8px 24px 18px' }}>
          <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600 }}>Week of Apr 28</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5, marginTop: 2 }}>Shopping</div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>4 of 13 done</div>
              <div style={{ fontSize: 11, color: T.textMute }}>~€68 · 5 meals</div>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.06)' }}>
              <div style={{ width: '31%', height: '100%', background: T.text, borderRadius: 2 }}/>
            </div>
          </Card>
        </div>

        {sections.map(sec => (
          <div key={sec.name} style={{ padding: '0 16px 18px' }}>
            <div style={{ padding: '0 6px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 16 }}>{sec.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>{sec.name.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: T.textMute }}>{sec.items.length}</div>
            </div>
            <Card padded={false}>
              {sec.items.map((it, i, a) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderBottom: i < a.length-1 ? `1px solid ${T.hairline}` : 'none',
                  opacity: it.done ? 0.45 : 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10,
                    background: it.done ? T.text : 'transparent',
                    border: it.done ? 'none' : `1.5px solid ${T.hairlineStrong}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    {it.done && <Icon d="M5 12l4 4L19 7" size={11} sw={3}/>}
                  </div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 500,
                    textDecoration: it.done ? 'line-through' : 'none' }}>{it.n}</div>
                  <div className="num" style={{ fontSize: 12, color: T.textDim, fontWeight: 500 }}>{it.q}</div>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 96, left: 16, right: 16, zIndex: 25 }}>
        <PrimaryButton style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon d="M3 3h2l3 12h12l3-8H6" size={16}/>
          Send to Instacart
        </PrimaryButton>
      </div>
      <TabBar active="plan"/>
    </Phone>
  );
}
window.Shopping = Shopping;
