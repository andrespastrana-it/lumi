import { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAction, useConvexAuth } from 'convex/react';
import { useAuth } from '@clerk/expo';
import { Mascot, Blob, Em } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';
import { getDeviceTimezone } from '@/lib/locale';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

const STEPS = ['Calculating TDEE', 'Setting deficit', 'Choosing meals', 'Building 26-week curve'];

const GOAL_MAP: Record<string, 'lose' | 'maintain' | 'gain'> = {
  'Lose weight': 'lose',
  'Maintain': 'maintain',
  'Build muscle': 'gain',
  'Eat better': 'maintain',
};

const ACTIVITY_MAP: Record<string, 'sed' | 'light' | 'mod' | 'active'> = {
  sed: 'sed',
  lite: 'light',
  active: 'mod',
  athlete: 'active',
};

export default function Compute() {
  const router = useRouter();
  const { state } = useApp();
  const commit = useAction(api.profileSetup.commit);
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { getToken } = useAuth();
  const [step, setStep] = useState(0);
  const [actionDone, setActionDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);

  // Step animation.
  useEffect(() => {
    if (step < STEPS.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), 750);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setAnimDone(true), 1000);
    return () => clearTimeout(t);
  }, [step]);

  // Backend commit (runs in parallel w/ animation).
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      Alert.alert('Not signed in', 'Please sign in again to continue.', [
        { text: 'OK', onPress: () => router.replace('/auth/sign-in' as any) },
      ]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        // DEBUG: log the JWT being sent so we can decode it on jwt.io.
        try {
          const tok = await getToken({ template: 'convex' });
          if (__DEV__) console.log('[JWT convex template]:', tok?.slice(0, 80) + '...');
        } catch (e) {
          if (__DEV__) console.warn('[JWT fetch failed]:', e);
        }

        const goal = GOAL_MAP[state.goal ?? ''] ?? 'lose';
        const activity = ACTIVITY_MAP[state.activity ?? ''] ?? 'mod';
        await commit({
          draft: {
            goal,
            weightKg: state.weight,
            targetKg: state.target,
            heightCm: state.height,
            age: state.age,
            sex: state.sex,
            activity,
            diet: state.diet,
            mealTimes: state.mealTimes,
            tz: getDeviceTimezone(),
          },
        });
        if (!cancelled) setActionDone(true);
      } catch (e) {
        if (cancelled) return;
        Alert.alert('Plan generation failed', describeConvexError(e), [
          { text: 'Back', onPress: () => router.back() },
        ]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [commit, state, router, authLoading, isAuthenticated, getToken]);

  // Navigate when both done.
  useEffect(() => {
    if (actionDone && animDone) {
      router.replace('/onboarding/plan-reveal');
    }
  }, [actionDone, animDone, router]);

  return (
    <View style={[S.page, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }]}>
      <Blob color={C.apricotMd} size={280} top={-40} left={-80} opacity={0.18} />
      <Blob color={C.butterLt} size={220} bottom={80} right={-60} opacity={0.08} />

      <View style={{ alignItems: 'center' }}>
        <Mascot mood="thinking" size={170} />
        <Text style={[S.h2, { fontSize: 30, marginTop: 14 }]}>
          Pip is <Em>thinking</Em>
        </Text>

        <View style={[S.pillow, { width: 280, padding: 0, marginTop: 28, overflow: 'hidden' }]}>
          {STEPS.map((s, i) => {
            const passed = i < step;
            const active = i === step;
            return (
              <View
                key={s}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  borderBottomWidth: i < STEPS.length - 1 ? 1 : 0,
                  borderBottomColor: C.hair,
                  opacity: i <= step ? 1 : 0.35,
                }}
              >
                <Text style={{ fontSize: 13, color: i <= step ? C.ink : C.dim, fontFamily: 'DMSans_400Regular' }}>{s}</Text>
                <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
                  {passed ? (
                    <View style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" color="#fff" size={12} />
                    </View>
                  ) : active ? (
                    <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: C.apricot }} />
                  ) : (
                    <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: C.hair }} />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
