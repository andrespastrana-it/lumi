'use client';

import { useEffect, useRef, useState } from 'react';

const SKIN = {
  s1: '#FFD8BB', s2: '#FFB088', s3: '#E8784E', s4: '#A04A1E',
  cheek: '#F5826A', leaf: '#7CA67C', leafDk: '#3D5A4A',
  ink: '#2A1F18', inkSoft: '#5A3A20', iris: '#6B3A1E', irisLt: '#A06840',
  sparkle: '#FFE4C9', cream: '#FCEAD8', teeth: '#FFF6EE',
  tongue: '#E8784E', tear: '#9DD0F0',
};

function Eye({ cx, cy, kind = 'open', look = 'center', blink = false, tremble = false }: {
  cx: number; cy: number; kind?: string; look?: string; blink?: boolean; tremble?: boolean;
}) {
  const lx = look === 'left' ? -2 : look === 'right' ? 2 : look === 'upLeft' ? -1.5 : look === 'upRight' ? 1.5 : 0;
  const ly = look === 'up' ? -2 : look === 'down' ? 2.5 : look === 'upLeft' ? -1.5 : look === 'upRight' ? -1.5 : 0;
  const id = `ig-${cx}-${cy}`;

  if (kind === 'closed') return <path d={`M ${cx-10} ${cy} Q ${cx} ${cy+5} ${cx+10} ${cy}`} stroke={SKIN.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />;
  if (kind === 'happy') return <path d={`M ${cx-10} ${cy+3} Q ${cx} ${cy-7} ${cx+10} ${cy+3}`} stroke={SKIN.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />;
  if (kind === 'star') return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse rx="11" ry="12" fill="#fff" stroke={SKIN.ink} strokeWidth="1.5" />
      <path d="M 0 -8 L 2 -2.5 L 8 -2.5 L 3.2 1.5 L 5 8 L 0 4 L -5 8 L -3.2 1.5 L -8 -2.5 L -2 -2.5 Z" fill={SKIN.ink} />
      <ellipse cx="-3" cy="-4" rx="2" ry="2.5" fill="#fff" />
    </g>
  );
  if (kind === 'heart') return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse rx="11" ry="12" fill="#fff" stroke={SKIN.ink} strokeWidth="1.5" />
      <path d="M -5.5 -2 a 2.8 2.8 0 0 1 5.5 0 a 2.8 2.8 0 0 1 5.5 0 q 0 4.5 -5.5 8 q -5.5 -3.5 -5.5 -8 z" fill={SKIN.s3} />
    </g>
  );

  const eyeH = blink ? 0.15 : 1;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SKIN.irisLt} />
          <stop offset="70%" stopColor={SKIN.iris} />
          <stop offset="100%" stopColor={SKIN.ink} />
        </radialGradient>
      </defs>
      <ellipse rx="11" ry={11 * eyeH} fill="#FFFAF3" stroke={SKIN.inkSoft} strokeWidth="0.6" opacity="0.95" />
      {!blink && <ellipse cx={lx} cy={ly} rx="8" ry="8.5" fill={`url(#${id})`} />}
      {!blink && <ellipse cx={lx} cy={ly} rx="4.5" ry="5" fill={SKIN.ink} />}
      {!blink && <><ellipse cx={lx - 2.5} cy={ly - 3.5} rx="2.6" ry="3.2" fill="#fff" /><circle cx={lx + 2.5} cy={ly + 2.5} r="1.3" fill="#fff" opacity="0.9" /></>}
      {!blink && <path d="M -10 1 Q 0 5 10 1" stroke={SKIN.inkSoft} strokeWidth="0.8" fill="none" opacity="0.4" />}
      {tremble && <animateTransform attributeName="transform" type="translate" values="0 0; 0.3 0; -0.3 0; 0 0" dur="0.3s" repeatCount="indefinite" />}
    </g>
  );
}

