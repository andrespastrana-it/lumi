import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { C, PILLOW_SHADOW } from '@/lib/tokens';

interface SelectCardProps {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
}

export function SelectCard({ selected, onPress, children }: SelectCardProps) {
  return (
    <Pressable
      onPress={onPress}
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
