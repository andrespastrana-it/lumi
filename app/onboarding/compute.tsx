import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Mascot, Blob, Em } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const STEPS = ['Calculating TDEE', 'Setting deficit', 'Choosing meals', 'Building 26-week curve'];

export default function Compute() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < STEPS.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 750);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => router.push('/onboarding/plan-reveal'), 1000);
    return () => clearTimeout(t);
  }, [step, router]);

  return (
    <View style={[S.page, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }]}>
      <Blob color={C.apricotMd} size={280} top={-40} left={-80} opacity={0.18} />
      <Blob color={C.butterLt} size={220} bottom={80} right={-60} opacity={0.08} />

      <View style={{ alignItems: 'center' }}>
        <Mascot mood="curious" size={170} />
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
