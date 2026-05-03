import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, FoodPlate, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const MEALS: {
  l: string; t: string; kcal: number; p: string; done: boolean; next: boolean;
  tone: 'apricot' | 'butter' | 'green' | 'cream' | 'sky'; icon: string;
}[] = [
  { l: 'Greek yogurt + berries', t: '07:30', kcal: 280, p: 'P 18 · C 32 · F 8',  done: true,  next: false, tone: 'apricot', icon: 'breakfast' },
  { l: 'Apple + 12 almonds',     t: '10:30', kcal: 180, p: 'P 4 · C 22 · F 9',   done: true,  next: false, tone: 'butter',  icon: 'snack' },
  { l: 'Chicken & quinoa bowl',  t: '13:00', kcal: 520, p: 'P 38 · C 48 · F 18', done: false, next: true,  tone: 'green',   icon: 'dinner' },
  { l: 'Protein shake',          t: '16:00', kcal: 220, p: 'P 28 · C 12 · F 4',  done: false, next: false, tone: 'cream',   icon: 'breakfast' },
  { l: 'Salmon, greens, rice',   t: '19:30', kcal: 580, p: 'P 42 · C 50 · F 22', done: false, next: false, tone: 'sky',     icon: 'lunch' },
];

export default function Plan() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header>Plan · Today</Header>
        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            5 meals · <Em>1,780</Em>
          </Text>
          <View style={{ marginTop: 22, gap: 10 }}>
            {MEALS.map((m, i) => (
              <Pressable
                key={i}
                onPress={() => router.push('/(tabs)/plan/recipe')}
                accessibilityRole="button"
                accessibilityLabel={`${m.l}, ${m.t}, ${m.kcal} kilocalories${m.done ? ', done' : m.next ? ', up next' : ''}`}
                style={[
                  S.pillowSm,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    opacity: m.done ? 0.55 : 1,
                    backgroundColor: m.next ? C.apricotLt : C.pillow,
                    borderWidth: 1.5,
                    borderColor: m.next ? `${C.apricot}40` : 'transparent',
                  },
                ]}
              >
                <FoodPlate
                  tone={m.tone}
                  icon={<Icon name={m.icon} color={m.tone === 'green' ? C.green : C.apricotDk} size={26} />}
                  size={52}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontFamily: 'Fraunces_400Regular', color: m.next ? C.apricot : C.ink }}>{m.l}</Text>
                  <Text style={{ fontSize: 11, color: C.dim, marginTop: 3, fontFamily: 'DMSans_400Regular' }}>
                    {m.t} · {m.p}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, color: C.ink }}>{m.kcal}</Text>
                  {m.done && (
                    <Text style={{ fontSize: 9, color: C.green, fontFamily: 'DMSans_700Bold', letterSpacing: 1, textTransform: 'uppercase' }}>
                      ✓ done
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Swap a meal with Pip" onPress={() => router.push('/(tabs)/coach')} />
          <CtaButton label="This week's shopping list →" variant="line" onPress={() => router.push('/(tabs)/plan/shopping')} />
        </View>
      </ScrollView>
    </View>
  );
}
