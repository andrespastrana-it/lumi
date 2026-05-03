import { Redirect } from 'expo-router';
import { useApp } from '@/context/AppContext';

export default function Index() {
  const { state } = useApp();
  // Onboarding considered done once a goal is picked.
  const onboarded = state.goal !== null;
  return <Redirect href={onboarded ? '/(tabs)/today' : '/onboarding/welcome'} />;
}
