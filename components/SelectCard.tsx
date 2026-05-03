import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { C, PILLOW_SHADOW } from '@/lib/tokens';

interface SelectCardProps {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  /** Screen-reader label. Mirror the visible option name. */
  label?: string;
}

export function SelectCard({ selected, onPress, children, label }: SelectCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        backgroundColor: selected ? C.pillow : 'rgba(255,251,241,.5)',
        borderRadius: 18,
        boxShadow: selected ? PILLOW_SHADOW : undefined,
        borderWidth: 1.5,
        borderColor: selected ? C.apricot : 'transparent',
      }}
    >
      {children}
    </Pressable>
  );
}
