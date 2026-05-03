import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CtaButton } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { openAppSettings } from '@/lib/permissions';

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
  const scannedRef = useRef(false);

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

  const onScan = (_r: BarcodeScanningResult) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/log/confirm');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'] }}
        onBarcodeScanned={onScan}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Dim overlay around scan window */}
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
          Center the code in the frame
        </Text>
      </View>

      <View style={{ position: 'absolute', top: 18, left: 22 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Fraunces_400Regular' }}>‹</Text>
        </Pressable>
      </View>

      <View style={{ position: 'absolute', bottom: 40, left: 22, right: 22 }}>
        <CtaButton
          label="Simulate scan"
          onPress={() => {
            scannedRef.current = true;
            router.replace('/log/confirm');
          }}
        />
      </View>
    </View>
  );
}
