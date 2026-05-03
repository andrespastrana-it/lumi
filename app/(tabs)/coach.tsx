import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Mascot, Header, IconChip } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C, BTN_SHADOW, PILLOW_SHADOW_SM } from '@/lib/tokens';

interface Msg {
  from: 'lumi' | 'me';
  text: string;
  action?: { label: string; to: string };
}

const PROMPTS: { q: string; icon: string; reply: () => { text: string; action?: Msg['action'] } }[] = [
  { q: 'Can I drink wine tonight?',                     icon: 'heart',   reply: () => ({ text: "A glass (150ml) is fine — that's ~120 kcal. I'll trim 100 kcal off dinner. Stick to one and water in between." }) },
  { q: 'Swap my lunch for something lighter',           icon: 'lunch',   reply: () => ({ text: 'How about a salmon poke bowl? 480 kcal, P 32 · C 50 · F 14. Tap to swap.', action: { label: 'Apply swap', to: '/(tabs)/plan' } }) },
  { q: 'Tapas with friends tonight, what do I order?',  icon: 'sparkle', reply: () => ({ text: "Get: pulpo a la gallega, gambas al ajillo, ensalada mixta. Skip: patatas bravas, chorizo. You'll land at ~620 kcal." }) },
];

function MessageBubble({ m, showMascot, onAction }: { m: Msg; showMascot: boolean; onAction: (to: string) => void }) {
  const isMe = m.from === 'me';
  return (
    <View
      style={{
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        maxWidth: '85%',
      }}
    >
      {!isMe && showMascot && (
        <View style={{ marginBottom: -2 }}>
          <Mascot mood="happy" size={32} />
        </View>
      )}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: isMe ? C.ink : C.apricotLt,
          borderRadius: 18,
          borderBottomRightRadius: isMe ? 4 : 18,
          borderBottomLeftRadius: isMe ? 18 : 4,
          boxShadow: PILLOW_SHADOW_SM,
        }}
      >
        <Text style={{ fontSize: 14, lineHeight: 21, color: isMe ? C.paper : C.ink, fontFamily: 'DMSans_400Regular' }}>
          {m.text}
        </Text>
        {m.action && (
          <Pressable
            onPress={() => onAction(m.action!.to)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 12,
              backgroundColor: C.apricot,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              alignSelf: 'flex-start',
              boxShadow: BTN_SHADOW,
            }}
          >
            <Icon name="check" color="#fff" size={12} />
            <Text style={{ color: C.paper, fontSize: 12, fontFamily: 'DMSans_600SemiBold' }}>{m.action.label}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function Coach() {
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'lumi', text: "Hey Marco — what's on your mind?" }]);
  const [draft, setDraft] = useState('');

  const send = (text: string, replyFn: () => { text: string; action?: Msg['action'] }) => {
    setMsgs(m => [...m, { from: 'me', text }]);
    setTimeout(() => {
      const r = replyFn();
      setMsgs(m => [...m, { from: 'lumi', text: r.text, action: r.action }]);
    }, 500);
  };

  const submitDraft = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft('');
    send(text, () => ({ text: 'Got it — give me a sec.' }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={S.page}
    >
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 110 }}>
        <Header>Coach</Header>

        <View style={{ paddingHorizontal: 22, paddingTop: 4, paddingBottom: 14 }}>
          <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
            <Mascot mood={msgs.length > 1 ? 'happy' : 'wave'} size={64} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 22, color: C.ink }}>Pip</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: C.green }} />
                <Text style={{ fontSize: 11, color: C.green, fontFamily: 'DMSans_600SemiBold', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                  Listening
                </Text>
              </View>
            </View>
            <IconChip tone="apricot" size={36}>
              <Icon name="sparkle" color={C.apricotDk} size={18} />
            </IconChip>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingBottom: 8, gap: 10 }}>
          {msgs.map((m, i) => (
            <MessageBubble key={i} m={m} showMascot={i === msgs.length - 1} onAction={to => router.push(to as never)} />
          ))}
        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 18, paddingBottom: 8 }}>
          <Text style={S.eyebrow}>Try asking</Text>
        </View>
        <View style={{ paddingHorizontal: 22, gap: 8 }}>
          {PROMPTS.map(p => (
            <Pressable
              key={p.q}
              onPress={() => send(p.q, p.reply)}
              style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
            >
              <IconChip tone="apricot" size={32}>
                <Icon name={p.icon} color={C.apricotDk} size={16} />
              </IconChip>
              <Text style={{ flex: 1, fontSize: 13.5, color: C.ink, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
                “{p.q}”
              </Text>
              <Icon name="add" color={C.apricot} size={16} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 22,
          paddingTop: 12,
          paddingBottom: 22,
          backgroundColor: 'rgba(255,251,241,.92)',
          borderTopWidth: 1,
          borderTopColor: C.hair,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <View style={[S.pillowSm, { flex: 1, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={submitDraft}
            placeholder="Ask Pip anything…"
            placeholderTextColor={C.dim}
            style={{ flex: 1, fontSize: 14, fontFamily: 'DMSans_400Regular', color: C.ink, padding: 0 }}
          />
          <Icon name="mic" color={C.dim} size={18} />
        </View>
        <Pressable
          onPress={() => router.push('/log/choose')}
          style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: C.apricot, alignItems: 'center', justifyContent: 'center', boxShadow: BTN_SHADOW }}
        >
          <Icon name="add" color="#fff" size={18} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
