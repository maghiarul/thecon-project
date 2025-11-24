import { mockLocations } from '@/data/locations';
import type { ChatMessage } from '@/services/ai-service';
import { streamChatMessage } from '@/services/ai-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './use-auth';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  locationIds?: string[];
}

const CHAT_STORAGE_KEY = 'chat_messages';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { user } = useAuth();

  const storageKey = user?.id ? `${CHAT_STORAGE_KEY}_${user.id}` : CHAT_STORAGE_KEY;

  useEffect(() => {
    loadMessages();
  }, [storageKey]);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const extractLocationIds = (content: string): string[] => {
    const ids: string[] = [];
    mockLocations.forEach(loc => {
      if (content.includes(loc.name)) {
        ids.push(loc.id);
      }
    });
    return ids;
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);

    setIsStreaming(true);

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const chatHistory: ChatMessage[] = updatedMessages
        .slice(-6)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      chatHistory.push({
        role: 'user',
        content,
      });

      const stream = streamChatMessage(chatHistory, mockLocations);

      for await (const chunk of stream) {
        assistantMessage.content += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = { ...assistantMessage };
          return newMessages;
        });
      }

      assistantMessage.locationIds = extractLocationIds(assistantMessage.content);
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);

    } catch (error) {
      console.error('Chat error:', error);
      assistantMessage.content = 'Ne pare rău, a apărut o eroare. Te rog încearcă din nou.';
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, storageKey]);

  const clearChat = useCallback(async () => {
    setMessages([]);
    try {
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  }, [storageKey]);

  return {
    messages,
    sendMessage,
    clearChat,
    isStreaming,
  };
}
