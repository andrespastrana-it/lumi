// All screens for the Lumi interactive wireframe — Editorial Wash system
// No cards. No bordered boxes. Color bands, hairline rules, oversize type.
// Each screen receives { go, state, set } props

const C = {
  // base
  cream:    '#F2EAD8',
  creamHi:  '#FAF6F0',
  paper:    '#FBF6EB',
  ink:      '#1F1B17',
  muted:    '#5A4F40',
  dim:      '#8C7B6A',
  hair:     '#D9CFBC',     // hairline rule color
  // accents
  apricot:  '#E8784E',
  apricotDk:'#7A4520',
  apricotLt:'#FCEAD8',
  apricotWash:'#F8E0CE',
  green:    '#3D5A4A',
  greenLt:  '#E2EBE5',
  greenWash:'#D8E5DA',
  plum:     '#5A3A55',
};

const S = {
  page:    { background: C.creamHi, minHeight: '100%', fontFamily: '"DM Sans", system-ui', position:'relative' },
  pad:     { padding: '0 22px' },           // standard horizontal padding
  // typography
  eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: C.dim, textTransform: 'uppercase' },
  h1:      { fontFamily: '"Fraunces", serif', fontVariationSettings: '"SOFT" 100', fontWeight: 400, fontSize: 38, lineHeight: 1.02, letterSpacing: '-1.2px', color: C.ink, margin: 0 },
  h2:      { fontFamily: '"Fraunces", serif', fontVariationSettings: '"SOFT" 100', fontWeight: 400, fontSize: 26, lineHeight: 1.05, letterSpacing: '-.6px', color: C.ink, margin: 0 },
  body:    { fontSize: 15, lineHeight: 1.55, color: C.muted, margin: 0 },
  display: { fontFamily: '"Fraunces", serif', fontVariationSettings: '"SOFT" 100', fontWeight: 300, color: C.apricot, lineHeight: .9, letterSpacing:'-3px' },
  italic:  { fontStyle:'italic', fontWeight: 400 },
  // layout primitives
  band:    (bg, py = 28) => ({ background: bg, padding: `${py}px 22px`, marginLeft: -22, marginRight: -22 }),
  hair:    { borderBottom: `1px solid ${C.hair}` },
  // controls — flat, no borders, no shadows
  cta:     { display:'block', width:'100%', textAlign:'center', background: C.ink, color: C.paper, border:0, padding: '18px', borderRadius: 0, fontSize: 14, fontWeight: 600, fontFamily:'inherit', cursor:'pointer', letterSpacing:'.04em', textTransform:'uppercase' },
  ctaLine: { display:'block', width:'100%', textAlign:'center', background:'transparent', color: C.ink, border:0, padding: '14px', fontSize: 13, fontWeight: 500, fontFamily:'inherit', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:'4px', textDecorationColor: C.dim },
  link:    { color: C.apricot, textDecoration:'underline', textUnderlineOffset:'3px', cursor:'pointer', fontWeight: 500 },
};

const Em = ({ children }) => <em style={{ color: C.apricot, fontStyle:'italic', fontWeight: 400 }}>{children}</em>;

// ───────────────────── shared ───────────────────────
function Header({ children, back, go, mode = 'cream' }) {
  const fg = mode === 'dark' ? 'rgba(255,246,238,.6)' : C.dim;
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'18px 22px 6px' }}>
      {back && <button onClick={() => go(back)} style={{ background:'none', border:0, fontSize: 22, color: fg, cursor:'pointer', padding: 0, lineHeight: 1, fontFamily:'serif' }}>‹</button>}
      <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: fg, textTransform:'uppercase', letterSpacing:'.18em' }}>{children}</div>
    </div>
  );
}

// Magazine-style two-column row: label left, value right, hairline rule
function Row({ label, value, onClick, selected, dense }) {
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'baseline', justifyContent:'space-between',
      padding: dense ? '10px 0' : '16px 0',
      borderBottom: `1px solid ${C.hair}`,
      cursor: onClick ? 'pointer' : 'default',
      color: selected ? C.apricot : C.ink,
    }}>
      <span style={{ fontSize: 14, fontWeight: selected ? 600 : 500, letterSpacing: selected ? '.01em' : 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: selected ? C.apricot : C.dim, fontFamily: typeof value === 'string' && /^[\d.,]/.test(value) ? '"Fraunces", serif' : 'inherit' }}>{value}</span>
    </div>
  );
}

function TabBar({ active, go }) {
  const tabs = [
    { id: 'today',   route: 'today',    label: 'Today' },
    { id: 'plan',    route: 'plan',     label: 'Plan' },
    { id: 'coach',   route: 'coach',    label: 'Coach' },
    { id: 'stats',   route: 'forecast', label: 'Stats' },
    { id: 'me',      route: 'profile',  label: 'Me' },
  ];
  return (
    <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, display:'flex', justifyContent:'space-around', background: C.creamHi, borderTop: `1px solid ${C.hair}`, padding:'14px 8px 28px', zIndex: 5 }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => go(t.route)} style={{
            background:'none', border:0, padding:'2px 4px', cursor:'pointer', fontFamily:'inherit',
            fontSize: 12, fontWeight: on ? 700 : 500,
            color: on ? C.ink : C.dim,
            letterSpacing: on ? '.02em' : 0,
            borderBottom: on ? `2px solid ${C.apricot}` : '2px solid transparent',
            paddingBottom: 4,
          }}>{t.label}</button>
        );
      })}
    </div>
  );
}

function FAB({ go }) {
  return (
    <button onClick={() => go('logChoose')} style={{
      position:'absolute', right: 22, bottom: 92, height: 44, padding:'0 20px',
      background: C.ink, color: C.paper, border:0,
      fontSize: 12, fontWeight: 700, letterSpacing:'.14em', textTransform:'uppercase',
      cursor:'pointer', zIndex: 6, fontFamily:'inherit',
      borderRadius: 0,
    }}>+ Log meal</button>
  );
}

// ─────────────────── ONBOARDING ───────────────────
function Welcome({ go }) {
  return (
    <div style={{ ...S.page, height:'100%', display:'flex', flexDirection:'column', background: C.cream }}>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'40px 24px' }}>
        <Pip mood="wave" size={170} trackCursor={true} />
        <h1 style={{ ...S.h1, fontSize: 56, marginTop: 20 }}>Hi, I'm</h1>
        <h1 style={{ ...S.h1, fontSize: 88, color: C.apricot, fontStyle:'italic', fontWeight: 300, marginTop: -6 }}>Pip</h1>
        <p style={{ ...S.body, fontSize: 15, marginTop: 18, maxWidth: 280 }}>Your weight-loss partner.<br/>Warm. Specific. On your side.</p>
      </div>
      <div>
        <button style={S.cta} onClick={() => go('goal')}>Let's begin</button>
        <button style={S.ctaLine} onClick={() => go('today')}>I have an account</button>
      </div>
    </div>
  );
}

