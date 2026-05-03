import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, CtaButton } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp, AppState } from '@/context/AppContext';

type UnitsKey = keyof AppState['units'];

const GROUPS: { k: UnitsKey; label: string; opts: string[] }[] = [
  { k: 'mass',     label: 'Body weight',    opts: ['kg', 'lb', 'st'] },
  { k: 'height',   label: 'Height',         opts: ['cm', 'ft / in'] },
  { k: 'energy',   label: 'Energy',         opts: ['kcal', 'kJ'] },
  { k: 'volume',   label: 'Liquids',        opts: ['mL', 'fl oz', 'L'] },
  { k: 'firstDay', label: 'Week starts on', opts: ['Monday', 'Sunday'] },
  { k: 'lang',     label: 'Language',       opts: ['English', 'Español', 'Português', 'Italiano'] },
];

export default function Units() {
  const router = useRouter();
  const { state, set } = useApp();
  const units = state.units;

  const setUnit = (k: UnitsKey, v: string) => set('units', { ...units, [k]: v });

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Units &amp; locale</Header>

        <View style={S.pad}>
          {GROUPS.map(g => (
            <View key={g.k}>
              <Text style={[S.eyebrow, { marginTop: 24 }]}>{g.label}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {g.opts.map(o => {
                  const on = units[g.k] === o;
                  return (
                    <Pressable
                      key={o}
                      onPress={() => setUnit(g.k, o)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 999,
                        backgroundColor: on ? C.apricot : C.surface,
                        borderWidth: on ? 0 : 1,
                        borderColor: C.hair,
                      }}
                    >
                      <Text style={{ fontSize: 13, color: on ? '#fff' : C.ink, fontFamily: on ? 'DMSans_600SemiBold' : 'DMSans_500Medium' }}>{o}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
          <CtaButton label="Save" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </View>
  );
}
