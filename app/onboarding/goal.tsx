import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Em, CtaButton, SelectCard, CheckBadge } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp } from '@/context/AppContext';

const OPTS: { label: string; chip: { tone: Parameters<typeof IconChip>[0]['tone']; icon: string; color: string } }[] = [
  { label: 'Lose weight',  chip: { tone: 'apricotSolid', icon: 'target',  color: '#fff' } },
  { label: 'Build muscle', chip: { tone: 'greenSolid',   icon: 'sparkle', color: '#fff' } },
  { label: 'Maintain',     chip: { tone: 'butter',       icon: 'heart',   color: C.apricotDk } },
  { label: 'Eat better',   chip: { tone: 'green',        icon: 'veg',     color: C.green } },
];

export default function Goal() {
  const router = useRouter();
  const { state, set } = useApp();

  return (
    <View style={S.page}>
      <Header showBack>Step 1 / 6</Header>
      <View style={[S.pad, { flex: 1 }]}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          What do you{'\n'}want to <Em>change</Em>?
        </Text>
        <Text style={[S.body, { marginTop: 10 }]}>Pick one. You can shift later.</Text>

        <View style={{ marginTop: 24, gap: 12 }}>
          {OPTS.map(o => {
            const on = state.goal === o.label;
            return (
              <SelectCard key={o.label} selected={on} label={o.label} onPress={() => set('goal', o.label)}>
                <IconChip tone={o.chip.tone}>
                  <Icon name={o.chip.icon} color={o.chip.color} size={22} />
                </IconChip>
                <Text style={{ flex: 1, fontSize: 16, fontFamily: on ? 'Fraunces_500Medium' : 'Fraunces_400Regular', color: C.ink }}>
                  {o.label}
                </Text>
                {on && <CheckBadge />}
              </SelectCard>
            );
          })}
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
        <CtaButton
          label="Continue"
          disabled={!state.goal}
          onPress={() => router.push('/onboarding/body')}
        />
      </View>
    </View>
  );
}
