import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  G,
  Path,
  Circle,
  Ellipse,
  Rect,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG      = Animated.createAnimatedComponent(G);
const AnimatedPath   = Animated.createAnimatedComponent(Path);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const SKIN = {
  s1: '#FFD8BB', s2: '#FFB088', s3: '#E8784E', s4: '#A04A1E',
  cheek: '#F5826A', leaf: '#7CA67C', leafDk: '#3D5A4A',
  ink: '#2A1F18', inkSoft: '#5A3A20', iris: '#6B3A1E', irisLt: '#A06840',
  sparkle: '#FFE4C9', cream: '#FCEAD8', teeth: '#FFF6EE',
  tongue: '#E8784E', tear: '#9DD0F0',
};

export type MascotMood =
  | 'happy' | 'celebrate' | 'proud' | 'thinking' | 'cheering'
  | 'curious' | 'oops' | 'sad' | 'sleepy' | 'love' | 'typing'
  | 'wave' | 'neutral' | 'idle';

type EyeKind = 'open' | 'closed' | 'happy' | 'star' | 'heart';
type MouthKind = 'smile' | 'bigOpen' | 'grin' | 'o' | 'flat' | 'frown' | 'wobble';
type BrowKind = 'none' | 'concerned' | 'sad' | 'angry' | 'raised' | 'arched';
type ArmsPose = 'rest' | 'up' | 'cheer' | 'hipsLeft' | 'thinking' | 'hug' | 'wave' | 'droop' | 'reach';
type LegsPose = 'rest' | 'jump' | 'step' | 'apart' | 'tucked';
type AccentKind = 'confetti' | 'thinkBubble' | 'sleepZ' | 'hearts' | 'sweat' | 'tear' | 'dots';
type AnimKind = 'bob' | 'breathe' | 'breatheSlow' | 'jump' | 'lean' | 'wave';
type LookDir = 'center' | 'up' | 'down' | 'left' | 'right' | 'upLeft' | 'upRight';

interface MoodConfig {
  eye: EyeKind;
  mouth: MouthKind;
  cheeks: boolean;
  brows: BrowKind;
  arms: ArmsPose;
  legs: LegsPose;
  accent: AccentKind | null;
  anim: AnimKind;
  look?: LookDir;
}

const MOODS: Record<MascotMood, MoodConfig> = {
  happy:     { eye: 'open',   mouth: 'smile',   cheeks: true,  brows: 'arched',    arms: 'rest',     legs: 'rest',  accent: null,         anim: 'bob' },
  celebrate: { eye: 'star',   mouth: 'bigOpen', cheeks: true,  brows: 'raised',    arms: 'cheer',    legs: 'jump',  accent: 'confetti',   anim: 'jump' },
  proud:     { eye: 'open',   mouth: 'grin',    cheeks: true,  brows: 'raised',    arms: 'hipsLeft', legs: 'apart', accent: null,         anim: 'breathe' },
  thinking:  { eye: 'open',   mouth: 'flat',    cheeks: false, brows: 'concerned', arms: 'thinking', legs: 'rest',  accent: 'thinkBubble',anim: 'lean',  look: 'upRight' },
  cheering:  { eye: 'happy',  mouth: 'bigOpen', cheeks: true,  brows: 'raised',    arms: 'cheer',    legs: 'jump',  accent: null,         anim: 'jump' },
  curious:   { eye: 'open',   mouth: 'o',       cheeks: true,  brows: 'raised',    arms: 'rest',     legs: 'rest',  accent: null,         anim: 'lean',     look: 'right' },
  oops:      { eye: 'open',   mouth: 'wobble',  cheeks: true,  brows: 'concerned', arms: 'hug',      legs: 'rest',  accent: 'sweat',      anim: 'breathe',  look: 'upLeft' },
  sad:       { eye: 'open',   mouth: 'frown',   cheeks: false, brows: 'sad',       arms: 'droop',    legs: 'rest',  accent: 'tear',       anim: 'breatheSlow', look: 'down' },
  sleepy:    { eye: 'closed', mouth: 'smile',   cheeks: true,  brows: 'none',      arms: 'rest',     legs: 'rest',  accent: 'sleepZ',     anim: 'breatheSlow' },
  love:      { eye: 'heart',  mouth: 'smile',   cheeks: true,  brows: 'arched',    arms: 'rest',     legs: 'rest',  accent: 'hearts',     anim: 'breathe' },
  typing:    { eye: 'open',   mouth: 'o',       cheeks: false, brows: 'raised',    arms: 'rest',     legs: 'rest',  accent: 'dots',       anim: 'breathe' },
  wave:      { eye: 'happy',  mouth: 'smile',   cheeks: true,  brows: 'raised',    arms: 'wave',     legs: 'rest',  accent: null,         anim: 'wave' },
  neutral:   { eye: 'open',   mouth: 'smile',   cheeks: true,  brows: 'arched',    arms: 'rest',     legs: 'rest',  accent: null,         anim: 'breathe' },
  idle:      { eye: 'open',   mouth: 'smile',   cheeks: true,  brows: 'arched',    arms: 'rest',     legs: 'rest',  accent: null,         anim: 'breathe' },
};

