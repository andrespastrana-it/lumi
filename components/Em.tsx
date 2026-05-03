import { ReactNode } from 'react';
import { Text } from 'react-native';
import { C } from '@/lib/tokens';

// Inline emphasized text — italic apricot. Renders as a child <Text>, so it
// nests inside an outer headline <Text>.
export function Em({ children }: { children: ReactNode }) {
  return (
    <Text style={{ color: C.apricot, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
      {children}
    </Text>
  );
}
