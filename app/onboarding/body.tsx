import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header, IconChip, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { useApp, AppState } from '@/context/AppContext';

type NumKey = 'weight' | 'height' | 'age' | 'target';

const FIELDS: {
  k: NumKey;
  label: string;
  suffix: string;
  min: number;
  max: number;
  step: number;
  tone: 'apricot' | 'green' | 'butter' | 'apricotSolid';
  icon: string;
  iconColor: string;
}[] = [
  { k: 'weight', label: 'Current weight', suffix: 'kg',  min: 35,  max: 250, step: 0.5, tone: 'apricot',      icon: 'scale',   iconColor: C.apricotDk },
  { k: 'height', label: 'Height',         suffix: 'cm',  min: 120, max: 220, step: 1,   tone: 'green',        icon: 'trend',   iconColor: C.green },
  { k: 'age',    label: 'Age',            suffix: 'yrs', min: 13,  max: 99,  step: 1,   tone: 'butter',       icon: 'sparkle', iconColor: C.apricotDk },
  { k: 'target', label: 'Target weight',  suffix: 'kg',  min: 35,  max: 250, step: 0.5, tone: 'apricotSolid', icon: 'target',  iconColor: '#fff' },
];

const fmt = (v: number) => (Number.isInteger(v) ? v.toString() : v.toFixed(1));

function StepButton({ label, a11yLabel, onPress, disabled }: { label: string; a11yLabel: string; onPress: () => void; disabled: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ disabled }}
      hitSlop={8}
      style={{
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: disabled ? C.surface : C.cream,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{ fontSize: 18, color: disabled ? C.dim : C.apricotDk, fontFamily: 'DMSans_500Medium' }}>{label}</Text>
    </Pressable>
  );
}

export default function Body() {
  const router = useRouter();
  const { state, set } = useApp();

  const bump = (k: NumKey, delta: number, min: number, max: number) => {
    const next = Math.min(max, Math.max(min, (state[k] as number) + delta));
    set(k as keyof AppState, Math.round(next * 2) / 2);
  };

  return (
    <View style={S.page}>
      <Header showBack>Step 2 / 6</Header>
      <View style={[S.pad, { flex: 1 }]}>
        <Text style={[S.h1, { marginTop: 14 }]}>
          Tell me{'\n'}about <Em>you</Em>
        </Text>

        <View style={{ marginTop: 24, gap: 10 }}>
          {FIELDS.map(f => {
            const v = state[f.k] as number;
            return (
              <View key={f.k} style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                <IconChip tone={f.tone} size={40}>
                  <Icon name={f.icon} color={f.iconColor} size={20} />
                </IconChip>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11.5, color: C.muted, letterSpacing: 0.5, fontFamily: 'DMSans_400Regular' }}>{f.label}</Text>
                  <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 24, color: C.ink, marginTop: 2 }}>
                    {fmt(v)}{' '}
                    <Text style={{ fontSize: 12, color: C.dim, fontFamily: 'DMSans_400Regular' }}>{f.suffix}</Text>
                  </Text>
                </View>
                <StepButton label="−" a11yLabel={`Decrease ${f.label}`} onPress={() => bump(f.k, -f.step, f.min, f.max)} disabled={v <= f.min} />
                <StepButton label="+" a11yLabel={`Increase ${f.label}`} onPress={() => bump(f.k,  f.step, f.min, f.max)} disabled={v >= f.max} />
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}>
        <CtaButton label="Continue" onPress={() => router.push('/onboarding/activity-level')} />
      </View>
    </View>
  );
}
