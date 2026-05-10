import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { convex } from '@/lib/convex';
import { Icon } from '@/lib/icons';
import { C } from '@/lib/tokens';

export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const translateY = useSharedValue(-80);

  useEffect(() => {
    const apply = (state: { isWebSocketConnected: boolean; hasEverConnected: boolean }) => {
      if (!state.hasEverConnected) {
        setVisible(false);
        return;
      }
      setVisible(!state.isWebSocketConnected);
    };
    apply(convex.connectionState());
    return convex.subscribeToConnectionState(apply);
  }, []);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : -80, { duration: 220 });
  }, [translateY, visible]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: insets.top,
          left: 12,
          right: 12,
          zIndex: 1000,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: C.ink,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 999,
        }}
      >
        <Icon name="sparkle" color={C.paper} size={14} />
        <Text
          style={{
            color: C.paper,
            fontSize: 12,
            fontFamily: 'DMSans_600SemiBold',
            flex: 1,
          }}
        >
          Offline — changes will sync when you&apos;re back
        </Text>
      </View>
    </Animated.View>
  );
}
