import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { Header, FoodPlate, Em, CtaButton, ScreenLoading, ScreenEmpty } from '@/components';
import type { PlateTone } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';
import type { Id } from '@/convex/_generated/dataModel';

const DAY = 86400_000;
const SLOT_ORDER = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 } as const;
const SLOT_TIME: Record<keyof typeof SLOT_ORDER, string> = {
  breakfast: '07:30',
  lunch: '13:00',
  dinner: '19:30',
  snack: '16:00',
};
const SLOT_TONE: Record<keyof typeof SLOT_ORDER, PlateTone> = {
  breakfast: 'apricot',
  lunch: 'butter',
  dinner: 'green',
  snack: 'cream',
};
const SLOT_ICON: Record<keyof typeof SLOT_ORDER, string> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snack: 'snack',
};

export default function Plan() {
  const router = useRouter();
  const plan = useQuery(api.plan.active);
  const markDone = useMutation(api.plan.markRecipeDone);

  if (plan === undefined) {
    return <ScreenLoading />;
  }

  if (plan === null) {
    return (
      <ScreenEmpty
        mascot="thinking"
        title="No plan yet"
        body="Finish onboarding so Pip can build your plan."
        cta={{ label: 'Finish onboarding', onPress: () => router.replace('/onboarding/welcome') }}
      />
    );
  }

  const dayInPlan = Math.max(0, Math.floor((Date.now() - plan.activeFrom) / DAY) % 7);
  const todays = [...plan.recipes]
    .filter((r: any) => r.day === dayInPlan)
    .sort((a: any, b: any) => SLOT_ORDER[a.slot as keyof typeof SLOT_ORDER] - SLOT_ORDER[b.slot as keyof typeof SLOT_ORDER]);

  const totalKcal = todays.reduce((sum: number, r: any) => sum + (r.kcal ?? 0), 0);
  const nextIdx = todays.findIndex((r: any) => !r.doneAt);

  const onMarkDone = async (r: any) => {
    try {
      await markDone({ planRecipeId: r._id as Id<'planRecipes'> });
    } catch (e) {
      Alert.alert('Could not update', describeConvexError(e));
    }
  };

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header>Plan · Today</Header>
        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            {todays.length} meals · <Em>{totalKcal.toLocaleString()}</Em>
          </Text>
          {todays.length === 0 ? (
            <Text style={{ marginTop: 22, fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
              No meals planned for today.
            </Text>
          ) : (
            <View style={{ marginTop: 22, gap: 10 }}>
              {todays.map((m: any, i: number) => {
                const slot = m.slot as keyof typeof SLOT_ORDER;
                const time = SLOT_TIME[slot];
                const tone = SLOT_TONE[slot];
                const icon = SLOT_ICON[slot];
                const isDone = !!m.doneAt;
                const isNext = i === nextIdx;
                return (
                  <Pressable
                    key={String(m._id ?? m.id)}
                    onPress={() =>
                      router.push({
                        pathname: '/(tabs)/plan/recipe',
                        params: { planRecipeId: String(m._id ?? m.id) },
                      })
                    }
                    onLongPress={() => onMarkDone(m)}
                    accessibilityRole="button"
                    accessibilityLabel={`${m.name}, ${time}, ${m.kcal} kilocalories${isDone ? ', done' : isNext ? ', up next' : ''}`}
                    style={[
                      S.pillowSm,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                        opacity: isDone ? 0.55 : 1,
                        backgroundColor: isNext ? C.apricotLt : C.pillow,
                        borderWidth: 1.5,
                        borderColor: isNext ? `${C.apricot}40` : 'transparent',
                      },
                    ]}
                  >
                    <FoodPlate
                      tone={tone}
                      icon={<Icon name={icon} color={tone === 'green' ? C.green : C.apricotDk} size={26} />}
                      size={52}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontFamily: 'Fraunces_400Regular', color: isNext ? C.apricot : C.ink }}>{m.name}</Text>
                      <Text style={{ fontSize: 11, color: C.dim, marginTop: 3, fontFamily: 'DMSans_400Regular' }}>
                        {time} · P {m.proteinG} · C {m.carbG} · F {m.fatG}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, color: C.ink }}>{m.kcal}</Text>
                      {isDone && (
                        <Text style={{ fontSize: 9, color: C.green, fontFamily: 'DMSans_700Bold', letterSpacing: 1, textTransform: 'uppercase' }}>
                          ✓ done
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Swap a meal with Pip" onPress={() => router.push('/(tabs)/coach')} />
          <CtaButton label="This week's shopping list →" variant="line" onPress={() => router.push('/(tabs)/plan/shopping')} />
        </View>
      </ScrollView>
    </View>
  );
}
