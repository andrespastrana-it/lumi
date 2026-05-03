import { ReactNode } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { C } from '@/lib/tokens';

interface HeaderProps {
  children?: ReactNode;
  showBack?: boolean;
  mode?: 'cream' | 'dark';
}

export function Header({ children, showBack, mode = 'cream' }: HeaderProps) {
  const router = useRouter();
  const nav = useNavigation();
  const fg = mode === 'dark' ? 'rgba(255,246,238,.6)' : C.dim;
  const canBack = showBack && nav.canGoBack();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 6 }}>
      {canBack && (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={{ backgroundColor: 'rgba(0,0,0,.04)', width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
        >
          <SymbolView name="chevron.left" size={18} tintColor={fg} />
        </Pressable>
      )}
      <Text style={{ flex: 1, fontSize: 11, fontWeight: '600', color: fg, textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'DMSans_600SemiBold' }}>
        {children}
      </Text>
    </View>
  );
}