function Goal({ go, state, set }) {
  const opts = ['Lose weight', 'Build muscle', 'Maintain', 'Eat better'];
  return (
    <div style={S.page}>
      <Header>Step 1 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>What do you<br/>want to <Em>change</Em>?</h1>
        <p style={{ ...S.body, marginTop: 10 }}>Pick one. You can shift later.</p>
        <div style={{ marginTop: 24 }}>
          {opts.map(o => (
            <Row key={o} label={o} value={state.goal===o ? '✓' : ''} selected={state.goal===o} onClick={() => set('goal', o)} />
          ))}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={{ ...S.cta, opacity: state.goal ? 1 : .35 }} disabled={!state.goal} onClick={() => go('body')}>Continue</button>
      </div>
    </div>
  );
}

function Body({ go, state }) {
  const fields = [
    { k: 'weight', label: 'Current weight', v: state.weight, suffix: 'kg' },
    { k: 'height', label: 'Height',         v: state.height, suffix: 'cm' },
    { k: 'age',    label: 'Age',            v: state.age,    suffix: 'yrs' },
    { k: 'target', label: 'Target weight',  v: state.target, suffix: 'kg' },
  ];
  return (
    <div style={S.page}>
      <Header back="goal" go={go}>Step 2 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>Tell me<br/>about <Em>you</Em></h1>
        <div style={{ marginTop: 28 }}>
          {fields.map(f => (
            <div key={f.k} style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'18px 0', borderBottom:`1px solid ${C.hair}` }}>
              <span style={{ fontSize: 13, color: C.muted, letterSpacing:'.02em' }}>{f.label}</span>
              <span style={{ fontFamily:'"Fraunces", serif', fontSize: 28, color: C.ink, fontWeight: 400 }}>
                {f.v} <span style={{ fontSize: 12, color: C.dim, fontFamily:'"DM Sans"' }}>{f.suffix}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('activity')}>Continue</button>
      </div>
    </div>
  );
}

