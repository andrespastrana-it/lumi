import { ScrollView, View, Text, Switch, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { Header, IconChip } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

type PrivacyState = { analytics: boolean; share: boolean; research: boolean };
type PrivKey = keyof PrivacyState;

const ROWS: { k: PrivKey; l: string; d: string }[] = [
  { k: 'analytics', l: 'Anonymous analytics',              d: 'Helps us improve Pip' },
  { k: 'share',     l: 'Share progress with friends',      d: 'Off · only you can see your data' },
  { k: 'research',  l: 'Contribute to nutrition research', d: 'De-identified, opt-out anytime' },
];

const DEFAULT_PRIVACY: PrivacyState = { analytics: true, share: false, research: false };

export default function Privacy() {
  const me = useQuery(api.me.get);
  const patch = useMutation(api.profile.patch);

  if (me === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
      </View>
    );
  }

  const current: PrivacyState = me?.profile?.privacy ?? DEFAULT_PRIVACY;

  const toggle = async (k: PrivKey) => {
    const next: PrivacyState = { ...current, [k]: !current[k] };
    try {
      await patch({ partial: { privacy: next } });
    } catch (e) {
      Alert.alert('Could not update', describeConvexError(e));
    }
  };

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Privacy</Header>

        <View style={S.pad}>
          <View style={[S.pillow, { backgroundColor: C.greenLt, marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
            <IconChip tone="greenSolid" size={44}>
              <Icon name="veg" color="#fff" size={22} />
            </IconChip>
            <View style={{ flex: 1 }}>
              <Text style={[S.eyebrow, { color: C.green }]}>Your data</Text>
              <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 18, color: C.green, marginTop: 2, letterSpacing: -0.3 }}>
                Encrypted &amp; yours.
              </Text>
            </View>
          </View>

          <Text style={[S.eyebrow, { marginTop: 28 }]}>What you share</Text>
          <View style={[S.pillow, { padding: 0, marginTop: 10 }]}>
            {ROWS.map((r, i) => (
              <View
                key={r.k}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  borderBottomWidth: i < ROWS.length - 1 ? 1 : 0,
                  borderBottomColor: C.hair,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'DMSans_500Medium' }}>{r.l}</Text>
                  <Text style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 15, fontFamily: 'DMSans_400Regular' }}>{r.d}</Text>
                </View>
                <Switch value={current[r.k]} onValueChange={() => toggle(r.k)} trackColor={{ true: C.apricot, false: C.hair }} />
              </View>
            ))}
          </View>

          <Text style={[S.eyebrow, { marginTop: 28 }]}>Your data, your control</Text>
          <View style={{ marginTop: 10, gap: 8 }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Export my data as CSV" style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: C.ink, fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Export my data (.csv)</Text>
            </Pressable>
            <Pressable accessibilityRole="link" accessibilityLabel="Open privacy policy" style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: C.ink, fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Privacy policy</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Delete my account" style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: '#B43E2A', fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Delete my account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
