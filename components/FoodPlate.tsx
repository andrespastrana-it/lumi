import { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export type PlateTone = 'apricot' | 'green' | 'butter' | 'cream' | 'sky';

const STOPS: Record<PlateTone, [string, string, string]> = {
  apricot: ['#FBE0CC', '#F4B690', '#E8784E'],
  green:   ['#E8F0EA', '#B5CEBC', '#7FA088'],
  butter:  ['#FCEDC4', '#F5C56A', '#D9A23E'],
  cream:   ['#FFF5E0', '#F2E0BB', '#D9C28C'],
  sky:     ['#EAF1F6', '#BDD2DE', '#88A8BD'],
};

interface FoodPlateProps {
  tone?: PlateTone;
  icon: ReactNode;
  size?: number;
}

export function FoodPlate({ tone = 'apricot', icon, size = 64 }: FoodPlateProps) {
  const r = size / 2;
  const stops = STOPS[tone];
  const gradId = `plate-${tone}`;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 8px 16px -10px rgba(122,69,32,.35), 0 2px 4px -2px rgba(122,69,32,.18)',
        borderRadius: r,
      }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id={gradId} cx="0.3" cy="0.3" r="0.7">
            <Stop offset="0" stopColor={stops[0]} />
            <Stop offset="0.7" stopColor={stops[1]} />
            <Stop offset="1" stopColor={stops[2]} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${gradId})`} />
      </Svg>
      <View style={{ width: size * 0.5, height: size * 0.5 }}>{icon}</View>
    </View>
  );
}
