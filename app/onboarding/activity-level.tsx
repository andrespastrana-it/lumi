import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Em, CtaButton, SelectCard, CheckBadge } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

const OPTS: {
  k: string;
  l: string;
  d: string;
  tone: 'cream' | 'green' | 'greenSolid' | 'apricotSolid';
  icon: string;
  iconColor: string;
}[] = [
  { k: 'sed',     l: 'Sedentary', d: 'Mostly sitting',  tone: 'cream',        icon: 'sleep', iconColor: C.dim },
  { k: 'lite',    l: 'Light',     d: '2–3 workouts/wk', tone: 'green',        icon: 'steps', iconColor: C.green },
  { k: 'active',  l: 'Active',    d: 'Daily movement',  tone: 'greenSolid',   icon: 'steps', iconColor: '#fff' },
  { k: 'athlete', l: 'Athlete',   d: 'Training hard',   tone: 'apricotSolid', icon: 'flame', iconColor: '#fff' },
];

export default function ActivityLevel() {
  const router = useRouter();
  const { state, set } = useApp();

  return (
    <View style={S.page}>
      <Header showBack>Step 3 / 6</Header>
      <View style={[S.pad, { flex: 1 }]}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          How <Em>active</Em>{'\n'}are you?
        </Text>

        <View style={{ marginTop: 24, gap: 10 }}>
          {OPTS.map(o => {
            const on = state.activity === o.k;
            return (
              <SelectCard key={o.k} selected={on} onPress={() => set('activity', o.k)}>
                <IconChip tone={o.tone} size={44}>
                  <Icon name={o.icon} color={o.iconColor} size={22} />
                </IconChip>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: on ? C.apricot : C.ink, fontFamily: on ? 'Fraunces_500Medium' : 'Fraunces_400Regular' }}>
                    {o.l}
                  </Text>
                  <Text style={{ fontSize: 12, color: C.dim, marginTop: 2, fontFamily: 'DMSans_400Regular' }}>{o.d}</Text>
                </View>
                {on && <CheckBadge />}
              </SelectCard>
            );
          })}
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
        <CtaButton
          label="Continue"
          disabled={!state.activity}
          onPress={() => router.push('/onboarding/diet')}
        />
      </View>
    </View>
  );
}
