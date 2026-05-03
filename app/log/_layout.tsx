import { Stack } from 'expo-router';
import { C } from '@/lib/tokens';

export default function LogLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'formSheet',
        sheetGrabberVisible: true,
        sheetAllowedDetents: [0.95],
        contentStyle: { backgroundColor: C.creamHi },
      }}
    />
  );
}
