import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C } from '@/lib/tokens';

export function FAB() {
  const router = useRouter();

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/log/choose');
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Log a meal"
      style={{
        position: 'absolute',
        right: 22,
        bottom: 92,
        height: 56,
        paddingLeft: 18,
        paddingRight: 22,
        backgroundColor: C.apricot,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 14px 28px -10px rgba(232,120,78,.6), 0 4px 0 rgba(122,69,32,.18)',
      }}
    >
      <Text style={{ fontSize: 22, color: C.paper, lineHeight: 22 }}>+</Text>
      <Text style={{ color: C.paper, fontSize: 14, fontWeight: '700', fontFamily: 'DMSans_700Bold', letterSpacing: 0.3 }}>
        Log meal
      </Text>
    </Pressable>
  );
}
