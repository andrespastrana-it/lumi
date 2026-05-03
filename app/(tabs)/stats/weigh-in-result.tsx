import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

export default function WeighInResult() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <Header showBack>Pip&apos;s take</Header>

      <View style={S.pad}>
        <Text style={[S.h1, { marginTop: 14, fontSize: 44, lineHeight: 46 }]}>
          <Em>5 days</Em>{'\n'}ahead
        </Text>
        <Text style={[S.body, { marginTop: 14 }]}>
          You lost 0.7 kg this week — 0.05 above target. Beautiful.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
        <View style={[S.pillow, { backgroundColor: C.greenLt, padding: 22 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={48}>
              <Icon name="trend" color="#fff" size={24} />
            </IconChip>
            <View>
              <Text style={[S.eyebrow, { color: C.green }]}>Adjustment</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 30, color: C.green, marginTop: 4, letterSpacing: -1 }}>
                +80 kcal/day
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: C.green,
              marginTop: 16,
              fontStyle: 'italic',
              fontFamily: 'Fraunces_300Light_Italic',
              maxWidth: 280,
              lineHeight: 19,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: 'rgba(61,90,74,.18)',
            }}
          >
            “Do not burn out the gas tank — we have 22 weeks ahead.”
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
        <CtaButton label="Apply & see forecast" onPress={() => router.replace('/(tabs)/stats')} />
        <CtaButton label="Skip — celebrate first" variant="line" onPress={() => router.replace('/(tabs)/stats/milestone')} />
      </View>
    </View>
  );
}
