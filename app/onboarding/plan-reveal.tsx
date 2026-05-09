import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { Mascot, Blob, IconChip, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { formatDate } from '@/lib/locale';

const WEEKLY_RATE_KG = 0.5;

function weeksToTarget(currentKg: number, targetKg: number): number {
  const delta = Math.abs(currentKg - targetKg);
  if (delta < 0.1) return 0;
  return Math.ceil(delta / WEEKLY_RATE_KG);
}

export default function PlanReveal() {
  const router = useRouter();
  const me = useQuery(api.me.get);

  const profile = me?.profile;
  const start = profile?.startWeightKg ?? 85;
  const target = profile?.targetWeightKg ?? 68;
  const weeks = weeksToTarget(start, target);
  const delta = Math.abs(start - target);
  const weeklyRate = weeks > 0 ? (delta / weeks).toFixed(2) : '0.00';
  const finishDate = formatDate(new Date(Date.now() + weeks * 7 * 86400 * 1000));

  return (
    <View style={S.page}>
      <Blob color={C.apricotMd} size={320} top={-100} right={-100} opacity={0.18} />
      <Blob color={C.greenWash} size={240} bottom={140} left={-60} opacity={0.22} />

      <View style={{ paddingTop: 44, alignItems: 'center' }}>
        <Mascot mood="proud" size={140} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <Text style={S.eyebrow}>Your plan</Text>
        <Text style={[S.h1, { fontSize: 30, marginTop: 8, textAlign: 'center' }]}>
          {weeks} weeks to <Em>{target} kg</Em>
        </Text>
        <Text style={[S.display, { fontSize: 140, marginVertical: 16, lineHeight: 130, letterSpacing: -6 }]}>
          {weeklyRate}
        </Text>
        <Text style={{ fontSize: 12, color: C.muted, letterSpacing: 1.8, textTransform: 'uppercase', textAlign: 'center', fontFamily: 'DMSans_500Medium' }}>
          kg per week — safe, sustainable
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingBottom: 22 }}>
        <View style={[S.pillow, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', marginBottom: 14 }]}>
          <IconChip tone="greenSolid" size={48}>
            <Icon name="target" color="#fff" size={24} />
          </IconChip>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[S.eyebrow, { color: C.green }]}>Estimated finish</Text>
            <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 22, color: C.green, marginTop: 2 }}>
              {finishDate}
            </Text>
          </View>
          {me?.activePlan ? (
            <Text style={{ fontSize: 11, color: C.green, opacity: 0.8, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
              {me.activePlan.dailyKcal} kcal/day
            </Text>
          ) : null}
        </View>
        <CtaButton label="I'm in" onPress={() => router.push('/onboarding/permissions')} />
      </View>
    </View>
  );
}
