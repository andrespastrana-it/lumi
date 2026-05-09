import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Line, Path, Circle, Text as SvgText } from 'react-native-svg';
import { Header, IconChip, Em, CtaButton, Mascot } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';

type WeighIn = { measuredAt: number; weightKg: number };

function ForecastChart({ points, target, latest }: { points: WeighIn[]; target: number; latest: number }) {
  const W = 320;
  const H = 160;

  if (points.length === 0) {
    return (
      <View style={{ width: '100%', height: H, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
          Log a weigh-in to see your trend.
        </Text>
      </View>
    );
  }

  const sorted = [...points].sort((a, b) => a.measuredAt - b.measuredAt);
  const minW = Math.min(target, ...sorted.map((p) => p.weightKg));
  const maxW = Math.max(...sorted.map((p) => p.weightKg));
  const padTop = 20, padBottom = 24;
  const range = Math.max(0.01, maxW - minW);

  const xFor = (i: number) => sorted.length === 1 ? W / 2 : (i / (sorted.length - 1)) * W;
  const yFor = (kg: number) => padTop + ((maxW - kg) / range) * (H - padTop - padBottom);

  let path = '';
  sorted.forEach((p, i) => {
    const x = xFor(i);
    const y = yFor(p.weightKg);
    path += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  });
  const fillPath = `${path} L${xFor(sorted.length - 1)},${H} L0,${H} Z`;

  const targetY = yFor(target);
  const latestX = xFor(sorted.length - 1);
  const latestY = yFor(latest);

  return (
    <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      <Defs>
        <SvgGradient id="curve" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor={C.apricot} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={C.apricot} stopOpacity="0" />
        </SvgGradient>
      </Defs>
      <Line x1="0" y1={H - padBottom} x2={W} y2={H - padBottom} stroke={C.hair} />
      <Line x1="0" y1={targetY} x2={W} y2={targetY} stroke={C.green} strokeDasharray="2 4" />
      <Path d={fillPath} fill="url(#curve)" />
      <Path d={path} stroke={C.apricot} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={latestX} cy={latestY} r={6} fill="#fff" stroke={C.apricot} strokeWidth={2.5} />
      <SvgText x={latestX - 4} y={latestY - 10} fontSize={10} fill={C.ink} fontFamily="DMSans_600SemiBold" textAnchor="end">
        today · {latest.toFixed(1)}
      </SvgText>
      <SvgText x={W - 4} y={targetY - 4} fontSize={10} fill={C.green} fontFamily="DMSans_600SemiBold" textAnchor="end">
        {target} kg goal
      </SvgText>
    </Svg>
  );
}

export default function Forecast() {
  const router = useRouter();
  const me = useQuery(api.me.get);
  const weighIns = useQuery(api.weighIns.recent, { limit: 30 });

  if (me === undefined || weighIns === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
      </View>
    );
  }

  if (!me?.profile) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 }]}>
        <Mascot mood="thinking" size={120} />
        <Text style={[S.h2, { textAlign: 'center' }]}>No profile yet</Text>
        <CtaButton label="Finish onboarding" onPress={() => router.replace('/onboarding/welcome')} />
      </View>
    );
  }

  const startKg = me.profile.startWeightKg;
  const targetKg = me.profile.targetWeightKg;
  const sorted = [...weighIns].sort((a, b) => a.measuredAt - b.measuredAt);
  const latest = sorted.length > 0 ? sorted[sorted.length - 1].weightKg : startKg;
  const lostKg = Math.max(0, startKg - latest);
  const toGoKg = Math.max(0, latest - targetKg);

  const STATS: { l: string; v: string; u: string; icon: string; tone: 'greenSolid' | 'apricot' | 'butter' }[] = [
    { l: 'Lost',      v: `−${lostKg.toFixed(1)}`, u: 'kg', icon: 'trend',   tone: 'greenSolid' },
    { l: 'To go',     v: toGoKg.toFixed(1),       u: 'kg', icon: 'target',  tone: 'apricot' },
    { l: 'Weigh-ins', v: String(weighIns.length), u: '',   icon: 'sparkle', tone: 'butter' },
  ];

  const headlineKg = sorted.length > 0 ? latest : startKg;

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 110 }}>
        <Header>Forecast</Header>

        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            <Em>{targetKg} kg</Em> · {headlineKg.toFixed(1)} now
          </Text>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
          <View style={[S.pillow, { padding: 20 }]}>
            <ForecastChart points={weighIns as WeighIn[]} target={targetKg} latest={headlineKg} />
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
              {u ? <Text style={{ fontSize: 10, color: C.dim, fontFamily: 'DMSans_400Regular' }}>{u}</Text> : null}
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Log a weigh-in" onPress={() => router.push('/(tabs)/stats/weigh-in')} />
          <CtaButton label="View milestones" variant="line" onPress={() => router.push('/(tabs)/stats/milestone')} />
        </View>
      </ScrollView>
    </View>
  );
}
