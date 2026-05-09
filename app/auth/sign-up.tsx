import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/expo';
import { Header, CtaButton } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

export default function SignUp() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const submit = async () => {
    setTopError(null);
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      setTopError(error.message ?? 'Sign-up failed');
      return;
    }
    await signUp.verifications.sendEmailCode();
    setPendingVerification(true);
  };

  const verify = async () => {
    setTopError(null);
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: () => router.replace('/onboarding/goal'),
      });
    } else {
      setTopError('Verification not complete.');
    }
  };

  const busy = fetchStatus === 'fetching';

  return (
    <View style={[S.page, { backgroundColor: C.creamHi }]}>
      <Header showBack>{pendingVerification ? 'Verify' : 'Sign up'}</Header>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 40, gap: 12 }}>
        {!pendingVerification ? (
          <>
            <Text style={[S.eyebrow, { marginTop: 8 }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={C.dim}
              style={input}
            />
            {errors.fields.emailAddress ? <Text style={errStyle}>{errors.fields.emailAddress.message}</Text> : null}
            <Text style={S.eyebrow}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="At least 8 characters"
              placeholderTextColor={C.dim}
              style={input}
            />
            {errors.fields.password ? <Text style={errStyle}>{errors.fields.password.message}</Text> : null}
            {topError ? <Text style={errStyle}>{topError}</Text> : null}
            <CtaButton label="Create account" onPress={submit} disabled={busy || !email || !password} />
            <View nativeID="clerk-captcha" />
            <Pressable onPress={() => router.replace('/auth/sign-in' as any)} style={{ paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: C.muted, fontFamily: 'DMSans_500Medium', fontSize: 14 }}>
                Already have an account? <Text style={{ color: C.apricot }}>Sign in</Text>
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[S.body, { marginTop: 8 }]}>We sent a 6-digit code to {email}.</Text>
            <Text style={[S.eyebrow, { marginTop: 8 }]}>Verification code</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              placeholder="123456"
              placeholderTextColor={C.dim}
              style={input}
            />
            {errors.fields.code ? <Text style={errStyle}>{errors.fields.code.message}</Text> : null}
            {topError ? <Text style={errStyle}>{topError}</Text> : null}
            <CtaButton label="Verify" onPress={verify} disabled={busy || code.length < 6} />
            <Pressable
              onPress={() => signUp.verifications.sendEmailCode()}
              style={{ paddingVertical: 12, alignItems: 'center' }}
            >
              <Text style={{ color: C.muted, fontFamily: 'DMSans_500Medium', fontSize: 14 }}>Resend code</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const input = {
  borderWidth: 1,
  borderColor: C.hair,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 16,
  fontFamily: 'DMSans_400Regular',
  backgroundColor: '#fff',
  color: C.ink,
} as const;

const errStyle = {
  color: '#b00020',
  fontSize: 13,
  fontFamily: 'DMSans_500Medium',
} as const;
