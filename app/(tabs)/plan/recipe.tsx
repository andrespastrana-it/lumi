import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C, PILLOW_SHADOW_SM } from '@/lib/tokens';

const INGREDIENTS = [
  '180g chicken breast',
  '60g quinoa',
  '½ cucumber',
  '¼ red onion',
  '1 tbsp olive oil',
  'Lemon, salt, pepper',
];
const STEPS = [
  'Cook quinoa per package.',
  'Season chicken, sear 4 min/side.',
  'Slice veg, dress with oil + lemon.',
  'Plate quinoa, top with chicken & veg.',
];

function Hero() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#F4B690', C.apricot, '#B85530']}
      start={{ x: 0.6, y: 0.5 }}
      end={{ x: 0.0, y: 1 }}
      style={{ height: 280, alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Outer plate (cream radial) */}
      <Svg width={200} height={200} style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id="outer" cx="0.35" cy="0.35" r="0.65">
            <Stop offset="0" stopColor="#FFF5E0" />
            <Stop offset="0.5" stopColor="#F2E0BB" />
            <Stop offset="0.9" stopColor="#C5A268" />
          </RadialGradient>
        </Defs>
        <Circle cx={100} cy={100} r={100} fill="url(#outer)" />
      </Svg>
      {/* Inner plate (green radial) */}
      <View style={{ width: 110, height: 110, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={110} height={110} style={{ position: 'absolute' }}>
          <Defs>
            <RadialGradient id="inner" cx="0.35" cy="0.35" r="0.65">
              <Stop offset="0" stopColor="#E2EBE5" />
              <Stop offset="0.6" stopColor="#7FA088" />
              <Stop offset="1" stopColor="#3D5A4A" />
            </RadialGradient>
          </Defs>
          <Circle cx={55} cy={55} r={55} fill="url(#inner)" />
        </Svg>
        <Icon name="dinner" color="#fff" size={44} />
      </View>

      <View style={{ position: 'absolute', top: 18, left: 22 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.25)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Fraunces_400Regular' }}>‹</Text>
        </Pressable>
      </View>
      <View style={{ position: 'absolute', top: 18, right: 22 }}>
        <Pressable
          style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.25)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="heart" color="#fff" size={18} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const STATS = [
  { icon: 'sleep',   label: '12 min',   tone: C.apricotLt },
  { icon: 'flame',   label: '520 kcal', tone: C.butterLt },
  { icon: 'sparkle', label: 'P 38',     tone: C.greenLt },
];

export default function Recipe() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Hero />

        <View style={{ paddingHorizontal: 22, marginTop: -32 }}>
          <View style={[S.pillow, { padding: 22 }]}>
            <Text style={[S.h1, { fontSize: 32, lineHeight: 34 }]}>
              Chicken &amp;{'\n'}<Em>quinoa</Em> bowl
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              {STATS.map(item => (
                <View
                  key={item.label}
                  style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 10, borderRadius: 14, backgroundColor: item.tone, alignItems: 'center' }}
                >
                  <Icon name={item.icon} color={C.apricotDk} size={18} />
                  <Text style={{ fontSize: 11, fontFamily: 'Fraunces_400Regular', color: C.ink, marginTop: 4 }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[S.pad, { marginTop: 24 }]}>
          <Text style={S.eyebrow}>Ingredients</Text>
          <View style={[S.pillow, { padding: 0, marginTop: 10 }]}>
            {INGREDIENTS.map((x, i) => (
              <View
                key={x}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderBottomWidth: i < INGREDIENTS.length - 1 ? 1 : 0,
                  borderBottomColor: C.hair,
                }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: C.apricot }} />
                <Text style={{ fontSize: 14, color: C.ink, fontFamily: 'DMSans_400Regular' }}>{x}</Text>
              </View>
            ))}
          </View>

          <Text style={[S.eyebrow, { marginTop: 24 }]}>Method</Text>
          <View style={{ marginTop: 10, gap: 10 }}>
            {STEPS.map((step, i) => (
              <View key={i} style={[S.pillowSm, { flexDirection: 'row', gap: 14, alignItems: 'flex-start' }]}>
                <View
                  style={{
                    width: 32, height: 32, borderRadius: 999, backgroundColor: C.apricot,
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: PILLOW_SHADOW_SM,
                  }}
                >
                  <Text style={{ fontFamily: 'Fraunces_500Medium', fontSize: 15, color: '#fff' }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: C.ink, lineHeight: 21, paddingTop: 6, fontFamily: 'DMSans_400Regular' }}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 28, paddingBottom: 22, gap: 4 }}>
          <CtaButton label="Add to shopping list" onPress={() => router.push('/(tabs)/plan/shopping')} />
          <CtaButton label="I made this — log it" variant="line" onPress={() => router.push('/log/choose')} />
        </View>
      </ScrollView>
    </View>
  );
}
