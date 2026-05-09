import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Mascot, Blob, CtaButton } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { t } from '@/lib/strings';

export default function Welcome() {
  const router = useRouter();
  return (
    <View style={[S.page, { backgroundColor: C.creamHi }]}>
      <Blob color={C.apricotMd} size={300} top={-60} right={-80} opacity={0.18} />
      <Blob color={C.butterLt} size={240} bottom={120} left={-60} opacity={0.08} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Mascot mood="wave" size={170} />
        <Text style={[S.h1, { fontSize: 56, marginTop: 20, lineHeight: 58, textAlign: 'center' }]}>
          {t.onboarding.welcomeHi}
        </Text>
        <Text
          style={{
            fontFamily: 'Fraunces_300Light_Italic',
            fontSize: 88,
            color: C.apricot,
            lineHeight: 88,
            marginTop: -6,
            textAlign: 'center',
          }}
        >
          {t.onboarding.welcomeName}
        </Text>
        <Text style={[S.body, { fontSize: 15, marginTop: 18, maxWidth: 280, textAlign: 'center' }]}>
          {t.onboarding.welcomeTagline}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingBottom: 28, gap: 4 }}>
        <CtaButton label={t.cta.letsBegin} onPress={() => router.push('/auth/sign-up' as any)} />
        <CtaButton label={t.cta.haveAccount} variant="line" onPress={() => router.push('/auth/sign-in' as any)} />
      </View>
    </View>
  );
}
