import { Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useColors } from '../theme-provider';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';
import { useAppSelector } from '../../store/hooks';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
  rawText?: string;
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<ScrollView>(null);
  const { token } = useAppSelector((state: any) => state.auth);
  const colors = useColors();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getHistory = () => {
    const actualMessages = messages.filter(msg => !msg.isThinking);
    
    if (actualMessages.length >= 2) {
      const lastTwo = actualMessages.slice(-2);
      const lastUserMessage = lastTwo.find(msg => msg.role === 'user');
      const lastAssistantMessage = lastTwo.find(msg => msg.role === 'assistant');
      
      return {
        query: lastUserMessage?.rawText || lastUserMessage?.content || '',
        response: lastAssistantMessage?.rawText || lastAssistantMessage?.content || ''
      };
    }
    
    return { query: '', response: '' };
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const query = input.trim();
    const history = getHistory();

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      rawText: query,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);

    // Add thinking message
    const thinkingMessageId = (Date.now() + 1).toString();
    const thinkingMessage: Message = {
      id: thinkingMessageId,
      role: 'assistant',
      content: 'Thinking...',
      isThinking: true,
    };
    setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

    try {
      // Get course name from storage (similar to website)
      // In React Native, we might need to use AsyncStorage or pass it as prop
      const courseName = 'cism'; // Default, should be passed as prop or from context
      const authToken = token || API_CONFIG.FIXED_TOKEN;

      if (!authToken) {
        throw new Error('Authorization token not found');
      }

      const response = await fetch(buildURL(API_CONFIG.ai.query), {
        method: 'POST',
        headers: getAuthHeaders(authToken),
        body: JSON.stringify({
          course_id: courseName,
          query: query,
          history: history,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || data.answer || 'No response received';

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === thinkingMessageId
            ? { ...msg, content: aiResponse, rawText: aiResponse, isThinking: false }
            : msg,
        ),
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send message');
      
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === thinkingMessageId
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isThinking: false }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Chat messages area */}
      <ScrollView
        ref={messagesContainerRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.mutedForeground }]}>
              Start a conversation by asking a question
            </Text>
          </View>
        )}
        
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.role === 'user'
                  ? { backgroundColor: colors.yellow || '#f0f0ff' }
                  : { backgroundColor: colors.card },
                message.isThinking && styles.thinkingMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: message.role === 'user' ? colors.background : colors.foreground },
                ]}
              >
                {message.content}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input area */}
      <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.foreground,
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          placeholder="Ask a question"
          placeholderTextColor={colors.mutedForeground}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSendMessage}
          editable={!isLoading}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={isLoading || input.trim() === ''}
          style={[
            styles.sendButton,
            { backgroundColor: colors.yellow || colors.primary },
            (isLoading || input.trim() === '') && styles.sendButtonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Send size={20} color={colors.background} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 8,
  },
  thinkingMessage: {
    opacity: 0.7,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

