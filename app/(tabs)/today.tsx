import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/expo';
import { Mascot, Blob, Em, IconChip, Ring, FoodPlate, FAB, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';
import { api } from '@/convex/_generated/api';

type Today = NonNullable<ReturnType<typeof useQuery<typeof api.today.get>>>;
type Meal = Today['meals'][number];

function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 12) return 'Morning';
  if (h < 18) return 'Afternoon';
  return 'Evening';
}

function moodToMascot(m: Today['mascotMood']): 'happy' | 'proud' | 'thinking' | 'oops' {
  if (m === 'worried') return 'oops';
  return m;
}

function HeaderGreeting({ firstName, mood }: { firstName: string; mood: Today['mascotMood'] }) {
  const now = new Date();
  const eyebrow = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const greeting = greetingFor(now);

  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 14 }}>
      <Blob color={C.apricotMd} size={180} top={-30} right={-30} opacity={0.12} />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
        <View style={{ marginTop: -16, marginLeft: -10 }}>
          <Mascot mood={moodToMascot(mood)} size={92} />
        </View>
        <View style={{ flex: 1, paddingTop: 4 }}>
          <Text style={S.eyebrow}>{eyebrow}</Text>
          <Text style={[S.h1, { fontSize: 30, marginTop: 6, lineHeight: 32 }]}>
            {greeting}, <Em>{firstName}</Em>
          </Text>
        </View>
      </View>
    </View>
  );
}

function CaloriesCard({ today }: { today: Today }) {
  const macroRows: ReadonlyArray<readonly [string, number, number, string, string]> = [
    ['Protein', Math.round(today.macros.proteinG.eaten), today.macros.proteinG.target, 'g', C.apricot],
    ['Carbs', Math.round(today.macros.carbG.eaten), today.macros.carbG.target, 'g', C.butter],
    ['Fat', Math.round(today.macros.fatG.eaten), today.macros.fatG.target, 'g', C.greenMd],
  ];
  const onTrack = today.kcalEaten <= today.kcalTotal;
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
      <View style={S.pillow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Ring
            pct={today.ringPct}
            size={88}
            stroke={8}
            color={C.apricot}
            track={C.apricotWash}
            label={Math.round(today.kcalEaten).toLocaleString()}
            sublabel="eaten"
          />
          <View style={{ flex: 1 }}>
            <Text style={S.eyebrow}>Calories</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 32, color: C.ink, letterSpacing: -1 }}>{today.kcalLeft}</Text>
              <Text style={{ fontSize: 12, color: C.dim, fontFamily: 'DMSans_400Regular' }}>kcal left</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: onTrack ? C.green : C.apricot }} />
              <Text style={{ fontSize: 11, color: onTrack ? C.green : C.apricot, fontFamily: 'DMSans_600SemiBold' }}>
                {onTrack ? 'On pace' : 'Over target'} · {today.kcalTotal.toLocaleString()} target
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.hair }}>
          {macroRows.map(([l, a, b, u, color]) => (
            <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ring pct={b > 0 ? a / b : 0} size={36} stroke={3.5} color={color} track={`${color}33`} />
              <View>
                <Text style={{ fontSize: 9, color: C.dim, fontFamily: 'DMSans_700Bold', letterSpacing: 1.4, textTransform: 'uppercase' }}>{l}</Text>
                <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 16, color: C.ink, marginTop: 1 }}>
                  {a}<Text style={{ fontSize: 10, color: C.dim, fontFamily: 'DMSans_400Regular' }}>/{b}{u}</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function StreakBanner({ days }: { days: number }) {
  const router = useRouter();
  if (days <= 0) return null;
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 14 }}>
      <Pressable
        onPress={() => router.push('/(tabs)/stats')}
        accessibilityRole="button"
        accessibilityLabel={`Streak: ${days} days. Tap to see forecast.`}
        style={[S.pillowSm, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', gap: 14 }]}
      >
        <IconChip tone="greenSolid" size={44}>
          <Icon name="flame" color="#fff" size={22} />
        </IconChip>
        <View style={{ flex: 1 }}>
          <Text style={[S.eyebrow, { color: C.green }]}>Streak</Text>
          <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 22, color: C.green, marginTop: 2, letterSpacing: -0.4 }}>
            {days} {days === 1 ? 'day' : 'days'}
          </Text>
        </View>
        <Icon name="add" color={C.green} size={18} />
      </Pressable>
    </View>
  );
}

