import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { Header, CtaButton, ScreenLoading } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

type UnitsState = {
  mass: string;
  height: string;
  energy: string;
  volume: string;
  firstDay: string;
  lang: string;
};
type UnitsKey = keyof UnitsState;

const GROUPS: { k: UnitsKey; label: string; opts: string[] }[] = [
  { k: 'mass',     label: 'Body weight',    opts: ['kg', 'lb', 'st'] },
  { k: 'height',   label: 'Height',         opts: ['cm', 'ft / in'] },
  { k: 'energy',   label: 'Energy',         opts: ['kcal', 'kJ'] },
  { k: 'volume',   label: 'Liquids',        opts: ['mL', 'fl oz', 'L'] },
  { k: 'firstDay', label: 'Week starts on', opts: ['Monday', 'Sunday'] },
  { k: 'lang',     label: 'Language',       opts: ['English', 'Español', 'Português', 'Italiano'] },
];

const DEFAULT_UNITS: UnitsState = {
  mass: 'kg', height: 'cm', energy: 'kcal', volume: 'L', firstDay: 'Monday', lang: 'English',
};

export default function Units() {
  const router = useRouter();
  const me = useQuery(api.me.get);
  const patch = useMutation(api.profile.patch);
  const [units, setUnits] = useState<UnitsState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (units === null && me?.profile?.units) {
      setUnits({ ...DEFAULT_UNITS, ...me.profile.units });
    }
  }, [me, units]);

  if (me === undefined || units === null) {
    return <ScreenLoading />;
  }

  const setUnit = (k: UnitsKey, v: string) => setUnits({ ...units, [k]: v });

  const onSave = async () => {
    if (busy) return;
    try {
      setBusy(true);
      await patch({ partial: { units } });
      router.back();
    } catch (e) {
      setBusy(false);
      Alert.alert('Could not save', describeConvexError(e));
    }
  };

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
                      accessibilityRole="radio"
                      accessibilityLabel={`${g.label}: ${o}`}
                      accessibilityState={{ selected: on }}
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
          <CtaButton label={busy ? 'Saving…' : 'Save'} disabled={busy} onPress={onSave} />
        </View>
      </ScrollView>
    </View>
  );
}
