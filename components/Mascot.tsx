import { useEffect } from 'react';
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
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

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

function Eye({ cx, cy, kind, look, blinkScale }: { cx: number; cy: number; kind: EyeKind; look?: LookDir; blinkScale?: SharedValue<number> }) {
  const style = useAnimatedProps(() => {
    if (!blinkScale) return {};
    return {
      transform: [
        { translateX: cx },
        { translateY: cy },
        { scaleY: blinkScale.value },
        { translateX: -cx },
        { translateY: -cy }
      ] as any
    };
  });

  const id = `ig-${cx}-${cy}`;
  let content = null;
  if (kind === 'closed') {
    content = <Path d={`M ${cx - 10} ${cy} Q ${cx} ${cy + 5} ${cx + 10} ${cy}`} stroke={SKIN.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
  } else if (kind === 'happy') {
    content = <Path d={`M ${cx - 10} ${cy + 3} Q ${cx} ${cy - 7} ${cx + 10} ${cy + 3}`} stroke={SKIN.ink} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
  } else if (kind === 'star') {
    content = (
      <G translateX={cx} translateY={cy}>
        <Ellipse rx={11} ry={12} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <Path d="M 0 -8 L 2 -2.5 L 8 -2.5 L 3.2 1.5 L 5 8 L 0 4 L -5 8 L -3.2 1.5 L -8 -2.5 L -2 -2.5 Z" fill={SKIN.ink} />
        <Ellipse cx={-3} cy={-4} rx={2} ry={2.5} fill="#fff" />
      </G>
    );
  } else if (kind === 'heart') {
    content = (
      <G translateX={cx} translateY={cy}>
        <Ellipse rx={11} ry={12} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <Path d="M -5.5 -2 a 2.8 2.8 0 0 1 5.5 0 a 2.8 2.8 0 0 1 5.5 0 q 0 4.5 -5.5 8 q -5.5 -3.5 -5.5 -8 z" fill={SKIN.s3} />
      </G>
    );
  } else {
    // open
    const { lx, ly } = lookOffset(look);
    content = (
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
  return <AnimatedG animatedProps={style}>{content}</AnimatedG>;
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

function Accent({ kind }: { kind: AccentKind }) {
  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
  }, []);
  
  const style = useAnimatedProps(() => ({
    transform: [{ translateY: floatY.value }] as any
  }));

  let content = null;
  if (kind === 'confetti') {
    const ps = [
      { cx: 18,  cy: 18, r: 3,   color: SKIN.s3 },
      { cx: 104, cy: 14, r: 2.5, color: SKIN.leafDk },
      { cx: 112, cy: 42, r: 2.2, color: '#5A3A55' },
      { cx: 14,  cy: 54, r: 2.5, color: SKIN.s3 },
      { cx: 108, cy: 78, r: 2,   color: SKIN.leafDk },
      { cx: 16,  cy: 90, r: 2.2, color: '#5A3A55' },
    ];
    content = <G>{ps.map((p, i) => <Circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.color} />)}</G>;
  } else if (kind === 'thinkBubble') {
    content = (
      <G translateX={92} translateY={6}>
        <Circle cx={2} cy={22} r={3} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <Circle cx={9} cy={14} r={4.5} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <Ellipse cx={22} cy={6} rx={14} ry={9} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <SvgText x={22} y={11} fontSize={13} fill={SKIN.ink} textAnchor="middle" fontFamily="Fraunces_300Light_Italic">?</SvgText>
      </G>
    );
  } else if (kind === 'sleepZ') {
    content = (
      <G translateX={95} translateY={16}>
        <SvgText x={0} y={14} fontSize={14} fill={SKIN.ink} fontFamily="Fraunces_400Regular">z</SvgText>
        <SvgText x={9} y={4}  fontSize={10} fill={SKIN.ink} opacity={0.7} fontFamily="Fraunces_400Regular">z</SvgText>
      </G>
    );
  } else if (kind === 'hearts') {
    content = (
      <G>
        <Path d="M 16 22 a 3 3 0 0 1 6 0 a 3 3 0 0 1 6 0 q 0 4 -6 8 q -6 -4 -6 -8 z" fill={SKIN.s3} />
        <Path d="M 92 12 a 2.5 2.5 0 0 1 5 0 a 2.5 2.5 0 0 1 5 0 q 0 3.5 -5 7 q -5 -3.5 -5 -7 z" fill={SKIN.s3} opacity={0.7} />
      </G>
    );
  } else if (kind === 'sweat') {
    content = (
      <G translateX={86} translateY={38}>
        <Path d="M 5 0 Q 0 8 0 12 a 5 5 0 0 0 10 0 Q 10 8 5 0 Z" fill="#7BB7E8" stroke={SKIN.ink} strokeWidth={1.2} />
      </G>
    );
  } else if (kind === 'tear') {
    content = <Path d="M 38 78 Q 35 92 38 100 a 3.5 3.5 0 0 0 7 0 Q 48 92 45 78 Z" fill={SKIN.tear} opacity={0.85} stroke={SKIN.iris} strokeWidth={0.8} />;
  } else if (kind === 'dots') {
    content = (
      <G translateX={92} translateY={-2}>
        <Ellipse cx={14} cy={6} rx={14} ry={9} fill="#fff" stroke={SKIN.ink} strokeWidth={1.5} />
        <Circle cx={8}  cy={6} r={1.8} fill={SKIN.ink} />
        <Circle cx={14} cy={6} r={1.8} fill={SKIN.ink} />
        <Circle cx={20} cy={6} r={1.8} fill={SKIN.ink} />
      </G>
    );
  }

  if (!content) return null;
  const needsFloat = ['thinkBubble', 'sleepZ', 'hearts', 'dots'].includes(kind);
  if (needsFloat) {
    return <AnimatedG animatedProps={style}>{content}</AnimatedG>;
  }
  return <G>{content}</G>;
}

function useDeepLiveness(anim: AnimKind, animate: boolean, mood: MascotMood) {
  const rootY = useSharedValue(0);
  const rootRotate = useSharedValue(0);
  const bodyScaleX = useSharedValue(1);
  const bodyScaleY = useSharedValue(1);
  const bodyY = useSharedValue(0);
  const faceX = useSharedValue(0);
  const faceY = useSharedValue(0);
  const armLagY = useSharedValue(0);
  const leafRotate = useSharedValue(0);
  const blinkScale = useSharedValue(1);
  const shadowScale = useSharedValue(1);

  // Blinking loop
  useEffect(() => {
    if (!animate) return;
    let isActive = true;
    const blinkLoop = () => {
      if (!isActive) return;
      const delay = 2000 + Math.random() * 4000;
      const isDouble = Math.random() > 0.6;
      setTimeout(() => {
        if (!isActive) return;
        if (mood === 'sleepy') return; // Don't blink if sleepy
        
        if (isDouble) {
          blinkScale.value = withSequence(
            withTiming(0.1, { duration: 60 }),
            withTiming(1, { duration: 60 }),
            withTiming(0.1, { duration: 60 }),
            withTiming(1, { duration: 80 })
          );
        } else {
          blinkScale.value = withSequence(
            withTiming(0.1, { duration: 60 }),
            withTiming(1, { duration: 80 })
          );
        }
        blinkLoop();
      }, delay);
    };
    blinkLoop();
    return () => { isActive = false; };
  }, [animate, mood]);

  // Main physics loop
  useEffect(() => {
    if (!animate) return;
    let intervalHandle: any = null;

    rootY.value = 0; rootRotate.value = 0;
    bodyScaleX.value = 1; bodyScaleY.value = 1; bodyY.value = 0;
    faceX.value = 0; faceY.value = 0;
    armLagY.value = 0; leafRotate.value = 0;
    shadowScale.value = 1;

    const backEasing = Easing.out(Easing.back(1.5));

    if (anim === 'breathe' || anim === 'breatheSlow') {
      const dur = anim === 'breatheSlow' ? 3200 : 2000;
      bodyScaleY.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: dur * 0.35, easing: Easing.out(Easing.sin) }),
          withTiming(1.03, { duration: dur * 0.1 }),
          withTiming(0.98, { duration: dur * 0.55, easing: Easing.inOut(Easing.quad) })
        ), -1, true
      );
      bodyScaleX.value = withRepeat(
        withSequence(
          withTiming(0.98, { duration: dur * 0.35, easing: Easing.out(Easing.sin) }),
          withTiming(0.98, { duration: dur * 0.1 }),
          withTiming(1.01, { duration: dur * 0.55, easing: Easing.inOut(Easing.quad) })
        ), -1, true
      );
      bodyY.value = withRepeat(
        withSequence(
          withTiming(-1.5, { duration: dur * 0.35, easing: Easing.out(Easing.sin) }),
          withTiming(-1.5, { duration: dur * 0.1 }),
          withTiming(0.5, { duration: dur * 0.55, easing: Easing.inOut(Easing.quad) })
        ), -1, true
      );
      shadowScale.value = withRepeat(
        withSequence(
          withTiming(0.97, { duration: dur * 0.35, easing: Easing.out(Easing.sin) }),
          withTiming(0.97, { duration: dur * 0.1 }),
          withTiming(1, { duration: dur * 0.55, easing: Easing.inOut(Easing.quad) })
        ), -1, true
      );
      
      faceY.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: dur * 0.4, easing: Easing.inOut(Easing.quad) }),
          withTiming(-0.5, { duration: dur * 0.6, easing: Easing.inOut(Easing.quad) })
        ), -1, true
      );
      faceX.value = withRepeat(
        withSequence(
          withTiming(1, { duration: dur * 0.8, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: dur * 0.8, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );

      armLagY.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: dur * 0.45, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: dur * 0.55, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
      leafRotate.value = withRepeat(
        withSequence(
          withTiming(3, { duration: dur * 0.45, easing: Easing.inOut(Easing.sin) }),
          withTiming(-2, { duration: dur * 0.55, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      );
    } 
    else if (anim === 'jump') {
      const jumpSeq = () => {
        bodyScaleY.value = withSequence(
          withTiming(0.85, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(1.15, { duration: 250, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 200, easing: Easing.in(Easing.quad) }),
          withTiming(0.9, { duration: 100, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 200, easing: backEasing })
        );
        bodyScaleX.value = withSequence(
          withTiming(1.15, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(0.85, { duration: 250, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 200, easing: Easing.in(Easing.quad) }),
          withTiming(1.1, { duration: 100, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 200, easing: backEasing })
        );
        bodyY.value = withSequence(
          withTiming(4, { duration: 150 }), 
          withTiming(-32, { duration: 250, easing: Easing.out(Easing.quad) }), 
          withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) }), 
          withTiming(2, { duration: 100 }), 
          withTiming(0, { duration: 200, easing: backEasing })
        );
        shadowScale.value = withSequence(
          withTiming(1, { duration: 150 }), 
          withTiming(0.6, { duration: 250, easing: Easing.out(Easing.quad) }), 
          withTiming(1, { duration: 200, easing: Easing.in(Easing.quad) }), 
          withTiming(1.1, { duration: 100 }), 
          withTiming(1, { duration: 200, easing: backEasing })
        );
        faceY.value = withSequence(
          withTiming(3, { duration: 150 }), 
          withTiming(-5, { duration: 250 }), 
          withTiming(4, { duration: 200 }), 
          withTiming(0, { duration: 300, easing: backEasing })
        );
        armLagY.value = withSequence(
          withTiming(8, { duration: 150 }),
          withTiming(14, { duration: 250 }),
          withTiming(-12, { duration: 200 }),
          withTiming(0, { duration: 300, easing: backEasing })
        );
        leafRotate.value = withSequence(
          withTiming(-20, { duration: 150 }),
          withTiming(25, { duration: 250 }),
          withTiming(-15, { duration: 200 }),
          withTiming(0, { duration: 300, easing: backEasing })
        );
      };
      jumpSeq();
      intervalHandle = setInterval(jumpSeq, 1600);
    }
    else if (anim === 'bob') {
      const dur = 800;
      bodyY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: dur * 0.5, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: dur * 0.5, easing: Easing.in(Easing.quad) })
        ), -1, false
      );
      bodyScaleY.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: dur * 0.5, easing: Easing.out(Easing.quad) }),
          withTiming(0.92, { duration: dur * 0.5, easing: Easing.in(Easing.quad) })
        ), -1, false
      );
      bodyScaleX.value = withRepeat(
        withSequence(
          withTiming(0.92, { duration: dur * 0.5, easing: Easing.out(Easing.quad) }),
          withTiming(1.08, { duration: dur * 0.5, easing: Easing.in(Easing.quad) })
        ), -1, false
      );
      shadowScale.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: dur * 0.5, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: dur * 0.5, easing: Easing.in(Easing.quad) })
        ), -1, false
      );
      armLagY.value = withRepeat(
        withSequence(
          withTiming(5, { duration: dur * 0.5, easing: Easing.out(Easing.quad) }),
          withTiming(-3, { duration: dur * 0.5, easing: Easing.in(Easing.quad) })
        ), -1, false
      );
      faceY.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: dur * 0.5, easing: Easing.out(Easing.quad) }),
          withTiming(2, { duration: dur * 0.5, easing: Easing.in(Easing.quad) })
        ), -1, false
      );
    }
    else if (anim === 'lean') {
      rootRotate.value = withRepeat(
        withSequence(
          withTiming(6, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.quad) })
        ), -1, false
      );
      bodyScaleY.value = withRepeat(withTiming(1.02, { duration: 1100 }), -1, true);
    }
    else if (anim === 'wave') {
      rootRotate.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 200 }),
          withTiming(22, { duration: 350, easing: Easing.out(Easing.quad) }),
          withTiming(-8, { duration: 350, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 350, easing: backEasing }),
          withTiming(0, { duration: 750 })
        ), -1, false
      );
      bodyScaleY.value = withRepeat(withTiming(1.02, { duration: 1000 }), -1, true);
    }

    return () => {
      if (intervalHandle) clearInterval(intervalHandle);
    };
  }, [anim, animate]);

  const rootStyle = useAnimatedProps(() => ({
    transform: [
      { translateY: rootY.value },
      { translateX: 60 },
      { translateY: 144 },
      { rotate: `${rootRotate.value}deg` },
      { translateX: -60 },
      { translateY: -144 }
    ] as any
  }));

  const bodyStyle = useAnimatedProps(() => ({
    transform: [
      { translateX: 60 },
      { translateY: 144 },
      { scaleX: bodyScaleX.value },
      { scaleY: bodyScaleY.value },
      { translateX: -60 },
      { translateY: -144 },
      { translateY: bodyY.value }
    ] as any
  }));

  const faceStyle = useAnimatedProps(() => ({
    transform: [
      { translateX: faceX.value },
      { translateY: faceY.value }
    ] as any
  }));

  const armStyle = useAnimatedProps(() => ({
    transform: [
      { translateY: armLagY.value }
    ] as any
  }));

  const leafStyle = useAnimatedProps(() => ({
    transform: [
      { translateX: 60 },
      { translateY: 30 },
      { rotate: `${leafRotate.value}deg` },
      { translateX: -60 },
      { translateY: -30 }
    ] as any
  }));

  const shadowStyle = useAnimatedProps(() => ({
    transform: [
      { translateX: 60 },
      { translateY: 160 },
      { scaleX: shadowScale.value },
      { scaleY: shadowScale.value },
      { translateX: -60 },
      { translateY: -160 }
    ] as any
  }));

  return { rootStyle, bodyStyle, faceStyle, armStyle, leafStyle, blinkScale, shadowStyle };
}

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  animate?: boolean;
  /** Web-only legacy prop. Ignored on native. */
  trackCursor?: boolean;
}

