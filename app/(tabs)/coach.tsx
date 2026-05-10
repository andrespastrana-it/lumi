import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Mascot, Header, IconChip, ScreenLoading } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C, BTN_SHADOW, PILLOW_SHADOW_SM } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';
import type { Id } from '@/convex/_generated/dataModel';

const STARTER_PROMPTS = [
  { q: 'Can I drink wine tonight?', icon: 'heart' },
  { q: 'Swap my lunch for something lighter', icon: 'lunch' },
  { q: "I'm out for tapas — what should I order?", icon: 'sparkle' },
];

type Msg = {
  _id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: { action?: { label: string; to: string } } | null;
};

function MessageBubble({
  m,
  showMascot,
  onAction,
}: {
  m: Msg;
  showMascot: boolean;
  onAction: (to: string) => void;
}) {
  const isMe = m.role === 'user';
  const action = m.toolCalls?.action;
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
          <Mascot mood="happy" size={32} animate={false} />
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
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
            color: isMe ? C.paper : C.ink,
            fontFamily: 'DMSans_400Regular',
          }}
        >
          {m.content}
        </Text>
        {action ? (
          <Pressable
            onPress={() => onAction(action.to)}
            accessibilityRole="button"
            accessibilityLabel={action.label}
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
            <Text style={{ color: C.paper, fontSize: 12, fontFamily: 'DMSans_600SemiBold' }}>
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function Coach() {
  const router = useRouter();
  const ensureThread = useMutation(api.chat.ensureThread);
  const sendUserMessage = useMutation(api.chat.sendUserMessage);
  const sendAction = useAction(api.chatActions.send);

  const [threadId, setThreadId] = useState<Id<'chatThreads'> | null>(null);
  const [draft, setDraft] = useState('');
  const [pipTyping, setPipTyping] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    ensureThread({})
      .then((id) => setThreadId(id as Id<'chatThreads'>))
      .catch((e) => {
        startedRef.current = false;
        Alert.alert("Couldn't open chat", describeConvexError(e));
      });
  }, [ensureThread]);

  const messages = useQuery(api.chat.messages, threadId ? { threadId } : 'skip') as
    | Msg[]
    | undefined;

  const submit = async (text: string) => {
    if (!threadId || !text.trim() || pipTyping) return;
    const trimmed = text.trim();
    setDraft('');
    setPipTyping(true);
    try {
      await sendUserMessage({ threadId, text: trimmed });
      await sendAction({ threadId, text: trimmed });
    } catch (e) {
      Alert.alert("Couldn't reach Pip", describeConvexError(e));
    } finally {
      setPipTyping(false);
    }
  };

  if (!threadId || messages === undefined) {
    return <ScreenLoading />;
  }

  const sorted = [...messages]; // already in insertion order from index
  const showStarters = sorted.length === 0 && !pipTyping;

  return (
    <KeyboardAvoidingView behavior="padding" style={S.page}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <Header>Coach</Header>

        <View style={{ paddingHorizontal: 22, paddingTop: 4, paddingBottom: 14 }}>
          <View style={[S.pillow, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
            <Mascot
              mood={pipTyping ? 'typing' : sorted.length > 0 ? 'happy' : 'wave'}
              size={64}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 22, color: C.ink }}>
                Pip
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <View
                  style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: C.green }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: C.green,
                    fontFamily: 'DMSans_600SemiBold',
                    letterSpacing: 0.6,
                    textTransform: 'uppercase',
                  }}
                >
                  {pipTyping ? 'Typing…' : 'Listening'}
                </Text>
              </View>
            </View>
            <IconChip tone="apricot" size={36}>
              <Icon name="sparkle" color={C.apricotDk} size={18} />
            </IconChip>
          </View>
        </View>

        <View style={{ paddingHorizontal: 22, paddingBottom: 8, gap: 10 }}>
          {sorted.map((m, i) => (
            <MessageBubble
              key={m._id}
              m={m}
              showMascot={i === sorted.length - 1}
              onAction={(to) => router.push(to as never)}
            />
          ))}
        </View>

        {showStarters ? (
          <>
            <View style={{ paddingHorizontal: 22, paddingTop: 18, paddingBottom: 8 }}>
              <Text style={S.eyebrow}>Try asking</Text>
            </View>
            <View style={{ paddingHorizontal: 22, gap: 8 }}>
              {STARTER_PROMPTS.map((p) => (
                <Pressable
                  key={p.q}
                  onPress={() => submit(p.q)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ask Pip: ${p.q}`}
                  style={[S.pillowSm, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}
                >
                  <IconChip tone="apricot" size={32}>
                    <Icon name={p.icon} color={C.apricotDk} size={16} />
                  </IconChip>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 13.5,
                      color: C.ink,
                      fontStyle: 'italic',
                      fontFamily: 'Fraunces_300Light_Italic',
                    }}
                  >
                    “{p.q}”
                  </Text>
                  <Icon name="add" color={C.apricot} size={16} />
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
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
        <View
          style={[
            S.pillowSm,
            {
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => submit(draft)}
            editable={!pipTyping}
            placeholder="Ask Pip anything…"
            placeholderTextColor={C.dim}
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: 'DMSans_400Regular',
              color: C.ink,
              padding: 0,
            }}
          />
          <Icon name="mic" color={C.dim} size={18} />
        </View>
        <Pressable
          onPress={() => router.push('/log/choose')}
          accessibilityRole="button"
          accessibilityLabel="Log a meal"
          hitSlop={4}
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: C.apricot,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: BTN_SHADOW,
          }}
        >
          <Icon name="add" color="#fff" size={18} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
