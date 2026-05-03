import { View } from 'react-native';
import { Icon } from '@/lib/icons';
import { C } from '@/lib/tokens';

export function CheckBadge() {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: C.apricot, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="check" color="#fff" size={14} />
    </View>
  );
}
