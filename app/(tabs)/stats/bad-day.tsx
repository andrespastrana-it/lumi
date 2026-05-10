import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { Header, IconChip, Mascot, Em, CtaButton, ScreenLoading, ScreenEmpty } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';

const RECOVER_DAYS = 5;

function yesterdayLocalDate(): string {
  const d = new Date(Date.now() - 86400_000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BadDay() {
  const router = useRouter();
  const dismiss = () => router.replace('/(tabs)/today');
  const me = useQuery(api.me.get);
  const yesterday = useQuery(api.logs.byDate, { date: yesterdayLocalDate() });

  if (me === undefined || yesterday === undefined) {
    return <ScreenLoading />;
  }

  const target = me?.activePlan?.dailyKcal ?? 0;
  const eaten = yesterday.reduce((sum, l) => sum + (l.kcal ?? 0), 0);
  const over = target > 0 ? Math.max(0, eaten - target) : 0;
  const onPlan = over === 0 && target > 0;

  if (target === 0) {
    return (
      <ScreenEmpty
        mascot="thinking"
        title="No plan yet"
        body="Finish onboarding so Pip can compare yesterday to a target."
        cta={{ label: 'Finish onboarding', onPress: () => router.replace('/onboarding/welcome') }}
      />
    );
  }

  if (onPlan) {
    return (
      <View style={S.page}>
        <Header showBack>Yesterday</Header>
        <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
          <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
            <Mascot mood="proud" size={80} />
            <Text style={[S.h1, { fontSize: 28, lineHeight: 30 }]}>
              You stayed{'\n'}<Em>on plan</Em>
            </Text>
          </View>
        </View>
        <View style={S.pad}>
          <Text style={[S.body, { marginTop: 18 }]}>
            Yesterday: {Math.round(eaten).toLocaleString()} of {target.toLocaleString()} kcal. Nothing to recover. Pip&apos;s proud of you.
          </Text>
        </View>
        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22 }}>
          <CtaButton label="Back to today" onPress={dismiss} />
        </View>
      </View>
    );
  }

  const perDay = Math.ceil(over / RECOVER_DAYS);

  return (
    <View style={S.page}>
      <Header showBack>Yesterday</Header>

      <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
        <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          <Mascot mood="oops" size={80} />
          <Text style={[S.h1, { fontSize: 28, lineHeight: 30 }]}>
            Tomorrow{'\n'}we <Em>adjust</Em>
          </Text>
        </View>
      </View>

      <View style={S.pad}>
        <Text style={[S.body, { marginTop: 18 }]}>
          One bad day does not undo a week of good ones. Pip will spread it out — gently.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
        <View style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          <IconChip tone="apricotSolid" size={40}>
            <Icon name="flame" color="#fff" size={20} />
          </IconChip>
          <View style={{ flex: 1 }}>
            <Text style={S.eyebrow}>Yesterday</Text>
            <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 22, color: C.apricot, marginTop: 2 }}>
              + {Math.round(over).toLocaleString()} kcal over
            </Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 12 }}>
        <View style={[S.pillow, { backgroundColor: C.greenLt, padding: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <IconChip tone="greenSolid" size={44}>
              <Icon name="sparkle" color="#fff" size={22} />
            </IconChip>
            <View>
              <Text style={[S.eyebrow, { color: C.green }]}>Pip&apos;s plan</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 22, color: C.green, marginTop: 2, letterSpacing: -0.4 }}>
                −{perDay.toLocaleString()} kcal/day × {RECOVER_DAYS} days
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: C.green,
              marginTop: 16,
              fontStyle: 'italic',
              fontFamily: 'Fraunces_300Light_Italic',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: 'rgba(61,90,74,.18)',
            }}
          >
            No drama. No skipping meals. Forecast unchanged.
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22 }}>
        <CtaButton label="Resume the plan" onPress={dismiss} />
      </View>
    </View>
  );
}
