import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useFonts as useFraunces, Fraunces_300Light_Italic, Fraunces_400Regular, Fraunces_500Medium } from '@expo-google-fonts/fraunces';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useConvexAuth, useMutation } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { AppProvider, useApp } from '@/context/AppContext';
import { ErrorBoundary } from '@/components';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!CLERK_KEY) {
  throw new Error('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY not set in .env');
}

SplashScreen.preventAutoHideAsync().catch(() => {});

function Gate({ children }: { children: React.ReactNode }) {
  const { hydrated } = useApp();
  const { isAuthenticated } = useConvexAuth();
  const ensureMe = useMutation(api.users.ensureMe);
  const calledRef = useRef(false);

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
    if (isAuthenticated && !calledRef.current) {
      calledRef.current = true;
      ensureMe({}).catch((e) => console.warn('ensureMe failed:', e));
    }
    if (!isAuthenticated) calledRef.current = false;
  }, [isAuthenticated, ensureMe]);

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
      <ErrorBoundary>
        <ClerkProvider publishableKey={CLERK_KEY!} tokenCache={tokenCache}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <KeyboardProvider>
              <AppProvider>
                <Gate>
                  <StatusBar style="dark" />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="auth" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="log" options={{ presentation: 'modal' }} />
                  </Stack>
                </Gate>
              </AppProvider>
            </KeyboardProvider>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
