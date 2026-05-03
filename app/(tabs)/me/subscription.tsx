import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';
import type { SubscriptionTier } from '@/context/AppContext';

const PLANS: { k: SubscriptionTier; l: string; p: string; s: string; best?: boolean }[] = [
  { k: 'annual',   l: 'Annual',   p: '€59.99/yr', s: '€5/mo billed yearly · save 50%', best: true },
  { k: 'monthly',  l: 'Monthly',  p: '€9.99/mo',  s: 'Cancel anytime' },
  { k: 'lifetime', l: 'Lifetime', p: '€199 once', s: 'Pay once. Yours forever.' },
];

export default function Subscription() {
  const router = useRouter();
  const { state, set } = useApp();
  const plan = state.subscription;

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Subscription</Header>

        <View style={S.pad}>
          <View style={[S.pillow, { backgroundColor: C.apricot, marginTop: 14 }]}>
            <Text style={[S.eyebrow, { color: 'rgba(255,255,255,.75)' }]}>Current plan</Text>
            <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 28, color: '#fff', marginTop: 4, letterSpacing: -0.4 }}>Trial</Text>
            <Text style={{ fontSize: 13, color: '#fff', marginTop: 6, opacity: 0.9, fontFamily: 'DMSans_400Regular' }}>
              5 days left · then €59.99/year
            </Text>
            <View style={{ marginTop: 14, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,.18)', borderRadius: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="sparkle" color="#fff" size={12} />
              <Text style={{ fontSize: 11, color: '#fff', fontFamily: 'DMSans_500Medium' }}>All features unlocked</Text>
            </View>
          </View>

          <Text style={[S.eyebrow, { marginTop: 28 }]}>Choose your plan</Text>
          <View style={{ marginTop: 10, gap: 10 }}>
            {PLANS.map(o => {
              const on = plan === o.k;
              return (
                <Pressable
                  key={o.k}
                  onPress={() => set('subscription', o.k)}
                  accessibilityRole="radio"
                  accessibilityLabel={`${o.l}, ${o.p}. ${o.s}`}
                  accessibilityState={{ selected: on }}
                  style={[
                    S.pillow,
                    {
                      padding: 16,
                      backgroundColor: on ? C.apricotWash : C.surface,
                      borderWidth: on ? 1.5 : 1,
                      borderColor: on ? C.apricot : C.hair,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                    },
                  ]}
                >
                  {o.best && (
                    <View style={{ position: 'absolute', top: -8, right: 14, backgroundColor: C.green, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                      <Text style={{ fontSize: 9, color: '#fff', fontFamily: 'DMSans_700Bold', letterSpacing: 1.2 }}>BEST VALUE</Text>
                    </View>
                  )}
                  <View
                    style={{
                      width: 22, height: 22, borderRadius: 999,
                      borderWidth: on ? 0 : 1.5, borderColor: C.dim,
                      backgroundColor: on ? C.apricot : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {on && <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#fff' }} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Fraunces_500Medium', fontSize: 19, color: on ? C.apricotDk : C.ink }}>{o.l}</Text>
                    <Text style={{ fontSize: 12, color: C.dim, marginTop: 2, fontFamily: 'DMSans_400Regular' }}>{o.s}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Fraunces_500Medium', fontSize: 17, color: C.ink }}>{o.p}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ marginTop: 18, gap: 8 }}>
            <CtaButton label="Upgrade now" onPress={() => router.back()} />
            <Pressable accessibilityRole="button" accessibilityLabel="Restore previous purchase" style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: C.dim, fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Restore purchase</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Cancel subscription" style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: '#B43E2A', fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Cancel subscription</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
