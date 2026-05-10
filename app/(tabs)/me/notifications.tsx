import { ScrollView, View, Text, Switch, Alert } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { Header, ScreenLoading } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

type PrefKey = 'summary' | 'mealNudge' | 'weighIn' | 'wins' | 'plateauAlert' | 'weekly' | 'quiet';

const ITEMS: { k: PrefKey; l: string; d: string }[] = [
  { k: 'summary',      l: 'Daily summary',   d: "9:00 AM · today's plan & yesterday's recap" },
  { k: 'mealNudge',    l: 'Meal nudges',     d: '12:30 PM · 7:00 PM · soft reminders' },
  { k: 'weighIn',      l: 'Weekly weigh-in', d: 'Sun 9:00 AM' },
  { k: 'wins',         l: 'Win moments',     d: 'Streaks, milestones, plan adjustments' },
  { k: 'plateauAlert', l: 'Plateau alerts',  d: 'Off · only ping if 14+ days flat' },
  { k: 'weekly',       l: 'Weekly recap',    d: 'Sun evening · your week in numbers' },
  { k: 'quiet',        l: 'Quiet hours',     d: '22:00 — 07:00' },
];

export default function Notifications() {
  const me = useQuery(api.me.get);
  const set = useMutation(api.notifPrefs.set);

  if (me === undefined) {
    return <ScreenLoading />;
  }

  const prefs = me?.notifPrefs;

  const toggle = async (k: PrefKey, current: boolean) => {
    try {
      await set({ partial: { [k]: !current } });
    } catch (e) {
      Alert.alert('Could not update', describeConvexError(e));
    }
  };

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Notifications</Header>

        <View style={S.pad}>
          <View style={[S.pillow, { marginTop: 14 }]}>
            <Text style={{ fontSize: 13, color: C.dim, lineHeight: 19, fontFamily: 'DMSans_400Regular' }}>
              We send <Text style={{ color: C.apricotDk, fontFamily: 'DMSans_600SemiBold' }}>3 reminders/day max</Text> on default. You&apos;re in control.
            </Text>
          </View>

          <View style={[S.pillow, { padding: 0, marginTop: 14 }]}>
            {ITEMS.map((it, i) => {
              const on = !!prefs?.[it.k];
              return (
                <View
                  key={it.k}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderBottomWidth: i < ITEMS.length - 1 ? 1 : 0,
                    borderBottomColor: C.hair,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'DMSans_500Medium' }}>{it.l}</Text>
                    <Text style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 15, fontFamily: 'DMSans_400Regular' }}>{it.d}</Text>
                  </View>
                  <Switch
                    value={on}
                    onValueChange={() => toggle(it.k, on)}
                    trackColor={{ true: C.apricot, false: C.hair }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
