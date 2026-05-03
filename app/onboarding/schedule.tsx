import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Em, CtaButton } from '@/components';
import type { ToneName } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp, AppState } from '@/context/AppContext';

type MealKey = keyof AppState['mealTimes'];

const MEALS: { k: MealKey; label: string; tone: ToneName; icon: string; color: string }[] = [
  { k: 'wake',      label: 'Wake',      tone: 'butter',  icon: 'sparkle',   color: C.apricotDk },
  { k: 'breakfast', label: 'Breakfast', tone: 'apricot', icon: 'breakfast', color: C.apricotDk },
  { k: 'lunch',     label: 'Lunch',     tone: 'green',   icon: 'dinner',    color: C.green },
  { k: 'dinner',    label: 'Dinner',    tone: 'apricot', icon: 'lunch',     color: C.apricotDk },
  { k: 'sleep',     label: 'Sleep',     tone: 'sky',     icon: 'sleep',     color: C.green },
];

function bumpTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10) + 15;
  if (m >= 60) { m -= 60; h += 1; }
  if (h >= 24) { h = 0; }
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export default function Schedule() {
  const router = useRouter();
  const { state, set } = useApp();

  const tap = (k: MealKey) => {
    set('mealTimes', { ...state.mealTimes, [k]: bumpTime(state.mealTimes[k]) });
  };

  return (
    <View style={S.page}>
      <Header showBack>Step 5 / 6</Header>
      <View style={[S.pad, { flex: 1 }]}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          When do{'\n'}you <Em>eat</Em>?
        </Text>
        <Text style={{ fontSize: 12, color: C.dim, marginTop: 10, fontFamily: 'DMSans_400Regular' }}>
          Tap a time to nudge it +15 min.
        </Text>

        <View style={{ marginTop: 18, gap: 8 }}>
          {MEALS.map(m => (
            <View key={m.k} style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
              <IconChip tone={m.tone} size={40}>
                <Icon name={m.icon} color={m.color} size={20} />
              </IconChip>
              <Text style={{ flex: 1, fontSize: 15, color: C.ink, fontFamily: 'DMSans_500Medium' }}>{m.label}</Text>
              <Pressable
                onPress={() => tap(m.k)}
                accessibilityRole="button"
                accessibilityLabel={`${m.label} time, ${state.mealTimes[m.k]}. Tap to nudge fifteen minutes later.`}
                hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                style={{ backgroundColor: C.cream, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 }}
              >
                <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, color: C.apricot }}>{state.mealTimes[m.k]}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
        <CtaButton label="Continue" onPress={() => router.push('/onboarding/compute')} />
      </View>
    </View>
  );
}
