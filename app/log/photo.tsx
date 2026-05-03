import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { openAppSettings } from '@/lib/permissions';

function CornerMark({ y, x }: { y: 0 | 1; x: 0 | 1 }) {
  const base = 12;
  return (
    <View
      style={{
        position: 'absolute',
        top: y ? undefined : base,
        bottom: y ? base : undefined,
        left: x ? undefined : base,
        right: x ? base : undefined,
        width: 24,
        height: 24,
        borderTopWidth: y ? 0 : 3,
        borderBottomWidth: y ? 3 : 0,
        borderLeftWidth: x ? 0 : 3,
        borderRightWidth: x ? 3 : 0,
        borderColor: '#fff',
      }}
    />
  );
}

export default function LogPhoto() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#1a1a1a' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ color: C.paper, fontFamily: 'Fraunces_400Regular', fontSize: 22, textAlign: 'center', marginBottom: 12 }}>
          Camera permission needed
        </Text>
        <Text style={{ color: 'rgba(255,246,238,.6)', fontSize: 14, textAlign: 'center', marginBottom: 24, fontFamily: 'DMSans_400Regular' }}>
          Lumi uses the camera so you can log meals by photo.
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

  const capture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
      router.replace({ pathname: '/log/confirm', params: { source: 'photo', photoUri: photo?.uri ?? '' } });
    } catch (e) {
      Alert.alert('Capture failed', String(e));
      setCapturing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={cameraRef} facing="back" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      {/* Vignette overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,.45)', 'rgba(0,0,0,0)', 'rgba(0,0,0,.5)']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 60, left: 60, right: 60, bottom: 60,
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,.4)',
          borderRadius: 24,
        }}
      >
        <CornerMark y={0} x={0} />
        <CornerMark y={0} x={1} />
        <CornerMark y={1} x={0} />
        <CornerMark y={1} x={1} />
      </View>

      <View style={{ position: 'absolute', top: 18, left: 22 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 999, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Fraunces_400Regular' }}>‹</Text>
        </Pressable>
      </View>

      <View style={{ position: 'absolute', top: 30, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={[S.eyebrow, { color: 'rgba(255,255,255,.85)' }]}>Photo log</Text>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 60, left: 0, right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <Pressable style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparkle" color="#fff" size={18} />
        </Pressable>
        <Pressable
          onPress={capture}
          disabled={capturing}
          style={{ width: 76, height: 76, borderRadius: 999, backgroundColor: '#fff', borderWidth: 5, borderColor: 'rgba(255,255,255,.3)', opacity: capturing ? 0.6 : 1 }}
        />
        <Pressable style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="flame" color="#fff" size={18} />
        </Pressable>
      </View>
    </View>
  );
}
