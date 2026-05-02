// Shopping list screen
function ShoppingScreen() {
  const cats = [
    { name: 'Produce', color: T.green,
      items: [['Cucumbers', '3', false], ['Cherry tomatoes', '500g', false], ['Bell peppers', '4', true], ['Spinach', '300g', false], ['Lemons', '4', false], ['Avocado', '2', false]] },
    { name: 'Protein', color: T.violet,
      items: [['Chicken breast', '900g', true], ['Salmon fillets', '600g', false], ['Greek yogurt', '1kg', false], ['Eggs', '12', false]] },
    { name: 'Pantry', color: T.amber,
      items: [['Quinoa', '500g', true], ['Olive oil', '1 bottle', false], ['Almonds', '200g', false]] },
    { name: 'Dairy', color: T.cyan,
      items: [['Feta cheese', '200g', false], ['Almond milk', '1L', false]] },
  ];

  const total = cats.reduce((a, c) => a + c.items.length, 0);
  const done = cats.reduce((a, c) => a + c.items.filter(i => i[2]).length, 0);

  return (
    <div className="lumen" style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', color: T.text }}>
      <GlowBg/>
      <LumenStatus/>

      <div className="hide-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }}>
        <div style={{ padding: '60px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, color: T.textDim, fontWeight: 600 }}>This week</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, marginTop: 2 }}>Shopping list</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: T.bgElev, border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={17}/>
          </div>
        </div>

        {/* Progress hero */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{
            background: T.bgElev, borderRadius: 22, padding: 18,
            border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <GradRing size={68} stroke={7} value={done/total} gradId="shoring">
              <div className="num" style={{ fontSize: 13, fontWeight: 700 }}>{done}/{total}</div>
            </GradRing>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>4 days of meals covered</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Est. €54.20 · 4 nearby stores</div>
            </div>
            <div style={{ padding: '8px 14px', borderRadius: 999, background: T.gradSoft,
              fontSize: 12, fontWeight: 700, color: T.cyan, border: `1px solid ${T.hairlineStrong}` }}>Order</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="hide-scroll" style={{ display: 'flex', gap: 6, padding: '18px 22px 0', overflowX: 'auto' }}>
          {['All', 'Produce', 'Protein', 'Pantry', 'Dairy'].map((t, i) => (
            <div key={t} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999,
              background: i === 0 ? T.grad : T.bgElev,
              color: i === 0 ? '#0B1020' : T.textDim,
              fontSize: 12, fontWeight: 700,
              border: i === 0 ? 'none' : `1px solid ${T.hairline}`,
            }}>{t}</div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ padding: '20px 22px 0' }}>
          {cats.map(cat => (
            <div key={cat.name} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: cat.color }}/>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.4, color: T.text }}>{cat.name.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600 }}>· {cat.items.length} items</div>
              </div>
              <div style={{ background: T.bgElev, borderRadius: 18, border: `1px solid ${T.hairline}`, overflow: 'hidden' }}>
                {cat.items.map(([n, q, d], i) => (
                  <div key={n} style={{
                    padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: i < cat.items.length - 1 ? `1px solid ${T.hairline}` : 'none',
                    opacity: d ? 0.5 : 1,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 7,
                      background: d ? T.grad : 'transparent',
                      border: d ? 'none' : `1.5px solid ${T.textMute}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {d && <Icon d="M5 12l5 5L20 7" size={12} sw={3.5} color="#0B1020"/>}
                    </div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 500, textDecoration: d ? 'line-through' : 'none' }}>{n}</div>
                    <div className="num" style={{ fontSize: 12, color: T.textDim, fontWeight: 600 }}>{q}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="plan"/>
    </div>
  );
}

window.ShoppingScreen = ShoppingScreen;
