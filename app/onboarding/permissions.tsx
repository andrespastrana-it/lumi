import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera } from 'expo-camera';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import { useMutation } from 'convex/react';
import { Header, IconChip, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { requestNotificationPermission } from '@/lib/permissions';
import { requestHealthPermission } from '@/lib/health';
import { useApp, AppState } from '@/context/AppContext';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

type PermKey = keyof AppState['permissions'];

const ITEMS: { k: PermKey; l: string; d: string; icon: string; tone: 'apricot' | 'green' | 'butter' | 'apricotSolid' }[] = [
  { k: 'notif',  l: 'Notifications', d: 'Gentle nudges. Never spam.',  icon: 'bell',   tone: 'apricot' },
  { k: 'health', l: 'Health app',    d: 'Steps + workouts auto-sync.', icon: 'heart',  tone: 'green' },
  { k: 'cam',    l: 'Camera',        d: 'Photo + barcode logging.',    icon: 'camera', tone: 'butter' },
  { k: 'mic',    l: 'Microphone',    d: 'Voice logging.',              icon: 'mic',    tone: 'apricotSolid' },
];

async function requestNative(k: PermKey): Promise<boolean> {
  if (k === 'cam')   return (await Camera.requestCameraPermissionsAsync()).granted;
  if (k === 'mic')   return (await requestRecordingPermissionsAsync()).granted;
  if (k === 'notif') return requestNotificationPermission();
  if (k === 'health') {
    // HealthKit / Health Connect via lib/health.ts. The stub returns
    // unsupported in Expo Go and on Android (no Health Connect module
    // wired yet). When unsupported we still flip the wireframe toggle
    // so the onboarding flow doesn't get stuck.
    const r = await requestHealthPermission();
    return r.granted || r.unsupported;
  }
  return true;
}

export default function Permissions() {
  const router = useRouter();
  const { state, set } = useApp();
  const setGrant = useMutation(api.permissionGrants.set);

  const onToggle = async (k: PermKey) => {
    const cur = state.permissions[k];
    if (cur) {
      // Turning off: flip local state + persist. iOS won't actually revoke,
      // but the user's intent is recorded so backend logic respects it.
      set('permissions', { ...state.permissions, [k]: false });
      setGrant({ key: k, value: false }).catch((e) =>
        Alert.alert("Couldn't save", describeConvexError(e)),
      );
      return;
    }
    const granted = await requestNative(k);
    set('permissions', { ...state.permissions, [k]: granted });
    setGrant({ key: k, value: granted }).catch((e) =>
      Alert.alert("Couldn't save", describeConvexError(e)),
    );
  };

  return (
    <View style={S.page}>
      <Header>Permissions</Header>
      <View style={[S.pad, { flex: 1 }]}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          A few quick{'\n'}<Em>asks</Em>
        </Text>

        <View style={{ marginTop: 24, gap: 10 }}>
          {ITEMS.map(item => {
            const on = state.permissions[item.k];
            const iconColor = item.tone === 'apricotSolid' ? '#fff' : C.apricotDk;
            return (
              <Pressable
                key={item.k}
                onPress={() => onToggle(item.k)}
                accessibilityRole="switch"
                accessibilityLabel={`${item.l}. ${item.d}`}
                accessibilityState={{ checked: on }}
                style={[
                  S.pillowSm,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    backgroundColor: on ? C.greenLt : C.pillow,
                  },
                ]}
              >
                <IconChip tone={item.tone} size={44}>
                  <Icon name={item.icon} color={iconColor} size={22} />
                </IconChip>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, color: C.ink, fontFamily: 'Fraunces_400Regular' }}>{item.l}</Text>
                  <Text style={{ fontSize: 12, color: C.dim, marginTop: 2, fontFamily: 'DMSans_400Regular' }}>{item.d}</Text>
                </View>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    backgroundColor: on ? C.green : 'transparent',
                    borderWidth: on ? 0 : 1.5,
                    borderColor: C.dim,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {on && <Icon name="check" color="#fff" size={16} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
        <CtaButton label="Continue" onPress={() => router.push('/onboarding/paywall')} />
      </View>
    </View>
  );
}
