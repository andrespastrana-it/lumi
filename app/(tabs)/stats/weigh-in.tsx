import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, Blob, Em, CtaButton } from '@/components';
import { S } from '@/lib/styles';
import { C, PILLOW_SHADOW_SM } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

const MIN = 35;
const MAX = 250;

export default function WeighIn() {
  const router = useRouter();
  const { set } = useApp();
  const [w, setW] = useState(82.4);
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    const n = parseFloat(draft.replace(',', '.'));
    if (!isNaN(n)) {
      const clamped = Math.min(MAX, Math.max(MIN, n));
      setW(Math.round(clamped * 10) / 10);
    }
    setDraft(null);
  };

  const submit = () => {
    set('lastWeight', w);
    set('weighInDue', false);
    router.replace('/(tabs)/stats/weigh-in-result');
  };

  const editing = draft !== null;

  return (
    <View style={S.page}>
      <Header showBack>Sunday weigh-in · Week 4</Header>

      <View style={S.pad}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          What does the{'\n'}<Em>scale</Em> say?
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingVertical: 32, alignItems: 'center' }}>
        <Blob color={C.apricotMd} size={260} top={-20} opacity={0.08} />

        {editing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={commit}
            onSubmitEditing={commit}
            keyboardType="decimal-pad"
            autoFocus
            selectTextOnFocus
            returnKeyType="done"
            style={[S.display, { fontSize: 140, lineHeight: 130, textAlign: 'center', minWidth: 280, padding: 0 }]}
          />
        ) : (
          <Pressable onPress={() => setDraft(w.toFixed(1))} accessibilityRole="adjustable" accessibilityLabel={`Weight, ${w.toFixed(1)} kilograms. Double tap to edit.`}>
            <Text style={[S.display, { fontSize: 140, lineHeight: 130 }]}>{w.toFixed(1)}</Text>
          </Pressable>
        )}

        <Text style={[S.eyebrow, { marginTop: 8 }]}>kilograms · tap to type</Text>

        <View style={{ flexDirection: 'row', gap: 14, marginTop: 36 }}>
          <Pressable
            onPress={() => setW(v => Math.max(MIN, Math.round((v - 0.1) * 10) / 10))}
            accessibilityRole="button"
            accessibilityLabel="Decrease weight"
            style={{ width: 60, height: 60, borderRadius: 999, backgroundColor: C.pillow, alignItems: 'center', justifyContent: 'center', boxShadow: PILLOW_SHADOW_SM }}
          >
            <Text style={{ fontSize: 26, color: C.ink, fontFamily: 'DMSans_400Regular' }}>−</Text>
          </Pressable>
          <Pressable
            onPress={() => setW(v => Math.min(MAX, Math.round((v + 0.1) * 10) / 10))}
            accessibilityRole="button"
            accessibilityLabel="Increase weight"
            style={{ width: 60, height: 60, borderRadius: 999, backgroundColor: C.apricot, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'DMSans_400Regular' }}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
        <CtaButton label="Confirm" onPress={submit} disabled={editing} />
      </View>
    </View>
  );
}