function Activity({ go, state, set }) {
  const opts = [
    { k: 'sed',     l: 'Sedentary', d: 'Mostly sitting' },
    { k: 'lite',    l: 'Light',     d: '2–3 workouts/wk' },
    { k: 'active',  l: 'Active',    d: 'Daily movement' },
    { k: 'athlete', l: 'Athlete',   d: 'Training hard' },
  ];
  return (
    <div style={S.page}>
      <Header back="body" go={go}>Step 3 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How <Em>active</Em><br/>are you?</h1>
        <div style={{ marginTop: 28 }}>
          {opts.map(o => {
            const on = state.activity === o.k;
            return (
              <div key={o.k} onClick={() => set('activity', o.k)} style={{
                padding:'18px 0', borderBottom:`1px solid ${C.hair}`, cursor:'pointer',
                display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: on ? 600 : 500, color: on ? C.apricot : C.ink, fontFamily:'"Fraunces", serif' }}>{o.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{o.d}</div>
                </div>
                {on && <span style={{ color: C.apricot, fontSize: 18 }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={{ ...S.cta, opacity: state.activity ? 1 : .35 }} disabled={!state.activity} onClick={() => go('diet')}>Continue</button>
      </div>
    </div>
  );
}

function Diet({ go, state, set }) {
  const tags = ['Mediterranean','Omnivore','Vegetarian','High protein','No dairy','No gluten','Loves coffee','Loves pasta'];
  const toggle = t => {
    const cur = state.diet || [];
    set('diet', cur.includes(t) ? cur.filter(x=>x!==t) : [...cur, t]);
  };
  return (
    <div style={S.page}>
      <Header back="activity" go={go}>Step 4 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>What do you<br/><Em>love</Em>?</h1>
        <p style={{ ...S.body, marginTop: 10 }}>Pick all that apply.</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 8, marginTop: 22 }}>
          {tags.map(t => {
            const on = (state.diet||[]).includes(t);
            return (
              <button key={t} onClick={() => toggle(t)} style={{
                padding:'10px 16px', borderRadius: 0, border: 0,
                background: on ? C.ink : C.apricotWash,
                color: on ? C.paper : C.apricotDk,
                fontSize: 13, fontWeight: 500, cursor:'pointer', fontFamily:'inherit',
              }}>{t}</button>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'40px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('schedule')}>Continue</button>
      </div>
    </div>
  );
}

function Schedule({ go }) {
  const meals = [['Wake','07:00'],['Breakfast','07:30'],['Lunch','13:00'],['Dinner','20:00'],['Sleep','23:30']];
  return (
    <div style={S.page}>
      <Header back="diet" go={go}>Step 5 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>When do<br/>you <Em>eat</Em>?</h1>
        <div style={{ marginTop: 28 }}>
          {meals.map(([l,t]) => <Row key={l} label={l} value={t} />)}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('compute')}>Continue</button>
      </div>
    </div>
  );
}

function Compute({ go }) {
  const [step, setStep] = React.useState(0);
  const steps = ['Calculating TDEE','Setting deficit','Choosing meals','Building 26-week curve'];
  React.useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 750);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => go('plan_reveal'), 1000);
      return () => clearTimeout(t);
    }
  }, [step]);
  return (
    <div style={{ ...S.page, background: C.cream, height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'40px 24px' }}>
      <Pip mood="thinking" size={170} />
      <h1 style={{ ...S.h2, fontSize: 30, marginTop: 14 }}>Pip is <Em>thinking</Em></h1>
      <div style={{ marginTop: 28, width:'100%', maxWidth: 280 }}>
        {steps.map((s,i) => (
          <div key={s} style={{
            padding: '12px 0', fontSize: 13,
            color: i<=step ? C.ink : C.dim,
            opacity: i<=step ? 1 : .35,
            transition:'opacity .3s',
            borderBottom: `1px solid ${C.hair}`,
            display:'flex', justifyContent:'space-between', alignItems:'baseline',
          }}>
            <span>{s}</span>
            <span style={{ fontFamily:'"Fraunces",serif', color: i<step ? C.green : i===step ? C.apricot : C.dim }}>
              {i<step ? '✓' : i===step ? '●' : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanReveal({ go }) {
  return (
    <div style={{ ...S.page, background: C.cream, height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ paddingTop: 50, textAlign:'center' }}>
        <Pip mood="proud" size={140} />
      </div>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
        <div style={S.eyebrow}>Your plan</div>
        <h1 style={{ ...S.h1, fontSize: 30, marginTop: 8 }}>26 weeks to <Em>68 kg</Em></h1>
        <div style={{ ...S.display, fontSize: 140, margin:'16px 0', letterSpacing:'-6px' }}>0.65</div>
        <div style={{ fontSize: 12, color: C.muted, letterSpacing:'.18em', textTransform:'uppercase' }}>kg per week — safe, sustainable</div>
      </div>
      <div style={{ ...S.band(C.greenWash, 22), display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div>
          <div style={{ ...S.eyebrow, color: C.green }}>Estimated finish</div>
          <div style={{ fontFamily:'"Fraunces",serif', fontSize: 26, color: C.green, marginTop: 4 }}>Oct 14, 2026</div>
        </div>
        <div style={{ fontSize: 11, color: C.green, opacity: .7, fontStyle:'italic', fontFamily:'"Fraunces",serif' }}>~ 14 days early</div>
      </div>
      <button style={S.cta} onClick={() => go('permissions')}>I'm in</button>
    </div>
  );
}

function Permissions({ go }) {
  const [done, setDone] = React.useState({});
  const items = [
    ['notif',  'Notifications', 'Gentle nudges. Never spam.'],
    ['health', 'Health app',    'Steps + workouts auto-sync.'],
    ['cam',    'Camera',        'Photo + barcode logging.'],
    ['mic',    'Microphone',    'Voice logging.'],
  ];
  return (
    <div style={S.page}>
      <Header>Permissions</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>A few quick<br/><Em>asks</Em></h1>
        <div style={{ marginTop: 28 }}>
          {items.map(([k,l,d]) => {
            const on = done[k];
            return (
              <div key={k} onClick={() => setDone({...done,[k]:true})} style={{
                padding:'18px 0', borderBottom:`1px solid ${C.hair}`, cursor:'pointer',
                display:'flex', alignItems:'center', gap: 14,
              }}>
                <div style={{
                  width: 28, height: 28,
                  background: on ? C.green : 'transparent',
                  border: on ? 0 : `1px solid ${C.dim}`,
                  color: '#fff',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14, fontWeight: 700,
                }}>{on ? '✓' : ''}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: C.ink, fontFamily:'"Fraunces", serif' }}>{l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('paywall')}>Continue</button>
      </div>
    </div>
  );
}

function Paywall({ go }) {
  return (
    <div style={{ ...S.page, background: C.ink, color: C.paper, height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'40px 24px 24px' }}>
        <div style={{ ...S.eyebrow, color: C.apricot }}>Unlock Lumi</div>
        <h1 style={{ ...S.h1, color: C.paper, fontSize: 44, marginTop: 14 }}>
          <span style={{ color: C.apricot, fontStyle:'italic', fontWeight: 300 }}>7 days</span><br/>on the house
        </h1>
        <p style={{ fontSize: 14, color:'rgba(255,246,238,.65)', lineHeight: 1.55, marginTop: 14, maxWidth: 280 }}>
          Then €8.99/month. Cancel anytime, even mid-trial.
        </p>
      </div>
      <div style={{ padding:'8px 24px', flex: 1 }}>
        {['Voice + photo logging','AI coach (unlimited)','26-week forecast','Recipes & shopping list','Weekly weigh-in & adjust','Apple Health sync'].map(f => (
          <div key={f} style={{
            padding:'14px 0',
            borderBottom:'1px solid rgba(255,246,238,.1)',
            fontSize: 14, display:'flex', alignItems:'center', gap: 14, color: C.paper,
          }}>
            <span style={{ color: C.apricot, fontFamily:'"Fraunces",serif' }}>✦</span>{f}
          </div>
        ))}
      </div>
      <button style={{ ...S.cta, background: C.apricot, color: C.paper }} onClick={() => go('today')}>Start free trial</button>
      <button style={{ ...S.ctaLine, color:'rgba(255,246,238,.55)', textDecorationColor:'rgba(255,246,238,.3)', paddingBottom: 22 }} onClick={() => go('today')}>Maybe later</button>
    </div>
  );
}

// ─────────────────── TODAY HUB ───────────────────
function Today({ go, state }) {
  const meals = [
    { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, done: true },
    { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, done: true },
    { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, done: false, next: true },
    { l: 'Protein shake',          t: '16:00', kcal: 220, done: false },
    { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, done: false },
  ];
  const eaten = 1108, total = 1780, left = total - eaten, pct = eaten/total;
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      {/* Greeting band — cream with Pip */}
      <div style={{ background: C.cream, padding:'22px 22px 14px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap: 14 }}>
          <div style={{ marginTop: -16, marginLeft: -10, flexShrink: 0 }}>
            <Pip mood="happy" size={92} trackCursor={true} />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <div style={S.eyebrow}>Tuesday · Apr 28</div>
            <h1 style={{ ...S.h1, fontSize: 30, marginTop: 6 }}>Morning, <Em>Marco</Em></h1>
            <div style={{ fontSize: 13, color: C.muted, fontStyle:'italic', fontFamily:'"Fraunces",serif', marginTop: 8, lineHeight: 1.4 }}>
              &ldquo;Today is a chicken-and-<br/>quinoa kind of day.&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Calorie band — bold stats, no card */}
      <div style={{ padding:'28px 22px 18px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div style={S.eyebrow}>Calories</div>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 600, letterSpacing:'.05em' }}>{left} left</div>
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 10 }}>
          <div style={{ ...S.display, fontSize: 88 }}>{eaten.toLocaleString()}</div>
          <div style={{ fontSize: 14, color: C.dim, marginLeft: 6 }}>/ {total.toLocaleString()}</div>
        </div>
        {/* hairline progress bar */}
        <div style={{ height: 2, background: C.hair, marginTop: 10, position:'relative' }}>
          <div style={{ position:'absolute', left: 0, top: 0, height: '100%', width: `${pct*100}%`, background: C.apricot }}></div>
        </div>
        {/* macros — inline tabs, no boxes */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop: 18 }}>
          {[['Protein','88','142','g'],['Carbs','142','220','g'],['Fat','42','60','g']].map(([l,a,b,u]) => (
            <div key={l}>
              <div style={{ fontSize: 9, color: C.dim, fontWeight: 700, letterSpacing:'.18em', textTransform:'uppercase' }}>{l}</div>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, color: C.ink, marginTop: 4, fontWeight: 400 }}>{a}<span style={{ fontSize: 11, color: C.dim, fontFamily:'"DM Sans"' }}>/{b}{u}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak band — full-bleed sage wash */}
      <div style={{ background: C.greenWash, padding:'18px 22px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div>
          <div style={{ ...S.eyebrow, color: C.green }}>Streak</div>
          <div style={{ fontFamily:'"Fraunces",serif', fontSize: 26, color: C.green, marginTop: 2, letterSpacing:'-.5px' }}>21 days · −2.6 kg</div>
        </div>
        <span onClick={() => go('forecast')} style={{ fontSize: 12, color: C.green, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:'3px' }}>forecast →</span>
      </div>

      {/* Meals — magazine-style list */}
      <div style={{ padding:'22px 22px 8px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
          <div style={S.eyebrow}>Today's meals</div>
          <span style={{ fontSize: 11, color: C.dim }}>5 planned</span>
        </div>
        {meals.map((m,i) => (
          <div key={i} onClick={() => go('plan')} style={{
            display:'flex', alignItems:'center', gap: 14,
            padding:'14px 0',
            borderBottom: i < meals.length - 1 ? `1px solid ${C.hair}` : 'none',
            cursor:'pointer',
            opacity: m.done ? .5 : 1,
          }}>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 13, color: m.next ? C.apricot : C.dim, width: 44, fontWeight: 400 }}>{m.t}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: m.next ? 600 : 500, color: m.next ? C.apricot : C.ink, fontFamily: '"Fraunces", serif' }}>{m.l}</div>
              {m.next && <div style={{ fontSize: 10, color: C.apricot, letterSpacing:'.18em', textTransform:'uppercase', marginTop: 2, fontWeight: 700 }}>Up next</div>}
            </div>
            <div style={{ fontSize: 12, color: C.dim, fontFamily:'"Fraunces",serif' }}>{m.kcal}</div>
            {m.done && <span style={{ fontSize: 12, color: C.green }}>✓</span>}
          </div>
        ))}
      </div>

      {state.weighInDue && (
        <div onClick={() => go('weighIn')} style={{ ...S.band(C.apricot, 22), color: C.paper, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ ...S.eyebrow, color:'rgba(255,246,238,.7)' }}>Sunday ritual</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, marginTop: 4 }}>Step on the scale</div>
          </div>
          <span style={{ fontSize: 24, fontFamily:'"Fraunces",serif' }}>→</span>
        </div>
      )}

      <button style={{ ...S.ctaLine, marginTop: 8 }} onClick={() => go('badday')}>Had a rough day yesterday</button>

      <FAB go={go} />
      <TabBar active="today" go={go} />
    </div>
  );
}

// ─────────────────── PLAN / RECIPE / SHOPPING ───────────────────
function Plan({ go }) {
  const meals = [
    { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, p:'P 18 · C 32 · F 8',  done: true },
    { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, p:'P 4 · C 22 · F 9',   done: true },
    { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, p:'P 38 · C 48 · F 18', done: false, next: true },
    { l: 'Protein shake',          t: '16:00', kcal: 220, p:'P 28 · C 12 · F 4',  done: false },
    { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, p:'P 42 · C 50 · F 22', done: false },
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Plan · Today</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}>5 meals · <Em>1,780</Em></h1>
        <div style={{ marginTop: 28 }}>
          {meals.map((m,i) => (
            <div key={i} onClick={() => go('recipe')} style={{
              padding:'18px 0', borderBottom:`1px solid ${C.hair}`, cursor:'pointer',
              display:'flex', alignItems:'baseline', gap: 14,
              opacity: m.done ? .5 : 1,
            }}>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 13, color: m.next ? C.apricot : C.dim, width: 44 }}>{m.t}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontFamily:'"Fraunces",serif', color: m.next ? C.apricot : C.ink, fontWeight: 400 }}>{m.l}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{m.p}</div>
              </div>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 18, color: C.ink }}>{m.kcal}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('coach')}>Swap a meal with Pip</button>
        <button style={S.ctaLine} onClick={() => go('shopping')}>This week's shopping list</button>
      </div>
      <TabBar active="plan" go={go} />
    </div>
  );
}

function Recipe({ go }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header back="plan" go={go}>Recipe</Header>
      {/* photo band — full bleed */}
      <div style={{ background: C.apricotWash, height: 220, display:'flex', alignItems:'center', justifyContent:'center', color: C.apricotDk, fontFamily:'"Fraunces",serif', fontStyle:'italic', fontSize: 18 }}>plate photo</div>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, fontSize: 36, marginTop: 22 }}>Chicken &<br/><Em>quinoa</Em> bowl</h1>
        {/* inline meta — no chips, just typography */}
        <div style={{ marginTop: 16, display:'flex', gap: 24, fontSize: 12, color: C.dim, letterSpacing:'.06em' }}>
          <span><span style={{ fontFamily:'"Fraunces",serif', fontSize: 16, color: C.ink }}>12</span> min</span>
          <span><span style={{ fontFamily:'"Fraunces",serif', fontSize: 16, color: C.ink }}>520</span> kcal</span>
          <span style={{ fontFamily:'"Fraunces",serif', fontSize: 13, color: C.ink }}>P 38 · C 48 · F 18</span>
        </div>

        <div style={{ ...S.eyebrow, marginTop: 32 }}>Ingredients</div>
        <div style={{ marginTop: 8 }}>
          {['180g chicken breast','60g quinoa','½ cucumber','¼ red onion','1 tbsp olive oil','Lemon, salt, pepper'].map(x => (
            <div key={x} style={{ padding:'12px 0', borderBottom:`1px solid ${C.hair}`, fontSize: 14 }}>{x}</div>
          ))}
        </div>

        <div style={{ ...S.eyebrow, marginTop: 32 }}>Method</div>
        <div style={{ marginTop: 8 }}>
          {['Cook quinoa per package.','Season chicken, sear 4 min/side.','Slice veg, dress with oil + lemon.','Plate quinoa, top with chicken & veg.'].map((s,i) => (
            <div key={i} style={{ display:'flex', gap: 18, padding:'14px 0', borderBottom:`1px solid ${C.hair}` }}>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 26, color: C.apricot, width: 32, lineHeight: 1, fontWeight: 300 }}>{i+1}</div>
              <div style={{ flex: 1, fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('shopping')}>Add to shopping list</button>
        <button style={S.ctaLine} onClick={() => go('logChoose')}>I made this — log it</button>
      </div>
    </div>
  );
}

function Shopping({ go }) {
  const groups = [
    ['Produce', ['Cucumber × 2','Red onion × 1','Lemons × 4','Berries · 250g','Spinach · 200g']],
    ['Protein', ['Chicken breast · 600g','Salmon fillet · 400g','Greek yogurt · 1kg']],
    ['Pantry',  ['Quinoa · 500g','Olive oil · 500ml','Almonds · 200g']],
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header back="plan" go={go}>This week</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}>Shopping<br/><Em>list</Em></h1>
      </div>
      <div style={{ ...S.band(C.greenWash, 18), display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop: 22 }}>
        <div style={{ ...S.eyebrow, color: C.green }}>Estimated total</div>
        <div style={{ fontFamily:'"Fraunces",serif', fontSize: 32, color: C.green, fontWeight: 300 }}>~€42</div>
      </div>
      <div style={S.pad}>
        {groups.map(([g, items]) => (
          <div key={g} style={{ marginTop: 28 }}>
            <div style={S.eyebrow}>{g}</div>
            <div style={{ marginTop: 6 }}>
              {items.map(it => (
                <div key={it} style={{ padding:'14px 0', borderBottom:`1px solid ${C.hair}`, fontSize: 14, display:'flex', alignItems:'center', gap: 14 }}>
                  <div style={{ width: 16, height: 16, border:`1px solid ${C.dim}` }}></div>
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('today')}>Order via Glovo</button>
      </div>
    </div>
  );
}

// ─────────────────── COACH CHAT ───────────────────
function Coach({ go }) {
  const [msgs, setMsgs] = React.useState([
    { from:'lumi', text:"Hey Marco — what's on your mind?" },
  ]);
  const send = (text, replyFn) => {
    setMsgs(m => [...m, { from:'me', text }]);
    setTimeout(() => {
      const reply = replyFn();
      setMsgs(m => [...m, { from:'lumi', text: reply.text, action: reply.action }]);
    }, 500);
  };
  const prompts = [
    { q: 'Can I drink wine tonight?', a: () => ({ text:"A glass (150ml) is fine — that's ~120 kcal. I'll trim 100 kcal off dinner. Stick to one and water in between." }) },
    { q: 'Swap my lunch for something lighter', a: () => ({ text:'How about a salmon poke bowl? 480 kcal, P 32 · C 50 · F 14. Tap to swap.', action: { label:'Apply swap', go:'plan' } }) },
    { q: 'Tapas with friends tonight, what do I order?', a: () => ({ text:"Get: pulpo a la gallega, gambas al ajillo, ensalada mixta. Skip: patatas bravas, chorizo. You'll land at ~620 kcal." }) },
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 180 }}>
      <Header>Coach</Header>
      {/* Pip header band — cream wash */}
      <div style={{ background: C.cream, padding:'8px 22px 22px', display:'flex', alignItems:'center', gap: 14 }}>
        <Pip mood={msgs.length > 1 ? 'happy' : 'wave'} size={76} trackCursor={true} />
        <div>
          <div style={{ fontFamily:'"Fraunces",serif', fontSize: 26, color: C.ink, fontWeight: 400, letterSpacing:'-.4px' }}>Pip</div>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 600, letterSpacing:'.08em', textTransform:'uppercase', marginTop: 2 }}>● Listening</div>
        </div>
      </div>

      {/* Messages — bubbles for chat are still appropriate (it's a chat metaphor), but flat, no borders */}
      <div style={{ padding:'24px 22px 8px', display:'flex', flexDirection:'column', gap: 12 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ alignSelf: m.from==='me' ? 'flex-end' : 'flex-start', display:'flex', alignItems:'flex-end', gap: 8, maxWidth:'85%' }}>
            {m.from==='lumi' && i === msgs.length - 1 && <div style={{ marginBottom: -2 }}><Pip mood="happy" size={32} animate={false} /></div>}
            <div style={{
              padding:'12px 16px',
              background: m.from==='me' ? C.ink : C.apricotWash,
              color: m.from==='me' ? C.paper : C.ink,
              fontSize: 14, lineHeight: 1.5,
              borderRadius: m.from==='me' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
            }}>
              {m.text}
              {m.action && (
                <button onClick={() => go(m.action.go)} style={{
                  display:'block', marginTop: 12,
                  background: C.apricot, color: C.paper,
                  border:0, padding:'8px 16px', borderRadius: 0,
                  fontFamily:'inherit', fontSize: 11, fontWeight: 700,
                  letterSpacing:'.14em', textTransform:'uppercase', cursor:'pointer',
                }}>{m.action.label}</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...S.eyebrow, padding:'22px 22px 8px' }}>Try asking</div>
      <div style={S.pad}>
        {prompts.map(p => (
          <button key={p.q} onClick={() => send(p.q, p.a)} style={{
            display:'flex', width:'100%', justifyContent:'space-between', alignItems:'baseline',
            padding:'14px 0', borderBottom:`1px solid ${C.hair}`,
            background:'none', border:'none', borderBottomStyle:'solid', borderBottomWidth: 1, borderBottomColor: C.hair,
            cursor:'pointer', fontFamily:'inherit', textAlign:'left',
          }}>
            <span style={{ fontSize: 14, color: C.ink, fontStyle:'italic', fontFamily:'"Fraunces", serif' }}>"{p.q}"</span>
            <span style={{ color: C.apricot, fontSize: 16 }}>↗</span>
          </button>
        ))}
      </div>

      {/* Composer — minimal, no card */}
      <div style={{ position:'absolute', left: 0, right: 0, bottom: 76, padding:'12px 22px', background: C.creamHi, borderTop:`1px solid ${C.hair}`, display:'flex', gap: 10, alignItems:'center' }}>
        <input placeholder="Ask Pip anything…" style={{ flex: 1, border: 0, outline:'none', background:'transparent', fontSize: 14, fontFamily:'inherit', padding:'10px 0', borderBottom: `1px solid ${C.hair}` }} />
        <button onClick={() => go('logChoose')} style={{ background: C.apricot, color: C.paper, border:0, width: 38, height: 38, cursor:'pointer', fontSize: 18 }}>↑</button>
      </div>
      <TabBar active="coach" go={go} />
    </div>
  );
}

// ─────────────────── LOG (4 modes) ───────────────────
function LogChoose({ go }) {
  const modes = [
    { k:'logVoice',   l:'Voice',   d:'"Two eggs and a coffee"', ic:'🎙' },
    { k:'logPhoto',   l:'Photo',   d:'Snap your plate',          ic:'📷' },
    { k:'logBarcode', l:'Barcode', d:'Scan packaging',           ic:'▦' },
    { k:'logSearch',  l:'Search',  d:'Type-ahead, 250k foods',   ic:'⌕' },
  ];
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Log a meal</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How will<br/>you <Em>log</Em>?</h1>
        <div style={{ marginTop: 32 }}>
          {modes.map(m => (
            <div key={m.k} onClick={() => go(m.k)} style={{
              padding:'22px 0', borderBottom:`1px solid ${C.hair}`, cursor:'pointer',
              display:'flex', alignItems:'center', gap: 18,
            }}>
              <div style={{ fontSize: 28, width: 40, textAlign:'center', color: C.apricot }}>{m.ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, color: C.ink, fontWeight: 400 }}>{m.l}</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{m.d}</div>
              </div>
              <span style={{ color: C.dim, fontSize: 18 }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogVoice({ go }) {
  return (
    <div style={{ ...S.page, background: C.ink, color: C.paper, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: 40 }}>
      <div style={{ ...S.eyebrow, color:'rgba(255,246,238,.5)' }}>Listening</div>
      <h1 style={{ ...S.h1, color: C.paper, textAlign:'center', fontSize: 38, marginTop: 24, lineHeight: 1.05 }}>"Two eggs &<br/><span style={{ color: C.apricot, fontStyle:'italic', fontWeight: 300 }}>a coffee</span>"</h1>
      <div style={{ display:'flex', gap: 5, marginTop: 40, alignItems:'center' }}>
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{ width: 3, height: 20 + (i%4)*22, background: C.apricot, opacity: .9 }}></div>
        ))}
      </div>
      <button style={{ ...S.cta, background: C.apricot, color: C.paper, marginTop: 80, maxWidth: 240 }} onClick={() => go('logConfirm')}>Stop & log</button>
    </div>
  );
}

function LogPhoto({ go }) {
  return (
    <div style={{ ...S.page, background:'#1a1a1a', height:'100%', position:'relative', padding: 0 }}>
      <div style={{ position:'absolute', inset: 60, border:'1px solid rgba(255,255,255,.4)', background:'rgba(232,120,78,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.6)', fontFamily:'"Fraunces",serif', fontStyle:'italic' }}>aim at your plate</div>
      <div style={{ position:'absolute', top: 60, left: 0, right: 0, textAlign:'center', color: C.paper }}>
        <div style={S.eyebrow}>Photo log</div>
      </div>
      <div style={{ position:'absolute', bottom: 80, left: 0, right: 0, display:'flex', justifyContent:'center' }}>
        <button onClick={() => go('logConfirm')} style={{ width: 72, height: 72, borderRadius: 36, background:'#fff', border:'4px solid rgba(255,255,255,.3)', cursor:'pointer' }}></button>
      </div>
    </div>
  );
}

function LogBarcode({ go }) {
  return (
    <div style={{ ...S.page, background:'#1a1a1a', height:'100%', position:'relative', padding: 0 }}>
      <div style={{ position:'absolute', top:'50%', left: 30, right: 30, height: 120, transform:'translateY(-50%)', border:'1px solid rgba(255,255,255,.3)' }}>
        <div style={{ position:'absolute', top:'50%', left: 0, right: 0, height: 1, background: C.apricot, animation:'scan 1.5s infinite', boxShadow:`0 0 12px ${C.apricot}` }}></div>
      </div>
      <div style={{ position:'absolute', top: 60, left: 0, right: 0, textAlign:'center', color: C.paper }}>
        <div style={S.eyebrow}>Scan barcode</div>
      </div>
      <button onClick={() => go('logConfirm')} style={{ ...S.cta, background: C.apricot, position:'absolute', bottom: 40, left: 22, right: 22 }}>Simulate scan</button>
    </div>
  );
}

function LogSearch({ go }) {
  const items = ['Greek yogurt','Banana','Chicken breast','Almonds','Olive oil','Salmon','Quinoa','Espresso'];
  return (
    <div style={S.page}>
      <Header back="logChoose" go={go}>Search foods</Header>
      <div style={S.pad}>
        <input autoFocus placeholder="Search 250k foods…" style={{
          width:'100%', padding:'18px 0', border: 0, borderBottom:`1px solid ${C.ink}`,
          fontSize: 18, fontFamily:'"Fraunces", serif', fontStyle:'italic', background:'transparent', outline:'none', color: C.ink,
          marginTop: 14,
        }} />
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Recents</div>
        <div style={{ marginTop: 8 }}>
          {items.map(it => (
            <div key={it} onClick={() => go('logConfirm')} style={{
              padding:'14px 0', borderBottom:`1px solid ${C.hair}`, cursor:'pointer',
              display:'flex', justifyContent:'space-between', alignItems:'center',
              fontSize: 14, color: C.ink,
            }}>
              <span>{it}</span><span style={{ color: C.dim }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogConfirm({ go }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Confirm</Header>
      {/* recognition band */}
      <div style={{ ...S.band(C.greenWash, 28), marginTop: 8 }}>
        <div style={{ ...S.eyebrow, color: C.green }}>Pip recognized</div>
        <h1 style={{ ...S.h2, color: C.green, marginTop: 8 }}>Two eggs + espresso</h1>
        <div style={{ display:'flex', gap: 24, fontSize: 13, color: C.green, marginTop: 14, fontFamily:'"Fraunces", serif' }}>
          <span>~180 kcal</span>
          <span>P 13</span>
          <span>C 1</span>
          <span>F 13</span>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Looks right?</div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('today')}>Add to today</button>
        <button style={S.ctaLine} onClick={() => go('logSearch')}>Edit details</button>
      </div>
    </div>
  );
}

// ─────────────────── WEIGH-IN LOOP ───────────────────
function WeighIn({ go, set }) {
  const [w, setW] = React.useState(82.4);
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Sunday weigh-in · Week 4</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>What does the<br/><Em>scale</Em> say?</h1>
      </div>
      <div style={{ padding:'48px 22px', textAlign:'center' }}>
        <div style={{ ...S.display, fontSize: 140 }}>{w.toFixed(1)}</div>
        <div style={{ ...S.eyebrow, marginTop: 8 }}>kilograms</div>
        <div style={{ display:'flex', gap: 0, justifyContent:'center', marginTop: 36 }}>
          <button onClick={() => setW(w => Math.round((w-0.1)*10)/10)} style={{ width: 60, height: 60, border:`1px solid ${C.ink}`, background: 'transparent', fontSize: 22, cursor:'pointer', color: C.ink, fontFamily:'inherit' }}>−</button>
          <button onClick={() => setW(w => Math.round((w+0.1)*10)/10)} style={{ width: 60, height: 60, border:`1px solid ${C.ink}`, borderLeft: 0, background: 'transparent', fontSize: 22, cursor:'pointer', color: C.ink, fontFamily:'inherit' }}>+</button>
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.cta} onClick={() => { set('lastWeight', w); set('weighInDue', false); go('weighInResult'); }}>Confirm</button>
      </div>
    </div>
  );
}

function WeighInResult({ go }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Pip's take</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14, fontSize: 44 }}><Em>5 days</Em><br/>ahead</h1>
        <p style={{ ...S.body, marginTop: 14 }}>You lost 0.7 kg this week — 0.05 above target. Beautiful.</p>
      </div>
      <div style={{ ...S.band(C.greenWash, 28), marginTop: 28 }}>
        <div style={{ ...S.eyebrow, color: C.green }}>Adjustment</div>
        <div style={{ fontFamily:'"Fraunces",serif', fontSize: 36, color: C.green, marginTop: 8, fontWeight: 300, letterSpacing:'-1px' }}>+80 kcal/day</div>
        <div style={{ fontSize: 13, color: C.green, marginTop: 14, fontStyle:'italic', fontFamily:'"Fraunces", serif', maxWidth: 280, lineHeight: 1.45 }}>&ldquo;Do not burn out the gas tank — we have 22 weeks ahead.&rdquo;</div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('forecast')}>Apply & see forecast</button>
        <button style={S.ctaLine} onClick={() => go('milestone')}>Skip — celebrate first</button>
      </div>
    </div>
  );
}

function Forecast({ go }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Forecast · 26 weeks</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}><Em>68 kg</Em> · Oct 14</h1>
      </div>
      {/* chart band — full bleed cream */}
      <div style={{ background: C.cream, padding:'24px 22px', marginTop: 22 }}>
        <svg viewBox="0 0 320 160" style={{ width:'100%', height: 160 }}>
          <line x1="0" y1="120" x2="320" y2="120" stroke={C.hair}/>
          <line x1="0" y1="60"  x2="320" y2="60"  stroke={C.hair} strokeDasharray="2 4"/>
          <path d="M0,20 Q80,40 160,80 T320,140" stroke={C.apricot} strokeWidth="2.5" fill="none"/>
          <path d="M0,20 Q80,40 160,80 T320,140 L320,160 L0,160 Z" fill={C.apricot} fillOpacity=".08"/>
          <circle cx="80" cy="50" r="4" fill={C.apricot}/>
          <text x="86" y="46" fontSize="10" fill={C.ink} fontFamily="DM Sans">today · 82.4</text>
          <circle cx="320" cy="140" r="4" fill={C.green}/>
          <text x="260" y="135" fontSize="10" fill={C.green} fontFamily="DM Sans" textAnchor="end">68 kg</text>
        </svg>
      </div>
      {/* stats — magazine 3-column, no borders */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:`1px solid ${C.hair}` }}>
        {[['Lost','−2.6','kg'],['To go','14.4','kg'],['Days early','14','d']].map(([l,v,u],i,arr) => (
          <div key={l} style={{ padding:'22px 16px', textAlign:'center', borderRight: i < arr.length-1 ? `1px solid ${C.hair}` : 'none' }}>
            <div style={{ ...S.eyebrow, fontSize: 9 }}>{l}</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 30, color: C.apricot, marginTop: 6, fontWeight: 300, letterSpacing:'-.5px' }}>{v}</div>
            <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{u}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('milestone')}>View milestones</button>
        <button style={S.ctaLine} onClick={() => go('plateau')}>What if I plateau?</button>
      </div>
      <TabBar active="stats" go={go} />
    </div>
  );
}

function Milestone({ go }) {
  return (
    <div style={{ ...S.page, background: C.cream, height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ paddingTop: 50, textAlign:'center' }}>
        <Pip mood="celebrate" size={170} />
      </div>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
        <div style={S.eyebrow}>Milestone</div>
        <h1 style={{ ...S.h1, fontSize: 56, marginTop: 12 }}><Em>2.5 kg</Em></h1>
        <div style={{ fontFamily:'"Fraunces", serif', fontSize: 28, color: C.ink, fontWeight: 300, marginTop: -4 }}>down</div>
        <p style={{ ...S.body, marginTop: 20, maxWidth: 280, marginLeft:'auto', marginRight:'auto' }}>The weight of 5 sticks of butter. Or one big cantaloupe. Either way — gone.</p>
      </div>
      <div style={{ ...S.band(C.greenWash, 22), display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div style={{ ...S.eyebrow, color: C.green }}>Streak</div>
        <div style={{ fontFamily:'"Fraunces",serif', fontSize: 32, color: C.green, fontWeight: 300 }}>21 days</div>
      </div>
      <button style={S.cta} onClick={() => go('today')}>Back to today</button>
      <button style={{ ...S.ctaLine, paddingBottom: 22 }} onClick={() => go('today')}>Share</button>
    </div>
  );
}

function Plateau({ go }) {
  return (
    <div style={S.page}>
      <Header back="forecast" go={go}>Plateau</Header>
      <div style={{ background: C.cream, padding:'14px 22px 22px', display:'flex', alignItems:'center', gap: 14 }}>
        <Pip mood="curious" size={92} />
        <h1 style={{ ...S.h1, fontSize: 30, margin: 0 }}>3 weeks<br/><Em>stuck</Em>?</h1>
      </div>
      <div style={S.pad}>
        <p style={{ ...S.body, marginTop: 22 }}>Plateaus mean your body is recalibrating, not failing. Here is what works:</p>
      </div>
      <div style={{ ...S.band(C.apricotWash, 24), marginTop: 22 }}>
        <div style={{ ...S.eyebrow, color: C.apricotDk }}>Try this week</div>
        <div style={{ marginTop: 14 }}>
          {['+ 20g protein/day','+ 1 extra walk (30 min)','− 100 kcal carbs at dinner'].map(x => (
            <div key={x} style={{ padding:'12px 0', borderBottom:`1px solid rgba(122,69,32,.15)`, color: C.apricotDk, fontSize: 14, fontFamily:'"Fraunces",serif' }}>{x}</div>
          ))}
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('forecast')}>Apply for one week</button>
        <button style={S.ctaLine} onClick={() => go('coach')}>Talk to Pip instead</button>
      </div>
    </div>
  );
}

function BadDay({ go }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Yesterday</Header>
      <div style={{ background: C.cream, padding:'14px 22px 22px', display:'flex', alignItems:'center', gap: 14 }}>
        <Pip mood="oops" size={92} />
        <h1 style={{ ...S.h1, fontSize: 30, margin: 0 }}>Tomorrow<br/>we <Em>adjust</Em></h1>
      </div>
      <div style={S.pad}>
        <p style={{ ...S.body, marginTop: 22 }}>One bad day does not undo a week of good ones. Pip will spread it out — gently.</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'22px 0', borderBottom:`1px solid ${C.hair}`, marginTop: 22 }}>
          <div style={S.eyebrow}>Yesterday</div>
          <div style={{ fontFamily:'"Fraunces",serif', fontSize: 26, color: C.apricot, fontWeight: 300 }}>+ 520 kcal over</div>
        </div>
      </div>
      <div style={{ ...S.band(C.greenWash, 24), marginTop: 22 }}>
        <div style={{ ...S.eyebrow, color: C.green }}>Pip's plan</div>
        <div style={{ fontFamily:'"Fraunces",serif', fontSize: 28, color: C.green, marginTop: 8, fontWeight: 300, letterSpacing:'-.5px' }}>−104 kcal/day × 5 days</div>
        <div style={{ fontSize: 13, color: C.green, marginTop: 12, fontStyle:'italic', fontFamily:'"Fraunces",serif' }}>No drama. No skipping meals. Forecast unchanged.</div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('today')}>Resume the plan</button>
      </div>
    </div>
  );
}

