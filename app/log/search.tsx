import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip } from '@/components';
import type { ToneName } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const FOOD_ITEMS: ReadonlyArray<readonly [string, string, ToneName, string]> = [
  ['Greek yogurt',   '100g · 59 kcal',          'apricot', 'breakfast'],
  ['Banana',         '1 medium · 105 kcal',     'butter',  'snack'],
  ['Chicken breast', '100g · 165 kcal',         'green',   'dinner'],
  ['Almonds',        '12 nuts · 84 kcal',       'cream',   'snack'],
  ['Olive oil',      '1 tbsp · 119 kcal',       'butter',  'breakfast'],
  ['Salmon',         '100g · 208 kcal',         'apricot', 'lunch'],
  ['Quinoa',         '60g cooked · 71 kcal',    'green',   'breakfast'],
  ['Espresso',       '1 shot · 3 kcal',         'cream',   'flame'],
];

export default function LogSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <View style={S.page}>
      <Header showBack>Search foods</Header>

      <View style={[S.pad, { flex: 1 }]}>
        <View style={[S.pillowSm, { marginTop: 14, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <Icon name="search" color={C.apricot} size={18} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search 250k foods…"
            placeholderTextColor={C.dim}
            style={{ flex: 1, fontSize: 16, fontFamily: 'Fraunces_300Light_Italic', fontStyle: 'italic', color: C.ink, padding: 0 }}
          />
        </View>

        <Text style={[S.eyebrow, { marginTop: 24 }]}>Recents</Text>
        <ScrollView style={[S.pillow, { padding: 0, marginTop: 10 }]}>
          {FOOD_ITEMS.map(([name, sub, tone, icon], i) => (
            <Pressable
              key={name}
              onPress={() => router.replace('/log/confirm')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderBottomWidth: i < FOOD_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: C.hair,
              }}
            >
              <IconChip tone={tone} size={36}>
                <Icon name={icon} color={C.apricotDk} size={18} />
              </IconChip>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'Fraunces_400Regular' }}>{name}</Text>
                <Text style={{ fontSize: 11, color: C.dim, marginTop: 2, fontFamily: 'DMSans_400Regular' }}>{sub}</Text>
              </View>
              <Icon name="add" color={C.dim} size={16} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
