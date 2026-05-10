import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Line, Path, Circle, Text as SvgText } from 'react-native-svg';
import { Header, IconChip, Em, CtaButton, Mascot, ScreenLoading, ScreenEmpty } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';

type WeighIn = { measuredAt: number; weightKg: number };
type ProjectionPoint = { weekIso: string; kg: number };

function ForecastChart({
  points,
  target,
  latest,
  projection,
}: {
  points: WeighIn[];
  target: number;
  latest: number;
  projection?: ProjectionPoint[];
}) {
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
  const projKgs = projection?.map((p) => p.kg) ?? [];
  const allKgs = [target, ...sorted.map((p) => p.weightKg), ...projKgs];
  const minW = Math.min(...allKgs);
  const maxW = Math.max(...allKgs);
  const padTop = 20, padBottom = 24;
  const range = Math.max(0.01, maxW - minW);

  const totalCols = sorted.length + (projection?.length ?? 0);
  const xFor = (i: number) => (totalCols <= 1 ? W / 2 : (i / (totalCols - 1)) * W);
  const yFor = (kg: number) => padTop + ((maxW - kg) / range) * (H - padTop - padBottom);

  let pastPath = '';
  sorted.forEach((p, i) => {
    const x = xFor(i);
    const y = yFor(p.weightKg);
    pastPath += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
  });

  let projPath = '';
  if (projection && projection.length > 0) {
    const startX = xFor(sorted.length - 1);
    const startY = yFor(latest);
    projPath = `M${startX},${startY}`;
    projection.forEach((p, i) => {
      const x = xFor(sorted.length + i);
      const y = yFor(p.kg);
      projPath += ` L${x},${y}`;
    });
  }

  const fillPath = `${pastPath} L${xFor(sorted.length - 1)},${H} L0,${H} Z`;
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
      <Path d={pastPath} stroke={C.apricot} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {projPath ? (
        <Path
          d={projPath}
          stroke={C.apricot}
          strokeWidth={2}
          strokeDasharray="3 3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55}
        />
      ) : null}
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
  const snapshot = useQuery(api.forecast.get, { range: '30d' });

  if (me === undefined || weighIns === undefined || snapshot === undefined) {
    return <ScreenLoading />;
  }

  if (!me?.profile) {
    return (
      <ScreenEmpty
        mascot="thinking"
        title="No profile yet"
        cta={{ label: 'Finish onboarding', onPress: () => router.replace('/onboarding/welcome') }}
      />
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

  const payload = snapshot?.payload as
    | {
        kind?: string;
        projection?: ProjectionPoint[];
        headline?: string;
        detail?: string;
        onTrack?: boolean;
      }
    | null
    | undefined;
  const projection =
    payload?.kind === 'weight' && Array.isArray(payload.projection)
      ? payload.projection
      : undefined;
  const narrativeHeadline = payload?.headline;
  const narrativeDetail = payload?.detail;
  const narrativeMascot = payload?.onTrack ? 'proud' : 'curious';

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
            <ForecastChart
              points={weighIns as WeighIn[]}
              target={targetKg}
              latest={headlineKg}
              projection={projection}
            />
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

        {narrativeHeadline ? (
          <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
            <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18 }]}>
              <Mascot mood={narrativeMascot} size={64} />
              <View style={{ flex: 1 }}>
                <Text style={[S.h2, { fontSize: 18 }]}>{narrativeHeadline}</Text>
                {narrativeDetail ? (
                  <Text style={[S.body, { marginTop: 6, fontSize: 13 }]}>{narrativeDetail}</Text>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Log a weigh-in" onPress={() => router.push('/(tabs)/stats/weigh-in')} />
          <CtaButton label="View milestones" variant="line" onPress={() => router.push('/(tabs)/stats/milestone')} />
        </View>
      </ScrollView>
    </View>
  );
}
