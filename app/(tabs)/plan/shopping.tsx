import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { Header, IconChip, Em, CtaButton } from '@/components';
import { Icon } from '@/lib/icons';
import { S } from '@/lib/styles';
import { C } from '@/lib/tokens';
import { api } from '@/convex/_generated/api';
import { describeConvexError } from '@/lib/clientError';

export default function Shopping() {
  const router = useRouter();
  const plan = useQuery(api.plan.active);
  const toggleItem = useMutation(api.plan.toggleShoppingItem);

  if (plan === undefined) {
    return (
      <View style={[S.page, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={C.apricot} />
      </View>
    );
  }

  if (plan === null || plan.shopping.length === 0) {
    return (
      <View style={S.page}>
        <Header showBack>This week</Header>
        <View style={[S.pad, { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }]}>
          <Text style={[S.h2, { textAlign: 'center' }]}>Shopping list is empty</Text>
          <Text style={{ fontSize: 14, color: C.muted, textAlign: 'center', maxWidth: 280, fontFamily: 'Fraunces_300Light_Italic' }}>
            Open a recipe and tap &ldquo;Add to shopping list&rdquo; to start.
          </Text>
          <CtaButton label="Browse plan" onPress={() => router.replace('/(tabs)/plan')} />
        </View>
      </View>
    );
  }

  const items = [...plan.shopping].sort((a, b) =>
    a.checked === b.checked ? a.name.localeCompare(b.name) : a.checked ? 1 : -1,
  );

  const onToggle = async (itemId: string) => {
    try {
      await toggleItem({ itemId });
    } catch (e) {
      Alert.alert('Could not update', describeConvexError(e));
    }
  };

  return (
    <View style={S.page}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 40 }}>
        <Header showBack>This week</Header>

        <View style={S.pad}>
          <Text style={[S.h1, { marginTop: 8 }]}>
            Shopping{'\n'}<Em>list</Em>
          </Text>
          <View style={[S.pillow, { backgroundColor: C.greenLt, flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22 }]}>
            <IconChip tone="greenSolid" size={48}>
              <Icon name="cart" color="#fff" size={24} />
            </IconChip>
            <View style={{ flex: 1 }}>
              <Text style={[S.eyebrow, { color: C.green }]}>Items to grab</Text>
              <Text style={{ fontFamily: 'Fraunces_300Light_Italic', fontSize: 28, color: C.green, marginTop: 2 }}>
                {items.filter((i) => !i.checked).length}
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: C.green, opacity: 0.7, fontStyle: 'italic', fontFamily: 'Fraunces_300Light_Italic' }}>
              of {items.length}
            </Text>
          </View>
        </View>

        <View style={S.pad}>
          <View style={[S.pillow, { padding: 0, marginTop: 12 }]}>
            {items.map((it, i) => (
              <Pressable
                key={it.id}
                onPress={() => onToggle(it.id)}
                accessibilityRole="checkbox"
                accessibilityLabel={`${it.name}, ${it.qty}`}
                accessibilityState={{ checked: it.checked }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingHorizontal: 18,
                  paddingVertical: 14,
                  borderBottomWidth: i < items.length - 1 ? 1 : 0,
                  borderBottomColor: C.hair,
                  opacity: it.checked ? 0.5 : 1,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 1.5,
                    borderColor: it.checked ? C.green : C.hair,
                    backgroundColor: it.checked ? C.green : C.creamHi,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {it.checked ? <Icon name="check" color="#fff" size={14} /> : null}
                </View>
                <Text
                  style={{
                    flex: 1,
                    color: C.ink,
                    fontSize: 14,
                    fontFamily: 'DMSans_400Regular',
                    textDecorationLine: it.checked ? 'line-through' : 'none',
                  }}
                >
                  {it.name}
                </Text>
                <Text style={{ color: C.dim, fontSize: 12, fontFamily: 'DMSans_400Regular' }}>{it.qty}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
