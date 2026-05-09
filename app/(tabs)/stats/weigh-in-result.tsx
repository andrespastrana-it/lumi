import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { Header, IconChip, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';

export default function WeighInResult() {
  const router = useRouter();
  const me = useQuery(api.me.get);
  const recent = useQuery(api.weighIns.recent, { limit: 2 });

  if (me === undefined || recent === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
      </View>
    );
  }

  const targetKg = me?.profile?.targetWeightKg ?? 0;
  const startKg = me?.profile?.startWeightKg ?? 0;
  const sorted = [...recent].sort((a, b) => a.measuredAt - b.measuredAt);
  const latest = sorted[sorted.length - 1]?.weightKg;
  const previous = sorted.length >= 2 ? sorted[sorted.length - 2].weightKg : null;

  // Insufficient data view: log at least 2 weigh-ins to compute a delta.
  if (latest === undefined || previous === null) {
    return (
      <View style={S.page}>
        <Header showBack>Pip&apos;s take</Header>
        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 14 }]}>
            One down,{'\n'}<Em>one to go</Em>
          </Text>
          <Text style={[S.body, { marginTop: 14 }]}>
            Log another weigh-in next week to see your trend. Pip needs two points to draw the line.
          </Text>
        </View>
        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22 }}>
          <CtaButton label="See forecast" onPress={() => router.replace('/(tabs)/stats')} />
        </View>
      </View>
    );
  }

  const delta = previous - latest; // positive = lost weight
  const lostKg = Math.max(0, delta);
  const direction =
    delta > 0.05 ? 'lost' :
    delta < -0.05 ? 'gained' :
    'flat';
  const headline =
    direction === 'lost' ? 'On pace' :
    direction === 'gained' ? 'Tomorrow we adjust' :
    'Holding steady';
  const detail =
    direction === 'lost'
      ? `You lost ${lostKg.toFixed(1)} kg this week. Beautiful.`
      : direction === 'gained'
      ? `You gained ${Math.abs(delta).toFixed(1)} kg this week. One week doesn't undo the rest — Pip will smooth it.`
      : 'Weight held steady this week. Often the body adjusts before the scale moves.';
  const remainingKg = Math.max(0, latest - targetKg);

  return (
    <View style={S.page}>
      <Header showBack>Pip&apos;s take</Header>

      <View style={S.pad}>
        <Text style={[S.h1, { marginTop: 14, fontSize: 44, lineHeight: 46 }]}>
          <Em>{headline}</Em>
        </Text>
        <Text style={[S.body, { marginTop: 14 }]}>{detail}</Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
        <View style={[S.pillow, { backgroundColor: C.greenLt, padding: 22 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={48}>
              <Icon name="trend" color="#fff" size={24} />
            </IconChip>
            <View>
              <Text style={[S.eyebrow, { color: C.green }]}>Now</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 30, color: C.green, marginTop: 4, letterSpacing: -1 }}>
                {latest.toFixed(1)} kg
              </Text>
              <Text style={{ fontSize: 12, color: C.green, marginTop: 6, fontFamily: 'DMSans_500Medium' }}>
                {targetKg ? `${remainingKg.toFixed(1)} kg to ${targetKg} kg goal` : 'No target set'}
                {startKg ? ` · started at ${startKg} kg` : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
        <CtaButton label="See forecast" onPress={() => router.replace('/(tabs)/stats')} />
        <CtaButton label="Celebrate first" variant="line" onPress={() => router.replace('/(tabs)/stats/milestone')} />
      </View>
    </View>
  );
}
