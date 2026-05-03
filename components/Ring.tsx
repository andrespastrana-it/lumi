import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { C } from '@/lib/tokens';

interface RingProps {
  pct?: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  sublabel?: string;
}

export function Ring({
  pct = 0.5,
  size = 44,
  stroke = 4,
  color = C.apricot,
  track = C.apricotWash,
  label,
  sublabel,
}: RingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - pct * circ;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circ}`}
          strokeDashoffset={off}
          strokeLinecap="round"
        />
      </Svg>
      {label && (
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: size * 0.3, color: C.ink, lineHeight: size * 0.32 }}>
            {label}
          </Text>
          {sublabel && (
            <Text style={{ fontSize: 8, color: C.dim, fontFamily: 'DMSans_500Medium', letterSpacing: 1, textTransform: 'uppercase', marginTop: 1 }}>
              {sublabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
