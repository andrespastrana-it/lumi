import { useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C, PILLOW_SHADOW_SM } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';
import type { Id } from '@/convex/_generated/dataModel';

const SLOT_ICON: Record<string, string> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snack: 'snack',
};

function Hero({ icon, isFavorite, onBack, onFavorite }: {
  icon: string;
  isFavorite: boolean;
  onBack: () => void;
  onFavorite: () => void;
}) {
  return (
    <LinearGradient
      colors={['#F4B690', C.apricot, '#B85530']}
      start={{ x: 0.6, y: 0.5 }}
      end={{ x: 0.0, y: 1 }}
      style={{ height: 280, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={200} height={200} style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id="outer" cx="0.35" cy="0.35" r="0.65">
            <Stop offset="0" stopColor="#FFF5E0" />
            <Stop offset="0.5" stopColor="#F2E0BB" />
            <Stop offset="0.9" stopColor="#C5A268" />
          </RadialGradient>
        </Defs>
        <Circle cx={100} cy={100} r={100} fill="url(#outer)" />
      </Svg>
      <View style={{ width: 110, height: 110, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={110} height={110} style={{ position: 'absolute' }}>
          <Defs>
            <RadialGradient id="inner" cx="0.35" cy="0.35" r="0.65">
              <Stop offset="0" stopColor="#E2EBE5" />
              <Stop offset="0.6" stopColor="#7FA088" />
              <Stop offset="1" stopColor="#3D5A4A" />
            </RadialGradient>
          </Defs>
          <Circle cx={55} cy={55} r={55} fill="url(#inner)" />
        </Svg>
        <Icon name={icon} color="#fff" size={44} />
      </View>

      <View style={{ position: 'absolute', top: 18, left: 22 }}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={6}
          style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.25)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Fraunces_400Regular' }}>‹</Text>
        </Pressable>
      </View>
      <View style={{ position: 'absolute', top: 18, right: 22 }}>
        <Pressable
          onPress={onFavorite}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          accessibilityState={{ selected: isFavorite }}
          hitSlop={6}
          style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: isFavorite ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.25)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="heart" color={isFavorite ? C.apricotDk : '#fff'} size={18} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

export default function Recipe() {
  const router = useRouter();
  const params = useLocalSearchParams<{ planRecipeId?: string }>();
  const plan = useQuery(api.plan.active);
  const addToShopping = useMutation(api.plan.addToShopping);
  const toggleFavorite = useMutation(api.plan.toggleRecipeFavorite);
  const logRecipe = useMutation(api.logs.logRecipe);
  const [busy, setBusy] = useState<null | 'shopping' | 'log' | 'favorite'>(null);

  if (plan === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
      </View>
    );
  }

  const recipe = plan?.recipes.find(
    (r: any) => String(r._id ?? r.id) === String(params.planRecipeId ?? ''),
  ) as any;

  if (!recipe) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 }]}>
        <Text style={[S.h2, { textAlign: 'center' }]}>Recipe not found</Text>
        <CtaButton label="Back to plan" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const slot = (recipe.slot as string) ?? 'lunch';
  const icon = SLOT_ICON[slot] ?? 'lunch';
  const STATS = [
    { icon: 'flame',   label: `${recipe.kcal} kcal`,    tone: C.butterLt },
    { icon: 'sparkle', label: `P ${recipe.proteinG}`,   tone: C.greenLt  },
    { icon: 'sparkle', label: `C ${recipe.carbG}`,      tone: C.apricotLt },
    { icon: 'sparkle', label: `F ${recipe.fatG}`,       tone: C.greenLt  },
  ];

  const onAddShopping = async () => {
    if (busy) return;
    try {
      setBusy('shopping');
      await addToShopping({ planRecipeId: recipe._id as Id<'planRecipes'> });
      router.push('/(tabs)/plan/shopping');
    } catch (e) {
      Alert.alert('Could not add', describeConvexError(e));
    } finally {
      setBusy(null);
    }
  };

  const onLogIt = async () => {
    if (busy) return;
    try {
      setBusy('log');
      await logRecipe({ planRecipeId: recipe._id as Id<'planRecipes'> });
      router.replace('/(tabs)/today');
    } catch (e) {
      Alert.alert('Could not log', describeConvexError(e));
    } finally {
      setBusy(null);
    }
  };

  const onFavorite = async () => {
    if (busy) return;
    try {
      setBusy('favorite');
      await toggleFavorite({ planRecipeId: recipe._id as Id<'planRecipes'> });
    } catch (e) {
      Alert.alert('Could not update', describeConvexError(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Hero
          icon={icon}
          isFavorite={!!recipe.isFavorite}
          onBack={() => router.back()}
          onFavorite={onFavorite}
        />

        <View style={{ paddingHorizontal: 22, marginTop: -32 }}>
          <View style={[S.pillow, { padding: 22 }]}>
            <Text style={[S.h1, { fontSize: 32, lineHeight: 34 }]}>
              {recipe.name.split(' ').slice(0, -1).join(' ')}{recipe.name.split(' ').length > 1 ? ' ' : ''}
              <Em>{recipe.name.split(' ').slice(-1)[0]}</Em>
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {STATS.map((item, i) => (
                <View
                  key={`${item.label}-${i}`}
                  style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 10, borderRadius: 14, backgroundColor: item.tone, alignItems: 'center', minWidth: 70 }}
                >
                  <Icon name={item.icon} color={C.apricotDk} size={18} />
                  <Text style={{ fontSize: 11, fontFamily: 'Fraunces_400Regular', color: C.ink, marginTop: 4 }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[S.pad, { marginTop: 24 }]}>
          <Text style={S.eyebrow}>Ingredients</Text>
          <View style={[S.pillow, { padding: 0, marginTop: 10 }]}>
            {(recipe.ingredients ?? []).map((ing: any, i: number) => (
              <View
                key={ing.id ?? `${ing.name}-${i}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderBottomWidth: i < (recipe.ingredients?.length ?? 0) - 1 ? 1 : 0,
                  borderBottomColor: C.hair,
                }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: C.apricot }} />
                <Text style={{ flex: 1, fontSize: 14, color: C.ink, fontFamily: 'DMSans_400Regular' }}>
                  {ing.qty} {ing.name}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[S.eyebrow, { marginTop: 24 }]}>Method</Text>
          <View style={{ marginTop: 10, gap: 10 }}>
            {(recipe.method ?? []).map((step: string, i: number) => (
              <View key={i} style={[S.pillowSm, { flexDirection: 'row', gap: 14, alignItems: 'flex-start' }]}>
                <View
                  style={{
                    width: 32, height: 32, borderRadius: 999, backgroundColor: C.apricot,
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: PILLOW_SHADOW_SM,
                  }}
                >
                  <Text style={{ fontFamily: 'Fraunces_500Medium', fontSize: 15, color: '#fff' }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: C.ink, lineHeight: 21, paddingTop: 6, fontFamily: 'DMSans_400Regular' }}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
          <CtaButton
            label={busy === 'shopping' ? 'Adding…' : 'Add to shopping list'}
            disabled={!!busy}
            onPress={onAddShopping}
          />
          <CtaButton
            label={busy === 'log' ? 'Logging…' : 'I made this — log it'}
            variant="line"
            disabled={!!busy}
            onPress={onLogIt}
          />
        </View>
      </ScrollView>
    </View>
  );
}