function lookOffset(look?: LookDir): { lx: number; ly: number } {
  switch (look) {
    case 'left':    return { lx: -2,   ly: 0 };
    case 'right':   return { lx: 2,    ly: 0 };
    case 'up':      return { lx: 0,    ly: -2 };
    case 'down':    return { lx: 0,    ly: 2.5 };
    case 'upLeft':  return { lx: -1.5, ly: -1.5 };
    case 'upRight': return { lx: 1.5,  ly: -1.5 };
    default:        return { lx: 0,    ly: 0 };
  }
}

function Eye({ cx, cy, kind, look, blink }: { cx: number; cy: number; kind: EyeKind; look?: LookDir; blink?: boolean }) {
  const id = `ig-${cx}-${cy}`;
  if (kind === 'closed' || (blink && kind === 'open')) {
    return <Path d={`M ${cx - 10} ${cy} Q ${cx} ${cy + 5} ${cx + 10} ${cy}`} stroke={SKIN.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
  }
  if (kind === 'happy') {
    return <Path d={`M ${cx - 10} ${cy + 3} Q ${cx} ${cy - 7} ${cx + 10} ${cy + 3}`} stroke={SKIN.ink} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
  }
  if (kind === 'star') {
    return (
      <G translateX={cx} translateY={cy}>
        <Ellipse rx={11} ry={12} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <Path d="M 0 -8 L 2 -2.5 L 8 -2.5 L 3.2 1.5 L 5 8 L 0 4 L -5 8 L -3.2 1.5 L -8 -2.5 L -2 -2.5 Z" fill={SKIN.ink} />
        <Ellipse cx={-3} cy={-4} rx={2} ry={2.5} fill="#fff" />
      </G>
    );
  }
  if (kind === 'heart') {
    return (
      <G translateX={cx} translateY={cy}>
        <Ellipse rx={11} ry={12} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <Path d="M -5.5 -2 a 2.8 2.8 0 0 1 5.5 0 a 2.8 2.8 0 0 1 5.5 0 q 0 4.5 -5.5 8 q -5.5 -3.5 -5.5 -8 z" fill={SKIN.s3} />
      </G>
    );
  }
  // open
  const { lx, ly } = lookOffset(look);
  return (
    <G translateX={cx} translateY={cy}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={SKIN.irisLt} />
          <Stop offset="70%" stopColor={SKIN.iris} />
          <Stop offset="100%" stopColor={SKIN.ink} />
        </RadialGradient>
      </Defs>
      <Ellipse rx={11} ry={11} fill="#FFFAF3" stroke={SKIN.inkSoft} strokeWidth={0.6} opacity={0.95} />
      <Ellipse cx={lx} cy={ly} rx={8} ry={8.5} fill={`url(#${id})`} />
      <Ellipse cx={lx} cy={ly} rx={4.5} ry={5} fill={SKIN.ink} />
      <Ellipse cx={lx - 2.5} cy={ly - 3.5} rx={2.6} ry={3.2} fill="#fff" />
      <Circle cx={lx + 2.5} cy={ly + 2.5} r={1.3} fill="#fff" opacity={0.9} />
      <Path d="M -10 1 Q 0 5 10 1" stroke={SKIN.inkSoft} strokeWidth={0.8} fill="none" opacity={0.4} />
    </G>
  );
}

function Mouth({ cx, cy, kind }: { cx: number; cy: number; kind: MouthKind }) {
  if (kind === 'smile') {
    return (
      <G>
        <Path d={`M ${cx - 10} ${cy - 1} Q ${cx} ${cy + 6} ${cx + 10} ${cy - 1}`} stroke={SKIN.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <Circle cx={cx - 12} cy={cy} r={1} fill={SKIN.cheek} opacity={0.6} />
        <Circle cx={cx + 12} cy={cy} r={1} fill={SKIN.cheek} opacity={0.6} />
      </G>
    );
  }
  if (kind === 'bigOpen') {
    return (
      <G>
        <Path d={`M ${cx - 14} ${cy - 3} Q ${cx} ${cy + 15} ${cx + 14} ${cy - 3} Q ${cx} ${cy + 2} ${cx - 14} ${cy - 3} Z`} fill={SKIN.ink} />
        <Path d={`M ${cx - 8} ${cy + 6} Q ${cx} ${cy + 12} ${cx + 8} ${cy + 6} Q ${cx} ${cy + 9} ${cx - 8} ${cy + 6} Z`} fill={SKIN.tongue} />
        <Rect x={cx - 9} y={cy - 2} width={18} height={2} fill={SKIN.teeth} rx={0.5} opacity={0.8} />
      </G>
    );
  }
  if (kind === 'grin') {
    return (
      <G>
        <Path d={`M ${cx - 13} ${cy - 2} Q ${cx} ${cy + 10} ${cx + 13} ${cy - 2} Q ${cx} ${cy + 1} ${cx - 13} ${cy - 2} Z`} fill={SKIN.ink} />
        <Rect x={cx - 10} y={cy - 1} width={20} height={3.5} fill={SKIN.teeth} rx={0.5} />
      </G>
    );
  }
  if (kind === 'o')      return <Ellipse cx={cx} cy={cy + 3} rx={5} ry={6.5} fill={SKIN.ink} />;
  if (kind === 'flat')   return <Line x1={cx - 7} y1={cy + 1} x2={cx + 7} y2={cy + 1} stroke={SKIN.ink} strokeWidth={2.6} strokeLinecap="round" />;
  if (kind === 'frown')  return <Path d={`M ${cx - 10} ${cy + 5} Q ${cx} ${cy - 3} ${cx + 10} ${cy + 5}`} stroke={SKIN.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
  if (kind === 'wobble') return <Path d={`M ${cx - 9} ${cy + 1} Q ${cx - 4} ${cy - 3} ${cx} ${cy + 2} Q ${cx + 4} ${cy + 6} ${cx + 9} ${cy}`} stroke={SKIN.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />;
  return null;
}

function Cheeks({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <G opacity={0.55}>
      <Ellipse cx={32} cy={80} rx={7.5} ry={4.5} fill={SKIN.cheek} />
      <Ellipse cx={88} cy={80} rx={7.5} ry={4.5} fill={SKIN.cheek} />
      <Circle cx={32} cy={79} r={0.6} fill={SKIN.s4} opacity={0.4} />
      <Circle cx={88} cy={80} r={0.6} fill={SKIN.s4} opacity={0.4} />
    </G>
  );
}

function Brows({ kind }: { kind: BrowKind }) {
  if (kind === 'none') return null;
  const stroke = SKIN.inkSoft;
  const sw = 3;
  if (kind === 'concerned') return (<G><Path d="M 33 52 Q 42 46 51 51" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /><Path d="M 69 51 Q 78 46 87 52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /></G>);
  if (kind === 'sad')       return (<G><Path d="M 33 50 Q 42 56 51 53" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /><Path d="M 69 53 Q 78 56 87 50" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /></G>);
  if (kind === 'angry')     return (<G><Path d="M 33 49 L 51 54" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /><Path d="M 69 54 L 87 49" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /></G>);
  if (kind === 'raised')    return (<G><Path d="M 33 47 Q 42 43 51 46" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /><Path d="M 69 46 Q 78 43 87 47" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /></G>);
  if (kind === 'arched')    return (<G><Path d="M 33 50 Q 42 44 52 50" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /><Path d="M 68 50 Q 78 44 87 50" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" /></G>);
  return null;
}

function Arms({ pose }: { pose: ArmsPose }) {
  const POSES: Record<ArmsPose, { left: string; right: string; lh: { cx: number; cy: number }; rh: { cx: number; cy: number } }> = {
    rest:     { left: 'M 26 100 Q 16 108 14 122', right: 'M 94 100 Q 104 108 106 122', lh: { cx: 14,  cy: 124 }, rh: { cx: 106, cy: 124 } },
    up:       { left: 'M 26 95 Q 12 70 8 50',     right: 'M 94 95 Q 108 70 112 50',    lh: { cx: 8,   cy: 48  }, rh: { cx: 112, cy: 48 } },
    cheer:    { left: 'M 26 95 Q 16 60 12 35',    right: 'M 94 95 Q 104 60 108 35',    lh: { cx: 12,  cy: 32  }, rh: { cx: 108, cy: 32 } },
    hipsLeft: { left: 'M 26 100 Q 22 116 32 122', right: 'M 94 100 Q 102 110 104 122', lh: { cx: 34,  cy: 122 }, rh: { cx: 104, cy: 122 } },
    thinking: { left: 'M 26 100 Q 22 116 28 124', right: 'M 94 95 Q 80 70 72 56',      lh: { cx: 28,  cy: 124 }, rh: { cx: 72,  cy: 54 } },
    hug:      { left: 'M 26 98 Q 38 108 56 105',  right: 'M 94 98 Q 82 108 64 105',    lh: { cx: 56,  cy: 105 }, rh: { cx: 64,  cy: 105 } },
    wave:     { left: 'M 26 100 Q 22 116 28 124', right: 'M 94 92 Q 110 60 114 32',    lh: { cx: 28,  cy: 124 }, rh: { cx: 114, cy: 30 } },
    droop:    { left: 'M 26 102 Q 20 122 22 132', right: 'M 94 102 Q 100 122 98 132',  lh: { cx: 22,  cy: 134 }, rh: { cx: 98,  cy: 134 } },
    reach:    { left: 'M 26 95 Q 20 80 30 65',    right: 'M 94 95 Q 100 80 90 65',     lh: { cx: 30,  cy: 62  }, rh: { cx: 90,  cy: 62 } },
  };
  const p = POSES[pose] || POSES.rest;
  const arm = (d: string, key: string) => (
    <G key={key}>
      <Path d={d} stroke={SKIN.s4} strokeWidth={13} fill="none" strokeLinecap="round" />
      <Path d={d} stroke={SKIN.s3} strokeWidth={11} fill="none" strokeLinecap="round" />
      <Path d={d} stroke={SKIN.s2} strokeWidth={9}  fill="none" strokeLinecap="round" />
    </G>
  );
  const hand = (cx: number, cy: number, key: string) => (
    <G key={key}>
      <Circle cx={cx} cy={cy}       r={8} fill={SKIN.s4} />
      <Circle cx={cx} cy={cy - 0.5} r={7} fill={SKIN.s3} />
      <Circle cx={cx} cy={cy - 1}   r={6} fill={SKIN.s2} />
      <Ellipse cx={cx - 1.5} cy={cy - 3} rx={2.4} ry={1.6} fill={SKIN.s1} opacity={0.7} />
    </G>
  );
  return (
    <G>
      {arm(p.left, 'l-arm')}
      {arm(p.right, 'r-arm')}
      {hand(p.lh.cx, p.lh.cy, 'l-hand')}
      {hand(p.rh.cx, p.rh.cy, 'r-hand')}
    </G>
  );
}

function Legs({ pose }: { pose: LegsPose }) {
  const POSES: Record<LegsPose, { l: { x: number; y: number }; r: { x: number; y: number } }> = {
    rest:   { l: { x: 48, y: 148 }, r: { x: 72, y: 148 } },
    jump:   { l: { x: 48, y: 138 }, r: { x: 72, y: 138 } },
    step:   { l: { x: 42, y: 146 }, r: { x: 78, y: 150 } },
    apart:  { l: { x: 40, y: 150 }, r: { x: 80, y: 150 } },
    tucked: { l: { x: 52, y: 146 }, r: { x: 68, y: 146 } },
  };
  const p = POSES[pose] || POSES.rest;
  const foot = (x: number, y: number, key: string) => (
    <G key={key}>
      <Ellipse cx={x} cy={y + 5} rx={10} ry={2.5} fill={SKIN.ink} opacity={0.18} />
      <Ellipse cx={x} cy={y + 1} rx={11} ry={7}   fill={SKIN.s4} />
      <Ellipse cx={x} cy={y}     rx={11} ry={7}   fill={SKIN.s3} />
      <Ellipse cx={x - 2} cy={y - 2.5} rx={5} ry={2.3} fill={SKIN.s1} opacity={0.6} />
    </G>
  );
  return (
    <G>
      {foot(p.l.x, p.l.y, 'l-foot')}
      {foot(p.r.x, p.r.y, 'r-foot')}
    </G>
  );
}

// ── Animated accents ─────────────────────────────────────────────

function ConfettiParticle({ cx, startY, r, color, dur, delay }: { cx: number; startY: number; r: number; color: string; dur: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withTiming(1, { duration: dur, easing: Easing.in(Easing.quad) }), -1, false));
  }, [t, dur, delay]);
  const animatedProps = useAnimatedProps(() => ({
    cy: startY + (180 - startY) * t.value,
    opacity: t.value < 0.7 ? 1 : 1 - (t.value - 0.7) / 0.3,
  }));
  return <AnimatedCircle animatedProps={animatedProps} cx={cx} r={r} fill={color} />;
}

function ConfettiAccent() {
  const ps = [
    { cx: 18,  cy: 18, r: 3,   color: SKIN.s3,     dur: 2500, delay: 0 },
    { cx: 104, cy: 14, r: 2.5, color: SKIN.leafDk, dur: 2800, delay: 500 },
    { cx: 112, cy: 42, r: 2.2, color: '#5A3A55',   dur: 2300, delay: 1000 },
    { cx: 14,  cy: 54, r: 2.5, color: SKIN.s3,     dur: 2600, delay: 300 },
    { cx: 108, cy: 78, r: 2,   color: SKIN.leafDk, dur: 2400, delay: 700 },
    { cx: 16,  cy: 90, r: 2.2, color: '#5A3A55',   dur: 2700, delay: 1200 },
  ];
  return <G>{ps.map((p, i) => <ConfettiParticle key={i} {...p} startY={p.cy} />)}</G>;
}

function HeartFloat({ d, fill, opacity, dur, delay }: { d: string; fill: string; opacity?: number; dur: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: dur / 2 }), withTiming(0, { duration: dur / 2 })), -1, false));
  }, [t, dur, delay]);
  const animatedProps = useAnimatedProps(() => ({
    translateY: -10 * t.value,
    opacity: (opacity ?? 1) * (1 - t.value * 0.3),
  }));
  return (
    <AnimatedG animatedProps={animatedProps}>
      <Path d={d} fill={fill} />
    </AnimatedG>
  );
}

