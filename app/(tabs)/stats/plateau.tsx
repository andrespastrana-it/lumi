import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Mascot, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const TIPS: { x: string; icon: string; tone: 'apricotSolid' | 'green' | 'butter' }[] = [
  { x: '+ 20g protein/day',          icon: 'lunch',     tone: 'apricotSolid' },
  { x: '+ 1 extra walk (30 min)',     icon: 'steps',     tone: 'green' },
  { x: '− 100 kcal carbs at dinner',  icon: 'breakfast', tone: 'butter' },
];

export default function Plateau() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <Header showBack>Plateau</Header>

      <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
        <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
          <Mascot mood="curious" size={80} />
          <Text style={[S.h1, { fontSize: 28, lineHeight: 30 }]}>
            3 weeks{'\n'}<Em>stuck</Em>?
          </Text>
        </View>
      </View>

      <View style={S.pad}>
        <Text style={[S.body, { marginTop: 18 }]}>
          Plateaus mean your body is recalibrating, not failing. Here&apos;s what works:
        </Text>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 18 }}>
        <View style={[S.pillow, { backgroundColor: C.apricotLt, padding: 20 }]}>
          <Text style={[S.eyebrow, { color: C.apricotDk }]}>Try this week</Text>
          <View style={{ marginTop: 14, gap: 8 }}>
            {TIPS.map(({ x, icon, tone }) => (
              <View
                key={x}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: 'rgba(255,255,255,.45)',
                  borderRadius: 12,
                }}
              >
                <IconChip tone={tone} size={32}>
                  <Icon
                    name={icon}
                    color={tone === 'apricotSolid' ? '#fff' : tone === 'green' ? C.green : C.apricotDk}
                    size={16}
                  />
                </IconChip>
                <Text style={{ flex: 1, color: C.apricotDk, fontSize: 14, fontFamily: 'Fraunces_400Regular' }}>{x}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
        <CtaButton label="Apply for one week" onPress={() => router.replace('/(tabs)/stats')} />
        <CtaButton label="Talk to Pip instead" variant="line" onPress={() => router.replace('/(tabs)/coach')} />
      </View>
    </View>
  );
}
