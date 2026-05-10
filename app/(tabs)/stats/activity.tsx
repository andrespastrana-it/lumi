import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { Header, Em, CtaButton, Mascot } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';

export default function Activity() {
  const router = useRouter();
  const me = useQuery(api.me.get);

  if (me === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
      </View>
    );
  }

  const healthGranted = me?.permissionGrants?.health === true;
  const appleHealthLinked = me?.integrations?.appleHealth === true;
  const googleFitLinked = me?.integrations?.googleFit === true;
  const anyHealthLinked = appleHealthLinked || googleFitLinked;

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>Activity</Header>

        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            <Em>Workouts</Em>{'\n'}&amp; steps
          </Text>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
          <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 22 }]}>
            <Mascot mood={anyHealthLinked ? 'thinking' : 'sleepy'} size={84} />
            <View style={{ flex: 1 }}>
              {anyHealthLinked ? (
                <>
                  <Text style={[S.h2, { fontSize: 18 }]}>Syncing soon</Text>
                  <Text style={[S.body, { marginTop: 6, fontSize: 13 }]}>
                    {appleHealthLinked ? 'Apple Health' : 'Google Fit'} is connected. Workout
                    and step pull is in development — your daily totals will appear here.
                  </Text>
                </>
              ) : healthGranted ? (
                <>
                  <Text style={[S.h2, { fontSize: 18 }]}>Connect a source</Text>
                  <Text style={[S.body, { marginTop: 6, fontSize: 13 }]}>
                    Permission granted, but no health source is linked yet. Pick one below
                    to start tracking.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[S.h2, { fontSize: 18 }]}>No data yet</Text>
                  <Text style={[S.body, { marginTop: 6, fontSize: 13 }]}>
                    Activity tracking needs Apple Health or Google Fit. Enable a source to
                    see workouts and steps here.
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22 }}>
          <CtaButton
            label={anyHealthLinked ? 'Manage integrations' : 'Connect a source'}
            onPress={() => router.push('/(tabs)/me/integrations')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
