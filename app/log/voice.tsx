import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioRecorder, useAudioRecorderState, RecordingPresets, requestRecordingPermissionsAsync, getRecordingPermissionsAsync } from 'expo-audio';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Blob, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { openAppSettings } from '@/lib/permissions';
import { useState } from 'react';

function PulseRing({ delay = 0 }: { delay?: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false));
  }, [v, delay]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.9 + v.value * 0.7 }],
    opacity: 0.8 - v.value * 0.8,
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 999, backgroundColor: 'rgba(232,120,78,.3)' },
        style,
      ]}
    />
  );
}

function Bar({ i }: { i: number }) {
  const v = useSharedValue(1);
  useEffect(() => {
    v.value = withDelay(i * 50, withRepeat(withTiming(2.2, { duration: 600 + (i % 3) * 200 }), -1, true));
  }, [v, i]);
  const baseHeight = 8 + (i % 4) * 16;
  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: v.value }] }));
  return (
    <Animated.View
      style={[
        { width: 3, height: baseHeight, backgroundColor: C.apricot, borderRadius: 999 },
        style,
      ]}
    />
  );
}

export default function LogVoice() {
  const router = useRouter();
  const [permission, setPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  useEffect(() => {
    (async () => {
      const cur = await getRecordingPermissionsAsync();
      if (cur.granted) {
        setPermission('granted');
        return;
      }
      const next = await requestRecordingPermissionsAsync();
      setPermission(next.granted ? 'granted' : 'denied');
    })();
  }, []);

  useEffect(() => {
    if (permission !== 'granted') return;
    let cancelled = false;
    (async () => {
      try {
        await recorder.prepareToRecordAsync();
        if (cancelled) return;
        recorder.record();
      } catch {
        // recorder may not be ready yet on hot reload; ignore
      }
    })();
    return () => {
      cancelled = true;
      if (recorderState.isRecording) recorder.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  const stopAndConfirm = async () => {
    let uri = '';
    try {
      if (recorderState.isRecording) await recorder.stop();
      uri = recorder.uri ?? '';
    } catch {
      // ignore — recorder may already be stopped on hot reload
    }
    router.replace({ pathname: '/log/confirm', params: { source: 'voice', audioUri: uri } });
  };

  if (permission === 'denied') {
    return (
      <View style={{ flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ color: C.paper, fontFamily: 'Fraunces_400Regular', fontSize: 22, textAlign: 'center', marginBottom: 12 }}>
          Microphone permission needed
        </Text>
        <Text style={{ color: 'rgba(255,246,238,.6)', fontSize: 14, textAlign: 'center', marginBottom: 24, fontFamily: 'DMSans_400Regular' }}>
          Lumi uses the microphone so you can describe meals by voice.
        </Text>
        <CtaButton label="Open settings" onPress={openAppSettings} />
        <Pressable onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ color: 'rgba(255,246,238,.6)', fontSize: 13, fontFamily: 'DMSans_500Medium' }}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#2D2620', C.ink]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}
    >
      <Blob color={C.apricot} size={300} top={-50} left={-50} opacity={0.1} />
      <Blob color={C.apricot} size={260} bottom={-30} right={-50} opacity={0.08} />

      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 120, height: 120, marginBottom: 28, alignItems: 'center', justifyContent: 'center' }}>
          <PulseRing delay={0} />
          <PulseRing delay={300} />
          <View
            style={{
              position: 'absolute',
              top: 24, left: 24, right: 24, bottom: 24,
              borderRadius: 999,
              backgroundColor: C.apricot,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 28px -8px rgba(232,120,78,.6)',
            }}
          >
            <Icon name="mic" color="#fff" size={36} />
          </View>
        </View>

        <Text style={[S.eyebrow, { color: 'rgba(255,246,238,.5)' }]}>
          {recorderState.isRecording ? 'Listening' : permission === 'granted' ? 'Tap stop when done' : 'Preparing…'}
        </Text>
        <Text style={[S.h1, { color: C.paper, fontSize: 36, marginTop: 16, lineHeight: 38, textAlign: 'center' }]}>
          “Two eggs &amp;{'\n'}
          <Text style={{ color: C.apricot, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>a coffee</Text>”
        </Text>

        <View style={{ flexDirection: 'row', gap: 5, marginTop: 32, alignItems: 'center', height: 60 }}>
          {Array.from({ length: 10 }).map((_, i) => <Bar key={i} i={i + 1} />)}
        </View>
      </View>

      <View style={{ marginTop: 60, width: 240 }}>
        <CtaButton label="Stop & log" onPress={stopAndConfirm} />
      </View>
    </LinearGradient>
  );
}