function HeartsAccent() {
  return (
    <G>
      <HeartFloat d="M 16 22 a 3 3 0 0 1 6 0 a 3 3 0 0 1 6 0 q 0 4 -6 8 q -6 -4 -6 -8 z"      fill={SKIN.s3} dur={2000} delay={0} />
      <HeartFloat d="M 92 12 a 2.5 2.5 0 0 1 5 0 a 2.5 2.5 0 0 1 5 0 q 0 3.5 -5 7 q -5 -3.5 -5 -7 z" fill={SKIN.s3} opacity={0.7} dur={2200} delay={500} />
    </G>
  );
}

function TypingDot({ cx, delay }: { cx: number; delay: number }) {
  const t = useSharedValue(0.3);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0.3, { duration: 500 })), -1, false));
  }, [t, delay]);
  const animatedProps = useAnimatedProps(() => ({ opacity: t.value }));
  return <AnimatedCircle animatedProps={animatedProps} cx={cx} cy={6} r={1.8} fill={SKIN.ink} />;
}

function DotsAccent() {
  return (
    <G translateX={92} translateY={-2}>
      <Ellipse cx={14} cy={6} rx={14} ry={9} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
      <TypingDot cx={8}  delay={0} />
      <TypingDot cx={14} delay={200} />
      <TypingDot cx={20} delay={400} />
    </G>
  );
}

