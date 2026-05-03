import { Pressable, Text, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { C, BTN_SHADOW } from '@/lib/tokens';

type Variant = 'apricot' | 'ink' | 'line';

interface CtaButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}

export function CtaButton({ label, onPress, disabled, variant = 'apricot', style }: CtaButtonProps) {
  const handle = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const palette = (() => {
    if (variant === 'apricot') return { bg: C.apricot, fg: C.paper, shadow: BTN_SHADOW as string | undefined };
    if (variant === 'ink')     return { bg: C.ink,     fg: C.paper, shadow: '0 4px 12px -4px rgba(31,27,23,.25)' };
    return { bg: 'transparent', fg: C.muted, shadow: undefined };
  })();

  return (
    <Pressable
      onPress={handle}
      disabled={disabled}
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: variant === 'line' ? 14 : 17,
        paddingHorizontal: 24,
        borderRadius: 999,
        backgroundColor: palette.bg,
        boxShadow: palette.shadow,
        opacity: disabled ? 0.35 : 1,
        ...style,
      }}
    >
      <Text
        style={{
          color: palette.fg,
          fontSize: variant === 'line' ? 13 : 14,
          fontWeight: variant === 'line' ? '500' : '600',
          fontFamily: variant === 'line' ? 'DMSans_500Medium' : 'DMSans_600SemiBold',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
