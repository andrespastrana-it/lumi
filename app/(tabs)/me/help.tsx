import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Mascot, Header } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const FAQS: [string, string][] = [
  ["How does Pip's plan adjust?", 'Every weekly weigh-in, Pip recalculates your calorie & macro target based on actual loss vs. predicted.'],
  ['Can I eat out?',               'Yes. Snap a photo or describe verbally — Pip estimates calories within ±10%.'],
  ['What if I plateau?',           'After 14 flat days Pip suggests a refeed, deload, or adjustment.'],
  ['Is my data private?',          'End-to-end encrypted. Never sold. You can export or delete anytime.'],
  ['Does it work without Apple Health?', 'Yes — but syncing improves accuracy. Manual logging is fine.'],
];

export default function Help() {
  const router = useRouter();
  const [open, setOpen] = useState(0);

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Help &amp; FAQ</Header>

        <View style={S.pad}>
          <Pressable
            onPress={() => router.push('/(tabs)/coach')}
            accessibilityRole="button"
            accessibilityLabel="Need a hand? Ask Pip directly."
            style={[S.pillow, { backgroundColor: C.apricotWash, marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }]}
          >
            <Mascot mood="wave" size={56} />
            <View style={{ flex: 1 }}>
              <Text style={[S.eyebrow, { color: C.apricotDk }]}>Need a hand?</Text>
              <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 19, color: C.apricotDk, marginTop: 2, letterSpacing: -0.3 }}>
                Ask Pip directly
              </Text>
            </View>
            <Icon name="add" color={C.apricotDk} size={14} />
          </Pressable>

          <Text style={[S.eyebrow, { marginTop: 28 }]}>Frequently asked</Text>
          <View style={[S.pillow, { padding: 0, marginTop: 10 }]}>
            {FAQS.map(([q, a], i) => {
              const on = open === i;
              return (
                <Pressable
                  key={q}
                  onPress={() => setOpen(on ? -1 : i)}
                  accessibilityRole="button"
                  accessibilityLabel={q}
                  accessibilityState={{ expanded: on }}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 16,
                    borderBottomWidth: i < FAQS.length - 1 ? 1 : 0,
                    borderBottomColor: C.hair,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                    <Text style={{ flex: 1, fontSize: 14, color: C.ink, fontFamily: 'DMSans_500Medium' }}>{q}</Text>
                    <Icon name="add" color={C.dim} size={16} />
                  </View>
                  {on && (
                    <Text style={{ fontSize: 13, color: C.dim, marginTop: 8, lineHeight: 20, fontFamily: 'DMSans_400Regular' }}>
                      {a}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={[S.eyebrow, { marginTop: 28 }]}>Contact us</Text>
          <View style={{ marginTop: 10, gap: 8 }}>
            <Pressable accessibilityRole="link" accessibilityLabel="Email support at lumi.app" style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: C.ink, fontSize: 13, fontFamily: 'DMSans_500Medium' }}>support@lumi.app</Text>
            </Pressable>
            <Pressable accessibilityRole="link" accessibilityLabel="Rate Lumi on the App Store" style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: C.ink, fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Rate Lumi on the App Store</Text>
            </Pressable>
          </View>

          <Text style={{ textAlign: 'center', marginTop: 28, fontSize: 11, color: C.dim, letterSpacing: 0.6, fontFamily: 'DMSans_400Regular' }}>
            Lumi · v{Constants.expoConfig?.version ?? '0.0.0'}
            {(() => {
              const ios = (Constants.expoConfig?.ios as { buildNumber?: string } | undefined)?.buildNumber;
              const android = (Constants.expoConfig?.android as { versionCode?: number } | undefined)?.versionCode;
              const build = ios ?? (android !== undefined ? String(android) : null);
              return build ? ` · Build ${build}` : '';
            })()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