function SleepZLetter({ x, y, fontSize, baseOpacity, delay }: { x: number; y: number; fontSize: number; baseOpacity: number; delay: number }) {
  const t = useSharedValue(baseOpacity);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withSequence(withTiming(baseOpacity * 0.3, { duration: 800 }), withTiming(baseOpacity, { duration: 800 })), -1, false));
  }, [t, baseOpacity, delay]);
  const animatedProps = useAnimatedProps(() => ({ opacity: t.value }));
  return (
    <AnimatedSvgText animatedProps={animatedProps} x={x} y={y} fontSize={fontSize} fill={SKIN.ink} fontFamily="Fraunces_400Regular">
      z
    </AnimatedSvgText>
  );
}

function SleepZAccent() {
  return (
    <G translateX={95} translateY={16}>
      <SleepZLetter x={0} y={14} fontSize={14} baseOpacity={1}   delay={0} />
      <SleepZLetter x={9} y={4}  fontSize={10} baseOpacity={0.7} delay={500} />
    </G>
  );
}

function SweatAccent() {
  const t = useSharedValue(0.4);
  useEffect(() => {
    t.value = withRepeat(withSequence(withTiming(1, { duration: 1000 }), withTiming(0.4, { duration: 1000 })), -1, false);
  }, [t]);
  const animatedProps = useAnimatedProps(() => ({ opacity: t.value }));
  return (
    <G translateX={86} translateY={38}>
      <AnimatedPath
        animatedProps={animatedProps}
        d="M 5 0 Q 0 8 0 12 a 5 5 0 0 0 10 0 Q 10 8 5 0 Z"
        fill="#7BB7E8"
        stroke={SKIN.ink}
        strokeWidth={1.2}
      />
    </G>
  );
}

