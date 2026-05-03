// 08 · Recipe
function Recipe({ density = 'comfy' }) {
  return (
    <Phone>
      <div className="hide-sb" style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
        <div style={{ position: 'relative', height: 280, background: T.bgInset, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 130 }}>🍗</div>
          <StatusBar/>
          <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, borderRadius: 22, background: '#000', zIndex: 50 }}/>
          <div style={{ position: 'absolute', top: 56, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d="M15 6l-6 6 6 6" size={16}/>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: '#fff', border: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" size={16}/>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 24px 18px' }}>
          <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: 0.3 }}>LUNCH · 13:00</div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.2, marginTop: 6 }}>
            Grilled chicken & quinoa power bowl
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12, color: T.textDim }}>
            <span>⏱ 18 min</span><span>👤 1 serving</span><span>⭐ 4.8</span>
          </div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Card padded={false} style={{ padding: '14px 0' }}>
            <div style={{ display: 'flex' }}>
              {[
                { v: '520', u: 'kcal' },
                { v: '42g', u: 'protein' },
                { v: '48g', u: 'carbs' },
                { v: '14g', u: 'fat' },
              ].map((s,i,a) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < a.length-1 ? `1px solid ${T.hairline}` : 'none' }}>
                  <div className="num" style={{ fontSize: 16, fontWeight: 600 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: T.textMute, fontWeight: 500, marginTop: 2 }}>{s.u}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ padding: '0 24px 8px', fontSize: 14, fontWeight: 600 }}>Ingredients</div>
        <div style={{ padding: '0 16px 16px' }}>
          <Card padded={false}>
            {[
              { e: '🍗', n: 'Chicken breast', q: '150 g' },
              { e: '🌾', n: 'Quinoa, dry', q: '80 g' },
              { e: '🥬', n: 'Mixed greens', q: '200 g' },
              { e: '🥑', n: 'Avocado', q: '½' },
              { e: '🍅', n: 'Cherry tomatoes', q: '100 g' },
              { e: '🫒', n: 'Olive oil', q: '1 tbsp' },
              { e: '🍋', n: 'Lemon', q: '½' },
            ].map((i, idx, a) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
                borderBottom: idx < a.length-1 ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ fontSize: 18, width: 24 }}>{i.e}</div>
                <div style={{ flex: 1, fontSize: 14 }}>{i.n}</div>
                <div className="num" style={{ fontSize: 13, color: T.textDim, fontWeight: 500 }}>{i.q}</div>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ padding: '0 24px 8px', fontSize: 14, fontWeight: 600 }}>Method</div>
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Cook quinoa: 1 part dry, 2 parts water, 12 min covered.',
            'Season chicken with salt, pepper, paprika. Grill 6 min/side.',
            'Slice avocado, halve tomatoes, dress greens with olive oil + lemon.',
            'Plate quinoa, top with greens, sliced chicken and avocado.',
          ].map((step, i) => (
            <Card key={i} style={{ padding: 14, display: 'flex', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: T.text, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{i+1}</div>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>{step}</div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16, display: 'flex', gap: 10, zIndex: 30 }}>
        <button style={{ width: 50, height: 50, borderRadius: 14, background: '#fff', border: `1px solid ${T.hairline}` }}>
          <Icon d="M3 6h18l-2 13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={18}/>
        </button>
        <PrimaryButton style={{ flex: 1, padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon d="M5 12l4 4L19 7" size={16} sw={2.4}/>
          Mark as eaten
        </PrimaryButton>
      </div>
    </Phone>
  );
}
window.Recipe = Recipe;
