import { ReactNode } from 'react';
import { Pressable, View, Text } from 'react-native';
import { C } from '@/lib/tokens';

interface RowProps {
  label: string;
  value?: ReactNode;
  onPress?: () => void;
  selected?: boolean;
  dense?: boolean;
  icon?: ReactNode;
  sub?: string;
}

export function Row({ label, value, onPress, selected, dense, icon, sub }: RowProps) {
  const Container: any = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: dense ? 10 : 16,
        borderBottomWidth: 1,
        borderBottomColor: C.hair,
      }}
    >
      {icon && <View>{icon}</View>}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: selected ? '600' : '500', color: selected ? C.apricot : C.ink, fontFamily: selected ? 'DMSans_600SemiBold' : 'DMSans_500Medium' }}>
          {label}
        </Text>
        {sub && <Text style={{ fontSize: 11.5, color: C.dim, marginTop: 2, fontFamily: 'DMSans_400Regular' }}>{sub}</Text>}
      </View>
      {value !== undefined && (
        <Text style={{ fontSize: 13, color: selected ? C.apricot : C.dim, fontFamily: 'DMSans_400Regular' }}>{value}</Text>
      )}
    </Container>
  );
}