function Accent({ kind, animate }: { kind: AccentKind; animate: boolean }) {
  // Static fallback for animate=false (used by MascotGallery thumbnails to
  // keep the grid quiet).
  if (!animate) {
    if (kind === 'confetti') {
      return (
        <G>
          {[
            [18, 18, 3, SKIN.s3],
            [104, 14, 2.5, SKIN.leafDk],
            [112, 42, 2.2, '#5A3A55'],
            [14, 54, 2.5, SKIN.s3],
            [108, 78, 2, SKIN.leafDk],
            [16, 90, 2.2, '#5A3A55'],
          ].map(([cx, cy, r, color], i) => (
            <Circle key={i} cx={cx as number} cy={cy as number} r={r as number} fill={color as string} />
          ))}
        </G>
      );
    }
    if (kind === 'hearts') {
      return (
        <G>
          <Path d="M 16 22 a 3 3 0 0 1 6 0 a 3 3 0 0 1 6 0 q 0 4 -6 8 q -6 -4 -6 -8 z" fill={SKIN.s3} />
          <Path d="M 92 12 a 2.5 2.5 0 0 1 5 0 a 2.5 2.5 0 0 1 5 0 q 0 3.5 -5 7 q -5 -3.5 -5 -7 z" fill={SKIN.s3} opacity={0.7} />
        </G>
      );
    }
    if (kind === 'dots') {
      return (
        <G translateX={92} translateY={-2}>
          <Ellipse cx={14} cy={6} rx={14} ry={9} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
          <Circle cx={8}  cy={6} r={1.8} fill={SKIN.ink} />
          <Circle cx={14} cy={6} r={1.8} fill={SKIN.ink} />
          <Circle cx={20} cy={6} r={1.8} fill={SKIN.ink} />
        </G>
      );
    }
    if (kind === 'sleepZ') {
      return (
        <G translateX={95} translateY={16}>
          <SvgText x={0} y={14} fontSize={14} fill={SKIN.ink} fontFamily="Fraunces_400Regular">z</SvgText>
          <SvgText x={9} y={4} fontSize={10} fill={SKIN.ink} opacity={0.7} fontFamily="Fraunces_400Regular">z</SvgText>
        </G>
      );
    }
    if (kind === 'sweat') {
      return (
        <G translateX={86} translateY={38}>
          <Path d="M 5 0 Q 0 8 0 12 a 5 5 0 0 0 10 0 Q 10 8 5 0 Z" fill="#7BB7E8" stroke={SKIN.ink} strokeWidth={1.2} />
        </G>
      );
    }
  }

  if (kind === 'confetti')    return <ConfettiAccent />;
  if (kind === 'hearts')      return <HeartsAccent />;
  if (kind === 'dots')        return <DotsAccent />;
  if (kind === 'sleepZ')      return <SleepZAccent />;
  if (kind === 'sweat')       return <SweatAccent />;
  if (kind === 'thinkBubble') return (
    <G translateX={92} translateY={6}>
      <Circle cx={2} cy={22} r={3} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
      <Circle cx={9} cy={14} r={4.5} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
      <Ellipse cx={22} cy={6} rx={14} ry={9} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
      <SvgText x={22} y={11} fontSize={13} fill={SKIN.ink} textAnchor="middle" fontFamily="Fraunces_300Light_Italic">?</SvgText>
    </G>
  );
  if (kind === 'tear') {
    return <Path d="M 38 78 Q 35 92 38 100 a 3.5 3.5 0 0 0 7 0 Q 48 92 45 78 Z" fill={SKIN.tear} opacity={0.85} stroke={SKIN.iris} strokeWidth={0.8} />;
  }
  return null;
}

