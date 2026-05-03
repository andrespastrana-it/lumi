import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Mascot, Blob, Em, IconChip, Ring, FoodPlate, FAB, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

const EATEN = 1108;
const TOTAL = 1780;
const MACROS: ReadonlyArray<readonly [string, number, number, string, string]> = [
  ['Protein', 88, 142, 'g', C.apricot],
  ['Carbs', 142, 220, 'g', C.butter],
  ['Fat', 42, 60, 'g', C.greenMd],
];
const MEALS: {
  l: string;
  t: string;
  kcal: number;
  done: boolean;
  next: boolean;
  tone: 'apricot' | 'butter' | 'green' | 'cream' | 'sky';
  icon: string;
}[] = [
  { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, done: true,  next: false, tone: 'apricot', icon: 'breakfast' },
  { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, done: true,  next: false, tone: 'butter',  icon: 'snack' },
  { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, done: false, next: true,  tone: 'green',   icon: 'dinner' },
  { l: 'Protein shake',          t: '16:00', kcal: 220, done: false, next: false, tone: 'cream',   icon: 'breakfast' },
  { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, done: false, next: false, tone: 'sky',     icon: 'lunch' },
];

function HeaderGreeting() {
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 14 }}>
      <Blob color={C.apricotMd} size={180} top={-30} right={-30} opacity={0.12} />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
        <View style={{ marginTop: -16, marginLeft: -10 }}>
          <Mascot mood="happy" size={92} />
        </View>
        <View style={{ flex: 1, paddingTop: 4 }}>
          <Text style={S.eyebrow}>Tuesday · Apr 28</Text>
          <Text style={[S.h1, { fontSize: 30, marginTop: 6, lineHeight: 32 }]}>
            Morning, <Em>Marco</Em>
          </Text>
          <Text style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic', marginTop: 8, lineHeight: 18 }}>
            “Today is a chicken-and-{'\n'}quinoa kind of day.”
          </Text>
        </View>
      </View>
    </View>
  );
}

function CaloriesCard() {
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
      <View style={S.pillow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Ring pct={EATEN / TOTAL} size={88} stroke={8} color={C.apricot} track={C.apricotWash} label={EATEN.toLocaleString()} sublabel="eaten" />
          <View style={{ flex: 1 }}>
            <Text style={S.eyebrow}>Calories</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 32, color: C.ink, letterSpacing: -1 }}>{TOTAL - EATEN}</Text>
              <Text style={{ fontSize: 12, color: C.dim, fontFamily: 'DMSans_400Regular' }}>kcal left</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: C.green }} />
              <Text style={{ fontSize: 11, color: C.green, fontFamily: 'DMSans_600SemiBold' }}>
                On pace · {TOTAL.toLocaleString()} target
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.hair }}>
          {MACROS.map(([l, a, b, u, color]) => (
            <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ring pct={a / b} size={36} stroke={3.5} color={color} track={`${color}33`} />
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

function StreakBanner() {
  const router = useRouter();
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 14 }}>
      <Pressable
        onPress={() => router.push('/(tabs)/stats')}
        style={[S.pillowSm, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', gap: 14 }]}
      >
        <IconChip tone="greenSolid" size={44}>
          <Icon name="flame" color="#fff" size={22} />
        </IconChip>
        <View style={{ flex: 1 }}>
          <Text style={[S.eyebrow, { color: C.green }]}>Streak</Text>
          <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 22, color: C.green, marginTop: 2, letterSpacing: -0.4 }}>
            21 days · −2.6 kg
          </Text>
        </View>
        <Icon name="add" color={C.green} size={18} />
      </Pressable>
    </View>
  );
}

function MealsList() {
  const router = useRouter();
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, paddingHorizontal: 4 }}>
        <Text style={S.eyebrow}>Today&apos;s meals</Text>
        <Text style={{ fontSize: 11, color: C.dim, fontFamily: 'DMSans_400Regular' }}>5 planned</Text>
      </View>
      <View style={[S.pillow, { padding: 0 }]}>
        {MEALS.map((m, i) => (
          <Pressable
            key={i}
            onPress={() => router.push('/(tabs)/plan')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingHorizontal: 18,
              paddingVertical: 14,
              borderBottomWidth: i < MEALS.length - 1 ? 1 : 0,
              borderBottomColor: C.hair,
              opacity: m.done ? 0.55 : 1,
              backgroundColor: m.next ? C.apricotLt : 'transparent',
            }}
          >
            <FoodPlate
              tone={m.tone}
              icon={<Icon name={m.icon} color={m.tone === 'green' ? C.green : C.apricotDk} size={24} />}
              size={48}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: m.next ? C.apricot : C.ink, fontFamily: m.next ? 'Fraunces_500Medium' : 'Fraunces_400Regular' }}>
                {m.l}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 3 }}>
                <Text style={{ fontSize: 11, color: C.dim, fontFamily: 'DMSans_400Regular' }}>{m.t}</Text>
                {m.next && (
                  <Text
                    style={{
                      fontSize: 9,
                      color: C.apricot,
                      letterSpacing: 1.4,
                      textTransform: 'uppercase',
                      fontFamily: 'DMSans_700Bold',
                      backgroundColor: C.apricotLt,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    Up next
                  </Text>
                )}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'Fraunces_400Regular' }}>{m.kcal}</Text>
              <Text style={{ fontSize: 9, color: C.dim, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DMSans_400Regular' }}>kcal</Text>
            </View>
            {m.done && (
              <View style={{ width: 22, height: 22, borderRadius: 999, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" color="#fff" size={12} />
              </View>
            )}
          </Pressable>
        ))}
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

export default function Today() {
  const router = useRouter();
  const { state } = useApp();

  return (
    <View style={S.page}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <HeaderGreeting />
        <CaloriesCard />
        <StreakBanner />
        <MealsList />
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