// ─────────────────── ACTIVITY / PROFILE ───────────────────
function Activity2({ go }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header back="today" go={go}>Activity</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}><Em>Workouts</Em><br/>& steps</h1>
      </div>
      <div style={{ ...S.band(C.greenWash, 24), marginTop: 22 }}>
        <div style={{ ...S.eyebrow, color: C.green }}>Today</div>
        <div style={{ fontFamily:'"Fraunces",serif', fontSize: 44, color: C.green, marginTop: 8, fontWeight: 300, letterSpacing:'-1px' }}>8,420 steps</div>
        <div style={{ fontSize: 13, color: C.green, marginTop: 6 }}>+340 kcal earned</div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>This week</div>
        <div style={{ marginTop: 6 }}>
          {[['Mon','Push','45 min','420 kcal'],['Wed','Pull','40 min','380 kcal'],['Today','Legs','—','planned 18:00']].map(([d,w,t,k]) => (
            <div key={d} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'18px 0', borderBottom:`1px solid ${C.hair}` }}>
              <div>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 18, color: C.ink, fontWeight: 400 }}>{w}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{d} · {t}</div>
              </div>
              <div style={{ fontSize: 12, color: C.green, fontFamily:'"Fraunces", serif' }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.cta} onClick={() => go('today')}>Add a workout</button>
      </div>
    </div>
  );
}

