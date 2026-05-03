import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Mascot, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

export default function BadDay() {
  const router = useRouter();
  const dismiss = () => router.replace('/(tabs)/today');

  return (
    <View style={S.page}>
      <Header showBack>Yesterday</Header>

      <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
        <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          <Mascot mood="oops" size={80} />
          <Text style={[S.h1, { fontSize: 28, lineHeight: 30 }]}>
            Tomorrow{'\n'}we <Em>adjust</Em>
          </Text>
        </View>
      </View>

      <View style={S.pad}>
        <Text style={[S.body, { marginTop: 18 }]}>
          One bad day does not undo a week of good ones. Pip will spread it out — gently.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
        <View style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          <IconChip tone="apricotSolid" size={40}>
            <Icon name="flame" color="#fff" size={20} />
          </IconChip>
          <View style={{ flex: 1 }}>
            <Text style={S.eyebrow}>Yesterday</Text>
            <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 22, color: C.apricot, marginTop: 2 }}>
              + 520 kcal over
            </Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 12 }}>
        <View style={[S.pillow, { backgroundColor: C.greenLt, padding: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={44}>
              <Icon name="sparkle" color="#fff" size={22} />
            </IconChip>
            <View>
              <Text style={[S.eyebrow, { color: C.green }]}>Pip&apos;s plan</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 22, color: C.green, marginTop: 2, letterSpacing: -0.4 }}>
                −104 kcal/day × 5 days
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
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: 'rgba(61,90,74,.18)',
            }}
          >
            No drama. No skipping meals. Forecast unchanged.
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22 }}>
        <CtaButton label="Resume the plan" onPress={dismiss} />
      </View>
    </View>
  );
}