function useMascotAnimation(anim: AnimKind, animate: boolean) {
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (!animate) return;
    translateY.value = 0;
    scaleX.value = 1;
    scaleY.value = 1;
    rotate.value = 0;

    if (anim === 'bob') {
      translateY.value = withRepeat(
        withSequence(withTiming(-6, { duration: 1200 }), withTiming(0, { duration: 1200 })),
        -1,
        false,
      );
    } else if (anim === 'breathe') {
      scaleY.value = withRepeat(withTiming(1.03, { duration: 1800 }), -1, true);
      scaleX.value = withRepeat(withTiming(0.985, { duration: 1800 }), -1, true);
    } else if (anim === 'breatheSlow') {
      scaleY.value = withRepeat(withTiming(1.02, { duration: 2800 }), -1, true);
      scaleX.value = withRepeat(withTiming(0.99,  { duration: 2800 }), -1, true);
    } else if (anim === 'jump') {
      translateY.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 280 }),
          withTiming(-22, { duration: 420, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 280, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: 420 }),
        ),
        -1,
        false,
      );
    } else if (anim === 'lean') {
      rotate.value = withRepeat(
        withSequence(withTiming(6, { duration: 1100 }), withTiming(0, { duration: 1100 })),
        -1,
        false,
      );
    } else if (anim === 'wave') {
      rotate.value = withRepeat(
        withSequence(
          withTiming(0,   { duration: 200 }),
          withTiming(22,  { duration: 350 }),
          withTiming(-8,  { duration: 350 }),
          withTiming(0,   { duration: 350 }),
          withTiming(0,   { duration: 750 }),
        ),
        -1,
        false,
      );
    }
  }, [anim, animate, translateY, scaleX, scaleY, rotate]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));
}

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  animate?: boolean;
  /** Web-only legacy prop. Ignored on native. */
  trackCursor?: boolean;
}