function Mouth({ cx = 60, cy = 90, kind = 'smile', tremble = false }: { cx?: number; cy?: number; kind?: string; tremble?: boolean; }) {
  if (kind === 'smile') return (
    <g>
      <path d={`M ${cx-10} ${cy-1} Q ${cx} ${cy+6} ${cx+10} ${cy-1}`} stroke={SKIN.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx={cx-12} cy={cy} r="1" fill={SKIN.cheek} opacity="0.6" />
      <circle cx={cx+12} cy={cy} r="1" fill={SKIN.cheek} opacity="0.6" />
    </g>
  );
  if (kind === 'bigOpen') return (
    <g>
      <path d={`M ${cx-14} ${cy-3} Q ${cx} ${cy+15} ${cx+14} ${cy-3} Q ${cx} ${cy+2} ${cx-14} ${cy-3} Z`} fill={SKIN.ink} />
      <path d={`M ${cx-8} ${cy+6} Q ${cx} ${cy+12} ${cx+8} ${cy+6} Q ${cx} ${cy+9} ${cx-8} ${cy+6} Z`} fill={SKIN.tongue} />
      <rect x={cx-9} y={cy-2} width="18" height="2" fill={SKIN.teeth} rx="0.5" opacity="0.8" />
    </g>
  );
  if (kind === 'grin') return (
    <g>
      <path d={`M ${cx-13} ${cy-2} Q ${cx} ${cy+10} ${cx+13} ${cy-2} Q ${cx} ${cy+1} ${cx-13} ${cy-2} Z`} fill={SKIN.ink} />
      <rect x={cx-10} y={cy-1} width="20" height="3.5" fill={SKIN.teeth} rx="0.5" />
    </g>
  );
  if (kind === 'o') return <ellipse cx={cx} cy={cy+3} rx="5" ry="6.5" fill={SKIN.ink} />;
  if (kind === 'flat') return <line x1={cx-7} y1={cy+1} x2={cx+7} y2={cy+1} stroke={SKIN.ink} strokeWidth="2.6" strokeLinecap="round" />;
  if (kind === 'frown') return (
    <path d={`M ${cx-10} ${cy+5} Q ${cx} ${cy-3} ${cx+10} ${cy+5}`} stroke={SKIN.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
  );
  if (kind === 'wobble') return (
    <path d={`M ${cx-9} ${cy+1} Q ${cx-4} ${cy-3} ${cx} ${cy+2} Q ${cx+4} ${cy+6} ${cx+9} ${cy}`} stroke={SKIN.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
  );
  return null;
}

function Cheeks({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <g opacity={0.55}>
      <ellipse cx="32" cy="80" rx="7.5" ry="4.5" fill={SKIN.cheek} />
      <ellipse cx="88" cy="80" rx="7.5" ry="4.5" fill={SKIN.cheek} />
      <circle cx="32" cy="79" r="0.6" fill={SKIN.s4} opacity="0.4" />
      <circle cx="88" cy="80" r="0.6" fill={SKIN.s4} opacity="0.4" />
    </g>
  );
}

function Brows({ kind = 'none' }: { kind?: string }) {
  if (kind === 'none') return null;
  const s = { stroke: SKIN.inkSoft, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
  if (kind === 'concerned') return <g {...s}><path d="M 33 52 Q 42 46 51 51" /><path d="M 69 51 Q 78 46 87 52" /></g>;
  if (kind === 'sad') return <g {...s}><path d="M 33 50 Q 42 56 51 53" /><path d="M 69 53 Q 78 56 87 50" /></g>;
  if (kind === 'angry') return <g {...s}><path d="M 33 49 L 51 54" /><path d="M 69 54 L 87 49" /></g>;
  if (kind === 'raised') return <g {...s}><path d="M 33 47 Q 42 43 51 46" /><path d="M 69 46 Q 78 43 87 47" /></g>;
  if (kind === 'arched') return <g {...s}><path d="M 33 50 Q 42 44 52 50" /><path d="M 68 50 Q 78 44 87 50" /></g>;
  return null;
}

function Arms({ pose = 'rest' }: { pose?: string }) {
  const poses: Record<string, { left: string; right: string; lh: { cx: number; cy: number }; rh: { cx: number; cy: number } }> = {
    rest:     { left:'M 26 100 Q 16 108 14 122', right:'M 94 100 Q 104 108 106 122', lh:{cx:14,cy:124}, rh:{cx:106,cy:124} },
    up:       { left:'M 26 95 Q 12 70 8 50',     right:'M 94 95 Q 108 70 112 50',   lh:{cx:8,cy:48},   rh:{cx:112,cy:48} },
    cheer:    { left:'M 26 95 Q 16 60 12 35',    right:'M 94 95 Q 104 60 108 35',   lh:{cx:12,cy:32},  rh:{cx:108,cy:32} },
    hipsLeft: { left:'M 26 100 Q 22 116 32 122', right:'M 94 100 Q 102 110 104 122',lh:{cx:34,cy:122}, rh:{cx:104,cy:122} },
    thinking: { left:'M 26 100 Q 22 116 28 124', right:'M 94 95 Q 80 70 72 56',     lh:{cx:28,cy:124}, rh:{cx:72,cy:54} },
    hug:      { left:'M 26 98 Q 38 108 56 105',  right:'M 94 98 Q 82 108 64 105',   lh:{cx:56,cy:105}, rh:{cx:64,cy:105} },
    wave:     { left:'M 26 100 Q 22 116 28 124', right:'M 94 92 Q 110 60 114 32',   lh:{cx:28,cy:124}, rh:{cx:114,cy:30} },
    droop:    { left:'M 26 102 Q 20 122 22 132', right:'M 94 102 Q 100 122 98 132', lh:{cx:22,cy:134}, rh:{cx:98,cy:134} },
    reach:    { left:'M 26 95 Q 20 80 30 65',    right:'M 94 95 Q 100 80 90 65',    lh:{cx:30,cy:62},  rh:{cx:90,cy:62} },
  };
  const p = poses[pose] || poses.rest;
  const arm = (d: string) => (
    <g>
      <path d={d} stroke={SKIN.s4} strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d={d} stroke={SKIN.s3} strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d={d} stroke={SKIN.s2} strokeWidth="9"  fill="none" strokeLinecap="round" />
    </g>
  );
  const hand = (cx: number, cy: number) => (
    <g>
      <circle cx={cx}   cy={cy}   r="8" fill={SKIN.s4} />
      <circle cx={cx}   cy={cy-0.5} r="7" fill={SKIN.s3} />
      <circle cx={cx}   cy={cy-1} r="6" fill={SKIN.s2} />
      <ellipse cx={cx-1.5} cy={cy-3} rx="2.4" ry="1.6" fill={SKIN.s1} opacity="0.7" />
    </g>
  );
  return <g>{arm(p.left)}{arm(p.right)}{hand(p.lh.cx, p.lh.cy)}{hand(p.rh.cx, p.rh.cy)}</g>;
}

function Legs({ pose = 'rest' }: { pose?: string }) {
  const poses: Record<string, { l: { x: number; y: number }; r: { x: number; y: number } }> = {
    rest:   { l:{x:48,y:148}, r:{x:72,y:148} },
    jump:   { l:{x:48,y:138}, r:{x:72,y:138} },
    step:   { l:{x:42,y:146}, r:{x:78,y:150} },
    apart:  { l:{x:40,y:150}, r:{x:80,y:150} },
    tucked: { l:{x:52,y:146}, r:{x:68,y:146} },
  };
  const p = poses[pose] || poses.rest;
  const foot = (x: number, y: number) => (
    <g>
      <ellipse cx={x} cy={y+5} rx="10" ry="2.5" fill={SKIN.ink} opacity="0.18" />
      <ellipse cx={x} cy={y+1} rx="11" ry="7" fill={SKIN.s4} />
      <ellipse cx={x} cy={y} rx="11" ry="7" fill={SKIN.s3} />
      <ellipse cx={x-2} cy={y-2.5} rx="5" ry="2.3" fill={SKIN.s1} opacity="0.6" />
    </g>
  );
  return <g>{foot(p.l.x, p.l.y)}{foot(p.r.x, p.r.y)}</g>;
}

function Accent({ kind }: { kind: string }) {
  if (kind === 'confetti') return (
    <g>
      {[
        {cx:18,cy:18,r:3,color:SKIN.s3,dur:'2.5s',begin:'0s'},
        {cx:104,cy:14,r:2.5,color:SKIN.leafDk,dur:'2.8s',begin:'0.5s'},
        {cx:112,cy:42,r:2.2,color:'#5A3A55',dur:'2.3s',begin:'1s'},
        {cx:14,cy:54,r:2.5,color:SKIN.s3,dur:'2.6s',begin:'0.3s'},
        {cx:108,cy:78,r:2,color:SKIN.leafDk,dur:'2.4s',begin:'0.7s'},
        {cx:16,cy:90,r:2.2,color:'#5A3A55',dur:'2.7s',begin:'1.2s'},
      ].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.color}>
          <animate attributeName="cy" values={`${p.cy};180;${p.cy}`} dur={p.dur} repeatCount="indefinite" begin={p.begin} />
          <animate attributeName="opacity" values="1;1;0;1" dur={p.dur} repeatCount="indefinite" begin={p.begin} />
        </circle>
      ))}
    </g>
  );
  if (kind === 'thinkBubble') return (
    <g transform="translate(92 6)">
      <circle cx="2" cy="22" r="3" fill="#fff" stroke={SKIN.ink} strokeWidth="1.5" />
      <circle cx="9" cy="14" r="4.5" fill="#fff" stroke={SKIN.ink} strokeWidth="1.5" />
      <ellipse cx="22" cy="6" rx="14" ry="9" fill="#fff" stroke={SKIN.ink} strokeWidth="1.5" />
      <text x="22" y="11" fontSize="13" fill={SKIN.ink} textAnchor="middle" fontFamily="'Fraunces',serif" fontStyle="italic" fontWeight="500">?</text>
    </g>
  );
  if (kind === 'sleepZ') return (
    <g transform="translate(95 16)" fill={SKIN.ink} fontFamily="'Fraunces',serif" fontStyle="italic" fontWeight="600">
      <text x="0" y="14" fontSize="14">z<animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" /></text>
      <text x="9" y="4" fontSize="10" opacity="0.7">z<animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.6s" repeatCount="indefinite" begin="0.5s" /></text>
    </g>
  );
  if (kind === 'hearts') return (
    <g>
      <path d="M 16 22 a 3 3 0 0 1 6 0 a 3 3 0 0 1 6 0 q 0 4 -6 8 q -6 -4 -6 -8 z" fill={SKIN.s3}>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -10; 0 0" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M 92 12 a 2.5 2.5 0 0 1 5 0 a 2.5 2.5 0 0 1 5 0 q 0 3.5 -5 7 q -5 -3.5 -5 -7 z" fill={SKIN.s3} opacity="0.7">
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -7; 0 0" dur="2.2s" repeatCount="indefinite" begin="0.5s" />
      </path>
    </g>
  );
  if (kind === 'sweat') return (
    <g transform="translate(86 38)">
      <path d="M 5 0 Q 0 8 0 12 a 5 5 0 0 0 10 0 Q 10 8 5 0 Z" fill="#7BB7E8" stroke={SKIN.ink} strokeWidth="1.2">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
  );
  if (kind === 'tear') return (
    <path d="M 38 78 Q 35 92 38 100 a 3.5 3.5 0 0 0 7 0 Q 48 92 45 78 Z" fill={SKIN.tear} opacity="0.85" stroke={SKIN.iris} strokeWidth="0.8" />
  );
  if (kind === 'dots') return (
    <g transform="translate(92 -2)">
      <ellipse cx="14" cy="6" rx="14" ry="9" fill="#fff" stroke={SKIN.ink} strokeWidth="1.5" />
      <circle cx="8" cy="6" r="1.8" fill={SKIN.ink}><animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0s" /></circle>
      <circle cx="14" cy="6" r="1.8" fill={SKIN.ink}><animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.2s" /></circle>
      <circle cx="20" cy="6" r="1.8" fill={SKIN.ink}><animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.4s" /></circle>
    </g>
  );
  return null;
}

const MOODS: Record<string, {
  eye: string; mouth: string; cheeks: boolean; brows: string;
  arms: string; legs: string; accent: string | null; anim: string; tremble: boolean; look?: string;
}> = {
  happy:     { eye:'open',   mouth:'smile',   cheeks:true,  brows:'arched',    arms:'rest',     legs:'rest',  accent:null,         anim:'bob',          tremble:false },
  celebrate: { eye:'star',   mouth:'bigOpen', cheeks:true,  brows:'raised',    arms:'cheer',    legs:'jump',  accent:'confetti',   anim:'jump',         tremble:false },
  proud:     { eye:'open',   mouth:'grin',    cheeks:true,  brows:'raised',    arms:'hipsLeft', legs:'apart', accent:null,         anim:'breathe',      tremble:false },
  thinking:  { eye:'open',   mouth:'flat',    cheeks:false, brows:'concerned', arms:'thinking', legs:'rest',  accent:'thinkBubble',anim:'lean',         tremble:false, look:'upRight' },
  cheering:  { eye:'happy',  mouth:'bigOpen', cheeks:true,  brows:'raised',    arms:'cheer',    legs:'jump',  accent:null,         anim:'jump',         tremble:false },
  curious:   { eye:'open',   mouth:'o',       cheeks:true,  brows:'raised',    arms:'rest',     legs:'rest',  accent:null,         anim:'lean',         tremble:false, look:'right' },
  oops:      { eye:'open',   mouth:'wobble',  cheeks:true,  brows:'concerned', arms:'hug',      legs:'rest',  accent:'sweat',      anim:'breathe',      tremble:true,  look:'upLeft' },
  sad:       { eye:'open',   mouth:'frown',   cheeks:false, brows:'sad',       arms:'droop',    legs:'rest',  accent:'tear',       anim:'breatheSlow',  tremble:true,  look:'down' },
  sleepy:    { eye:'closed', mouth:'smile',   cheeks:true,  brows:'none',      arms:'rest',     legs:'rest',  accent:'sleepZ',     anim:'breatheSlow',  tremble:false },
  love:      { eye:'heart',  mouth:'smile',   cheeks:true,  brows:'arched',    arms:'rest',     legs:'rest',  accent:'hearts',     anim:'breathe',      tremble:false },
  typing:    { eye:'open',   mouth:'o',       cheeks:false, brows:'raised',    arms:'rest',     legs:'rest',  accent:'dots',       anim:'breathe',      tremble:false },
  wave:      { eye:'happy',  mouth:'smile',   cheeks:true,  brows:'raised',    arms:'wave',     legs:'rest',  accent:null,         anim:'wave',         tremble:false },
  neutral:   { eye:'open',   mouth:'smile',   cheeks:true,  brows:'arched',    arms:'rest',     legs:'rest',  accent:null,         anim:'breathe',      tremble:false },
};

export type MoodType = keyof typeof MOODS;

interface MascotProps {
  mood?: MoodType;
  size?: number;
  animate?: boolean;
  trackCursor?: boolean;
}

export default function Mascot({ mood = 'happy', size = 140, animate = true, trackCursor = false }: MascotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState('center');

  useEffect(() => {
    if (!animate) return;
    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>;
    const loop = () => {
      const wait = 2400 + Math.random() * 3000;
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => { setBlink(false); loop(); }, 130);
      }, wait);
    };
    loop();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animate]);

  useEffect(() => {
    if (!trackCursor || !animate) return;
    const handle = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax < 40 && ay < 40) setLook('center');
      else if (ax > ay) setLook(dx > 0 ? 'right' : 'left');
      else setLook(dy > 0 ? 'down' : 'up');
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [trackCursor, animate]);

  const m = MOODS[mood] || MOODS.happy;
  const lookDir = trackCursor ? look : (m.look || 'center');
  const animClass = animate ? `pip-${m.anim}` : '';
  const h = size * (170 / 120);

  return (
    <div ref={ref} style={{ display: 'inline-block', width: size, height: h, position: 'relative' }}>
      <svg width={size} height={h} viewBox="0 0 120 170" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="pipBody" cx="38%" cy="28%" r="72%">
            <stop offset="0%" stopColor={SKIN.s1} />
            <stop offset="30%" stopColor={SKIN.s2} />
            <stop offset="78%" stopColor={SKIN.s3} />
            <stop offset="100%" stopColor={SKIN.s4} />
          </radialGradient>
          <radialGradient id="pipBelly" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor={SKIN.s4} stopOpacity="0.45" />
            <stop offset="100%" stopColor={SKIN.s4} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pipGloss" cx="32%" cy="18%" r="42%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pipLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9CC49C" />
            <stop offset="100%" stopColor={SKIN.leafDk} />
          </linearGradient>
        </defs>

        <ellipse cx="60" cy="160" rx="40" ry="6" fill={SKIN.ink} opacity="0.18">
          {animate && m.anim === 'jump' && <animate attributeName="rx" values="40;26;40" dur="1.4s" repeatCount="indefinite" />}
          {animate && m.anim === 'jump' && <animate attributeName="opacity" values="0.18;0.08;0.18" dur="1.4s" repeatCount="indefinite" />}
        </ellipse>

        <Legs pose={m.legs} />

        <g className={animClass} style={{ transformOrigin: '60px 110px' }}>
          {(m.arms === 'cheer' || m.arms === 'up' || m.arms === 'wave') && <Arms pose={m.arms} />}

          <path d="M 60 32 C 89 32, 102 58, 102 92 C 102 124, 86 144, 60 144 C 34 144, 18 124, 18 92 C 18 58, 31 32, 60 32 Z" fill="url(#pipBody)" />
          <path d="M 60 34 Q 56 64 58 104 Q 56 134 60 142" stroke={SKIN.s4} strokeWidth="1.6" fill="none" opacity="0.32" strokeLinecap="round" />
          <ellipse cx="60" cy="120" rx="38" ry="24" fill="url(#pipBelly)">
            {animate && <animate attributeName="ry" values="24;26;24" dur="3.6s" repeatCount="indefinite" />}
          </ellipse>
          <ellipse cx="42" cy="62" rx="22" ry="28" fill="url(#pipGloss)" />
          <ellipse cx="80" cy="50" rx="6" ry="9" fill="#fff" opacity="0.18" />

          <g>
            <path d="M 60 30 Q 72 18 82 22 Q 78 33 66 33 Z" fill="url(#pipLeaf)" />
            <path d="M 60 30 Q 70 22 80 24" stroke={SKIN.leafDk} strokeWidth="1.2" fill="none" opacity="0.5" />
            <path d="M 60 32 Q 50 22 42 26 Q 46 35 58 33 Z" fill={SKIN.leafDk} opacity="0.85" />
            <path d="M 60 33 L 60 24" stroke={SKIN.leafDk} strokeWidth="2.2" strokeLinecap="round" />
          </g>

          <Brows kind={m.brows} />
          <Cheeks visible={m.cheeks} />
          <Eye cx={45} cy={70} kind={m.eye} look={lookDir} blink={blink && m.eye === 'open'} tremble={m.tremble} />
          <Eye cx={75} cy={70} kind={m.eye} look={lookDir} blink={blink && m.eye === 'open'} tremble={m.tremble} />
          <Mouth cx={60} cy={92} kind={m.mouth} tremble={m.tremble} />
          <ellipse cx="60" cy="80" rx="1.5" ry="1" fill={SKIN.s4} opacity="0.4" />

          {(m.arms !== 'cheer' && m.arms !== 'up' && m.arms !== 'wave') && <Arms pose={m.arms} />}
        </g>

        {m.accent && <Accent kind={m.accent} />}
      </svg>
    </div>
  );
}
