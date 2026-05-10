import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { Mascot, IconChip, Blob, Em, CtaButton, ScreenLoading } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';

export default function Milestone() {
  const router = useRouter();
  const me = useQuery(api.me.get);
  const recent = useQuery(api.weighIns.recent, { limit: 1 });
  const today = useQuery(api.today.get);
  const dismiss = () => router.replace('/(tabs)/today');

  if (me === undefined || recent === undefined || today === undefined) {
    return <ScreenLoading />;
  }

  const startKg = me?.profile?.startWeightKg ?? 0;
  const latestKg = recent[0]?.weightKg ?? startKg;
  const kgDown = Math.max(0, startKg - latestKg);
  const streak = today?.streakDays ?? 0;

  const headline = kgDown >= 0.1 ? `${kgDown.toFixed(1)} kg` : 'Showing up';
  const subhead = kgDown >= 0.1 ? 'down' : 'is the win';
  const flavor =
    kgDown >= 5 ? 'The weight of a small bowling ball. Or a chunky cat. Either way — gone.'
    : kgDown >= 2 ? 'The weight of a few sticks of butter. Or one big cantaloupe. Either way — gone.'
    : kgDown >= 0.5 ? 'The weight of a small loaf of bread. The scale noticed.'
    : kgDown >= 0.1 ? 'Every kilo starts here. Keep stacking days.'
    : 'Streaks come before scales. Pip sees you.';

  return (
    <View style={S.page}>
      <Blob color={C.apricotMd} size={320} top={-100} right={-80} opacity={0.18} />
      <Blob color={C.greenWash} size={240} bottom={140} left={-80} opacity={0.08} />

      <View style={{ paddingTop: 44, alignItems: 'center' }}>
        <Mascot mood="celebrate" size={170} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <Text style={S.eyebrow}>Milestone unlocked ✦</Text>
        <Text style={[S.h1, { fontSize: 56, marginTop: 12, lineHeight: 58 }]}>
          <Em>{headline}</Em>
        </Text>
        <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 28, color: C.ink, marginTop: -4 }}>
          {subhead}
        </Text>
        <Text style={[S.body, { marginTop: 20, maxWidth: 280, textAlign: 'center' }]}>{flavor}</Text>
      </View>

      {streak > 0 ? (
        <View style={{ paddingHorizontal: 22, paddingBottom: 12 }}>
          <View style={[S.pillow, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
            <IconChip tone="greenSolid" size={44}>
              <Icon name="flame" color="#fff" size={22} />
            </IconChip>
            <View style={{ flex: 1 }}>
              <Text style={[S.eyebrow, { color: C.green }]}>Streak</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 26, color: C.green }}>
                {streak} {streak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: 22, paddingBottom: 22, gap: 4 }}>
        <CtaButton label="Back to today" onPress={dismiss} />
        <CtaButton label="Share" variant="line" onPress={dismiss} />
      </View>
    </View>
  );
}
