import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Ring, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const WEEK: { d: string; w: string; t: string; k: string; tone: 'apricot' | 'green' | 'butter'; icon: string }[] = [
  { d: 'Mon',   w: 'Push', t: '45 min', k: '420 kcal',          tone: 'apricot', icon: 'flame' },
  { d: 'Wed',   w: 'Pull', t: '40 min', k: '380 kcal',          tone: 'green',   icon: 'sparkle' },
  { d: 'Today', w: 'Legs', t: '—',      k: 'planned 18:00',     tone: 'butter',  icon: 'steps' },
];

export default function Activity() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Activity</Header>

        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            <Em>Workouts</Em>{'\n'}&amp; steps
          </Text>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
          <View style={[S.pillow, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
            <Ring pct={0.62} size={84} stroke={8} color={C.green} track="rgba(255,255,255,.4)" label="62%" />
            <View style={{ flex: 1 }}>
              <Text style={[S.eyebrow, { color: C.green }]}>Today</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 32, color: C.green, marginTop: 4, letterSpacing: -1 }}>8,420</Text>
              <Text style={{ fontSize: 12, color: C.green, marginTop: 2, fontFamily: 'DMSans_500Medium' }}>steps · +340 kcal earned</Text>
            </View>
          </View>
        </View>

        <View style={S.pad}>
          <Text style={[S.eyebrow, { marginTop: 24, marginBottom: 10 }]}>This week</Text>
          <View style={{ gap: 8 }}>
            {WEEK.map(({ d, w, t, k, tone, icon }) => (
              <View key={d} style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
                <IconChip tone={tone} size={40}>
                  <Icon name={icon} color={tone === 'green' ? C.green : C.apricotDk} size={20} />
                </IconChip>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 17, color: C.ink }}>{w}</Text>
                  <Text style={{ fontSize: 11, color: C.dim, marginTop: 2, fontFamily: 'DMSans_400Regular' }}>{d} · {t}</Text>
                </View>
                <Text style={{ fontSize: 13, color: C.green, fontFamily: 'Fraunces_400Regular' }}>{k}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22 }}>
          <CtaButton label="Add a workout" onPress={() => router.replace('/(tabs)/today')} />
        </View>
      </ScrollView>
    </View>
  );
}
