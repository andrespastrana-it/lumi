import { StyleSheet } from 'react-native';
import { C, PILLOW_SHADOW, PILLOW_SHADOW_SM } from './tokens';

// Mirror of legacy app/components/ui.tsx `S` object, ported to RN style values.
// Used by the per-screen ports during the migration.
export const S = StyleSheet.create({
  page:     { flex: 1, backgroundColor: C.creamHi },
  pad:      { paddingHorizontal: 22 },
  eyebrow:  { fontSize: 10, fontWeight: '700', letterSpacing: 2.2, color: C.dim, textTransform: 'uppercase', fontFamily: 'DMSans_700Bold' },
  h1:       { fontFamily: 'Fraunces_400Regular', fontSize: 38, lineHeight: 40, letterSpacing: -1.2, color: C.ink },
  h2:       { fontFamily: 'Fraunces_400Regular', fontSize: 26, lineHeight: 28, letterSpacing: -0.6, color: C.ink },
  body:     { fontFamily: 'DMSans_400Regular', fontSize: 15, lineHeight: 23, color: C.muted },
  display:  { fontFamily: 'Fraunces_300Light_Italic', color: C.apricot, lineHeight: 110, letterSpacing: -3 },
  pillow:   { backgroundColor: C.pillow, borderRadius: 22, boxShadow: PILLOW_SHADOW, padding: 20 },
  pillowSm: { backgroundColor: C.pillow, borderRadius: 18, boxShadow: PILLOW_SHADOW_SM, padding: 16 },
});
