import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAction } from 'convex/react';
import { CtaButton } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { openAppSettings } from '@/lib/permissions';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

function ScanBar() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, [t]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: t.value * 120 }],
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', top: 16, left: 0, right: 0, height: 2, backgroundColor: C.apricot },
        style,
      ]}
    />
  );
}

export default function LogBarcode() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const scannedRef = useRef(false);
  const draftFromBarcode = useAction(api.logsActions.draftFromBarcode);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#0f0f0f' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ color: C.paper, fontFamily: 'Fraunces_400Regular', fontSize: 22, textAlign: 'center', marginBottom: 12 }}>
          Camera permission needed
        </Text>
        <Text style={{ color: 'rgba(255,246,238,.6)', fontSize: 14, textAlign: 'center', marginBottom: 24, fontFamily: 'DMSans_400Regular' }}>
          Lumi uses the camera to scan packaging barcodes.
        </Text>
        <CtaButton
          label={permission.canAskAgain ? 'Allow camera' : 'Open settings'}
          onPress={() => (permission.canAskAgain ? requestPermission() : openAppSettings())}
        />
        <Pressable onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ color: 'rgba(255,246,238,.6)', fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  const onScan = async (r: BarcodeScanningResult) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    try {
      setBusy(true);
      const { logId } = await draftFromBarcode({ ean: r.data });
      router.replace({ pathname: '/log/confirm', params: { source: 'barcode', logId, barcode: r.data } });
    } catch (e: any) {
      Alert.alert('Lookup failed', describeConvexError(e));
      scannedRef.current = false;
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'] }}
        onBarcodeScanned={onScan}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} />

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 30 }}>
        <View
          style={{
            height: 160,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,.4)',
            overflow: 'hidden',
          }}
        >
          <ScanBar />
        </View>
      </View>

      <View style={{ position: 'absolute', top: 30, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={[S.eyebrow, { color: 'rgba(255,255,255,.85)' }]}>Scan barcode</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 8, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
          {busy ? 'Looking up product…' : 'Center the code in the frame'}
        </Text>
      </View>

      <View style={{ position: 'absolute', top: 18, left: 22 }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Cancel and go back"
          hitSlop={6}
          style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Fraunces_400Regular' }}>‹</Text>
        </Pressable>
      </View>

      {__DEV__ ? (
        <View style={{ position: 'absolute', bottom: 40, left: 22, right: 22 }}>
          <CtaButton
            label="Test scan (5449000000996)"
            disabled={busy}
            onPress={async () => {
              scannedRef.current = true;
              try {
                setBusy(true);
                const { logId } = await draftFromBarcode({ ean: '5449000000996' });
                router.replace({ pathname: '/log/confirm', params: { source: 'barcode', logId, barcode: '5449000000996' } });
              } catch (e: any) {
                Alert.alert('Lookup failed', describeConvexError(e));
                scannedRef.current = false;
                setBusy(false);
              }
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
