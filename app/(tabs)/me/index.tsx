import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip } from '@/components';
import type { ToneName } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

export default function Profile() {
  const router = useRouter();
  const { state, restart } = useApp();

  const subLabel =
    state.subscription === 'annual'  ? 'Annual · €59.99/yr' :
    state.subscription === 'monthly' ? 'Monthly · €9.99/mo' :
                                       'Lifetime · €199';
  const intCount = Object.values(state.integrations).filter(Boolean).length;
  const notifCount = Object.values(state.notifPrefs).filter(Boolean).length;

  const items: { l: string; v: string; to: string | null; icon: string; tone: ToneName | 'apricotSolid'; signOut?: boolean }[] = [
    { l: 'Activity log',   v: 'This week · 4 workouts',          to: '/(tabs)/stats/activity',       icon: 'workout', tone: 'green' },
    { l: 'Notifications',  v: `${notifCount} active reminders`,  to: '/(tabs)/me/notifications',     icon: 'bell',    tone: 'butter' },
    { l: 'Coach tone',     v: state.coachTone,                   to: '/(tabs)/me/coach-tone',        icon: 'coach',   tone: 'apricot' },
    { l: 'Units & locale', v: `${state.units.mass} · ${state.units.height} · ${state.units.energy}`, to: '/(tabs)/me/units', icon: 'scale', tone: 'green' },
    { l: 'Integrations',   v: `${intCount} connected`,           to: '/(tabs)/me/integrations',      icon: 'heart',   tone: 'butter' },
    { l: 'Privacy',        v: state.privacy.share ? 'Sharing on' : 'Standard', to: '/(tabs)/me/privacy', icon: 'veg',  tone: 'green' },
    { l: 'Subscription',   v: subLabel,                          to: '/(tabs)/me/subscription',      icon: 'sparkle', tone: 'apricotSolid' },
    { l: 'Meet Pip',       v: 'Coach moods',                     to: '/(tabs)/stats/mascot-gallery', icon: 'coach',   tone: 'apricot' },
    { l: 'Help & FAQ',     v: 'Get in touch',                    to: '/(tabs)/me/help',              icon: 'sparkle', tone: 'cream' },
    { l: 'Sign out',       v: '',                                to: null,                            icon: 'add',     tone: 'cream', signOut: true },
  ];

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 110 }}>
        <Header>Me</Header>

        <View style={{ paddingHorizontal: 22, paddingTop: 4 }}>
          <Pressable
            onPress={() => router.push('/(tabs)/me/edit')}
            accessibilityRole="button"
            accessibilityLabel="Marco. Down 2.6 kilograms, 21-day streak. Tap to edit profile."
            style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 16 }]}
          >
            <View style={{ width: 64, height: 64, borderRadius: 999, backgroundColor: C.apricot, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 28, color: C.paper }}>M</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 28, color: C.ink }}>Marco</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: C.green }} />
                <Text style={{ fontSize: 12, color: C.green, fontFamily: 'DMSans_500Medium' }}>−2.6 kg · 21-day streak</Text>
              </View>
            </View>
            <Icon name="add" color={C.dim} size={14} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
          <View style={[S.pillow, { padding: 0 }]}>
            {items.map((it, i) => {
              const solid = it.tone === 'apricotSolid';
              const greenSolid = it.tone === 'greenSolid';
              const onPress = it.signOut
                ? () => { restart(); }
                : () => router.push(it.to as never);
              return (
                <Pressable
                  key={it.l}
                  onPress={onPress}
                  accessibilityRole="button"
                  accessibilityLabel={it.v ? `${it.l}, ${it.v}` : it.l}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderBottomWidth: i < items.length - 1 ? 1 : 0,
                    borderBottomColor: C.hair,
                  }}
                >
                  <IconChip tone={it.tone as ToneName} size={36}>
                    <Icon
                      name={it.icon}
                      color={solid || greenSolid ? '#fff' : it.tone === 'green' ? C.green : C.apricotDk}
                      size={18}
                    />
                  </IconChip>
                  <Text style={{ flex: 1, fontSize: 14, color: C.ink, fontFamily: 'DMSans_500Medium' }}>{it.l}</Text>
                  <Text style={{ fontSize: 12, color: C.dim, fontFamily: 'DMSans_400Regular' }}>{it.v}</Text>
                  <Icon name="add" color={C.dim} size={14} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
