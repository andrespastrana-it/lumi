import { View, Text } from 'react-native';
import { Mascot } from './Mascot';
import { CtaButton } from './CtaButton';
import { S } from '@/lib/styles';
import { describeConvexError } from '@/lib/clientError';

export function ScreenError({
  title = 'Something went wrong',
  error,
  onRetry,
}: {
  title?: string;
  error: unknown;
  onRetry?: () => void;
}) {
  const message = describeConvexError(error);
  return (
    <View
      style={[
        S.page,
        { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
      ]}
    >
      <Mascot mood="oops" size={120} />
      <Text style={[S.h2, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[S.body, { textAlign: 'center', maxWidth: 320 }]}>{message}</Text>
      {onRetry ? <CtaButton label="Try again" onPress={onRetry} /> : null}
    </View>
  );
}
