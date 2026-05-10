import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { Header, Mascot, Em, CtaButton, ScreenLoading } from '@/components';
import type { MascotMood } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

type Tone = 'Warm' | 'Direct' | 'Cheerleader' | 'Stoic';

const TONES: { l: Tone; d: string; m: MascotMood }[] = [
  { l: 'Warm',        d: 'Like a thoughtful friend. Default.',   m: 'happy' },
  { l: 'Direct',      d: 'No fluff. Says it straight.',          m: 'thinking' },
  { l: 'Cheerleader', d: 'Hype every win, no matter how small.', m: 'cheering' },
  { l: 'Stoic',       d: 'Calm, sparing, philosophical.',        m: 'curious' },
];

export default function CoachTone() {
  const router = useRouter();
  const me = useQuery(api.me.get);
  const patch = useMutation(api.profile.patch);
  const [pick, setPick] = useState<Tone | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (pick === null && me?.profile?.coachTone) {
      setPick(me.profile.coachTone as Tone);
    }
  }, [me, pick]);

  if (me === undefined || pick === null) {
    return <ScreenLoading />;
  }

  const onSave = async () => {
    if (busy) return;
    try {
      setBusy(true);
      await patch({ partial: { coachTone: pick } });
      router.back();
    } catch (e) {
      setBusy(false);
      Alert.alert('Could not save', describeConvexError(e));
    }
  };

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Coach tone</Header>

        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 14 }]}>
            How should{'\n'}<Em>Pip</Em> talk to you?
          </Text>
          <Text style={{ fontSize: 14, color: C.dim, marginTop: 10, lineHeight: 21, fontFamily: 'DMSans_400Regular' }}>
            You can change this anytime. Pip will quietly adapt across all messages.
          </Text>

          <View style={{ marginTop: 22, gap: 10 }}>
            {TONES.map(t => {
              const on = pick === t.l;
              return (
                <Pressable
                  key={t.l}
                  onPress={() => setPick(t.l)}
                  accessibilityRole="radio"
                  accessibilityLabel={`${t.l}. ${t.d}`}
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
                  <View style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: on ? '#fff' : C.pillow, alignItems: 'center', justifyContent: 'center' }}>
                    <Mascot mood={t.m} size={44} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Fraunces_500Medium', fontSize: 19, color: on ? C.apricotDk : C.ink }}>{t.l}</Text>
                    <Text style={{ fontSize: 12, color: C.dim, marginTop: 3, lineHeight: 17, fontFamily: 'DMSans_400Regular' }}>{t.d}</Text>
                  </View>
                  {on && (
                    <View style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: C.apricot, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" color="#fff" size={14} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
          <CtaButton label={busy ? 'Saving…' : 'Save'} disabled={busy} onPress={onSave} />
        </View>
      </ScrollView>
    </View>
  );
}
