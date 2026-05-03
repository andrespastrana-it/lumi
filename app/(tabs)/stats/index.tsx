import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Line, Path, Circle, Text as SvgText } from 'react-native-svg';
import { Header, IconChip, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

function ForecastChart() {
  return (
    <Svg viewBox="0 0 320 160" width="100%" height={160}>
      <Defs>
        <SvgGradient id="curve" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor={C.apricot} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={C.apricot} stopOpacity="0" />
        </SvgGradient>
      </Defs>
      <Line x1="0" y1="120" x2="320" y2="120" stroke={C.hair} />
      <Line x1="0" y1="60" x2="320" y2="60" stroke={C.hair} strokeDasharray="2 4" />
      <Path d="M0,20 Q80,40 160,80 T320,140 L320,160 L0,160 Z" fill="url(#curve)" />
      <Path d="M0,20 Q80,40 160,80 T320,140" stroke={C.apricot} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Circle cx={80} cy={50} r={6} fill="#fff" stroke={C.apricot} strokeWidth={2.5} />
      <SvgText x={86} y={42} fontSize={10} fill={C.ink} fontFamily="DMSans_600SemiBold">
        today · 82.4
      </SvgText>
      <Circle cx={320} cy={140} r={6} fill={C.green} stroke="#fff" strokeWidth={2} />
      <SvgText x={260} y={135} fontSize={10} fill={C.green} fontFamily="DMSans_600SemiBold" textAnchor="end">
        68 kg goal
      </SvgText>
    </Svg>
  );
}

const STATS: { l: string; v: string; u: string; icon: string; tone: 'greenSolid' | 'apricot' | 'butter' }[] = [
  { l: 'Lost',       v: '−2.6', u: 'kg',   icon: 'trend',   tone: 'greenSolid' },
  { l: 'To go',      v: '14.4', u: 'kg',   icon: 'target',  tone: 'apricot' },
  { l: 'Days early', v: '14',   u: 'days', icon: 'sparkle', tone: 'butter' },
];

export default function Forecast() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 110 }}>
        <Header>Forecast · 26 weeks</Header>

        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            <Em>68 kg</Em> · Oct 14
          </Text>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
          <View style={[S.pillow, { padding: 20 }]}>
            <ForecastChart />
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 16, flexDirection: 'row', gap: 10 }}>
          {STATS.map(({ l, v, u, icon, tone }) => (
            <View key={l} style={[S.pillowSm, { flex: 1, padding: 14, alignItems: 'center' }]}>
              <IconChip tone={tone} size={32}>
                <Icon name={icon} color={tone === 'greenSolid' ? '#fff' : C.apricotDk} size={16} />
              </IconChip>
              <Text style={[S.eyebrow, { fontSize: 9, marginTop: 8 }]}>{l}</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 24, color: C.apricot, marginTop: 4, letterSpacing: -0.5 }}>{v}</Text>
              <Text style={{ fontSize: 10, color: C.dim, fontFamily: 'DMSans_400Regular' }}>{u}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="View milestones" onPress={() => router.push('/(tabs)/stats/milestone')} />
          <CtaButton label="What if I plateau?" variant="line" onPress={() => router.push('/(tabs)/stats/plateau')} />
        </View>
      </ScrollView>
    </View>
  );
}
