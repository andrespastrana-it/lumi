import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Em } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

const MODES: {
  to: string;
  l: string;
  d: string;
  icon: string;
  tone: 'apricotSolid' | 'greenSolid' | 'butter' | 'apricot';
}[] = [
  { to: '/log/voice',   l: 'Voice',   d: '"Two eggs and a coffee"', icon: 'mic',     tone: 'apricotSolid' },
  { to: '/log/photo',   l: 'Photo',   d: 'Snap your plate',          icon: 'camera',  tone: 'greenSolid' },
  { to: '/log/barcode', l: 'Barcode', d: 'Scan packaging',           icon: 'barcode', tone: 'butter' },
  { to: '/log/search',  l: 'Search',  d: 'Type-ahead, 250k foods',   icon: 'search',  tone: 'apricot' },
];

export default function LogChoose() {
  const router = useRouter();

  return (
    <View style={S.page}>
      <Header showBack>Log a meal</Header>
      <View style={[S.pad, { flex: 1 }]}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          How will{'\n'}you <Em>log</Em>?
        </Text>

        <View style={{ marginTop: 28, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {MODES.map(m => {
            const solid = m.tone === 'apricotSolid' || m.tone === 'greenSolid';
            return (
              <Pressable
                key={m.to}
                onPress={() => router.push(m.to as never)}
                accessibilityRole="button"
                accessibilityLabel={`${m.l}. ${m.d}`}
                style={[
                  S.pillow,
                  {
                    width: '47%',
                    padding: 18,
                    minHeight: 140,
                    alignItems: 'flex-start',
                    gap: 14,
                  },
                ]}
              >
                <IconChip tone={m.tone} size={48}>
                  <Icon name={m.icon} color={solid ? '#fff' : C.apricotDk} size={24} />
                </IconChip>
                <View>
                  <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 20, color: C.ink }}>{m.l}</Text>
                  <Text style={{ fontSize: 11, color: C.dim, marginTop: 4, lineHeight: 14, fontFamily: 'DMSans_400Regular' }}>{m.d}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
