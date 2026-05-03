import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Em, CtaButton } from '@/components';
import type { ToneName } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const GROUPS: { g: string; tone: ToneName; icon: string; items: [string, string][] }[] = [
  { g: 'Produce', tone: 'green',   icon: 'veg',       items: [['Cucumber', '× 2'], ['Red onion', '× 1'], ['Lemons', '× 4'], ['Berries', '· 250g'], ['Spinach', '· 200g']] },
  { g: 'Protein', tone: 'apricot', icon: 'lunch',     items: [['Chicken breast', '· 600g'], ['Salmon fillet', '· 400g'], ['Greek yogurt', '· 1kg']] },
  { g: 'Pantry',  tone: 'butter',  icon: 'breakfast', items: [['Quinoa', '· 500g'], ['Olive oil', '· 500ml'], ['Almonds', '· 200g']] },
];

export default function Shopping() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>This week</Header>

        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            Shopping{'\n'}<Em>list</Em>
          </Text>
          <View style={[S.pillow, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22 }]}>
            <IconChip tone="greenSolid" size={48}>
              <Icon name="cart" color="#fff" size={24} />
            </IconChip>
            <View style={{ flex: 1 }}>
              <Text style={[S.eyebrow, { color: C.green }]}>Estimated total</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 28, color: C.green, marginTop: 2 }}>~€42</Text>
            </View>
            <Text style={{ fontSize: 11, color: C.green, opacity: 0.7, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>15 items</Text>
          </View>
        </View>

        <View style={S.pad}>
          {GROUPS.map(({ g, tone, icon, items }) => (
            <View key={g} style={{ marginTop: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <IconChip tone={tone} size={28}>
                  <Icon name={icon} color={tone === 'green' ? C.green : C.apricotDk} size={14} />
                </IconChip>
                <Text style={S.eyebrow}>{g}</Text>
              </View>
              <View style={[S.pillow, { padding: 0 }]}>
                {items.map(([name, qty], i) => (
                  <View
                    key={name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      paddingHorizontal: 18,
                      paddingVertical: 14,
                      borderBottomWidth: i < items.length - 1 ? 1 : 0,
                      borderBottomColor: C.hair,
                    }}
                  >
                    <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: C.hair, backgroundColor: C.creamHi }} />
                    <Text style={{ flex: 1, color: C.ink, fontSize: 14, fontFamily: 'DMSans_400Regular' }}>{name}</Text>
                    <Text style={{ color: C.dim, fontSize: 12, fontFamily: 'DMSans_400Regular' }}>{qty}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22 }}>
          <CtaButton label="Order via Glovo" onPress={() => router.replace('/(tabs)/today')} />
        </View>
      </ScrollView>
    </View>
  );
}
