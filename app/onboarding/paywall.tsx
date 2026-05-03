import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Blob, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const FEATURES = [
  { l: 'Voice + photo logging',     icon: 'mic' },
  { l: 'AI coach (unlimited)',      icon: 'sparkle' },
  { l: '26-week forecast',          icon: 'trend' },
  { l: 'Recipes & shopping list',   icon: 'cart' },
  { l: 'Weekly weigh-in & adjust',  icon: 'scale' },
  { l: 'Apple Health sync',         icon: 'heart' },
];

export default function Paywall() {
  const router = useRouter();
  const dismiss = () => router.replace('/(tabs)/today');

  return (
    <View style={{ flex: 1 }}>
      {/* Legacy used radial-gradient(circle at 80% 0%, #2D2620 0%, ink 60%).
          LinearGradient with start/end approximates the dark-corner glow. */}
      <LinearGradient
        colors={['#2D2620', C.ink]}
        start={{ x: 0.8, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={{ ...S.page, backgroundColor: C.ink }}
      >
        <Blob color={C.apricot} size={300} top={-80} right={-80} opacity={0.08} />

        <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 16 }}>
          <Text style={[S.eyebrow, { color: C.apricot }]}>✦ Unlock Lumi</Text>
          <Text style={[S.h1, { color: C.paper, fontSize: 44, marginTop: 14, lineHeight: 46 }]}>
            <Text style={{ color: C.apricot, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>7 days</Text>
            {'\n'}on the house
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,246,238,.65)', lineHeight: 22, marginTop: 14, maxWidth: 280, fontFamily: 'DMSans_400Regular' }}>
            Then €8.99/month. Cancel anytime, even mid-trial.
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
          <View style={{ borderRadius: 22, padding: 18, backgroundColor: 'rgba(255,246,238,.06)', borderWidth: 1, borderColor: 'rgba(255,246,238,.08)' }}>
            {FEATURES.map((f, i) => (
              <View
                key={f.l}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingVertical: 12,
                  borderBottomWidth: i < FEATURES.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255,246,238,.08)',
                }}
              >
                <View style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: 'rgba(232,120,78,.18)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={f.icon} color={C.apricot} size={16} />
                </View>
                <Text style={{ fontSize: 14, color: C.paper, fontFamily: 'DMSans_400Regular' }}>{f.l}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 16, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Start free trial" onPress={dismiss} />
          <CtaButton label="Maybe later" variant="line" onPress={dismiss} style={{ }} />
        </View>
      </LinearGradient>
    </View>
  );
}
