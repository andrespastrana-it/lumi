import { ScrollView, View, Text, Switch } from 'react-native';
import { Header } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const TONES = ['Warm (default)', 'Direct', 'Cheerleader', 'Stoic'];
const NOTIFS = ['Daily summary · 09:00', 'Meal nudge · 12:30', 'Weigh-in · Sun 09:00', 'Win moments'];

export default function ProfileSettings() {
  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Settings</Header>

        <View style={S.pad}>
          <Text style={[S.eyebrow, { marginTop: 14 }]}>Coach tone</Text>
          <View style={[S.pillow, { padding: 0, marginTop: 10 }]}>
            {TONES.map((t, i) => {
              const on = t.includes('Warm');
              return (
                <View
                  key={t}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderBottomWidth: i < TONES.length - 1 ? 1 : 0,
                    borderBottomColor: C.hair,
                  }}
                >
                  <View
                    style={{
                      width: 22, height: 22, borderRadius: 999,
                      borderWidth: on ? 0 : 1.5,
                      borderColor: C.dim,
                      backgroundColor: on ? C.apricot : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {on && <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#fff' }} />}
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: on ? C.apricot : C.ink, fontFamily: on ? 'DMSans_600SemiBold' : 'DMSans_500Medium' }}>{t}</Text>
                </View>
              );
            })}
          </View>

          <Text style={[S.eyebrow, { marginTop: 28, marginBottom: 10 }]}>Notifications</Text>
          <View style={[S.pillow, { padding: 0 }]}>
            {NOTIFS.map((t, i) => (
              <View
                key={t}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  borderBottomWidth: i < NOTIFS.length - 1 ? 1 : 0,
                  borderBottomColor: C.hair,
                }}
              >
                <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'DMSans_400Regular' }}>{t}</Text>
                <Switch value={true} trackColor={{ true: C.apricot, false: C.hair }} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
