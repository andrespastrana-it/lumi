import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Mascot, IconChip, Blob, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

export default function Milestone() {
  const router = useRouter();
  const dismiss = () => router.replace('/(tabs)/today');

  return (
    <View style={S.page}>
      <Blob color={C.apricotMd} size={320} top={-100} right={-80} opacity={0.18} />
      <Blob color={C.greenWash} size={240} bottom={140} left={-80} opacity={0.08} />

      <View style={{ paddingTop: 44, alignItems: 'center' }}>
        <Mascot mood="celebrate" size={170} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <Text style={S.eyebrow}>Milestone unlocked ✦</Text>
        <Text style={[S.h1, { fontSize: 56, marginTop: 12, lineHeight: 58 }]}>
          <Em>2.5 kg</Em>
        </Text>
        <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 28, color: C.ink, marginTop: -4 }}>down</Text>
        <Text style={[S.body, { marginTop: 20, maxWidth: 280, textAlign: 'center' }]}>
          The weight of 5 sticks of butter. Or one big cantaloupe. Either way — gone.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingBottom: 12 }}>
        <View style={[S.pillow, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          <IconChip tone="greenSolid" size={44}>
            <Icon name="flame" color="#fff" size={22} />
          </IconChip>
          <View style={{ flex: 1 }}>
            <Text style={[S.eyebrow, { color: C.green }]}>Streak</Text>
            <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 26, color: C.green }}>21 days</Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingBottom: 22, gap: 4 }}>
        <CtaButton label="Back to today" onPress={dismiss} />
        <CtaButton label="Share" variant="line" onPress={dismiss} />
      </View>
    </View>
  );
}
