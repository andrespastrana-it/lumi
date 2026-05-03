import { ScrollView, View, Text } from 'react-native';
import { Header, Mascot, Em } from '@/components';
import type { MascotMood } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const MOODS: { m: MascotMood; l: string; d: string }[] = [
  { m: 'happy',     l: 'Happy',     d: 'Default greeting' },
  { m: 'celebrate', l: 'Celebrate', d: 'Milestones, streak wins' },
  { m: 'proud',     l: 'Proud',     d: 'Plan reveal, recap' },
  { m: 'thinking',  l: 'Thinking',  d: 'AI computing' },
  { m: 'cheering',  l: 'Cheering',  d: 'You hit your goal' },
  { m: 'curious',   l: 'Curious',   d: 'Plateau, open question' },
  { m: 'oops',      l: 'Oops',      d: 'Bad day, recovery' },
  { m: 'sad',       l: 'Sad',       d: 'Missed weigh-in' },
  { m: 'sleepy',    l: 'Sleepy',    d: 'Late night nudge' },
  { m: 'love',      l: 'Love',      d: 'Share with friends' },
  { m: 'typing',    l: 'Typing',    d: 'Coach replying' },
  { m: 'wave',      l: 'Wave',      d: 'Hello / goodbye' },
];

export default function MascotGallery() {
  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 60 }}>
        <Header showBack>Pip · your coach</Header>

        <View style={{ paddingHorizontal: 22, paddingTop: 4 }}>
          <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
            <Mascot mood="wave" size={100} />
            <View style={{ flex: 1 }}>
              <Text style={[S.h1, { fontSize: 30, lineHeight: 32 }]}>
                Hi, I&apos;m <Em>Pip</Em>
              </Text>
              <Text style={[S.body, { marginTop: 6, fontSize: 13 }]}>A little peach with a big plan.</Text>
            </View>
          </View>
        </View>

        <View style={S.pad}>
          <Text style={[S.eyebrow, { marginTop: 22, marginBottom: 10 }]}>Twelve moods</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {MOODS.map(o => (
              <View key={o.m} style={[S.pillowSm, { width: '48%', padding: 14, alignItems: 'center' }]}>
                <View style={{ height: 110, justifyContent: 'flex-end' }}>
                  <Mascot mood={o.m} size={84} />
                </View>
                <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 15, color: C.ink, marginTop: 8 }}>{o.l}</Text>
                <Text style={{ fontSize: 10.5, color: C.dim, marginTop: 2, lineHeight: 14, textAlign: 'center', fontFamily: 'DMSans_400Regular' }}>
                  {o.d}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
