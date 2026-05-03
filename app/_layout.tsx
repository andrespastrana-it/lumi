import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts as useFraunces, Fraunces_300Light_Italic, Fraunces_400Regular, Fraunces_500Medium } from '@expo-google-fonts/fraunces';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { AppProvider, useApp } from '@/context/AppContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Gate({ children }: { children: React.ReactNode }) {
  const { hydrated } = useApp();
  const [fontsLoaded] = useFraunces({
    Fraunces_300Light_Italic,
    Fraunces_400Regular,
    Fraunces_500Medium,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (hydrated && fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated, fontsLoaded]);

  if (!hydrated || !fontsLoaded) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Gate>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="log" options={{ presentation: 'modal' }} />
          </Stack>
        </Gate>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
