import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAction, useMutation } from 'convex/react';
import { Header, IconChip } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

type Result = {
  name: string;
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  servingSizeG?: number;
  confidence: number;
};

export default function LogSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const draftFromSearch = useAction(api.logsActions.draftFromSearch);
  const draftSearchPick = useMutation(api.logs.draftSearchPick);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        setBusy(true);
        const out = await draftFromSearch({ q: query });
        setResults(out.results);
      } catch (e) {
        setResults([]);
        Alert.alert('Search failed', describeConvexError(e));
      } finally {
        setBusy(false);
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [query, draftFromSearch]);

  const pick = async (r: Result) => {
    if (creating) return;
    try {
      setCreating(true);
      const logId = await draftSearchPick({
        name: r.name,
        kcal: Math.round(r.kcal),
        proteinG: r.proteinG,
        carbG: r.carbG,
        fatG: r.fatG,
        servingSizeG: r.servingSizeG,
        confidence: r.confidence,
      });
      router.replace({ pathname: '/log/confirm', params: { source: 'search', logId } });
    } catch (e) {
      Alert.alert('Could not save', describeConvexError(e));
      setCreating(false);
    }
  };

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
            placeholder="Search foods…"
            placeholderTextColor={C.dim}
            style={{ flex: 1, fontSize: 16, fontFamily: 'Fraunces_300Light_Italic', fontStyle: 'italic', color: C.ink, padding: 0 }}
          />
          {busy ? <ActivityIndicator color={C.apricot} /> : null}
        </View>

        <Text style={[S.eyebrow, { marginTop: 24 }]}>
          {query.trim() ? 'Results' : 'Type to search'}
        </Text>

        {results.length === 0 && !busy && query.trim() ? (
          <Text style={{ marginTop: 24, fontSize: 13, color: C.muted, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic', textAlign: 'center' }}>
            No matches.
          </Text>
        ) : null}

        <ScrollView style={results.length > 0 ? [S.pillow, { padding: 0, marginTop: 10 }] : { marginTop: 10 }}>
          {results.map((r, i) => (
            <Pressable
              key={`${r.name}-${i}`}
              onPress={() => pick(r)}
              disabled={creating}
              accessibilityRole="button"
              accessibilityLabel={`${r.name}, ${r.kcal} kilocalories`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderBottomWidth: i < results.length - 1 ? 1 : 0,
                borderBottomColor: C.hair,
                opacity: creating ? 0.5 : 1,
              }}
            >
              <IconChip tone="apricot" size={36}>
                <Icon name="snack" color={C.apricotDk} size={18} />
              </IconChip>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'Fraunces_400Regular' }}>{r.name}</Text>
                <Text style={{ fontSize: 11, color: C.dim, marginTop: 2, fontFamily: 'DMSans_400Regular' }}>
                  {r.servingSizeG ? `${r.servingSizeG}g · ` : ''}{Math.round(r.kcal)} kcal · P {r.proteinG}/C {r.carbG}/F {r.fatG}
                </Text>
              </View>
              <Icon name="add" color={C.dim} size={16} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
