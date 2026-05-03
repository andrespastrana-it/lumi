import { ReactNode } from 'react';
import { View } from 'react-native';
import { C, PILLOW_SHADOW_SM } from '@/lib/tokens';

export type ToneName = 'apricot' | 'apricotSolid' | 'green' | 'greenSolid' | 'butter' | 'sky' | 'cream';

const TONES: Record<ToneName, { bg: string; color: string }> = {
  apricot:      { bg: C.apricotWash, color: C.apricotDk },
  apricotSolid: { bg: C.apricot,     color: '#fff' },
  green:        { bg: C.greenLt,     color: C.green },
  greenSolid:   { bg: C.green,       color: '#fff' },
  butter:       { bg: C.butterLt,    color: C.apricotDk },
  sky:          { bg: C.skyLt,       color: C.green },
  cream:        { bg: C.cream,       color: C.apricotDk },
};

interface IconChipProps {
  tone?: ToneName;
  size?: number;
  children: ReactNode;
}

export function IconChip({ tone = 'apricot', size = 44, children }: IconChipProps) {
  const t = TONES[tone];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: t.bg,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: PILLOW_SHADOW_SM,
      }}
    >
      <View style={{ width: size * 0.5, height: size * 0.5 }}>{children}</View>
    </View>
  );
}

export { TONES };
