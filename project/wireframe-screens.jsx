// All screens for the Lumi interactive wireframe — Warm Material system
// Soft pillow surfaces with depth, gradients, real icons, photo moments.
// Each screen receives { go, state, set } props

const C = {
  // base
  cream:    '#F2EAD8',
  creamHi:  '#FAF6F0',
  creamSoft:'#FFF7E8',
  paper:    '#FBF6EB',
  ink:      '#1F1B17',
  inkSoft:  '#3A3128',
  muted:    '#5A4F40',
  dim:      '#8C7B6A',
  hair:     '#E5DAC4',
  // pillow surfaces (subtle, warm)
  pillow:   '#FFFBF1',           // primary surface — slightly brighter than page
  pillowAlt:'#FBF1DC',           // secondary surface
  // accents
  apricot:  '#E8784E',
  apricotDk:'#7A4520',
  apricotLt:'#FCEAD8',
  apricotMd:'#F4B690',
  apricotWash:'#FBDFC8',
  butter:   '#F5C56A',
  butterLt: '#FBE4B0',
  green:    '#3D5A4A',
  greenMd:  '#7FA088',
  greenLt:  '#E2EBE5',
  greenWash:'#CDDED2',
  plum:     '#5A3A55',
  sky:      '#A9C4D6',
  skyLt:    '#DDE9F0',
};

// pillow shadow — quiet, single soft layer for clarity
const PILLOW_SHADOW = '0 2px 8px -4px rgba(122,69,32,.10), 0 1px 2px rgba(122,69,32,.05)';
const PILLOW_SHADOW_SM = '0 1px 4px -2px rgba(122,69,32,.08)';
const BTN_SHADOW = '0 4px 12px -4px rgba(232,120,78,.35)';

const S = {
  page:    { background: C.creamHi, minHeight: '100%', fontFamily: '"DM Sans", system-ui', position:'relative' },
  pad:     { padding: '0 22px' },
  eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: '.22em', color: C.dim, textTransform: 'uppercase' },
  h1:      { fontFamily: '"Fraunces", serif', fontVariationSettings: '"SOFT" 100', fontWeight: 400, fontSize: 38, lineHeight: 1.02, letterSpacing: '-1.2px', color: C.ink, margin: 0 },
  h2:      { fontFamily: '"Fraunces", serif', fontVariationSettings: '"SOFT" 100', fontWeight: 400, fontSize: 26, lineHeight: 1.05, letterSpacing: '-.6px', color: C.ink, margin: 0 },
  body:    { fontSize: 15, lineHeight: 1.55, color: C.muted, margin: 0 },
  display: { fontFamily: '"Fraunces", serif', fontVariationSettings: '"SOFT" 100', fontWeight: 300, color: C.apricot, lineHeight: .9, letterSpacing:'-3px' },
  // pillow surface — soft, warm, depth
  pillow:  { background: C.pillow, borderRadius: 22, boxShadow: PILLOW_SHADOW, padding: 20 },
  pillowSm:{ background: C.pillow, borderRadius: 18, boxShadow: PILLOW_SHADOW_SM, padding: 16 },
  // primary CTA — flat solid apricot, very subtle shadow
  cta:     { display:'block', width:'100%', textAlign:'center', background: C.ink, color: C.paper, border:0, padding: '17px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily:'inherit', cursor:'pointer', letterSpacing:'.02em', boxShadow: '0 4px 12px -4px rgba(31,27,23,.25)' },
  ctaApricot: { display:'block', width:'100%', textAlign:'center', background: C.apricot, color: C.paper, border:0, padding: '17px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily:'inherit', cursor:'pointer', letterSpacing:'.02em', boxShadow: BTN_SHADOW },
  ctaLine: { display:'block', width:'100%', textAlign:'center', background:'transparent', color: C.muted, border:0, padding: '14px', fontSize: 13, fontWeight: 500, fontFamily:'inherit', cursor:'pointer' },
};

const Em = ({ children }) => <em style={{ color: C.apricot, fontStyle:'italic', fontWeight: 400 }}>{children}</em>;

// ───────────────────── ICON SYSTEM ─────────────────────
// Canonical Lumi icon set — sourced from Icon System.html.
// 24×24 grid · 1.6 stroke · round caps · apricot accent embedded where called for.
// All icons are functions (c) => <svg/> · pass any color; default is currentColor (inherits).
const ICON_PATHS = {
  "today": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1\"/></g>",
  "plan": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"3\"/><path d=\"M8 3.5v3M16 3.5v3M3.5 10h17\"/><path d=\"M9 14.5c1.5-2 3.5-2 5 0M9 17h6\" stroke=\"#E8784E\"/></g>",
  "coach": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 11c0-3.3 3.6-6 8-6s8 2.7 8 6c0 3.3-3.6 6-8 6-.9 0-1.7-.1-2.5-.3L6 19l1-3.6C5.1 14.3 4 12.7 4 11z\"/><path d=\"M12 8.5l.9 1.8 2 .3-1.4 1.4.3 2L12 13l-1.8 1 .3-2-1.4-1.4 2-.3z\" fill=\"#E8784E\" stroke=\"#E8784E\"/></g>",
  "stats": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 20h16\"/><path d=\"M7 17v-4M12 17V8M17 17v-7\"/><path d=\"M5 8l4-3 4 4 5-5\" stroke=\"#E8784E\"/><circle cx=\"18\" cy=\"4\" r=\"1.4\" fill=\"#E8784E\" stroke=\"none\"/></g>",
  "me": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"9\" r=\"3.4\"/><path d=\"M5 20c1-3.5 3.8-5 7-5s6 1.5 7 5\"/></g>",
  "breakfast": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12h13a3 3 0 010 6H8a4 4 0 01-4-4z\"/><path d=\"M17 12h2a2 2 0 110 4h-2\"/><path d=\"M8 8c0-1 1-1 1-2s-1-1-1-2M12 8c0-1 1-1 1-2s-1-1-1-2\" stroke=\"#E8784E\"/></g>",
  "lunch": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 13h18a9 9 0 01-18 0z\"/><path d=\"M2 18h20\"/><circle cx=\"9\" cy=\"9\" r=\"2.2\" stroke=\"#E8784E\"/><circle cx=\"14\" cy=\"7.5\" r=\"1.6\" stroke=\"#E8784E\"/></g>",
  "snack": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 4c2 1 3 2.5 3 4.5 0 1-.4 1.8-1 2.5l1 9-3-2-3 2 1-9c-.6-.7-1-1.5-1-2.5C9 6.5 10 5 12 4z\"/><path d=\"M12 5.5v3M11 8l1 1 1-1\" stroke=\"#E8784E\"/></g>",
  "dinner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 11c0-3.5 3-6 7-6s7 2.5 7 6c0 1.5-.5 2.7-1.3 3.7L20 17H4l1.3-2.3C4.5 13.7 5 12.5 5 11z\"/><path d=\"M9 11h6\" stroke=\"#E8784E\"/></g>",
  "water": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3.5c4 4.5 6 7.5 6 10.5a6 6 0 01-12 0c0-3 2-6 6-10.5z\"/><path d=\"M9 14a3 3 0 003 3\" stroke=\"#E8784E\"/></g>",
  "protein": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 11c0-3 2-5 5-5 1.5 0 2.5.5 3.5 1.5L19 13l-2 2-5.5-5.5C11 9 10.5 8.5 10 8.5c-1.5 0-3 1.2-3 2.5 0 .5.2 1 .5 1.5L13 18l-2 2-6-6c-.7-.7-1-1.7-1-3z\"/><circle cx=\"16\" cy=\"8\" r=\"1.4\" fill=\"#E8784E\" stroke=\"none\"/></g>",
  "veg": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 4c-2 0-4 1.5-5 3.5C7 8 5 10 5 13a6 6 0 0012 0c0-3-2-5-4-5.5C13 5.5 14 4 14 4z\"/><path d=\"M11 4c.5 1.5 0 3-1 4\" stroke=\"#E8784E\"/></g>",
  "grain": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 4v16\"/><path d=\"M12 7c-2-1-4-1-5 0 0 2 2 3 5 3M12 7c2-1 4-1 5 0 0 2-2 3-5 3M12 12c-2-1-4-1-5 0 0 2 2 3 5 3M12 12c2-1 4-1 5 0 0 2-2 3-5 3M12 17c-2-1-4-1-5 0 0 2 2 3 5 3M12 17c2-1 4-1 5 0 0 2-2 3-5 3\" stroke=\"#E8784E\"/></g>",
  "flame": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3c1 3.5 4 5 4 8.5 0 2.5-2 4.5-4 4.5s-4-2-4-4.5C8 9 9 7 9 5c1.5 1 2.5 2 3 4z\"/><path d=\"M11 12c.5 1 1.5 1.5 2 1.5\" stroke=\"#E8784E\"/><path d=\"M12 16v3\" stroke=\"currentColor\"/></g>",
  "steps": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 17c-1.5 0-2.5-1-2.5-2.5 0-1.8 1-3.5 1.5-5C7.5 8 8.5 7 10 7c1.2 0 2 .8 2 2 0 1.5-1 3-1.5 4.5-.4 1.4-1 3.5-2.5 3.5z\"/><path d=\"M16 11c-1 0-1.5-.7-1.5-1.5 0-1 .5-2 1-3 .3-.7 1-1.5 2-1.5.8 0 1.5.5 1.5 1.5 0 1-.5 2-1 3-.3.8-.8 1.5-2 1.5z\" stroke=\"#E8784E\"/></g>",
  "workout": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3.5 10v4M6.5 7v10M20.5 10v4M17.5 7v10\"/><path d=\"M6.5 12h11\" stroke=\"#E8784E\"/></g>",
  "heart": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 19s-7-4.5-7-9.5c0-2.5 2-4.5 4.5-4.5 1.4 0 2.6.7 3.5 1.8.9-1.1 2.1-1.8 3.5-1.8 2.5 0 4.5 2 4.5 4.5 0 5-7 9.5-7 9.5z\"/><path d=\"M8 11.5l2 .5 1-2 1.5 3 1-1.5h2\" stroke=\"#E8784E\"/></g>",
  "sleep": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 14.5A8 8 0 119.5 4a6.5 6.5 0 0010.5 10.5z\"/><path d=\"M14 8h3l-3 3h3\" stroke=\"#E8784E\"/></g>",
  "scale": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"3\"/><path d=\"M8 9l4-2 4 2\" stroke=\"#E8784E\"/><path d=\"M9.5 13h5\" stroke=\"currentColor\"/></g>",
  "mic": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9.5\" y=\"3.5\" width=\"5\" height=\"10\" rx=\"2.5\"/><path d=\"M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6\"/><circle cx=\"12\" cy=\"8\" r=\"1.2\" fill=\"#E8784E\" stroke=\"none\"/></g>",
  "camera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 8h3l1.5-2h7L17 8h3a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0120 20H4a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 014 8z\"/><circle cx=\"12\" cy=\"13.5\" r=\"3.5\" stroke=\"#E8784E\"/></g>",
  "barcode": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 6v12M7 6v12M10 6v12M13 6v12M16 6v12M19 6v12\" stroke=\"currentColor\"/><path d=\"M3 4.5L3 3.5h3M21 4.5L21 3.5h-3M3 19.5L3 20.5h3M21 19.5L21 20.5h-3\" stroke=\"#E8784E\"/></g>",
  "search": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"6\"/><path d=\"M15.5 15.5l4 4\" stroke=\"#E8784E\"/></g>",
  "add": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 8v8M8 12h8\" stroke=\"#E8784E\"/></g>",
  "target": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"4.5\"/><circle cx=\"12\" cy=\"12\" r=\"1.4\" fill=\"#E8784E\" stroke=\"none\"/></g>",
  "trend": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 16l5-5 4 3 7-7\"/><path d=\"M14 7h6v6\" stroke=\"#E8784E\"/></g>",
  "streak": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3.5c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3.5 1-5.5 0 1.5 1 2.5 2 2.5 0-2 1-5 2-7z\"/><path d=\"M10 14.5c.5 1.5 1.5 2 2 2\" stroke=\"#E8784E\"/></g>",
  "medal": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"14\" r=\"5\"/><path d=\"M9 9.5L7 4h10l-2 5.5\"/><path d=\"M10 14l1.5 1.5L14 13\" stroke=\"#E8784E\"/></g>",
  "bell": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 16V11a6 6 0 0112 0v5l1.5 2H4.5z\"/><path d=\"M10 20a2 2 0 004 0\"/><circle cx=\"17\" cy=\"6\" r=\"1.6\" fill=\"#E8784E\" stroke=\"none\"/></g>",
  "cart": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 4h2.5l2 12h11l1.5-8H7\"/><circle cx=\"9\" cy=\"19.5\" r=\"1.4\"/><circle cx=\"17\" cy=\"19.5\" r=\"1.4\"/><path d=\"M11 10h5\" stroke=\"#E8784E\"/></g>",
  "recipe": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3.5h11a2 2 0 012 2v13a2 2 0 01-2 2H8a2 2 0 01-2-2V3.5z\"/><path d=\"M6 7h-1.5a1 1 0 00-1 1v10a1 1 0 001 1H6\"/><path d=\"M9 9h6M9 12h6M9 15h4\" stroke=\"#E8784E\"/></g>",
  "settings": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"2.8\" stroke=\"#E8784E\"/><path d=\"M12 4v2M12 18v2M4 12H6M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4\"/></g>",
  "check": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M8 12.5l3 3 5-6\" stroke=\"#E8784E\"/></g>",
  "close": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M9 9l6 6M15 9l-6 6\" stroke=\"#E8784E\"/></g>",
  "sparkle": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z\" fill=\"#E8784E\" stroke=\"#E8784E\"/><path d=\"M18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z\" stroke=\"currentColor\"/></g>"
};

function makeIcon(name) {
  return (c) => {
    const body = ICON_PATHS[name];
    if (!body) return null;
    return <svg viewBox="0 0 24 24" style={{ width:'100%', height:'100%', color: c || 'currentColor' }} dangerouslySetInnerHTML={{ __html: body }} />;
  };
}

const I = {
  today: makeIcon('today'),
  plan: makeIcon('plan'),
  coach: makeIcon('coach'),
  stats: makeIcon('stats'),
  me: makeIcon('me'),
  breakfast: makeIcon('breakfast'),
  lunch: makeIcon('lunch'),
  snack: makeIcon('snack'),
  dinner: makeIcon('dinner'),
  water: makeIcon('water'),
  protein: makeIcon('protein'),
  veg: makeIcon('veg'),
  grain: makeIcon('grain'),
  flame: makeIcon('flame'),
  steps: makeIcon('steps'),
  workout: makeIcon('workout'),
  heart: makeIcon('heart'),
  sleep: makeIcon('sleep'),
  scale: makeIcon('scale'),
  mic: makeIcon('mic'),
  camera: makeIcon('camera'),
  barcode: makeIcon('barcode'),
  search: makeIcon('search'),
  add: makeIcon('add'),
  target: makeIcon('target'),
  trend: makeIcon('trend'),
  streak: makeIcon('streak'),
  medal: makeIcon('medal'),
  bell: makeIcon('bell'),
  cart: makeIcon('cart'),
  recipe: makeIcon('recipe'),
  settings: makeIcon('settings'),
  check: makeIcon('check'),
  close: makeIcon('close'),
  sparkle: makeIcon('sparkle'),
  // aliases for legacy names used across screens
  tabHome: makeIcon('today'),
  tabPlan: makeIcon('plan'),
  tabCoach: makeIcon('coach'),
  tabStats: makeIcon('stats'),
  tabMe: makeIcon('me'),
  spark: makeIcon('sparkle'),
  bowl: makeIcon('breakfast'),
  apple: makeIcon('snack'),
  shake: makeIcon('protein'),
  fish: makeIcon('lunch'),
  chicken: makeIcon('dinner'),
  leaf: makeIcon('veg'),
  walk: makeIcon('steps'),
  clock: makeIcon('sleep'),
  cam: makeIcon('camera'),
  health: makeIcon('heart'),
  plus: makeIcon('add'),
  arrow: makeIcon('add'),
};

// ───────────────────── shared components ───────────────────────
function Header({ children, back, go, mode = 'cream' }) {
  const fg = mode === 'dark' ? 'rgba(255,246,238,.6)' : C.dim;
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 10, padding:'18px 22px 6px' }}>
      {back && <button onClick={() => go(back)} style={{ background:'rgba(0,0,0,.04)', border:0, width: 34, height: 34, borderRadius: 999, fontSize: 18, color: fg, cursor:'pointer', padding: 0, lineHeight: 1, fontFamily:'serif', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>}
      <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: fg, textTransform:'uppercase', letterSpacing:'.18em' }}>{children}</div>
    </div>
  );
}

