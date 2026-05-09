import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/expo';
import { Header, CtaButton } from '@/components';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';

export default function SignIn() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [topError, setTopError] = useState<string | null>(null);

  const submit = async () => {
    setTopError(null);
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) {
      setTopError(error.message ?? 'Bad credentials');
      return;
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: () => router.replace('/'),
      });
    } else {
      setTopError('Sign-in not complete.');
    }
  };

  const busy = fetchStatus === 'fetching';

  return (
    <View style={[S.page, { backgroundColor: C.creamHi }]}>
      <Header showBack>Sign in</Header>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 40, gap: 12 }}>
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
        {errors.fields.identifier ? <Text style={errStyle}>{errors.fields.identifier.message}</Text> : null}
        <Text style={S.eyebrow}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={C.dim}
          style={input}
        />
        {errors.fields.password ? <Text style={errStyle}>{errors.fields.password.message}</Text> : null}
        {topError ? <Text style={errStyle}>{topError}</Text> : null}
        <CtaButton label="Continue" onPress={submit} disabled={busy || !email || !password} />
        <Pressable onPress={() => router.replace('/auth/sign-up' as any)} style={{ paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: C.muted, fontFamily: 'DMSans_500Medium', fontSize: 14 }}>
            New here? <Text style={{ color: C.apricot }}>Create account</Text>
          </Text>
        </Pressable>
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
