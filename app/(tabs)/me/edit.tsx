import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { Header, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';

const WEEKLY_RATE_KG = 0.5;

function FieldList({ rows, accent }: { rows: [string, string][]; accent?: boolean }) {
  return (
    <View style={[S.pillow, { padding: 0, marginTop: 10 }]}>
      {rows.map(([k, v], i) => (
        <View
          key={k}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 18,
            paddingVertical: 14,
            borderBottomWidth: i < rows.length - 1 ? 1 : 0,
            borderBottomColor: C.hair,
          }}
        >
          <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'DMSans_400Regular' }}>{k}</Text>
          <Text style={{ fontSize: 13, color: accent ? C.apricot : C.dim, fontFamily: accent ? 'Fraunces_500Medium' : 'Fraunces_400Regular' }}>{v}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileEdit() {
  const router = useRouter();
  const { user } = useUser();
  const me = useQuery(api.me.get);

  if (me === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
      </View>
    );
  }

  const profile = me?.profile;
  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'You';
  const initial = firstName.charAt(0).toUpperCase();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '—';
  const sex = profile?.sex ? profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1) : '—';
  const heightCm = profile?.heightCm ? `${profile.heightCm} cm` : '—';
  const age = profile?.age ? `${profile.age} years` : '—';
  const startKg = profile?.startWeightKg ?? 0;
  const targetKg = profile?.targetWeightKg ?? 0;
  const delta = Math.abs(startKg - targetKg);
  const weeks = delta < 0.1 ? 0 : Math.ceil(delta / WEEKLY_RATE_KG);
  const targetDate = weeks > 0
    ? new Date(Date.now() + weeks * 7 * 86400 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  const About: [string, string][] = [
    ['Name',   firstName],
    ['Email',  email],
    ['Sex',    sex],
    ['Age',    age],
    ['Height', heightCm],
  ];
  const Goal: [string, string][] = [
    ['Current weight', startKg ? `${startKg} kg` : '—'],
    ['Target weight',  targetKg ? `${targetKg} kg` : '—'],
    ['Pace',           `${WEEKLY_RATE_KG} kg / week`],
    ['Target date',    targetDate],
  ];

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Edit profile</Header>

        <View style={S.pad}>
          <View style={{ alignItems: 'center', marginTop: 18, gap: 12 }}>
            <View style={{ width: 96, height: 96, borderRadius: 999, backgroundColor: C.apricot, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 44, color: C.paper }}>{initial}</Text>
              <View style={{ position: 'absolute', bottom: -2, right: -2, width: 32, height: 32, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="camera" color={C.apricot} size={16} />
              </View>
            </View>
            <Text style={{ fontSize: 12, color: C.dim, fontFamily: 'DMSans_500Medium', letterSpacing: 0.6 }}>Photo upload coming soon</Text>
          </View>

          <Text style={[S.eyebrow, { marginTop: 28 }]}>About you</Text>
          <FieldList rows={About} />

          <Text style={[S.eyebrow, { marginTop: 28 }]}>Goal</Text>
          <FieldList rows={Goal} accent />
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
          <CtaButton label="Done" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </View>
  );
}
