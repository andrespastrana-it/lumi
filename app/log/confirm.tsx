import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { Header, IconChip, FoodPlate, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

type Source = 'photo' | 'voice' | 'barcode' | 'search' | 'manual';

interface Params {
  source?: Source;
  logId?: string;
  photoUri?: string;
  barcode?: string;
  name?: string;
}

export default function LogConfirm() {
  const router = useRouter();
  const params = useLocalSearchParams() as Params;
  const draft = useQuery(
    api.logs.draftById,
    params.logId ? { id: params.logId as Id<'foodLogs'> } : 'skip',
  );
  const confirm = useMutation(api.logs.confirm);

  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [proteinG, setProteinG] = useState('');
  const [carbG, setCarbG] = useState('');
  const [fatG, setFatG] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!draft) return;
    setName(draft.name);
    setKcal(String(draft.kcal));
    setProteinG(String(draft.proteinG));
    setCarbG(String(draft.carbG));
    setFatG(String(draft.fatG));
  }, [draft]);

  const save = async () => {
    if (!params.logId || busy) return;
    try {
      setBusy(true);
      await confirm({
        id: params.logId as Id<'foodLogs'>,
        edits: {
          name,
          kcal: parseInt(kcal, 10) || 0,
          proteinG: parseFloat(proteinG) || 0,
          carbG: parseFloat(carbG) || 0,
          fatG: parseFloat(fatG) || 0,
        },
      });
      router.dismissAll();
    } catch {
      setBusy(false);
    }
  };

  if (params.logId && draft === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
        <Text style={[S.eyebrow, { marginTop: 16 }]}>Pip is recognizing…</Text>
      </View>
    );
  }

  if (params.logId && draft === null) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 }]}>
        <Text style={[S.h2, { textAlign: 'center' }]}>Draft not found</Text>
        <CtaButton label="Go back" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const eyebrow =
    params.source === 'photo' ? 'Pip recognized your photo' :
    params.source === 'voice' ? 'Pip heard' :
    params.source === 'barcode' ? `Scanned · ${params.barcode ?? ''}` :
    params.source === 'search' ? 'From search' :
    'Recognized';

  const confidence = draft?.confidence;

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Confirm</Header>

        {params.photoUri ? (
          <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
            <Image
              source={{ uri: params.photoUri }}
              style={{ width: '100%', height: 220, borderRadius: 22, backgroundColor: C.surface }}
              resizeMode="cover"
            />
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
          <View style={[S.pillow, { backgroundColor: C.greenLt, padding: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconChip tone="greenSolid" size={44}>
                <Icon name="check" color="#fff" size={22} />
              </IconChip>
              <View style={{ flex: 1 }}>
                <Text style={[S.eyebrow, { color: C.green }]}>{eyebrow}</Text>
              </View>
            </View>

            <Text style={[S.eyebrow, { marginTop: 18, color: C.green }]}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={input}
              placeholderTextColor={C.dim}
            />

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <NumField label="kcal" value={kcal} onChange={setKcal} />
              <NumField label="P" value={proteinG} onChange={setProteinG} />
              <NumField label="C" value={carbG} onChange={setCarbG} />
              <NumField label="F" value={fatG} onChange={setFatG} />
            </View>
          </View>
        </View>

        {confidence !== undefined ? (
          <View style={S.pad}>
            <Text style={[S.eyebrow, { marginTop: 24, marginBottom: 10 }]}>Confidence</Text>
            <View style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
              <FoodPlate tone="butter" icon={<Icon name="snack" color="#fff" size={24} />} size={48} />
              <Text style={{ flex: 1, fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
                Pip&apos;s confidence:{' '}
                <Text style={{ color: confidence > 0.7 ? C.green : C.apricot, fontStyle: 'normal', fontFamily: 'DMSans_600SemiBold' }}>
                  {Math.round(confidence * 100)}%
                </Text>
              </Text>
            </View>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Add to today" onPress={save} disabled={busy || !name || !kcal} />
          {params.source === 'photo' || params.source === 'voice' || params.source === 'barcode' ? (
            <CtaButton label="Retake" variant="line" onPress={() => router.replace(`/log/${params.source}` as any)} />
          ) : (
            <CtaButton label="Edit details" variant="line" onPress={() => router.replace('/log/search' as any)} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (s: string) => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,.45)', borderRadius: 12, padding: 10, alignItems: 'center' }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, color: C.green, padding: 0, minWidth: 36, textAlign: 'center' }}
      />
      <Text style={{ fontSize: 9, color: C.green, fontFamily: 'DMSans_700Bold', letterSpacing: 1.6, textTransform: 'uppercase', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

const input = {
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,.08)',
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 10,
  fontSize: 16,
  fontFamily: 'Fraunces_400Regular',
  backgroundColor: 'rgba(255,255,255,.45)',
  color: C.green,
  marginTop: 6,
} as const;
