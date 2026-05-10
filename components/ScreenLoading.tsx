import { View, Text, ActivityIndicator } from 'react-native';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

export function ScreenLoading({ label }: { label?: string }) {
  return (
    <View style={[S.page, { alignItems: 'center', justifyContent: 'center', gap: 12 }]}>
      <ActivityIndicator color={C.apricot} />
      {label ? (
        <Text style={[S.body, { fontSize: 13, color: C.dim }]}>{label}</Text>
      ) : null}
    </View>
  );
}