// Icon chip — circle with an icon, used as visual hook on rows
function IconChip({ tone='apricot', size=44, children }) {
  const tones = {
    apricot: { bg: C.apricotWash, color: C.apricotDk },
    apricotSolid: { bg: C.apricot, color: '#fff' },
    green:   { bg: C.greenLt, color: C.green },
    greenSolid: { bg: C.green, color: '#fff' },
    butter:  { bg: C.butterLt, color: C.apricotDk },
    sky:     { bg: C.skyLt, color: C.green },
    cream:   { bg: C.cream, color: C.apricotDk },
  };
  const t = tones[tone] || tones.apricot;
  return (
    <div style={{
      width: size, height: size,
      flexShrink: 0,
      borderRadius: 999,
      background: t.bg,
      color: t.color,
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow: PILLOW_SHADOW_SM,
    }}>
      <div style={{ width: size * .5, height: size * .5 }}>{children}</div>
    </div>
  );
}

// Decorative blob — soft colored shape behind hero text
function Blob({ color, size=240, top, left, right, bottom, opacity=.55 }) {
  return (
    <div style={{
      position:'absolute',
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      pointerEvents:'none',
      top, left, right, bottom,
      filter: 'blur(8px)',
    }}/>
  );
}

// Mini ring progress (SVG)
function Ring({ pct=0.5, size=44, stroke=4, color=C.apricot, track=C.apricotWash, label, sublabel }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - pct * c;
  return (
    <div style={{ position:'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"/>
      </svg>
      {label && <div style={{ position:'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'"Fraunces",serif', fontSize: size*.3, fontWeight:400, color: C.ink, lineHeight: 1 }}>
        {label}
        {sublabel && <div style={{ fontSize: 8, color: C.dim, fontFamily:'"DM Sans"', letterSpacing:'.1em', textTransform:'uppercase', marginTop: 1 }}>{sublabel}</div>}
      </div>}
    </div>
  );
}

// Magazine-style row with optional icon chip on the left
function Row({ label, value, onClick, selected, dense, icon, sub }) {
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap: 14,
      padding: dense ? '10px 0' : '16px 0',
      borderBottom: `1px solid ${C.hair}`,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {icon && <div style={{ flexShrink: 0 }}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: selected ? 600 : 500, color: selected ? C.apricot : C.ink }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 13, color: selected ? C.apricot : C.dim, fontFamily: typeof value === 'string' && /^[\d.,]/.test(value) ? '"Fraunces", serif' : 'inherit' }}>{value}</div>
    </div>
  );
}

function TabBar({ active, go }) {
  const tabs = [
    { id: 'today',   route: 'today',    label: 'Today', ic: I.tabHome },
    { id: 'plan',    route: 'plan',     label: 'Plan',  ic: I.tabPlan },
    { id: 'coach',   route: 'coach',    label: 'Coach', ic: I.tabCoach },
    { id: 'stats',   route: 'forecast', label: 'Stats', ic: I.tabStats },
    { id: 'me',      route: 'profile',  label: 'Me',    ic: I.tabMe },
  ];
  return (
    <div style={{ position:'absolute', left: 0, right: 0, bottom: 0, display:'flex', justifyContent:'space-around', background: 'rgba(255,251,241,.92)', backdropFilter:'blur(10px)', borderTop: `1px solid ${C.hair}`, padding:'10px 8px 26px', zIndex: 5 }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => go(t.route)} style={{
            background:'none', border:0, padding:'4px 10px', cursor:'pointer', fontFamily:'inherit',
            display:'flex', flexDirection:'column', alignItems:'center', gap: 3,
          }}>
            <div style={{ width: 22, height: 22, color: on ? C.apricot : C.dim }}>{t.ic(on ? C.apricot : C.dim, on)}</div>
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, color: on ? C.apricot : C.dim, letterSpacing: on ? '.04em' : 0 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function FAB({ go }) {
  return (
    <button onClick={() => go('logChoose')} style={{
      position:'absolute', right: 22, bottom: 92,
      height: 56, paddingLeft: 18, paddingRight: 22,
      background: C.apricot,
      color: C.paper, border:0,
      fontSize: 14, fontWeight: 700, letterSpacing:'.02em',
      cursor:'pointer', zIndex: 6, fontFamily:'inherit',
      borderRadius: 999,
      display:'flex', alignItems:'center', gap: 8,
      boxShadow: '0 14px 28px -10px rgba(232,120,78,.6), 0 4px 0 rgba(122,69,32,.18), 0 1px 0 rgba(255,255,255,.4) inset',
    }}>
      <span style={{ width: 20, height: 20, fontSize: 22, lineHeight: '20px' }}>+</span>
      Log meal
    </button>
  );
}

// food illustration — abstract gradient plate, used for meal photos
function FoodPlate({ tone='apricot', icon, size=64 }) {
  const tones = {
    apricot: `radial-gradient(circle at 30% 30%, #FBE0CC, #F4B690 70%, #E8784E)`,
    green:   `radial-gradient(circle at 30% 30%, #E8F0EA, #B5CEBC 70%, #7FA088)`,
    butter:  `radial-gradient(circle at 30% 30%, #FCEDC4, #F5C56A 70%, #D9A23E)`,
    cream:   `radial-gradient(circle at 30% 30%, #FFF5E0, #F2E0BB 70%, #D9C28C)`,
    sky:     `radial-gradient(circle at 30% 30%, #EAF1F6, #BDD2DE 70%, #88A8BD)`,
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: tones[tone] || tones.apricot,
      flexShrink: 0,
      boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 8px 16px -10px rgba(122,69,32,.35), 0 2px 4px -2px rgba(122,69,32,.18)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color: 'rgba(255,255,255,.92)',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ width: size*.5, height: size*.5, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.15))' }}>{icon}</div>
    </div>
  );
}

// ─────────────────── ONBOARDING ───────────────────
function Welcome({ go }) {
  return (
    <div style={{ ...S.page, height:'100%', display:'flex', flexDirection:'column', background: C.creamHi, position:'relative', overflow:'hidden' }}>
      <Blob color={C.apricotMd} size={300} top={-60} right={-80} opacity={.18} />
      <Blob color={C.butterLt} size={240} bottom={120} left={-60} opacity={.08} />
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'40px 24px', position:'relative', zIndex: 1 }}>
        <Pip mood="wave" size={170} trackCursor={true} />
        <h1 style={{ ...S.h1, fontSize: 56, marginTop: 20 }}>Hi, I'm</h1>
        <h1 style={{ ...S.h1, fontSize: 88, color: C.apricot, fontStyle:'italic', fontWeight: 300, marginTop: -6 }}>Pip</h1>
        <p style={{ ...S.body, fontSize: 15, marginTop: 18, maxWidth: 280 }}>Your weight-loss partner.<br/>Warm. Specific. On your side.</p>
      </div>
      <div style={{ padding:'0 22px 28px', position:'relative', zIndex: 1 }}>
        <button style={S.ctaApricot} onClick={() => go('goal')}>Let's begin</button>
        <button style={S.ctaLine} onClick={() => go('today')}>I have an account</button>
      </div>
    </div>
  );
}

