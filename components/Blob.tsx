import { View } from 'react-native';

interface BlobProps {
  color: string;
  size?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  opacity?: number;
}

// Note: legacy used radial-gradient + blur(8px). RN has no radial-gradient
// primitive. A solid color with low opacity + a translucent inner ring gets
// close to the wireframe's soft-glow effect without pulling in expo-blur for
// every screen. Tune opacity if the visual diff feels off in Phase 5.
export function Blob({ color, size = 240, top, left, right, bottom, opacity = 0.55 }: BlobProps) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        top,
        left,
        right,
        bottom,
      }}
    />
  );
}
