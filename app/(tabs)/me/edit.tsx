import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

export default function ProfileEdit() {
  const router = useRouter();
  const { state } = useApp();

  const About: [string, string][] = [
    ['Name',          'Marco'],
    ['Email',         'marco@kavrentech.com'],
    ['Date of birth', '12 May 1991'],
    ['Sex',           'Male'],
    ['Height',        `${state.height} cm`],
  ];
  const Goal: [string, string][] = [
    ['Current weight', `${state.weight} kg`],
    ['Target weight',  `${state.target} kg`],
    ['Pace',           '0.5 kg / week'],
    ['Target date',    'Sep 14, 2026'],
  ];

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

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Edit profile</Header>

        <View style={S.pad}>
          <View style={{ alignItems: 'center', marginTop: 18, gap: 12 }}>
            <View style={{ width: 96, height: 96, borderRadius: 999, backgroundColor: C.apricot, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 44, color: C.paper }}>M</Text>
              <View style={{ position: 'absolute', bottom: -2, right: -2, width: 32, height: 32, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="camera" color={C.apricot} size={16} />
              </View>
            </View>
            <Text style={{ fontSize: 12, color: C.apricot, fontFamily: 'DMSans_600SemiBold', letterSpacing: 0.6 }}>Change photo</Text>
          </View>

          <Text style={[S.eyebrow, { marginTop: 28 }]}>About you</Text>
          <FieldList rows={About} />

          <Text style={[S.eyebrow, { marginTop: 28 }]}>Goal</Text>
          <FieldList rows={Goal} accent />
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
          <CtaButton label="Save changes" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </View>
  );
}
