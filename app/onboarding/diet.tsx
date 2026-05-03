import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C, BTN_SHADOW, PILLOW_SHADOW_SM } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

const TAGS = ['Mediterranean', 'Omnivore', 'Vegetarian', 'High protein', 'No dairy', 'No gluten', 'Loves coffee', 'Loves pasta'];

export default function Diet() {
  const router = useRouter();
  const { state, set } = useApp();

  const toggle = (t: string) => {
    const cur = state.diet || [];
    set('diet', cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
  };

  return (
    <View style={S.page}>
      <Header showBack>Step 4 / 6</Header>
      <View style={[S.pad, { flex: 1 }]}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          What do you{'\n'}<Em>love</Em>?
        </Text>
        <Text style={[S.body, { marginTop: 10 }]}>Pick all that apply.</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
          {TAGS.map(t => {
            const on = state.diet.includes(t);
            return (
              <Pressable
                key={t}
                onPress={() => toggle(t)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 999,
                  backgroundColor: on ? C.apricot : C.pillow,
                  boxShadow: on ? BTN_SHADOW : PILLOW_SHADOW_SM,
                }}
              >
                {on && <Icon name="check" color="#fff" size={12} />}
                <Text style={{ color: on ? C.paper : C.ink, fontSize: 13, fontFamily: 'DMSans_500Medium' }}>{t}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 40, paddingBottom: 22 }}>
        <CtaButton label="Continue" onPress={() => router.push('/onboarding/schedule')} />
      </View>
    </View>
  );
}