function useEyeBlink(animate: boolean) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (!animate) return;
    let t1: ReturnType<typeof setTimeout> | undefined;
    let t2: ReturnType<typeof setTimeout> | undefined;
    const loop = () => {
      const wait = 2400 + Math.random() * 3000;
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => {
          setBlink(false);
          loop();
        }, 130);
      }, wait);
    };
    loop();
    return () => {
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [animate]);
  return blink;
}

export function Mascot({ mood = 'happy', size = 140, animate = true }: MascotProps) {
  const m = MOODS[mood] || MOODS.happy;
  const h = size * (170 / 120);
  const animStyle = useMascotAnimation(m.anim, animate);
  const blink = useEyeBlink(animate);

  return (
    <View style={{ width: size, height: h }}>
      <Animated.View style={[{ width: size, height: h }, animStyle]}>
        <Svg width={size} height={h} viewBox="0 0 120 170">
          <Defs>
            <RadialGradient id="pipBody" cx="38%" cy="28%" r="72%">
              <Stop offset="0%" stopColor={SKIN.s1} />
              <Stop offset="30%" stopColor={SKIN.s2} />
              <Stop offset="78%" stopColor={SKIN.s3} />
              <Stop offset="100%" stopColor={SKIN.s4} />
            </RadialGradient>
            <RadialGradient id="pipBelly" cx="50%" cy="80%" r="50%">
              <Stop offset="0%"   stopColor={SKIN.s4} stopOpacity={0.45} />
              <Stop offset="100%" stopColor={SKIN.s4} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="pipGloss" cx="32%" cy="18%" r="42%">
              <Stop offset="0%"   stopColor="#fff" stopOpacity={0.9} />
              <Stop offset="55%"  stopColor="#fff" stopOpacity={0.18} />
              <Stop offset="100%" stopColor="#fff" stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id="pipLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%"   stopColor="#9CC49C" />
              <Stop offset="100%" stopColor={SKIN.leafDk} />
            </LinearGradient>
          </Defs>

          <Ellipse cx={60} cy={160} rx={40} ry={6} fill={SKIN.ink} opacity={0.18} />

          <Legs pose={m.legs} />

          {(m.arms === 'cheer' || m.arms === 'up' || m.arms === 'wave') && <Arms pose={m.arms} />}

          <Path d="M 60 32 C 89 32, 102 58, 102 92 C 102 124, 86 144, 60 144 C 34 144, 18 124, 18 92 C 18 58, 31 32, 60 32 Z" fill="url(#pipBody)" />
          <Path d="M 60 34 Q 56 64 58 104 Q 56 134 60 142" stroke={SKIN.s4} strokeWidth={1.6} fill="none" opacity={0.32} strokeLinecap="round" />
          <Ellipse cx={60} cy={120} rx={38} ry={24} fill="url(#pipBelly)" />
          <Ellipse cx={42} cy={62}  rx={22} ry={28} fill="url(#pipGloss)" />
          <Ellipse cx={80} cy={50}  rx={6}  ry={9}  fill="#fff" opacity={0.18} />

          {/* Leaves */}
          <G>
            <Path d="M 60 30 Q 72 18 82 22 Q 78 33 66 33 Z" fill="url(#pipLeaf)" />
            <Path d="M 60 30 Q 70 22 80 24" stroke={SKIN.leafDk} strokeWidth={1.2} fill="none" opacity={0.5} />
            <Path d="M 60 32 Q 50 22 42 26 Q 46 35 58 33 Z" fill={SKIN.leafDk} opacity={0.85} />
            <Path d="M 60 33 L 60 24" stroke={SKIN.leafDk} strokeWidth={2.2} strokeLinecap="round" />
          </G>

          <Brows kind={m.brows} />
          <Cheeks visible={m.cheeks} />
          <Eye cx={45} cy={70} kind={m.eye} look={m.look} blink={blink} />
          <Eye cx={75} cy={70} kind={m.eye} look={m.look} blink={blink} />
          <Mouth cx={60} cy={92} kind={m.mouth} />
          <Ellipse cx={60} cy={80} rx={1.5} ry={1} fill={SKIN.s4} opacity={0.4} />

          {(m.arms !== 'cheer' && m.arms !== 'up' && m.arms !== 'wave') && <Arms pose={m.arms} />}

          {m.accent && <Accent kind={m.accent} animate={animate} />}
        </Svg>
      </Animated.View>
    </View>
  );
}
