import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { C } from '@/lib/tokens';

interface ScreenStubProps {
  label: string;
  next?: { to: string; label: string };
}

// Phase 2 placeholder for every legacy screen. Lets navigation be exercised
// before any real screen body is ported. Each route has its own file so the
// per-screen port in Phases 4–8 only swaps the import.
export function ScreenStub({ label, next }: ScreenStubProps) {
  const router = useRouter();
  const nav = useNavigation();
  const canGoBack = nav.canGoBack();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: C.creamHi }}
      contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 16, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 32, color: C.ink }}>{label}</Text>
      <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 13, color: C.dim, textAlign: 'center' }}>
        Stub screen — port the body in the matching phase.
      </Text>

      {next && (
        <Pressable
          onPress={() => router.push(next.to as never)}
          style={{ marginTop: 12, backgroundColor: C.apricot, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 999 }}
        >
          <Text style={{ color: C.paper, fontFamily: 'DMSans_700Bold', fontSize: 14 }}>{next.label}</Text>
        </Pressable>
      )}

      {canGoBack && (
        <Pressable onPress={() => router.back()} style={{ marginTop: 4 }}>
          <Text style={{ color: C.dim, fontFamily: 'DMSans_500Medium', fontSize: 13 }}>← back</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
