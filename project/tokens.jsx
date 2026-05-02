// Lumi — light/minimal tokens
// Philosophy: white base, hairlines, typography does the work.
// One restrained accent (near-black) for primary actions; subtle blue only for live data.

const T = {
  bg: '#FFFFFF',
  bgSubtle: '#FAFAF9',
  bgElev: '#FFFFFF',
  bgInset: '#F5F5F4',
  hairline: 'rgba(0,0,0,0.08)',
  hairlineStrong: 'rgba(0,0,0,0.14)',

  text: '#0A0A0A',
  textDim: '#525252',
  textMute: '#A3A3A3',

  accent: '#0A0A0A',       // primary action = near-black
  accentSoft: '#171717',
  blue: '#2563EB',         // for live/active data only
  green: '#16A34A',
  amber: '#B45309',
  red: '#DC2626',

  font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif',
};

if (typeof document !== 'undefined' && !document.getElementById('lumi-base')) {
  const s = document.createElement('style');
  s.id = 'lumi-base';
  s.textContent = `
    .num{font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}
    .hide-sb::-webkit-scrollbar{display:none}.hide-sb{scrollbar-width:none}
    @keyframes lumi-pulse{0%,100%{opacity:.55}50%{opacity:1}}
  `;
  document.head.appendChild(s);
}

const Icon = ({ d, size = 20, fill = false, sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
       stroke={fill ? 'none' : 'currentColor'} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

function Ring({ size = 108, stroke = 6, value = 0.6, children, color }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r}
                stroke={color || T.accent} strokeWidth={stroke} fill="none"
                strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))}
                strokeLinecap="round"/>
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>{children}</div>}
    </div>
  );
}

function TabBar({ active = 'home' }) {
  const items = [
    { id: 'home',  label: 'Today', d: 'M3 11l9-8 9 8M5 9v11h14V9' },
    { id: 'plan',  label: 'Plan',  d: ['M4 6h16','M4 12h16','M4 18h10'] },
    { id: 'chat',  label: 'Lumi',  d: 'M21 12a8 8 0 1 1-3-6.2L21 4l-1 4.6A8 8 0 0 1 21 12z' },
    { id: 'stats', label: 'Stats', d: ['M4 20V10','M10 20V4','M16 20v-7','M22 20H2'] },
    { id: 'me',    label: 'Me',    d: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z','M4 21a8 8 0 0 1 16 0'] },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      display: 'flex', justifyContent: 'space-around',
      padding: '10px 12px 30px',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${T.hairline}`,
      zIndex: 30,
    }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <div key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: on ? T.text : T.textMute,
          }}>
            <Icon d={it.d} size={22} sw={on ? 2 : 1.6}/>
            <div style={{ fontSize: 10, fontWeight: on ? 700 : 500 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBar({ time = '9:41' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 32px 8px', color: T.text, fontFamily: T.font,
    }}>
      <div style={{ fontSize: 17, fontWeight: 600 }}>{time}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1" fill={T.text}/><rect x="5" y="5" width="3" height="6" rx="1" fill={T.text}/><rect x="10" y="2" width="3" height="9" rx="1" fill={T.text}/><rect x="15" y="0" width="3" height="11" rx="1" fill={T.text}/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2c2.2 0 4.2 0.9 5.7 2.3l1-1A8 8 0 0 0 8 1a8 8 0 0 0-6.7 2.3l1 1C3.8 2.9 5.8 2 8 2z" fill={T.text}/><circle cx="8" cy="9" r="1.5" fill={T.text}/></svg>
        <svg width="25" height="11" viewBox="0 0 25 11"><rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke={T.text} fill="none"/><rect x="2" y="2" width="18" height="7" rx="1.2" fill={T.text}/><rect x="22" y="3.5" width="1.5" height="4" rx="0.5" fill={T.text}/></svg>
      </div>
    </div>
  );
}

function Phone({ children, w = 390, h = 844 }) {
  return (
    <div style={{
      width: w, height: h, position: 'relative', overflow: 'hidden',
      background: T.bg, color: T.text, fontFamily: T.font,
      WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, borderRadius: 22, background: '#000', zIndex: 50 }}/>
      <StatusBar/>
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0, height: 5, zIndex: 60,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ width: 134, height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.85)' }}/>
      </div>
    </div>
  );
}

function Card({ children, style = {}, padded = true, inset = false }) {
  return (
    <div style={{
      background: inset ? T.bgInset : T.bgElev,
      borderRadius: 16,
      border: inset ? 'none' : `1px solid ${T.hairline}`,
      padding: padded ? 18 : 0,
      ...style,
    }}>{children}</div>
  );
}

function Avatar({ children = 'L', size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size/2,
      background: T.text, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, letterSpacing: -0.3,
    }}>{children}</div>
  );
}

function Chip({ children, tone = 'default', style = {} }) {
  const tones = {
    default: { bg: T.bgInset, fg: T.text, bd: 'transparent' },
    line:    { bg: 'transparent', fg: T.textDim, bd: T.hairlineStrong },
    dark:    { bg: T.text, fg: '#fff', bd: 'transparent' },
    green:   { bg: '#F0FDF4', fg: T.green, bd: 'transparent' },
  };
  const t = tones[tone] || tones.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 9px', borderRadius: 999,
      background: t.bg, color: t.fg, fontSize: 11, fontWeight: 600,
      border: `1px solid ${t.bd}`, letterSpacing: 0.1, whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

function PrimaryButton({ children, style }) {
  return (
    <button style={{
      background: T.text, color: '#fff', fontWeight: 600, fontSize: 16,
      border: 'none', borderRadius: 14, padding: '15px 22px',
      letterSpacing: -0.2, fontFamily: T.font, cursor: 'pointer',
      ...style,
    }}>{children}</button>
  );
}

Object.assign(window, { T, Icon, Ring, TabBar, StatusBar, Phone, Card, Avatar, Chip, PrimaryButton });
