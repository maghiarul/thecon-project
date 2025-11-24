import { ChatBubble } from '@/components/chat-bubble';
import { ChatInput } from '@/components/chat-input';
import { LocationCard } from '@/components/location-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TypingIndicator } from '@/components/typing-indicator';
import { mockLocations } from '@/data/locations';
import { useChat } from '@/hooks/use-chat';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const QUICK_REPLIES = [
  '☕ Cafenea liniștită',
  '🍽️ Restaurant romantic',
  '🥐 Brunch weekend',
  '🍕 Mâncare rapidă',
  '🌱 Opțiuni vegetariene',
];

export default function ChatScreen() {
  const { messages, sendMessage, clearChat, isStreaming } = useChat();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  const handleClearChat = () => {
    Alert.alert(
      'Șterge conversația',
      'Sigur vrei să ștergi toate mesajele?',
      [
        { text: 'Anulează', style: 'cancel' },
        { text: 'Șterge', style: 'destructive', onPress: clearChat },
      ]
    );
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleLocationPress = (locationId: string) => {
    const location = mockLocations.find(loc => loc.id === locationId);
    if (location) {
      router.push({
        pathname: '/location-details',
        params: { locationId: locationId },
      });
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View>
      <ChatBubble message={item} />
      {item.locationIds && item.locationIds.length > 0 && (
        <View style={styles.locationsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.locationsScroll}>
            {item.locationIds.map((id: string) => {
              const location = mockLocations.find(loc => loc.id === id);
              if (!location) return null;
              return (
                <LocationCard
                  key={id}
                  location={location}
                  variant="compact"
                  onPress={() => handleLocationPress(id)}
                  style={{ width: 160, marginRight: 12, minWidth: 0, maxWidth: '100%' }}
                />
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color={`${tintColor}40`} />
      <ThemedText type="title" style={styles.emptyTitle}>
        Chat cu AI
      </ThemedText>
      <ThemedText style={styles.emptyText}>
        Întreabă-mă orice despre locațiile disponibile!{'\n'}
        Pot să te ajut să găsești locul perfect.
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {messages.length > 0 && (
        <View style={styles.header}>
          <Pressable onPress={handleClearChat} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color={tintColor} />
            <ThemedText style={styles.clearText}>Șterge conversația</ThemedText>
          </Pressable>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.content}>
            {renderEmpty()}
            <View style={styles.quickRepliesContainer}>
              <ThemedText style={styles.quickRepliesLabel}>Sugestii:</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickRepliesScroll}
              >
                {QUICK_REPLIES.map((reply, index) => (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.quickReply,
                      { borderColor: `${borderColor}30` },
                      pressed && styles.quickReplyPressed,
                    ]}
                    onPress={() => handleQuickReply(reply)}
                  >
                    <ThemedText style={styles.quickReplyText}>{reply}</ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            inverted
            contentContainerStyle={styles.messagesList}
            ListFooterComponent={isStreaming ? <TypingIndicator /> : null}
          />
        )}

        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  clearText: {
    fontSize: 14,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
  quickRepliesContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  quickRepliesLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  quickRepliesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickReply: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: 14,
  },
  quickReplyPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  messagesList: {
    paddingTop: 16,
    paddingBottom: 120,
    flexDirection: 'column-reverse',
  },
  locationsContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  locationsScroll: {
    paddingHorizontal: 16,
  },
});