function Profile({ go }) {
  const items = [
    ['Coach tone','Warm', 'profileSettings'],
    ['Units','kg · cm', 'profileSettings'],
    ['Integrations','Apple Health · Glovo', 'profileSettings'],
    ['Privacy','Standard', 'profileSettings'],
    ['Subscription','Trial · 5 days left', 'profileSettings'],
    ['Sign out','', 'welcome'],
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Me</Header>
      {/* hero band */}
      <div style={{ background: C.cream, padding:'18px 22px 28px', display:'flex', alignItems:'center', gap: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: 0, background: C.apricot, color: C.paper, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Fraunces",serif', fontSize: 30, fontWeight: 300 }}>M</div>
        <div>
          <div style={{ fontFamily:'"Fraunces",serif', fontSize: 32, color: C.ink, fontWeight: 400 }}>Marco</div>
          <div style={{ fontSize: 12, color: C.green, marginTop: 4, letterSpacing:'.04em' }}>−2.6 kg · 21-day streak</div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ marginTop: 22 }}>
          {items.map(([l,v,r]) => (
            <Row key={l} label={l} value={`${v}${v ? ' →' : '→'}`} onClick={() => go(r)} />
          ))}
        </div>
      </div>
      <TabBar active="me" go={go} />
    </div>
  );
}

