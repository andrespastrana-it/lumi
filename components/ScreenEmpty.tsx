import { View, Text } from 'react-native';
import { Mascot } from './Mascot';
import type { MascotMood } from './Mascot';
import { CtaButton } from './CtaButton';
import { S } from '@/lib/styles';

type Cta = { label: string; onPress: () => void };

export function ScreenEmpty({
  mascot,
  title,
  body,
  cta,
  secondaryCta,
}: {
  mascot: MascotMood;
  title: string;
  body?: string;
  cta?: Cta;
  secondaryCta?: Cta;
}) {
  return (
    <View
      style={[
        S.page,
        { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
      ]}
    >
      <Mascot mood={mascot} size={120} />
      <Text style={[S.h2, { textAlign: 'center' }]}>{title}</Text>
      {body ? (
        <Text style={[S.body, { textAlign: 'center', maxWidth: 320 }]}>{body}</Text>
      ) : null}
      {cta ? <CtaButton label={cta.label} onPress={cta.onPress} /> : null}
      {secondaryCta ? (
        <CtaButton label={secondaryCta.label} variant="line" onPress={secondaryCta.onPress} />
      ) : null}
    </View>
  );
}