export function Mascot({ mood = 'happy', size = 140, animate = true }: MascotProps) {
  const m = MOODS[mood] || MOODS.happy;
  const h = size * (170 / 120);
  const { rootStyle, bodyStyle, faceStyle, armStyle, leafStyle, blinkScale, shadowStyle } = useDeepLiveness(m.anim, animate, mood);

  return (
    <View style={{ width: size, height: h }}>
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

        <AnimatedG animatedProps={shadowStyle}>
          <Ellipse cx={60} cy={160} rx={40} ry={6} fill={SKIN.ink} opacity={0.18} />
        </AnimatedG>

        <AnimatedG animatedProps={rootStyle}>
          <Legs pose={m.legs} />

          <AnimatedG animatedProps={bodyStyle}>
            {(m.arms === 'cheer' || m.arms === 'up' || m.arms === 'wave') && (
              <AnimatedG animatedProps={armStyle}>
                <Arms pose={m.arms} />
              </AnimatedG>
            )}

            <Path d="M 60 32 C 89 32, 102 58, 102 92 C 102 124, 86 144, 60 144 C 34 144, 18 124, 18 92 C 18 58, 31 32, 60 32 Z" fill="url(#pipBody)" />
            <Path d="M 60 34 Q 56 64 58 104 Q 56 134 60 142" stroke={SKIN.s4} strokeWidth={1.6} fill="none" opacity={0.32} strokeLinecap="round" />
            <Ellipse cx={60} cy={120} rx={38} ry={24} fill="url(#pipBelly)" />
            <Ellipse cx={42} cy={62}  rx={22} ry={28} fill="url(#pipGloss)" />
            <Ellipse cx={80} cy={50}  rx={6}  ry={9}  fill="#fff" opacity={0.18} />

            <AnimatedG animatedProps={leafStyle}>
              <Path d="M 60 30 Q 72 18 82 22 Q 78 33 66 33 Z" fill="url(#pipLeaf)" />
              <Path d="M 60 30 Q 70 22 80 24" stroke={SKIN.leafDk} strokeWidth={1.2} fill="none" opacity={0.5} />
              <Path d="M 60 32 Q 50 22 42 26 Q 46 35 58 33 Z" fill={SKIN.leafDk} opacity={0.85} />
              <Path d="M 60 33 L 60 24" stroke={SKIN.leafDk} strokeWidth={2.2} strokeLinecap="round" />
            </AnimatedG>

            <AnimatedG animatedProps={faceStyle}>
              <Brows kind={m.brows} />
              <Cheeks visible={m.cheeks} />
              <Eye cx={45} cy={70} kind={m.eye} look={m.look} blinkScale={blinkScale} />
              <Eye cx={75} cy={70} kind={m.eye} look={m.look} blinkScale={blinkScale} />
              <Mouth cx={60} cy={92} kind={m.mouth} />
              <Ellipse cx={60} cy={80} rx={1.5} ry={1} fill={SKIN.s4} opacity={0.4} />
            </AnimatedG>

            {(m.arms !== 'cheer' && m.arms !== 'up' && m.arms !== 'wave') && (
              <AnimatedG animatedProps={armStyle}>
                <Arms pose={m.arms} />
              </AnimatedG>
            )}

            {m.accent && <Accent kind={m.accent} />}
          </AnimatedG>
        </AnimatedG>
      </Svg>
    </View>
  );
}
