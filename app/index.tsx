import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const me = useQuery(api.me.get, isSignedIn ? {} : 'skip');

  if (!isLoaded) return <View />;
  if (!isSignedIn) return <Redirect href="/onboarding/welcome" />;
  if (me === undefined) return <View />;
  if (!me?.profile) return <Redirect href="/onboarding/goal" />;
  return <Redirect href="/(tabs)/today" />;
}
