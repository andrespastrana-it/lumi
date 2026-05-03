import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { C } from '@/lib/tokens';

// Phase 1 stub: static apricot circle with face dots.
// Full Reanimated port (8 keyframes: pip-breathe, pip-bob, pip-jump, pip-wave,
// pip-blink, pip-shine-rot, pulse, scan) lands in Phase 9. See
// docs/MIGRATION-TO-EXPO.md §9 for the keyframe → Reanimated mapping.
export type MascotMood = 'idle' | 'wave' | 'happy' | 'sleepy' | 'curious' | 'cheer';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  trackCursor?: boolean;
}

export function Mascot({ size = 170 }: MascotProps) {
  const xml = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${C.apricotMd}"/>
          <stop offset="100%" stop-color="${C.apricot}"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="115" rx="70" ry="68" fill="url(#g)"/>
      <ellipse cx="100" cy="180" rx="55" ry="6" fill="${C.apricotDk}" opacity="0.15"/>
      <circle cx="82" cy="105" r="5" fill="${C.ink}"/>
      <circle cx="118" cy="105" r="5" fill="${C.ink}"/>
      <path d="M85 130 Q100 142 115 130" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>
  `;

  return (
    <View style={{ width: size, height: size }}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}