function Goal({ go, state, set }) {
  const opts = [
    { label: 'Lose weight',   icon: <IconChip tone="apricotSolid">{I.target('#fff')}</IconChip> },
    { label: 'Build muscle',  icon: <IconChip tone="greenSolid">{I.spark('#fff')}</IconChip> },
    { label: 'Maintain',      icon: <IconChip tone="butter">{I.heart(C.apricotDk)}</IconChip> },
    { label: 'Eat better',    icon: <IconChip tone="green">{I.leaf(C.green)}</IconChip> },
  ];
  return (
    <div style={S.page}>
      <Header>Step 1 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>What do you<br/>want to <Em>change</Em>?</h1>
        <p style={{ ...S.body, marginTop: 10 }}>Pick one. You can shift later.</p>
        <div style={{ marginTop: 24, display:'flex', flexDirection:'column', gap: 12 }}>
          {opts.map(o => {
            const on = state.goal === o.label;
            return (
              <div key={o.label} onClick={() => set('goal', o.label)} style={{
                display:'flex', alignItems:'center', gap: 14,
                padding: 14,
                background: on ? C.pillow : 'rgba(255,251,241,.5)',
                borderRadius: 18,
                boxShadow: on ? PILLOW_SHADOW : 'none',
                border: on ? `1.5px solid ${C.apricot}` : '1.5px solid transparent',
                cursor:'pointer',
              }}>
                {o.icon}
                <span style={{ flex: 1, fontSize: 16, fontWeight: on ? 600 : 500, color: C.ink, fontFamily:'"Fraunces",serif' }}>{o.label}</span>
                {on && <div style={{ width: 24, height: 24, borderRadius: 999, background: C.apricot, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width: 14, height: 14 }}>{I.check('#fff')}</div></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={{ ...S.ctaApricot, opacity: state.goal ? 1 : .35 }} disabled={!state.goal} onClick={() => go('body')}>Continue</button>
      </div>
    </div>
  );
}

function Body({ go, state }) {
  const fields = [
    { k: 'weight', label: 'Current weight', v: state.weight, suffix: 'kg', icon: <IconChip tone="apricot" size={40}>{I.scale(C.apricotDk)}</IconChip> },
    { k: 'height', label: 'Height',         v: state.height, suffix: 'cm', icon: <IconChip tone="green" size={40}>{I.trend(C.green)}</IconChip> },
    { k: 'age',    label: 'Age',            v: state.age,    suffix: 'yrs', icon: <IconChip tone="butter" size={40}>{I.spark(C.apricotDk)}</IconChip> },
    { k: 'target', label: 'Target weight',  v: state.target, suffix: 'kg', icon: <IconChip tone="apricotSolid" size={40}>{I.target('#fff')}</IconChip> },
  ];
  return (
    <div style={S.page}>
      <Header back="goal" go={go}>Step 2 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>Tell me<br/>about <Em>you</Em></h1>
        <div style={{ marginTop: 24, display:'flex', flexDirection:'column', gap: 10 }}>
          {fields.map(f => (
            <div key={f.k} style={{ ...S.pillowSm, display:'flex', alignItems:'center', gap: 14 }}>
              {f.icon}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: C.muted, letterSpacing:'.04em' }}>{f.label}</div>
              </div>
              <div style={{ fontFamily:'"Fraunces", serif', fontSize: 26, color: C.ink, fontWeight: 400 }}>
                {f.v} <span style={{ fontSize: 12, color: C.dim, fontFamily:'"DM Sans"' }}>{f.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('activity')}>Continue</button>
      </div>
    </div>
  );
}

function Activity({ go, state, set }) {
  const opts = [
    { k: 'sed',     l: 'Sedentary', d: 'Mostly sitting',     ic: I.clock(C.dim) },
    { k: 'lite',    l: 'Light',     d: '2–3 workouts/wk',    ic: I.walk(C.green) },
    { k: 'active',  l: 'Active',    d: 'Daily movement',     ic: I.walk(C.green) },
    { k: 'athlete', l: 'Athlete',   d: 'Training hard',      ic: I.flame(C.apricot) },
  ];
  return (
    <div style={S.page}>
      <Header back="body" go={go}>Step 3 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How <Em>active</Em><br/>are you?</h1>
        <div style={{ marginTop: 24, display:'flex', flexDirection:'column', gap: 10 }}>
          {opts.map((o, i) => {
            const on = state.activity === o.k;
            const tones = ['cream','green','greenSolid','apricotSolid'];
            return (
              <div key={o.k} onClick={() => set('activity', o.k)} style={{
                display:'flex', alignItems:'center', gap: 14, padding: 14,
                background: on ? C.pillow : 'rgba(255,251,241,.5)',
                borderRadius: 18,
                boxShadow: on ? PILLOW_SHADOW : 'none',
                border: on ? `1.5px solid ${C.apricot}` : '1.5px solid transparent',
                cursor:'pointer',
              }}>
                <IconChip tone={tones[i]} size={44}>{o.ic}</IconChip>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: on ? 600 : 500, color: on ? C.apricot : C.ink, fontFamily:'"Fraunces", serif' }}>{o.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{o.d}</div>
                </div>
                {on && <div style={{ width: 24, height: 24, borderRadius: 999, background: C.apricot, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width: 14, height: 14 }}>{I.check('#fff')}</div></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={{ ...S.ctaApricot, opacity: state.activity ? 1 : .35 }} disabled={!state.activity} onClick={() => go('diet')}>Continue</button>
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
        <div style={{ display:'flex', flexWrap:'wrap', gap: 10, marginTop: 22 }}>
          {tags.map(t => {
            const on = (state.diet||[]).includes(t);
            return (
              <button key={t} onClick={() => toggle(t)} style={{
                padding:'12px 18px', borderRadius: 999, border: 0,
                background: on ? C.apricot : C.pillow,
                color: on ? C.paper : C.ink,
                fontSize: 13, fontWeight: 500, cursor:'pointer', fontFamily:'inherit',
                boxShadow: on ? BTN_SHADOW : PILLOW_SHADOW_SM,
                display:'flex', alignItems:'center', gap: 6,
              }}>
                {on && <div style={{ width: 12, height: 12 }}>{I.check('#fff')}</div>}
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'40px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('schedule')}>Continue</button>
      </div>
    </div>
  );
}

function Schedule({ go }) {
  const meals = [
    ['Wake','07:00','butter', I.spark(C.apricotDk)],
    ['Breakfast','07:30','apricot', I.bowl(C.apricotDk)],
    ['Lunch','13:00','green', I.chicken(C.green)],
    ['Dinner','20:00','apricot', I.fish(C.apricotDk)],
    ['Sleep','23:30','sky', I.heart(C.green)],
  ];
  return (
    <div style={S.page}>
      <Header back="diet" go={go}>Step 5 / 6</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>When do<br/>you <Em>eat</Em>?</h1>
        <div style={{ marginTop: 24, display:'flex', flexDirection:'column', gap: 8 }}>
          {meals.map(([l,t,tone,ic]) => (
            <div key={l} style={{ ...S.pillowSm, display:'flex', alignItems:'center', gap: 14 }}>
              <IconChip tone={tone} size={40}>{ic}</IconChip>
              <span style={{ flex: 1, fontSize: 15, color: C.ink, fontWeight: 500 }}>{l}</span>
              <span style={{ fontFamily:'"Fraunces",serif', fontSize: 18, color: C.apricot }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('compute')}>Continue</button>
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
    <div style={{ ...S.page, background: C.creamHi, height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
      <Blob color={C.apricotMd} size={280} top={-40} left={-80} opacity={.18} />
      <Blob color={C.butterLt} size={220} bottom={80} right={-60} opacity={.08} />
      <div style={{ position:'relative', zIndex: 1 }}>
        <Pip mood="thinking" size={170} />
        <h1 style={{ ...S.h2, fontSize: 30, marginTop: 14 }}>Pip is <Em>thinking</Em></h1>
        <div style={{ marginTop: 28, width: 280, ...S.pillow, padding: 0, overflow:'hidden' }}>
          {steps.map((s,i) => (
            <div key={s} style={{
              padding: '14px 18px', fontSize: 13,
              color: i<=step ? C.ink : C.dim,
              opacity: i<=step ? 1 : .35,
              transition:'opacity .3s',
              borderBottom: i < steps.length - 1 ? `1px solid ${C.hair}` : 'none',
              display:'flex', justifyContent:'space-between', alignItems:'center',
            }}>
              <span style={{ textAlign:'left' }}>{s}</span>
              <span style={{ width: 18, height: 18, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {i<step ? <div style={{ width: 18, height: 18, borderRadius: 999, background: C.green, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width: 12, height: 12 }}>{I.check('#fff')}</div></div>
                  : i===step ? <div style={{ width: 10, height: 10, borderRadius: 999, background: C.apricot, animation: 'pulse 1s ease-in-out infinite' }}/>
                  : <div style={{ width: 8, height: 8, borderRadius: 999, background: C.hair }}/>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanReveal({ go }) {
  return (
    <div style={{ ...S.page, background: C.creamHi, height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <Blob color={C.apricotMd} size={320} top={-100} right={-100} opacity={.18} />
      <Blob color={C.greenWash} size={240} bottom={140} left={-60} opacity={.22} />
      <div style={{ paddingTop: 44, textAlign:'center', position:'relative', zIndex: 1 }}>
        <Pip mood="proud" size={140} />
      </div>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center', padding:'0 24px', position:'relative', zIndex: 1 }}>
        <div style={S.eyebrow}>Your plan</div>
        <h1 style={{ ...S.h1, fontSize: 30, marginTop: 8 }}>26 weeks to <Em>68 kg</Em></h1>
        <div style={{ ...S.display, fontSize: 140, margin:'16px 0', letterSpacing:'-6px' }}>0.65</div>
        <div style={{ fontSize: 12, color: C.muted, letterSpacing:'.18em', textTransform:'uppercase' }}>kg per week — safe, sustainable</div>
      </div>
      <div style={{ padding:'0 22px 22px', position:'relative', zIndex: 1 }}>
        <div style={{ ...S.pillow, background: C.greenLt, display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
          <IconChip tone="greenSolid" size={48}>{I.target('#fff')}</IconChip>
          <div style={{ flex: 1, marginLeft: 14, textAlign:'left' }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Estimated finish</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2 }}>Oct 14, 2026</div>
          </div>
          <div style={{ fontSize: 11, color: C.green, opacity: .8, fontStyle:'italic', fontFamily:'"Fraunces",serif' }}>~ 14 days early</div>
        </div>
        <button style={S.ctaApricot} onClick={() => go('permissions')}>I'm in</button>
      </div>
    </div>
  );
}

function Permissions({ go }) {
  const [done, setDone] = React.useState({});
  const items = [
    ['notif',  'Notifications', 'Gentle nudges. Never spam.', I.bell, 'apricot'],
    ['health', 'Health app',    'Steps + workouts auto-sync.', I.health, 'green'],
    ['cam',    'Camera',        'Photo + barcode logging.',    I.cam, 'butter'],
    ['mic',    'Microphone',    'Voice logging.',              I.mic, 'apricotSolid'],
  ];
  return (
    <div style={S.page}>
      <Header>Permissions</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>A few quick<br/><Em>asks</Em></h1>
        <div style={{ marginTop: 24, display:'flex', flexDirection:'column', gap: 10 }}>
          {items.map(([k,l,d,ic,tone]) => {
            const on = done[k];
            return (
              <div key={k} onClick={() => setDone({...done,[k]:true})} style={{
                ...S.pillowSm,
                display:'flex', alignItems:'center', gap: 14,
                cursor:'pointer',
                background: on ? C.greenLt : C.pillow,
              }}>
                <IconChip tone={tone} size={44}>{ic(tone === 'apricotSolid' ? '#fff' : C.apricotDk)}</IconChip>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: C.ink, fontFamily:'"Fraunces", serif' }}>{l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{d}</div>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: 999,
                  background: on ? C.green : 'transparent',
                  border: on ? 0 : `1.5px solid ${C.dim}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{on && <div style={{ width: 16, height: 16 }}>{I.check('#fff')}</div>}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('paywall')}>Continue</button>
      </div>
    </div>
  );
}

function Paywall({ go }) {
  const features = [
    ['Voice + photo logging', I.mic],
    ['AI coach (unlimited)',  I.spark],
    ['26-week forecast',      I.trend],
    ['Recipes & shopping list', I.cart],
    ['Weekly weigh-in & adjust', I.scale],
    ['Apple Health sync',     I.health],
  ];
  return (
    <div style={{ ...S.page, background: `radial-gradient(circle at 80% 0%, #2D2620 0%, ${C.ink} 60%)`, color: C.paper, height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <Blob color={C.apricot} size={300} top={-80} right={-80} opacity={.08} />
      <div style={{ padding:'40px 24px 16px', position:'relative', zIndex: 1 }}>
        <div style={{ ...S.eyebrow, color: C.apricot }}>✦ Unlock Lumi</div>
        <h1 style={{ ...S.h1, color: C.paper, fontSize: 44, marginTop: 14 }}>
          <span style={{ color: C.apricot, fontStyle:'italic', fontWeight: 300 }}>7 days</span><br/>on the house
        </h1>
        <p style={{ fontSize: 14, color:'rgba(255,246,238,.65)', lineHeight: 1.55, marginTop: 14, maxWidth: 280 }}>
          Then €8.99/month. Cancel anytime, even mid-trial.
        </p>
      </div>
      <div style={{ padding:'8px 24px', flex: 1, position:'relative', zIndex: 1 }}>
        <div style={{ background:'rgba(255,246,238,.06)', borderRadius: 22, padding: 18, backdropFilter:'blur(10px)', border:'1px solid rgba(255,246,238,.08)' }}>
          {features.map(([f, ic], i) => (
            <div key={f} style={{
              padding:'12px 0',
              borderBottom: i < features.length - 1 ? '1px solid rgba(255,246,238,.08)' : 0,
              fontSize: 14, display:'flex', alignItems:'center', gap: 14, color: C.paper,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background:'rgba(232,120,78,.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width: 16, height: 16 }}>{ic(C.apricot)}</div>
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'16px 22px 22px', position:'relative', zIndex: 1 }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Start free trial</button>
        <button style={{ ...S.ctaLine, color:'rgba(255,246,238,.55)' }} onClick={() => go('today')}>Maybe later</button>
      </div>
    </div>
  );
}


// ─────────────────── TODAY HUB ───────────────────
function Today({ go, state }) {
  const meals = [
    { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, done: true,  tone: 'apricot', ic: I.bowl(C.apricotDk) },
    { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, done: true,  tone: 'butter',  ic: I.apple(C.apricotDk) },
    { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, done: false, next: true, tone: 'green', ic: I.chicken(C.green) },
    { l: 'Protein shake',          t: '16:00', kcal: 220, done: false, tone: 'cream',   ic: I.shake(C.apricotDk) },
    { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, done: false, tone: 'sky',     ic: I.fish(C.green) },
  ];
  const eaten = 1108, total = 1780, left = total - eaten, pct = eaten/total;
  const macros = [['Protein', 88, 142, 'g', C.apricot], ['Carbs', 142, 220, 'g', C.butter], ['Fat', 42, 60, 'g', C.greenMd]];

  return (
    <div style={{ ...S.page, paddingBottom: 110, background: C.creamHi }}>
      {/* Greeting band — soft apricot blob backdrop */}
      <div style={{ padding:'22px 22px 14px', position:'relative' }}>
        <Blob color={C.apricotMd} size={180} top={-30} right={-30} opacity={.12} />
        <div style={{ display:'flex', alignItems:'flex-start', gap: 14, position:'relative', zIndex: 1 }}>
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

      {/* Calorie pillow */}
      <div style={{ padding:'8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow }}>
          <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
            <Ring pct={pct} size={88} stroke={8} color={C.apricot} track={C.apricotWash} label={eaten.toLocaleString()} sublabel="eaten" />
            <div style={{ flex: 1 }}>
              <div style={S.eyebrow}>Calories</div>
              <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 4 }}>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 32, color: C.ink, fontWeight: 300, letterSpacing:'-1px' }}>{left}</div>
                <div style={{ fontSize: 12, color: C.dim }}>kcal left</div>
              </div>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 4, display:'flex', alignItems:'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green }}/>
                On pace · {total.toLocaleString()} target
              </div>
            </div>
          </div>
          {/* macro mini-rings */}
          <div style={{ display:'flex', justifyContent:'space-around', marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.hair}` }}>
            {macros.map(([l, a, b, u, color]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <Ring pct={a/b} size={36} stroke={3.5} color={color} track={`${color}33`} />
                <div>
                  <div style={{ fontSize: 9, color: C.dim, fontWeight: 700, letterSpacing:'.14em', textTransform:'uppercase' }}>{l}</div>
                  <div style={{ fontFamily:'"Fraunces",serif', fontSize: 16, color: C.ink, marginTop: 1, fontWeight: 400 }}>{a}<span style={{ fontSize: 10, color: C.dim, fontFamily:'"DM Sans"' }}>/{b}{u}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak pillow — sage */}
      <div style={{ padding:'14px 22px 0' }}>
        <div onClick={() => go('forecast')} style={{
          ...S.pillowSm,
          background: C.greenLt,
          display:'flex', alignItems:'center', gap: 14, cursor:'pointer',
        }}>
          <IconChip tone="greenSolid" size={44}>{I.flame('#fff')}</IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Streak</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2, letterSpacing:'-.4px' }}>21 days · −2.6 kg</div>
          </div>
          <div style={{ width: 18, height: 18 }}>{I.arrow(C.green)}</div>
        </div>
      </div>

      {/* Meals — pillow list with food plates */}
      <div style={{ padding:'22px 22px 8px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 12, padding:'0 4px' }}>
          <div style={S.eyebrow}>Today's meals</div>
          <span style={{ fontSize: 11, color: C.dim }}>5 planned</span>
        </div>
        <div style={{ ...S.pillow, padding: 0 }}>
          {meals.map((m, i) => (
            <div key={i} onClick={() => go('plan')} style={{
              display:'flex', alignItems:'center', gap: 14,
              padding:'14px 18px',
              borderBottom: i < meals.length - 1 ? `1px solid ${C.hair}` : 'none',
              cursor:'pointer',
              opacity: m.done ? .55 : 1,
              background: m.next ? C.apricotLt : 'transparent',
            }}>
              <FoodPlate tone={m.tone} icon={m.ic} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: m.next ? 600 : 500, color: m.next ? C.apricot : C.ink, fontFamily: '"Fraunces", serif' }}>{m.l}</div>
                <div style={{ display:'flex', gap: 8, alignItems:'center', marginTop: 3 }}>
                  <span style={{ fontSize: 11, color: C.dim }}>{m.t}</span>
                  {m.next && <span style={{ fontSize: 9, color: C.apricot, letterSpacing:'.14em', textTransform:'uppercase', fontWeight: 700, background: C.apricotLt, padding:'2px 6px', borderRadius: 4 }}>Up next</span>}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: 14, color: C.ink, fontFamily:'"Fraunces",serif', fontWeight: 400 }}>{m.kcal}</div>
                <div style={{ fontSize: 9, color: C.dim, letterSpacing:'.1em', textTransform:'uppercase' }}>kcal</div>
              </div>
              {m.done && <div style={{ width: 22, height: 22, borderRadius: 999, background: C.green, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width: 12, height: 12 }}>{I.check('#fff')}</div></div>}
            </div>
          ))}
        </div>
      </div>

      {state.weighInDue && (
        <div style={{ padding:'16px 22px 0' }}>
          <div onClick={() => go('weighIn')} style={{
            ...S.pillow,
            background: C.apricot,
            color: C.paper, cursor:'pointer',
            display:'flex', alignItems:'center', gap: 14,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width: 22, height: 22 }}>{I.scale('#fff')}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...S.eyebrow, color:'rgba(255,246,238,.85)' }}>Sunday ritual</div>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 19, marginTop: 2 }}>Step on the scale</div>
            </div>
            <div style={{ width: 18, height: 18 }}>{I.arrow('#fff')}</div>
          </div>
        </div>
      )}

      <button style={{ ...S.ctaLine, marginTop: 12 }} onClick={() => go('badday')}>Had a rough day yesterday</button>

      <FAB go={go} />
      <TabBar active="today" go={go} />
    </div>
  );
}

// ─────────────────── PLAN / RECIPE / SHOPPING ───────────────────
function Plan({ go }) {
  const meals = [
    { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, p:'P 18 · C 32 · F 8',  done: true, tone:'apricot', ic: I.bowl(C.apricotDk) },
    { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, p:'P 4 · C 22 · F 9',   done: true, tone:'butter',  ic: I.apple(C.apricotDk) },
    { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, p:'P 38 · C 48 · F 18', done: false, next: true, tone:'green', ic: I.chicken(C.green) },
    { l: 'Protein shake',          t: '16:00', kcal: 220, p:'P 28 · C 12 · F 4',  done: false, tone:'cream',   ic: I.shake(C.apricotDk) },
    { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, p:'P 42 · C 50 · F 22', done: false, tone:'sky',     ic: I.fish(C.green) },
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Plan · Today</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}>5 meals · <Em>1,780</Em></h1>
        <div style={{ marginTop: 22, display:'flex', flexDirection:'column', gap: 10 }}>
          {meals.map((m,i) => (
            <div key={i} onClick={() => go('recipe')} style={{
              ...S.pillowSm, display:'flex', alignItems:'center', gap: 14,
              cursor:'pointer', opacity: m.done ? .55 : 1,
              background: m.next ? C.apricotLt : C.pillow,
              border: m.next ? `1.5px solid ${C.apricot}40` : '1.5px solid transparent',
            }}>
              <FoodPlate tone={m.tone} icon={m.ic} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontFamily:'"Fraunces",serif', color: m.next ? C.apricot : C.ink, fontWeight: 400 }}>{m.l}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>{m.t} · {m.p}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 18, color: C.ink, fontWeight: 400 }}>{m.kcal}</div>
                {m.done && <div style={{ fontSize: 9, color: C.green, fontWeight: 700, letterSpacing:'.1em', textTransform:'uppercase' }}>✓ done</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('coach')}>Swap a meal with Pip</button>
        <button style={S.ctaLine} onClick={() => go('shopping')}>This week's shopping list →</button>
      </div>
      <TabBar active="plan" go={go} />
    </div>
  );
}

function Recipe({ go }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      {/* Hero photo band — full bleed gradient with abstract food */}
      <div style={{ position:'relative', height: 280, background: `radial-gradient(circle at 60% 50%, #F4B690 0%, ${C.apricot} 50%, #B85530 100%)`, overflow:'hidden' }}>
        <Blob color="#FBE0CC" size={240} top={20} left={30} opacity={.08} />
        <div style={{ position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width: 200, height: 200, borderRadius: 999, background:'radial-gradient(circle at 35% 35%, #FFF5E0, #F2E0BB 50%, #C5A268 90%)', boxShadow:'0 24px 48px -16px rgba(0,0,0,.35), inset 0 -12px 24px rgba(0,0,0,.12), inset 0 8px 16px rgba(255,255,255,.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width: 110, height: 110, borderRadius: 999, background:'radial-gradient(circle at 35% 35%, #E2EBE5, #7FA088 60%, #3D5A4A)', boxShadow:'inset 0 -8px 16px rgba(0,0,0,.18), inset 0 4px 8px rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width: 44, height: 44 }}>{I.chicken('#fff')}</div>
            </div>
          </div>
        </div>
        <div style={{ position:'absolute', top: 18, left: 22 }}>
          <button onClick={() => go('plan')} style={{ background:'rgba(255,255,255,.25)', backdropFilter:'blur(8px)', border:0, width: 38, height: 38, borderRadius: 999, fontSize: 18, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
        </div>
        <div style={{ position:'absolute', top: 18, right: 22 }}>
          <button style={{ background:'rgba(255,255,255,.25)', backdropFilter:'blur(8px)', border:0, width: 38, height: 38, borderRadius: 999, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width: 18, height: 18 }}>{I.heart('#fff')}</div>
          </button>
        </div>
      </div>

      {/* content pillow lifted up over photo */}
      <div style={{ padding:'0 22px', marginTop: -32, position:'relative', zIndex: 2 }}>
        <div style={{ ...S.pillow, padding: 22 }}>
          <h1 style={{ ...S.h1, fontSize: 32 }}>Chicken &<br/><Em>quinoa</Em> bowl</h1>
          <div style={{ marginTop: 14, display:'flex', gap: 8 }}>
            {[
              [I.clock(C.apricotDk), '12 min', 'apricot'],
              [I.flame(C.apricotDk), '520 kcal', 'butter'],
              [I.spark(C.green), 'P 38', 'green'],
            ].map(([ic, l, t], i) => (
              <div key={i} style={{ flex: 1, padding:'10px 8px', borderRadius: 14, background: t === 'apricot' ? C.apricotLt : t === 'butter' ? C.butterLt : C.greenLt, textAlign:'center' }}>
                <div style={{ width: 18, height: 18, margin:'0 auto' }}>{ic}</div>
                <div style={{ fontSize: 11, fontFamily:'"Fraunces",serif', color: C.ink, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...S.pad, marginTop: 24 }}>
        <div style={S.eyebrow}>Ingredients</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {['180g chicken breast','60g quinoa','½ cucumber','¼ red onion','1 tbsp olive oil','Lemon, salt, pepper'].map((x, i, arr) => (
            <div key={x} style={{ padding:'12px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, fontSize: 14, color: C.ink, display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: C.apricot }}/>
              {x}
            </div>
          ))}
        </div>

        <div style={{ ...S.eyebrow, marginTop: 24 }}>Method</div>
        <div style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 10 }}>
          {['Cook quinoa per package.','Season chicken, sear 4 min/side.','Slice veg, dress with oil + lemon.','Plate quinoa, top with chicken & veg.'].map((s,i) => (
            <div key={i} style={{ ...S.pillowSm, display:'flex', gap: 14, alignItems:'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: C.apricot, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Fraunces",serif', fontSize: 15, fontWeight: 500, boxShadow: PILLOW_SHADOW_SM }}>{i+1}</div>
              <div style={{ flex: 1, fontSize: 14, color: C.ink, lineHeight: 1.5, paddingTop: 6 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('shopping')}>Add to shopping list</button>
        <button style={S.ctaLine} onClick={() => go('logChoose')}>I made this — log it</button>
      </div>
    </div>
  );
}

function Shopping({ go }) {
  const groups = [
    ['Produce', 'green', I.leaf, [['Cucumber', '× 2'],['Red onion', '× 1'],['Lemons', '× 4'],['Berries', '· 250g'],['Spinach', '· 200g']]],
    ['Protein', 'apricot', I.fish, [['Chicken breast', '· 600g'],['Salmon fillet', '· 400g'],['Greek yogurt', '· 1kg']]],
    ['Pantry', 'butter', I.bowl, [['Quinoa', '· 500g'],['Olive oil', '· 500ml'],['Almonds', '· 200g']]],
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header back="plan" go={go}>This week</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 8 }}>Shopping<br/><Em>list</Em></h1>
        <div style={{ marginTop: 22, ...S.pillow, background: C.greenLt, display:'flex', alignItems:'center', gap: 14 }}>
          <IconChip tone="greenSolid" size={48}>{I.cart('#fff')}</IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Estimated total</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 28, color: C.green, fontWeight: 300, marginTop: 2 }}>~€42</div>
          </div>
          <div style={{ fontSize: 11, color: C.green, opacity: .7, fontStyle:'italic' }}>15 items</div>
        </div>
      </div>
      <div style={S.pad}>
        {groups.map(([g, tone, ic, items]) => (
          <div key={g} style={{ marginTop: 22 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
              <IconChip tone={tone} size={28}>{ic(tone === 'green' ? C.green : C.apricotDk)}</IconChip>
              <div style={S.eyebrow}>{g}</div>
            </div>
            <div style={{ ...S.pillow, padding: 0 }}>
              {items.map(([name, qty], i) => (
                <div key={name} style={{ padding:'14px 18px', borderBottom: i < items.length - 1 ? `1px solid ${C.hair}` : 0, fontSize: 14, display:'flex', alignItems:'center', gap: 14 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border:`1.5px solid ${C.hair}`, background: C.creamHi }}/>
                  <span style={{ flex: 1, color: C.ink }}>{name}</span>
                  <span style={{ color: C.dim, fontSize: 12 }}>{qty}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Order via Glovo</button>
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
    { q: 'Can I drink wine tonight?', ic: I.heart, a: () => ({ text:"A glass (150ml) is fine — that's ~120 kcal. I'll trim 100 kcal off dinner. Stick to one and water in between." }) },
    { q: 'Swap my lunch for something lighter', ic: I.fish, a: () => ({ text:'How about a salmon poke bowl? 480 kcal, P 32 · C 50 · F 14. Tap to swap.', action: { label:'Apply swap', go:'plan' } }) },
    { q: 'Tapas with friends tonight, what do I order?', ic: I.spark, a: () => ({ text:"Get: pulpo a la gallega, gambas al ajillo, ensalada mixta. Skip: patatas bravas, chorizo. You'll land at ~620 kcal." }) },
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 180 }}>
      <Header>Coach</Header>
      {/* Pip header — soft cream pillow */}
      <div style={{ padding:'4px 22px 14px' }}>
        <div style={{ ...S.pillow, background: C.pillow, display:'flex', alignItems:'center', gap: 14 }}>
          <Pip mood={msgs.length > 1 ? 'happy' : 'wave'} size={64} trackCursor={true} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, color: C.ink, fontWeight: 400 }}>Pip</div>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 600, letterSpacing:'.06em', textTransform:'uppercase', marginTop: 2, display:'flex', alignItems:'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: C.green, animation:'pulse 1.4s ease-in-out infinite' }}/>
              Listening
            </div>
          </div>
          <IconChip tone="apricot" size={36}>{I.spark(C.apricotDk)}</IconChip>
        </div>
      </div>

      {/* messages */}
      <div style={{ padding:'4px 22px 8px', display:'flex', flexDirection:'column', gap: 10 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ alignSelf: m.from==='me' ? 'flex-end' : 'flex-start', display:'flex', alignItems:'flex-end', gap: 8, maxWidth:'85%' }}>
            {m.from==='lumi' && i === msgs.length - 1 && <div style={{ marginBottom: -2 }}><Pip mood="happy" size={32} animate={false} /></div>}
            <div style={{
              padding:'12px 16px',
              background: m.from==='me' ? C.ink : C.apricotLt,
              color: m.from==='me' ? C.paper : C.ink,
              fontSize: 14, lineHeight: 1.5,
              borderRadius: m.from==='me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: PILLOW_SHADOW_SM,
            }}>
              {m.text}
              {m.action && (
                <button onClick={() => go(m.action.go)} style={{
                  display:'flex', alignItems:'center', gap: 6, marginTop: 12,
                  background: C.apricot, color: C.paper,
                  border:0, padding:'8px 14px', borderRadius: 999,
                  fontFamily:'inherit', fontSize: 12, fontWeight: 600,
                  cursor:'pointer', boxShadow: BTN_SHADOW,
                }}>
                  <div style={{ width: 12, height: 12 }}>{I.check('#fff')}</div>
                  {m.action.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'18px 22px 8px' }}><div style={S.eyebrow}>Try asking</div></div>
      <div style={{ padding:'0 22px', display:'flex', flexDirection:'column', gap: 8 }}>
        {prompts.map(p => (
          <button key={p.q} onClick={() => send(p.q, p.a)} style={{
            ...S.pillowSm, display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12,
            cursor:'pointer', fontFamily:'inherit', textAlign:'left', border: 0, width:'100%',
          }}>
            <IconChip tone="apricot" size={32}>{p.ic(C.apricotDk)}</IconChip>
            <span style={{ flex: 1, fontSize: 13.5, color: C.ink, fontStyle:'italic', fontFamily:'"Fraunces", serif' }}>"{p.q}"</span>
            <div style={{ width: 16, height: 16, color: C.apricot }}>{I.arrow(C.apricot)}</div>
          </button>
        ))}
      </div>

      {/* Composer */}
      <div style={{ position:'absolute', left: 0, right: 0, bottom: 76, padding:'12px 22px', background:'rgba(255,251,241,.92)', backdropFilter:'blur(10px)', borderTop:`1px solid ${C.hair}`, display:'flex', gap: 10, alignItems:'center' }}>
        <div style={{ flex: 1, ...S.pillowSm, padding:'10px 16px', display:'flex', alignItems:'center', gap: 10 }}>
          <input placeholder="Ask Pip anything…" style={{ flex: 1, border: 0, outline:'none', background:'transparent', fontSize: 14, fontFamily:'inherit' }} />
          <div style={{ width: 18, height: 18 }}>{I.mic(C.dim)}</div>
        </div>
        <button onClick={() => go('logChoose')} style={{ background: C.apricot, color: C.paper, border:0, width: 44, height: 44, borderRadius: 999, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: BTN_SHADOW }}>
          <div style={{ width: 18, height: 18, transform:'rotate(-90deg)' }}>{I.arrow('#fff')}</div>
        </button>
      </div>
      <TabBar active="coach" go={go} />
    </div>
  );
}

// ─────────────────── LOG (4 modes) ───────────────────
function LogChoose({ go }) {
  const modes = [
    { k:'logVoice',   l:'Voice',   d:'"Two eggs and a coffee"', ic: I.mic,     tone:'apricotSolid' },
    { k:'logPhoto',   l:'Photo',   d:'Snap your plate',          ic: I.cam,    tone:'greenSolid' },
    { k:'logBarcode', l:'Barcode', d:'Scan packaging',           ic: I.barcode, tone:'butter' },
    { k:'logSearch',  l:'Search',  d:'Type-ahead, 250k foods',   ic: I.search,  tone:'apricot' },
  ];
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Log a meal</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How will<br/>you <Em>log</Em>?</h1>
        <div style={{ marginTop: 28, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
          {modes.map(m => (
            <div key={m.k} onClick={() => go(m.k)} style={{
              ...S.pillow, padding: 18, cursor:'pointer',
              display:'flex', flexDirection:'column', alignItems:'flex-start', gap: 14, minHeight: 140,
            }}>
              <IconChip tone={m.tone} size={48}>{m.ic(['apricotSolid','greenSolid'].includes(m.tone) ? '#fff' : C.apricotDk)}</IconChip>
              <div>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 20, color: C.ink, fontWeight: 400 }}>{m.l}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 4, lineHeight: 1.3 }}>{m.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogVoice({ go }) {
  return (
    <div style={{ ...S.page, background: `radial-gradient(circle at 50% 30%, #2D2620, ${C.ink} 70%)`, color: C.paper, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: 40, position:'relative', overflow:'hidden' }}>
      <Blob color={C.apricot} size={300} top={-50} left={-50} opacity={.1} />
      <Blob color={C.apricot} size={260} bottom={-30} right={-50} opacity={.08} />
      <div style={{ position:'relative', zIndex: 1, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        {/* pulsing mic ring */}
        <div style={{ position:'relative', width: 120, height: 120, marginBottom: 28 }}>
          <div style={{ position:'absolute', inset: 0, borderRadius: 999, background:'rgba(232,120,78,.2)', animation:'pulse-ring 1.6s ease-out infinite' }}/>
          <div style={{ position:'absolute', inset: 12, borderRadius: 999, background:'rgba(232,120,78,.3)', animation:'pulse-ring 1.6s ease-out .3s infinite' }}/>
          <div style={{ position:'absolute', inset: 24, borderRadius: 999, background: C.apricot, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 12px 28px -8px rgba(232,120,78,.6)' }}>
            <div style={{ width: 36, height: 36 }}>{I.mic('#fff')}</div>
          </div>
        </div>
        <div style={{ ...S.eyebrow, color:'rgba(255,246,238,.5)' }}>Listening</div>
        <h1 style={{ ...S.h1, color: C.paper, textAlign:'center', fontSize: 36, marginTop: 16, lineHeight: 1.05 }}>"Two eggs &<br/><span style={{ color: C.apricot, fontStyle:'italic', fontWeight: 300 }}>a coffee</span>"</h1>
        <div style={{ display:'flex', gap: 5, marginTop: 32, alignItems:'center', height: 60 }}>
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} style={{ width: 3, height: 8 + (i%4)*16, background: C.apricot, borderRadius: 999, animation: `bar ${0.6 + (i%3)*0.2}s ease-in-out ${i*0.05}s infinite alternate` }}/>
          ))}
        </div>
      </div>
      <button style={{ ...S.ctaApricot, marginTop: 60, maxWidth: 240, position:'relative', zIndex: 1 }} onClick={() => go('logConfirm')}>Stop & log</button>
    </div>
  );
}

function LogPhoto({ go }) {
  return (
    <div style={{ ...S.page, background:'#1a1a1a', height:'100%', position:'relative', padding: 0 }}>
      {/* simulated viewfinder with food blob */}
      <div style={{ position:'absolute', inset: 0, background:'radial-gradient(circle at 50% 45%, #4a3a2a 0%, #1a1a1a 70%)' }}/>
      <div style={{ position:'absolute', inset: 60, border:'2px solid rgba(255,255,255,.4)', borderRadius: 24, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset: 0, background:'radial-gradient(circle at 50% 50%, #F4B690 0%, #B85530 60%, transparent 100%)', opacity:.6 }}/>
        {/* corner brackets */}
        {[[0,0],[0,1],[1,0],[1,1]].map(([y,x],i) => (
          <div key={i} style={{
            position:'absolute',
            [y?'bottom':'top']: 12, [x?'right':'left']: 12,
            width: 24, height: 24,
            borderTop: y ? 0 : '3px solid #fff',
            borderBottom: y ? '3px solid #fff' : 0,
            borderLeft: x ? 0 : '3px solid #fff',
            borderRight: x ? '3px solid #fff' : 0,
          }}/>
        ))}
      </div>
      <div style={{ position:'absolute', top: 18, left: 22 }}>
        <button onClick={() => go('logChoose')} style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', border:0, width: 38, height: 38, borderRadius: 999, fontSize: 18, color:'#fff', cursor:'pointer' }}>‹</button>
      </div>
      <div style={{ position:'absolute', top: 30, left: 0, right: 0, textAlign:'center', color: '#fff' }}>
        <div style={{ ...S.eyebrow, color:'rgba(255,255,255,.7)' }}>Photo log</div>
      </div>
      <div style={{ position:'absolute', bottom: 60, left: 0, right: 0, display:'flex', justifyContent:'center', gap: 28, alignItems:'center' }}>
        <button style={{ width: 44, height: 44, borderRadius: 999, background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', border:0, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width: 18, height: 18 }}>{I.spark('#fff')}</div>
        </button>
        <button onClick={() => go('logConfirm')} style={{ width: 76, height: 76, borderRadius: 999, background:'#fff', border:'5px solid rgba(255,255,255,.3)', cursor:'pointer', boxShadow:'0 0 0 1px rgba(0,0,0,.1), 0 8px 24px rgba(0,0,0,.4)' }}/>
        <button style={{ width: 44, height: 44, borderRadius: 999, background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', border:0, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width: 18, height: 18 }}>{I.flame('#fff')}</div>
        </button>
      </div>
    </div>
  );
}

function LogBarcode({ go }) {
  return (
    <div style={{ ...S.page, background:'#1a1a1a', height:'100%', position:'relative', padding: 0 }}>
      <div style={{ position:'absolute', inset: 0, background:'radial-gradient(circle at 50% 50%, #2a241e 0%, #0f0f0f 70%)' }}/>
      <div style={{ position:'absolute', top:'50%', left: 30, right: 30, height: 160, transform:'translateY(-50%)', borderRadius: 16, border:'2px solid rgba(255,255,255,.3)', overflow:'hidden' }}>
        <div style={{ position:'absolute', top: 20, bottom: 20, left: 20, right: 20, display:'flex', alignItems:'center', justifyContent:'space-around', opacity: .6 }}>
          {[3,1,2,4,1,3,2,1,4,2,3,1,2].map((w,i) => (
            <div key={i} style={{ width: w, height: '100%', background:'#fff' }}/>
          ))}
        </div>
        <div style={{ position:'absolute', top:'50%', left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.apricot}, transparent)`, animation:'scan 1.5s infinite', boxShadow:`0 0 16px ${C.apricot}` }}/>
      </div>
      <div style={{ position:'absolute', top: 30, left: 0, right: 0, textAlign:'center', color: '#fff' }}>
        <div style={{ ...S.eyebrow, color:'rgba(255,255,255,.7)' }}>Scan barcode</div>
        <div style={{ fontSize: 13, color:'rgba(255,255,255,.5)', marginTop: 8, fontStyle:'italic', fontFamily:'"Fraunces",serif' }}>Center the code in the frame</div>
      </div>
      <div style={{ position:'absolute', top: 18, left: 22 }}>
        <button onClick={() => go('logChoose')} style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', border:0, width: 38, height: 38, borderRadius: 999, fontSize: 18, color:'#fff', cursor:'pointer' }}>‹</button>
      </div>
      <button onClick={() => go('logConfirm')} style={{ ...S.ctaApricot, position:'absolute', bottom: 40, left: 22, right: 22 }}>Simulate scan</button>
    </div>
  );
}

function LogSearch({ go }) {
  const items = [
    ['Greek yogurt', '100g · 59 kcal', 'apricot', I.bowl],
    ['Banana', '1 medium · 105 kcal', 'butter', I.apple],
    ['Chicken breast', '100g · 165 kcal', 'green', I.chicken],
    ['Almonds', '12 nuts · 84 kcal', 'cream', I.apple],
    ['Olive oil', '1 tbsp · 119 kcal', 'butter', I.bowl],
    ['Salmon', '100g · 208 kcal', 'apricot', I.fish],
    ['Quinoa', '60g cooked · 71 kcal', 'green', I.bowl],
    ['Espresso', '1 shot · 3 kcal', 'cream', I.flame],
  ];
  return (
    <div style={S.page}>
      <Header back="logChoose" go={go}>Search foods</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillowSm, marginTop: 14, padding:'14px 18px', display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ width: 18, height: 18 }}>{I.search(C.apricot)}</div>
          <input autoFocus placeholder="Search 250k foods…" style={{
            flex: 1, padding: 0, border: 0,
            fontSize: 16, fontFamily:'"Fraunces", serif', fontStyle:'italic',
            background:'transparent', outline:'none', color: C.ink,
          }} />
        </div>
        <div style={{ ...S.eyebrow, marginTop: 24 }}>Recents</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {items.map(([name, sub, tone, ic], i) => (
            <div key={name} onClick={() => go('logConfirm')} style={{
              padding:'12px 18px', borderBottom: i < items.length - 1 ? `1px solid ${C.hair}` : 0, cursor:'pointer',
              display:'flex', alignItems:'center', gap: 12,
            }}>
              <IconChip tone={tone} size={36}>{ic(C.apricotDk)}</IconChip>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: C.ink, fontFamily:'"Fraunces",serif', fontWeight: 400 }}>{name}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{sub}</div>
              </div>
              <div style={{ width: 16, height: 16 }}>{I.arrow(C.dim)}</div>
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
      <div style={{ padding:'8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 20 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <IconChip tone="greenSolid" size={44}>{I.check('#fff')}</IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Pip recognized</div>
              <h1 style={{ ...S.h2, color: C.green, marginTop: 4, fontSize: 22 }}>Two eggs + espresso</h1>
            </div>
          </div>
          <div style={{ display:'flex', gap: 8, marginTop: 18 }}>
            {[['~180', 'kcal'],['13', 'P'],['1', 'C'],['13', 'F']].map(([v, l]) => (
              <div key={l} style={{ flex: 1, background:'rgba(255,255,255,.45)', borderRadius: 12, padding:'10px 8px', textAlign:'center' }}>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 18, color: C.green, fontWeight: 400 }}>{v}</div>
                <div style={{ fontSize: 9, color: C.green, fontWeight: 700, letterSpacing:'.16em', textTransform:'uppercase', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 24, marginBottom: 10 }}>Looks right?</div>
        <div style={{ ...S.pillowSm, display:'flex', alignItems:'center', gap: 12 }}>
          <FoodPlate tone="butter" icon={I.apple('#fff')} size={48} />
          <div style={{ flex: 1, fontSize: 13, color: C.muted, fontStyle:'italic', fontFamily:'"Fraunces",serif' }}>
            Pip's confidence: <span style={{ color: C.green, fontWeight: 600, fontStyle:'normal' }}>92%</span>
          </div>
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Add to today</button>
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
      <div style={{ padding:'32px 22px', textAlign:'center', position:'relative' }}>
        <Blob color={C.apricotMd} size={260} top={-20} left="50%" opacity={.08} />
        <div style={{ position:'relative', zIndex: 1 }}>
          <div style={{ ...S.display, fontSize: 140 }}>{w.toFixed(1)}</div>
          <div style={{ ...S.eyebrow, marginTop: 8 }}>kilograms</div>
          <div style={{ display:'flex', gap: 14, justifyContent:'center', marginTop: 36 }}>
            <button onClick={() => setW(w => Math.round((w-0.1)*10)/10)} style={{ width: 60, height: 60, borderRadius: 999, border: 0, background: C.pillow, fontSize: 26, cursor:'pointer', color: C.ink, fontFamily:'inherit', boxShadow: PILLOW_SHADOW_SM }}>−</button>
            <button onClick={() => setW(w => Math.round((w+0.1)*10)/10)} style={{ width: 60, height: 60, borderRadius: 999, border: 0, background: C.apricot, fontSize: 26, cursor:'pointer', color:'#fff', fontFamily:'inherit', boxShadow: BTN_SHADOW }}>+</button>
          </div>
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => { set('lastWeight', w); set('weighInDue', false); go('weighInResult'); }}>Confirm</button>
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
      <div style={{ padding:'22px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 22 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={48}>{I.trend('#fff')}</IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Adjustment</div>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 30, color: C.green, marginTop: 4, fontWeight: 300, letterSpacing:'-1px' }}>+80 kcal/day</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 16, fontStyle:'italic', fontFamily:'"Fraunces", serif', maxWidth: 280, lineHeight: 1.45, paddingTop: 12, borderTop:'1px solid rgba(61,90,74,.18)' }}>
            &ldquo;Do not burn out the gas tank — we have 22 weeks ahead.&rdquo;
          </div>
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('forecast')}>Apply & see forecast</button>
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
      {/* chart pillow */}
      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, padding: 20 }}>
          <svg viewBox="0 0 320 160" style={{ width:'100%', height: 160 }}>
            <defs>
              <linearGradient id="curve" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={C.apricot} stopOpacity=".25"/>
                <stop offset="100%" stopColor={C.apricot} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <line x1="0" y1="120" x2="320" y2="120" stroke={C.hair}/>
            <line x1="0" y1="60"  x2="320" y2="60"  stroke={C.hair} strokeDasharray="2 4"/>
            <path d="M0,20 Q80,40 160,80 T320,140 L320,160 L0,160 Z" fill="url(#curve)"/>
            <path d="M0,20 Q80,40 160,80 T320,140" stroke={C.apricot} strokeWidth="3" fill="none" strokeLinecap="round"/>
            <circle cx="80" cy="50" r="6" fill="#fff" stroke={C.apricot} strokeWidth="2.5"/>
            <text x="86" y="42" fontSize="10" fill={C.ink} fontFamily="DM Sans" fontWeight="600">today · 82.4</text>
            <circle cx="320" cy="140" r="6" fill={C.green} stroke="#fff" strokeWidth="2"/>
            <text x="260" y="135" fontSize="10" fill={C.green} fontFamily="DM Sans" textAnchor="end" fontWeight="600">68 kg goal</text>
          </svg>
        </div>
      </div>
      {/* stats — 3 pillows */}
      <div style={{ padding:'16px 22px 0', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10 }}>
        {[
          ['Lost','−2.6','kg', I.trend, 'greenSolid'],
          ['To go','14.4','kg', I.target, 'apricot'],
          ['Days early','14','days', I.spark, 'butter'],
        ].map(([l,v,u,ic,tone]) => (
          <div key={l} style={{ ...S.pillowSm, padding: 14, textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom: 8 }}>
              <IconChip tone={tone} size={32}>{ic(tone === 'greenSolid' ? '#fff' : C.apricotDk)}</IconChip>
            </div>
            <div style={{ ...S.eyebrow, fontSize: 9 }}>{l}</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 24, color: C.apricot, marginTop: 4, fontWeight: 300, letterSpacing:'-.5px' }}>{v}</div>
            <div style={{ fontSize: 10, color: C.dim, marginTop: 0 }}>{u}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('milestone')}>View milestones</button>
        <button style={S.ctaLine} onClick={() => go('plateau')}>What if I plateau?</button>
      </div>
      <TabBar active="stats" go={go} />
    </div>
  );
}

function Milestone({ go }) {
  return (
    <div style={{ ...S.page, background: C.creamHi, height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <Blob color={C.apricotMd} size={320} top={-100} right={-80} opacity={.18} />
      <Blob color={C.greenWash} size={240} bottom={140} left={-80} opacity={.08} />
      <div style={{ paddingTop: 44, textAlign:'center', position:'relative', zIndex: 1 }}>
        <Pip mood="celebrate" size={170} />
      </div>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center', padding:'0 24px', position:'relative', zIndex: 1 }}>
        <div style={S.eyebrow}>Milestone unlocked ✦</div>
        <h1 style={{ ...S.h1, fontSize: 56, marginTop: 12 }}><Em>2.5 kg</Em></h1>
        <div style={{ fontFamily:'"Fraunces", serif', fontSize: 28, color: C.ink, fontWeight: 300, marginTop: -4 }}>down</div>
        <p style={{ ...S.body, marginTop: 20, maxWidth: 280, marginLeft:'auto', marginRight:'auto' }}>The weight of 5 sticks of butter. Or one big cantaloupe. Either way — gone.</p>
      </div>
      <div style={{ padding:'0 22px 12px', position:'relative', zIndex: 1 }}>
        <div style={{ ...S.pillow, background: C.greenLt, display:'flex', alignItems:'center', gap: 14 }}>
          <IconChip tone="greenSolid" size={44}>{I.flame('#fff')}</IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Streak</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 26, color: C.green, fontWeight: 300 }}>21 days</div>
          </div>
        </div>
      </div>
      <div style={{ padding:'0 22px 22px', position:'relative', zIndex: 1 }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Back to today</button>
        <button style={S.ctaLine} onClick={() => go('today')}>Share</button>
      </div>
    </div>
  );
}

function Plateau({ go }) {
  return (
    <div style={S.page}>
      <Header back="forecast" go={go}>Plateau</Header>
      <div style={{ padding:'8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display:'flex', alignItems:'center', gap: 14 }}>
          <Pip mood="curious" size={80} />
          <h1 style={{ ...S.h1, fontSize: 28, margin: 0 }}>3 weeks<br/><Em>stuck</Em>?</h1>
        </div>
      </div>
      <div style={S.pad}>
        <p style={{ ...S.body, marginTop: 18 }}>Plateaus mean your body is recalibrating, not failing. Here's what works:</p>
      </div>
      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.apricotLt, padding: 20 }}>
          <div style={{ ...S.eyebrow, color: C.apricotDk }}>Try this week</div>
          <div style={{ marginTop: 14, display:'flex', flexDirection:'column', gap: 8 }}>
            {[
              ['+ 20g protein/day', I.fish, 'apricotSolid'],
              ['+ 1 extra walk (30 min)', I.walk, 'green'],
              ['− 100 kcal carbs at dinner', I.bowl, 'butter'],
            ].map(([x, ic, tone]) => (
              <div key={x} style={{ display:'flex', alignItems:'center', gap: 12, padding:'10px 12px', background:'rgba(255,255,255,.45)', borderRadius: 12 }}>
                <IconChip tone={tone} size={32}>{ic(tone.includes('Solid') ? '#fff' : tone === 'green' ? C.green : C.apricotDk)}</IconChip>
                <div style={{ flex: 1, color: C.apricotDk, fontSize: 14, fontFamily:'"Fraunces",serif' }}>{x}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('forecast')}>Apply for one week</button>
        <button style={S.ctaLine} onClick={() => go('coach')}>Talk to Pip instead</button>
      </div>
    </div>
  );
}

function BadDay({ go }) {
  return (
    <div style={S.page}>
      <Header back="today" go={go}>Yesterday</Header>
      <div style={{ padding:'8px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display:'flex', alignItems:'center', gap: 14 }}>
          <Pip mood="oops" size={80} />
          <h1 style={{ ...S.h1, fontSize: 28, margin: 0 }}>Tomorrow<br/>we <Em>adjust</Em></h1>
        </div>
      </div>
      <div style={S.pad}>
        <p style={{ ...S.body, marginTop: 18 }}>One bad day does not undo a week of good ones. Pip will spread it out — gently.</p>
      </div>
      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ ...S.pillowSm, display:'flex', alignItems:'center', gap: 14 }}>
          <IconChip tone="apricotSolid" size={40}>{I.flame('#fff')}</IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow }}>Yesterday</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, color: C.apricot, fontWeight: 300, marginTop: 2 }}>+ 520 kcal over</div>
          </div>
        </div>
      </div>
      <div style={{ padding:'12px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, padding: 20 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={44}>{I.spark('#fff')}</IconChip>
            <div>
              <div style={{ ...S.eyebrow, color: C.green }}>Pip's plan</div>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 22, color: C.green, marginTop: 2, fontWeight: 300, letterSpacing:'-.4px' }}>−104 kcal/day × 5 days</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 16, fontStyle:'italic', fontFamily:'"Fraunces",serif', paddingTop: 12, borderTop:'1px solid rgba(61,90,74,.18)' }}>
            No drama. No skipping meals. Forecast unchanged.
          </div>
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Resume the plan</button>
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
      <div style={{ padding:'22px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.greenLt, display:'flex', alignItems:'center', gap: 16 }}>
          <Ring pct={.62} size={84} stroke={8} color={C.green} track="rgba(255,255,255,.4)" label="62%" />
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Today</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 32, color: C.green, marginTop: 4, fontWeight: 300, letterSpacing:'-1px' }}>8,420</div>
            <div style={{ fontSize: 12, color: C.green, marginTop: 2, fontWeight: 500 }}>steps · +340 kcal earned</div>
          </div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 24, marginBottom: 10 }}>This week</div>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          {[
            ['Mon','Push','45 min','420 kcal','apricot', I.flame],
            ['Wed','Pull','40 min','380 kcal','green', I.spark],
            ['Today','Legs','—','planned 18:00','butter', I.walk],
          ].map(([d,w,t,k,tone,ic]) => (
            <div key={d} style={{ ...S.pillowSm, display:'flex', alignItems:'center', gap: 14 }}>
              <IconChip tone={tone} size={40}>{ic(tone === 'green' ? C.green : C.apricotDk)}</IconChip>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 17, color: C.ink, fontWeight: 400 }}>{w}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{d} · {t}</div>
              </div>
              <div style={{ fontSize: 13, color: C.green, fontFamily:'"Fraunces", serif', textAlign:'right' }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('today')}>Add a workout</button>
      </div>
    </div>
  );
}

function Profile({ go }) {
  const items = [
    ['Activity log','This week · 4 workouts', 'activity2', I.workout, 'green'],
    ['Notifications','3 active reminders',     'notifications', I.bell, 'butter'],
    ['Coach tone','Warm',                      'coachTone', I.coach, 'apricot'],
    ['Units & locale','kg · cm · kcal',        'units', I.scale, 'green'],
    ['Integrations','Apple Health · Glovo',    'integrations', I.health, 'butter'],
    ['Privacy','Standard',                     'privacy', I.leaf, 'green'],
    ['Subscription','Trial · 5 days left',     'subscription', I.spark, 'apricotSolid'],
    ['Meet Pip','Coach moods',                 'mascotGallery', I.coach, 'apricot'],
    ['Help & FAQ','Get in touch',              'help', I.sparkle, 'cream'],
    ['Sign out','',                            'welcome', I.arrow, 'cream'],
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Me</Header>
      <div style={{ padding:'4px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display:'flex', alignItems:'center', gap: 16, cursor:'pointer' }} onClick={() => go('profileEdit')}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: C.apricot, color: C.paper, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Fraunces",serif', fontSize: 28, fontWeight: 300, boxShadow: PILLOW_SHADOW_SM }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 28, color: C.ink, fontWeight: 400 }}>Marco</div>
            <div style={{ fontSize: 12, color: C.green, marginTop: 4, letterSpacing:'.04em', fontWeight: 500, display:'flex', alignItems:'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green }}/>
              −2.6 kg · 21-day streak
            </div>
          </div>
          <div style={{ width: 14, height: 14, color: C.dim }}>{I.arrow(C.dim)}</div>
        </div>
      </div>
      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ ...S.pillow, padding: 0 }}>
          {items.map(([l,v,r,ic,tone], i, arr) => (
            <div key={l} onClick={() => go(r)} style={{
              padding:'14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, cursor:'pointer',
              display:'flex', alignItems:'center', gap: 14,
            }}>
              <IconChip tone={tone} size={36}>{ic(tone === 'apricotSolid' ? '#fff' : tone === 'green' ? C.green : C.apricotDk)}</IconChip>
              <div style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
              <div style={{ fontSize: 12, color: C.dim }}>{v}</div>
              <div style={{ width: 14, height: 14 }}>{I.arrow(C.dim)}</div>
            </div>
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
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {tones.map((t, i, arr) => {
            const on = t.includes('Warm');
            return (
              <div key={t} onClick={()=>{}} style={{ padding:'14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, cursor:'pointer', display:'flex', alignItems:'center', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: on ? 0 : `1.5px solid ${C.dim}`, background: on ? C.apricot : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: 999, background:'#fff' }}/>}
                </div>
                <span style={{ flex: 1, fontSize: 14, color: on ? C.apricot : C.ink, fontWeight: on ? 600 : 500 }}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28, marginBottom: 10 }}>Notifications</div>
        <div style={{ ...S.pillow, padding: 0 }}>
          {notifs.map((t, i, arr) => (
            <div key={t} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0 }}>
              <span style={{ fontSize: 14, color: C.ink }}>{t}</span>
              <div style={{ width: 40, height: 22, background: C.apricot, borderRadius: 999, position:'relative', boxShadow:'inset 0 1px 2px rgba(0,0,0,.15)' }}>
                <div style={{ position:'absolute', right: 2, top: 2, width: 18, height: 18, background:'#fff', borderRadius: 999, boxShadow:'0 1px 3px rgba(0,0,0,.25)' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────── PROFILE SUB-SCREENS ───────────────────
function ProfileEdit({ go, state, set }) {
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Edit profile</Header>
      <div style={S.pad}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop: 18, gap: 12 }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, background: C.apricot, color: C.paper, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Fraunces",serif', fontSize: 44, fontWeight: 300, boxShadow: PILLOW_SHADOW_SM, position:'relative' }}>
            M
            <div style={{ position:'absolute', bottom: -2, right: -2, width: 32, height: 32, borderRadius: 999, background:'#fff', boxShadow: PILLOW_SHADOW_SM, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width: 16, height: 16 }}>{I.camera(C.apricot)}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.apricot, fontWeight: 600, letterSpacing:'.04em' }}>Change photo</div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>About you</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[
            ['Name','Marco'],
            ['Email','marco@kavrentech.com'],
            ['Date of birth','12 May 1991'],
            ['Sex','Male'],
            ['Height', state.height + ' cm'],
          ].map(([k,v], i, arr) => (
            <div key={k} style={{ padding:'14px 18px', borderBottom: i < arr.length-1 ? `1px solid ${C.hair}` : 0, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize: 14, color: C.ink }}>{k}</span>
              <span style={{ fontSize: 13, color: C.dim, fontFamily:'"Fraunces",serif' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Goal</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[
            ['Current weight', state.weight + ' kg'],
            ['Target weight', state.target + ' kg'],
            ['Pace','0.5 kg / week'],
            ['Target date','Sep 14, 2026'],
          ].map(([k,v], i, arr) => (
            <div key={k} style={{ padding:'14px 18px', borderBottom: i < arr.length-1 ? `1px solid ${C.hair}` : 0, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize: 14, color: C.ink }}>{k}</span>
              <span style={{ fontSize: 13, color: C.apricot, fontFamily:'"Fraunces",serif', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save changes</button>
      </div>
    </div>
  );
}

function CoachTone({ go }) {
  const [pick, setPick] = React.useState('Warm');
  const tones = [
    { l:'Warm',         d:'Like a thoughtful friend. Default.',   m:'happy' },
    { l:'Direct',       d:'No fluff. Says it straight.',          m:'thinking' },
    { l:'Cheerleader',  d:'Hype every win, no matter how small.', m:'cheering' },
    { l:'Stoic',        d:'Calm, sparing, philosophical.',        m:'curious' },
  ];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Coach tone</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How should<br/><Em>Pip</Em> talk to you?</h1>
        <div style={{ fontSize: 14, color: C.dim, marginTop: 10, lineHeight: 1.5 }}>You can change this anytime. Pip will quietly adapt across all messages.</div>
        <div style={{ marginTop: 22, display:'flex', flexDirection:'column', gap: 10 }}>
          {tones.map(t => {
            const on = pick === t.l;
            return (
              <div key={t.l} onClick={()=>setPick(t.l)} style={{
                ...S.pillow, padding: 16, cursor:'pointer',
                background: on ? C.apricotWash : C.surface,
                border: on ? `1.5px solid ${C.apricot}` : `1px solid ${C.hair}`,
                display:'flex', alignItems:'center', gap: 14,
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: on ? '#fff' : C.pillow, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Pip mood={t.m} size={44}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'"Fraunces",serif', fontSize: 19, color: on ? C.apricotDk : C.ink, fontWeight: 500 }}>{t.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 3, lineHeight: 1.4 }}>{t.d}</div>
                </div>
                {on && <div style={{ width: 24, height: 24, borderRadius: 999, background: C.apricot, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width: 14, height: 14 }}>{I.check('#fff')}</div></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save</button>
      </div>
    </div>
  );
}

function Units({ go }) {
  const [units, setUnits] = React.useState({ mass:'kg', height:'cm', energy:'kcal', volume:'L', firstDay:'Monday', lang:'English' });
  const Group = ({ k, label, opts }) => (
    <div>
      <div style={{ ...S.eyebrow, marginTop: 24 }}>{label}</div>
      <div style={{ marginTop: 10, display:'flex', gap: 8, flexWrap:'wrap' }}>
        {opts.map(o => {
          const on = units[k] === o;
          return (
            <button key={o} onClick={()=>setUnits(u=>({...u,[k]:o}))} style={{
              padding:'10px 16px', borderRadius: 999, fontSize: 13, fontWeight: on ? 600 : 500,
              background: on ? C.apricot : C.surface, color: on ? '#fff' : C.ink,
              border: on ? 0 : `1px solid ${C.hair}`, cursor:'pointer', fontFamily:'inherit',
            }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Units &amp; locale</Header>
      <div style={S.pad}>
        <Group k="mass"   label="Body weight" opts={['kg','lb','st']} />
        <Group k="height" label="Height"      opts={['cm','ft / in']} />
        <Group k="energy" label="Energy"      opts={['kcal','kJ']} />
        <Group k="volume" label="Liquids"     opts={['mL','fl oz','L']} />
        <Group k="firstDay" label="Week starts on" opts={['Monday','Sunday']} />
        <Group k="lang"   label="Language"    opts={['English','Español','Português','Italiano']} />
      </div>
      <div style={{ padding:'24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save</button>
      </div>
    </div>
  );
}

function Integrations({ go }) {
  const [conn, setConn] = React.useState({ apple:true, glovo:true, strava:false, google:false, fitbit:false, withings:true });
  const items = [
    ['apple','Apple Health','Steps · workouts · sleep · weight', I.heart, 'apricotSolid'],
    ['google','Google Fit','Activity & body metrics',            I.health, 'green'],
    ['strava','Strava','Auto-import runs & rides',               I.flame, 'apricot'],
    ['fitbit','Fitbit','Wearable + scale',                       I.heart, 'butter'],
    ['withings','Withings scale','Auto-log weigh-ins',           I.scale, 'greenSolid'],
    ['glovo','Glovo','Order recipe ingredients',                 I.cart, 'cream'],
  ];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Integrations</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillowSm, background: C.pillow, marginTop: 14, fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
          <span style={{ color: C.green, fontWeight: 600 }}>3 connected.</span> Lumi reads what you allow. Disconnect anytime.
        </div>
        <div style={{ marginTop: 14, ...S.pillow, padding: 0 }}>
          {items.map(([k,l,d,ic,tone], i, arr) => {
            const on = conn[k];
            return (
              <div key={k} style={{ padding:'14px 18px', borderBottom: i < arr.length-1 ? `1px solid ${C.hair}` : 0, display:'flex', alignItems:'center', gap: 14 }}>
                <IconChip tone={tone} size={36}>{ic(['apricotSolid','greenSolid'].includes(tone) ? '#fff' : C.apricotDk)}</IconChip>
                <div style={{ flex:1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={()=>setConn(c=>({...c,[k]:!c[k]}))} style={{
                  padding:'7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  background: on ? C.greenLt : C.surface, color: on ? C.green : C.dim,
                  border: on ? 0 : `1px solid ${C.hair}`, cursor:'pointer', fontFamily:'inherit', flexShrink: 0,
                }}>{on ? '✓ Connected' : 'Connect'}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Privacy({ go }) {
  const [perm, setPerm] = React.useState({ analytics:true, share:false, research:true });
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Privacy</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.greenLt, marginTop: 14, display:'flex', alignItems:'center', gap: 14 }}>
          <IconChip tone="greenSolid" size={44}>{I.veg('#fff')}</IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Your data</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 18, color: C.green, marginTop: 2, letterSpacing:'-.3px' }}>Encrypted &amp; yours.</div>
          </div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>What you share</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[
            ['analytics','Anonymous analytics','Helps us improve Pip'],
            ['share','Share progress with friends','Off · only you can see your data'],
            ['research','Contribute to nutrition research','De-identified, opt-out anytime'],
          ].map(([k,l,d], i, arr) => {
            const on = perm[k];
            return (
              <div key={k} style={{ padding:'14px 18px', borderBottom: i < arr.length-1 ? `1px solid ${C.hair}` : 0, display:'flex', alignItems:'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={()=>setPerm(p=>({...p,[k]:!p[k]}))} style={{
                  width: 44, height: 26, borderRadius: 999, background: on ? C.apricot : C.hair,
                  border: 0, cursor:'pointer', position:'relative', flexShrink: 0,
                }}>
                  <div style={{ position:'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, background:'#fff', borderRadius: 999, boxShadow:'0 1px 3px rgba(0,0,0,.25)', transition:'left .2s' }}/>
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Your data, your control</div>
        <div style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 8 }}>
          <button style={{ ...S.ctaLine, color: C.ink }}>Export my data (.csv)</button>
          <button style={{ ...S.ctaLine, color: C.ink }}>Privacy policy</button>
          <button style={{ ...S.ctaLine, color:'#B43E2A', borderColor:'#F4D9B5' }}>Delete my account</button>
        </div>
      </div>
    </div>
  );
}

function Subscription({ go }) {
  const [plan, setPlan] = React.useState('annual');
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Subscription</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.apricot, color:'#fff', marginTop: 14, position:'relative', overflow:'hidden' }}>
          <div style={{ ...S.eyebrow, color:'rgba(255,255,255,.75)' }}>Current plan</div>
          <div style={{ fontFamily:'"Fraunces",serif', fontSize: 28, marginTop: 4, letterSpacing:'-.4px' }}>Trial</div>
          <div style={{ fontSize: 13, marginTop: 6, opacity: .9 }}>5 days left · then €59.99/year</div>
          <div style={{ marginTop: 14, padding:'8px 12px', background:'rgba(255,255,255,.18)', borderRadius: 12, fontSize: 11, color:'#fff', display:'inline-flex', gap: 6, alignItems:'center' }}>
            <div style={{ width: 12, height: 12 }}>{I.sparkle('#fff')}</div>
            All features unlocked
          </div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Choose your plan</div>
        <div style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 10 }}>
          {[
            { k:'annual',  l:'Annual',   p:'€59.99/yr',  s:'€5/mo billed yearly · save 50%', best:true },
            { k:'monthly', l:'Monthly',  p:'€9.99/mo',   s:'Cancel anytime' },
            { k:'lifetime',l:'Lifetime', p:'€199 once',  s:'Pay once. Yours forever.' },
          ].map(o => {
            const on = plan === o.k;
            return (
              <div key={o.k} onClick={()=>setPlan(o.k)} style={{
                ...S.pillow, padding: 16, cursor:'pointer',
                background: on ? C.apricotWash : C.surface,
                border: on ? `1.5px solid ${C.apricot}` : `1px solid ${C.hair}`,
                display:'flex', alignItems:'center', gap: 14, position:'relative',
              }}>
                {o.best && <div style={{ position:'absolute', top:-8, right: 14, background: C.green, color:'#fff', fontSize: 9, fontWeight: 700, letterSpacing:'.12em', padding:'3px 8px', borderRadius: 6 }}>BEST VALUE</div>}
                <div style={{ width: 22, height: 22, borderRadius: 999, border: on ? 0 : `1.5px solid ${C.dim}`, background: on ? C.apricot : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: 999, background:'#fff' }}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'"Fraunces",serif', fontSize: 19, color: on ? C.apricotDk : C.ink, fontWeight: 500 }}>{o.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{o.s}</div>
                </div>
                <div style={{ fontFamily:'"Fraunces",serif', fontSize: 17, color: C.ink, fontWeight: 500 }}>{o.p}</div>
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Billing</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[
            ['Payment method','Apple Pay'],
            ['Renews','May 4, 2026'],
            ['Receipts','Email · marco@…'],
          ].map(([k,v], i, arr) => (
            <div key={k} style={{ padding:'14px 18px', borderBottom: i < arr.length-1 ? `1px solid ${C.hair}` : 0, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize: 14, color: C.ink }}>{k}</span>
              <span style={{ fontSize: 13, color: C.dim }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, display:'flex', flexDirection:'column', gap: 8 }}>
          <button style={S.ctaApricot} onClick={() => go('profile')}>Upgrade now</button>
          <button style={{ ...S.ctaLine, color: C.dim }}>Restore purchase</button>
          <button style={{ ...S.ctaLine, color:'#B43E2A' }}>Cancel subscription</button>
        </div>
      </div>
    </div>
  );
}

function Notifications({ go }) {
  const [pref, setPref] = React.useState({
    summary:true, mealNudge:true, weighIn:true, wins:true, plateauAlert:false, weekly:true, quiet:true,
  });
  const items = [
    ['summary','Daily summary','9:00 AM · today\'s plan & yesterday\'s recap'],
    ['mealNudge','Meal nudges','12:30 PM · 7:00 PM · soft reminders'],
    ['weighIn','Weekly weigh-in','Sun 9:00 AM'],
    ['wins','Win moments','Streaks, milestones, plan adjustments'],
    ['plateauAlert','Plateau alerts','Off · only ping if 14+ days flat'],
    ['weekly','Weekly recap','Sun evening · your week in numbers'],
    ['quiet','Quiet hours','22:00 — 07:00'],
  ];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Notifications</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.pillow, marginTop: 14, fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
          We send <span style={{ color: C.apricotDk, fontWeight: 600 }}>3 reminders/day max</span> on default. You're in control.
        </div>
        <div style={{ marginTop: 14, ...S.pillow, padding: 0 }}>
          {items.map(([k,l,d], i, arr) => {
            const on = pref[k];
            return (
              <div key={k} style={{ padding:'14px 18px', borderBottom: i < arr.length-1 ? `1px solid ${C.hair}` : 0, display:'flex', alignItems:'center', gap: 14 }}>
                <div style={{ flex:1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={()=>setPref(p=>({...p,[k]:!p[k]}))} style={{
                  width: 44, height: 26, borderRadius: 999, background: on ? C.apricot : C.hair,
                  border: 0, cursor:'pointer', position:'relative', flexShrink: 0,
                }}>
                  <div style={{ position:'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, background:'#fff', borderRadius: 999, boxShadow:'0 1px 3px rgba(0,0,0,.25)', transition:'left .2s' }}/>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Help({ go }) {
  const faqs = [
    ['How does Pip\'s plan adjust?','Every weekly weigh-in, Pip recalculates your calorie & macro target based on actual loss vs. predicted.'],
    ['Can I eat out?','Yes. Snap a photo or describe verbally — Pip estimates calories within ±10%.'],
    ['What if I plateau?','After 14 flat days Pip suggests a refeed, deload, or adjustment.'],
    ['Is my data private?','End-to-end encrypted. Never sold. You can export or delete anytime.'],
    ['Does it work without Apple Health?','Yes — but syncing improves accuracy. Manual logging is fine.'],
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Help &amp; FAQ</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.apricotWash, marginTop: 14, display:'flex', alignItems:'center', gap: 14, cursor:'pointer' }} onClick={() => go('coach')}>
          <Pip mood="wave" size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.apricotDk }}>Need a hand?</div>
            <div style={{ fontFamily:'"Fraunces",serif', fontSize: 19, color: C.apricotDk, marginTop: 2, letterSpacing:'-.3px' }}>Ask Pip directly</div>
          </div>
          <div style={{ width: 14, height: 14 }}>{I.arrow(C.apricotDk)}</div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Frequently asked</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {faqs.map(([q,a], i) => {
            const on = open === i;
            return (
              <div key={q} onClick={()=>setOpen(on ? -1 : i)} style={{ padding:'16px 18px', borderBottom: i < faqs.length-1 ? `1px solid ${C.hair}` : 0, cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 500, flex: 1 }}>{q}</span>
                  <div style={{ width: 16, height: 16, transform: on ? 'rotate(180deg)' : 'none', transition:'transform .2s', color: C.dim, marginTop: 2 }}>{I.arrow(C.dim)}</div>
                </div>
                {on && <div style={{ fontSize: 13, color: C.dim, marginTop: 8, lineHeight: 1.55 }}>{a}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Contact us</div>
        <div style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 8 }}>
          <button style={{ ...S.ctaLine, color: C.ink }}>support@lumi.app</button>
          <button style={{ ...S.ctaLine, color: C.ink }}>Rate Lumi on the App Store</button>
        </div>
        <div style={{ textAlign:'center', marginTop: 28, fontSize: 11, color: C.dim, letterSpacing:'.06em' }}>Lumi · v1.4.2 · Build 824</div>
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
  profileEdit: ProfileEdit, coachTone: CoachTone, units: Units, integrations: Integrations,
  privacy: Privacy, subscription: Subscription, notifications: Notifications, help: Help,
  mascotGallery: MascotGallery,
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
      <div style={{ padding:'4px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display:'flex', alignItems:'center', gap: 16 }}>
          <Pip mood="wave" size={100} trackCursor={true} />
          <div style={{ flex: 1 }}>
            <h1 style={{ ...S.h1, fontSize: 30, margin: 0 }}>Hi, I'm <Em>Pip</Em></h1>
            <p style={{ ...S.body, margin: '6px 0 0', fontSize: 13 }}>A little peach with a big plan.</p>
          </div>
        </div>
      </div>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 22, marginBottom: 10 }}>Twelve moods</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {moods.map(o => (
            <div key={o.m} style={{ ...S.pillowSm, padding: 14, textAlign:'center' }}>
              <div style={{ display:'flex', justifyContent:'center', height: 110, alignItems:'flex-end' }}>
                <Pip mood={o.m} size={84} />
              </div>
              <div style={{ fontFamily:'"Fraunces",serif', fontSize: 15, color: C.ink, marginTop: 8, fontWeight: 400 }}>{o.l}</div>
              <div style={{ fontSize: 10.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{o.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
ROUTES.mascotGallery = MascotGallery;
