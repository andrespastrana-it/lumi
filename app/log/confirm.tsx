import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, FoodPlate, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const STATS: [string, string][] = [
  ['~180', 'kcal'],
  ['13',   'P'],
  ['1',    'C'],
  ['13',   'F'],
];

export default function LogConfirm() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Confirm</Header>

        <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
          <View style={[S.pillow, { backgroundColor: C.greenLt, padding: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconChip tone="greenSolid" size={44}>
                <Icon name="check" color="#fff" size={22} />
              </IconChip>
              <View>
                <Text style={[S.eyebrow, { color: C.green }]}>Pip recognized</Text>
                <Text style={[S.h2, { color: C.green, marginTop: 4, fontSize: 22, lineHeight: 24 }]}>
                  Two eggs + espresso
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
              {STATS.map(([v, l]) => (
                <View
                  key={l}
                  style={{ flex: 1, backgroundColor: 'rgba(255,255,255,.45)', borderRadius: 12, padding: 10, alignItems: 'center' }}
                >
                  <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, color: C.green }}>{v}</Text>
                  <Text style={{ fontSize: 9, color: C.green, fontFamily: 'DMSans_700Bold', letterSpacing: 1.6, textTransform: 'uppercase', marginTop: 2 }}>
                    {l}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={S.pad}>
          <Text style={[S.eyebrow, { marginTop: 24, marginBottom: 10 }]}>Looks right?</Text>
          <View style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
            <FoodPlate tone="butter" icon={<Icon name="snack" color="#fff" size={24} />} size={48} />
            <Text style={{ flex: 1, fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
              Pip&apos;s confidence:{' '}
              <Text style={{ color: C.green, fontStyle: 'normal', fontFamily: 'DMSans_600SemiBold' }}>92%</Text>
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Add to today" onPress={() => router.dismissAll()} />
          <CtaButton label="Edit details" variant="line" onPress={() => router.replace('/log/search')} />
        </View>
      </ScrollView>
    </View>
  );
}