function ProfileSettings({ go }) {
  const tones = ['Warm (default)','Direct','Cheerleader','Stoic'];
  const notifs = ['Daily summary · 09:00','Meal nudge · 12:30','Weigh-in · Sun 09:00','Win moments'];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Settings</Header>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 14 }}>Coach tone</div>
        <div style={{ marginTop: 6 }}>
          {tones.map(t => (
            <Row key={t} label={t} value={t.includes('Warm') ? '✓' : ''} selected={t.includes('Warm')} onClick={()=>{}} />
          ))}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 32 }}>Notifications</div>
        <div style={{ marginTop: 6 }}>
          {notifs.map(t => (
            <div key={t} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', borderBottom:`1px solid ${C.hair}` }}>
              <span style={{ fontSize: 14 }}>{t}</span>
              <div style={{ width: 36, height: 20, background: C.apricot, position:'relative' }}>
                <div style={{ position:'absolute', right: 2, top: 2, width: 16, height: 16, background: C.paper }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────── ROUTE TABLE ───────────────────
const ROUTES = {
  welcome: Welcome, goal: Goal, body: Body, activity: Activity, diet: Diet, schedule: Schedule,
  compute: Compute, plan_reveal: PlanReveal, permissions: Permissions, paywall: Paywall,
  today: Today, plan: Plan, recipe: Recipe, shopping: Shopping,
  coach: Coach,
  logChoose: LogChoose, logVoice: LogVoice, logPhoto: LogPhoto, logBarcode: LogBarcode, logSearch: LogSearch, logConfirm: LogConfirm,
  weighIn: WeighIn, weighInResult: WeighInResult, forecast: Forecast, milestone: Milestone, plateau: Plateau, badday: BadDay,
  activity2: Activity2, profile: Profile, profileSettings: ProfileSettings,
};

window.LUMI_ROUTES = ROUTES;

// ─────────────────── MASCOT GALLERY ───────────────────
function MascotGallery({ go }) {
  const moods = [
    { m:'happy',     l:'Happy',     d:'Default greeting' },
    { m:'celebrate', l:'Celebrate', d:'Milestones, streak wins' },
    { m:'proud',     l:'Proud',     d:'Plan reveal, recap' },
    { m:'thinking',  l:'Thinking',  d:'AI computing' },
    { m:'cheering',  l:'Cheering',  d:'You hit your goal' },
    { m:'curious',   l:'Curious',   d:'Plateau, open question' },
    { m:'oops',      l:'Oops',      d:'Bad day, recovery' },
    { m:'sad',       l:'Sad',       d:'Missed weigh-in' },
    { m:'sleepy',    l:'Sleepy',    d:'Late night nudge' },
    { m:'love',      l:'Love',      d:'Share with friends' },
    { m:'typing',    l:'Typing',    d:'Coach replying' },
    { m:'wave',      l:'Wave',      d:'Hello / goodbye' },
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 60 }}>
      <Header back="today" go={go}>Pip · your coach</Header>
      <div style={{ background: C.cream, padding:'14px 22px 28px', display:'flex', alignItems:'center', gap: 16 }}>
        <Pip mood="wave" size={110} trackCursor={true} />
        <div style={{ flex: 1 }}>
          <h1 style={{ ...S.h1, fontSize: 32, margin: 0 }}>Hi, I'm <Em>Pip</Em></h1>
          <p style={{ ...S.body, margin: '8px 0 0', fontSize: 13 }}>A little peach with a big plan.</p>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 22 }}>Twelve moods</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', columnGap: 0, rowGap: 0, marginTop: 8 }}>
          {moods.map((o, i) => (
            <div key={o.m} style={{
              padding:'18px 12px',
              textAlign:'center',
              borderBottom:`1px solid ${C.hair}`,
              borderRight: i % 2 === 0 ? `1px solid ${C.hair}` : 'none',
            }}>
              <div style={{ display:'flex', justifyContent:'center', height: 130, alignItems:'flex-end' }}>
                <Pip mood={o.m} size={92} />
              </div>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 16, color: C.ink, marginTop: 8, fontWeight: 400 }}>{o.l}</div>
              <div style={{ fontSize: 10.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{o.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
ROUTES.mascotGallery = MascotGallery;