function sourceIcon(s: Meal['source']): string {
  switch (s) {
    case 'breakfast' as any:
      return 'breakfast';
    case 'photo':
      return 'snack';
    case 'voice':
      return 'snack';
    case 'barcode':
      return 'snack';
    case 'search':
      return 'snack';
    case 'manual':
      return 'snack';
    default:
      return 'snack';
  }
}

function MealsList({ meals }: { meals: Meal[] }) {
  const router = useRouter();
  if (meals.length === 0) {
    return (
      <View style={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 8 }}>
        <View style={[S.pillow, { alignItems: 'center', paddingVertical: 28 }]}>
          <Text style={[S.eyebrow, { textAlign: 'center' }]}>No meals yet today</Text>
          <Text style={{ fontSize: 13, color: C.muted, marginTop: 6, textAlign: 'center', fontFamily: 'Fraunces_300Light_Italic' }}>
            Tap the + to log your first meal.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, paddingHorizontal: 4 }}>
        <Text style={S.eyebrow}>Today&apos;s meals</Text>
        <Text style={{ fontSize: 11, color: C.dim, fontFamily: 'DMSans_400Regular' }}>
          {meals.length} logged
        </Text>
      </View>
      <View style={[S.pillow, { padding: 0 }]}>
        {meals.map((m, i) => {
          const time = new Date(m.consumedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
          return (
            <Pressable
              key={String(m.id)}
              onPress={() => router.push('/(tabs)/plan')}
              accessibilityRole="button"
              accessibilityLabel={`${m.name}, ${time}, ${m.kcal} kilocalories`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingHorizontal: 18,
                paddingVertical: 14,
                borderBottomWidth: i < meals.length - 1 ? 1 : 0,
                borderBottomColor: C.hair,
              }}
            >
              <FoodPlate
                tone="apricot"
                icon={<Icon name={sourceIcon(m.source)} color={C.apricotDk} size={24} />}
                size={48}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'Fraunces_400Regular' }}>{m.name}</Text>
                <Text style={{ fontSize: 11, color: C.dim, fontFamily: 'DMSans_400Regular', marginTop: 3 }}>{time}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'Fraunces_400Regular' }}>{m.kcal}</Text>
                <Text style={{ fontSize: 9, color: C.dim, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DMSans_400Regular' }}>kcal</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function WeighInBanner() {
  const router = useRouter();
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 16 }}>
      <Pressable
        onPress={() => router.push('/(tabs)/stats/weigh-in')}
        accessibilityRole="button"
        accessibilityLabel="Sunday weigh-in. Tap to step on the scale."
        style={[S.pillow, { backgroundColor: C.apricot, flexDirection: 'row', alignItems: 'center', gap: 14 }]}
      >
        <View style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="scale" color="#fff" size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[S.eyebrow, { color: 'rgba(255,246,238,.85)' }]}>Sunday ritual</Text>
          <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 19, marginTop: 2, color: C.paper }}>
            Step on the scale
          </Text>
        </View>
        <Icon name="add" color="#fff" size={18} />
      </Pressable>
    </View>
  );
}

function LoadingState() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <Mascot mood="thinking" size={120} />
      <Text style={[S.eyebrow, { marginTop: 12 }]}>Loading your day…</Text>
    </View>
  );
}

function NoPlanState() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 }}>
      <Mascot mood="thinking" size={120} />
      <Text style={[S.h2, { textAlign: 'center' }]}>No plan yet</Text>
      <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', maxWidth: 280, fontFamily: 'Fraunces_300Light_Italic' }}>
        Finish onboarding so Pip can build your plan.
      </Text>
      <CtaButton label="Finish onboarding" onPress={() => router.replace('/onboarding/welcome')} />
    </View>
  );
}

export default function TodayScreen() {
  const router = useRouter();
  const today = useQuery(api.today.get);
  const { user } = useUser();
  const { state } = useApp();

  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'friend';

  if (today === undefined) {
    return (
      <View style={S.page}>
        <LoadingState />
      </View>
    );
  }

  if (today === null) {
    return (
      <View style={S.page}>
        <NoPlanState />
      </View>
    );
  }

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 110 }}>
        <HeaderGreeting firstName={firstName} mood={today.mascotMood} />
        <CaloriesCard today={today} />
        <StreakBanner days={today.streakDays} />
        <MealsList meals={today.meals} />
        {state.weighInDue && <WeighInBanner />}

        <View style={{ paddingHorizontal: 22, marginTop: 12 }}>
          <CtaButton
            label="Had a rough day yesterday"
            variant="line"
            onPress={() => router.push('/(tabs)/stats/bad-day')}
          />
        </View>
      </ScrollView>

      <FAB />
    </View>
  );
}
