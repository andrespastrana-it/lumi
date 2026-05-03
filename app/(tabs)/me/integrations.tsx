import { ScrollView, View, Text, Pressable } from 'react-native';
import { Header, IconChip } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

const INT_ITEMS: {
  k: string; l: string; d: string; icon: string;
  tone: 'apricotSolid' | 'green' | 'apricot' | 'butter' | 'greenSolid' | 'cream';
}[] = [
  { k: 'apple',    l: 'Apple Health',    d: 'Steps · workouts · sleep · weight', icon: 'heart', tone: 'apricotSolid' },
  { k: 'google',   l: 'Google Fit',      d: 'Activity & body metrics',           icon: 'heart', tone: 'green' },
  { k: 'strava',   l: 'Strava',          d: 'Auto-import runs & rides',          icon: 'flame', tone: 'apricot' },
  { k: 'fitbit',   l: 'Fitbit',          d: 'Wearable + scale',                  icon: 'heart', tone: 'butter' },
  { k: 'withings', l: 'Withings scale',  d: 'Auto-log weigh-ins',                icon: 'scale', tone: 'greenSolid' },
  { k: 'glovo',    l: 'Glovo',           d: 'Order recipe ingredients',          icon: 'cart',  tone: 'cream' },
];

export default function Integrations() {
  const { state, set } = useApp();
  const conn = state.integrations;
  const count = Object.values(conn).filter(Boolean).length;

  const toggle = (k: string) => set('integrations', { ...conn, [k]: !conn[k] });

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Integrations</Header>

        <View style={S.pad}>
          <View style={[S.pillowSm, { marginTop: 14 }]}>
            <Text style={{ fontSize: 13, color: C.dim, lineHeight: 19, fontFamily: 'DMSans_400Regular' }}>
              <Text style={{ color: C.green, fontFamily: 'DMSans_600SemiBold' }}>{count} connected.</Text>{' '}
              Lumi reads what you allow. Disconnect anytime.
            </Text>
          </View>

          <View style={[S.pillow, { padding: 0, marginTop: 14 }]}>
            {INT_ITEMS.map((it, i) => {
              const on = conn[it.k];
              const solid = it.tone === 'apricotSolid' || it.tone === 'greenSolid';
              return (
                <View
                  key={it.k}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderBottomWidth: i < INT_ITEMS.length - 1 ? 1 : 0,
                    borderBottomColor: C.hair,
                  }}
                >
                  <IconChip tone={it.tone} size={36}>
                    <Icon name={it.icon} color={solid ? '#fff' : it.tone === 'green' ? C.green : C.apricotDk} size={18} />
                  </IconChip>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'DMSans_500Medium' }}>{it.l}</Text>
                    <Text style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 15, fontFamily: 'DMSans_400Regular' }}>{it.d}</Text>
                  </View>
                  <Pressable
                    onPress={() => toggle(it.k)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 999,
                      backgroundColor: on ? C.greenLt : C.surface,
                      borderWidth: on ? 0 : 1,
                      borderColor: C.hair,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: on ? C.green : C.dim, fontFamily: 'DMSans_600SemiBold' }}>
                      {on ? '✓ Connected' : 'Connect'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
