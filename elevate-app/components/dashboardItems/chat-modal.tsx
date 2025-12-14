import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export function ChatbotModal({
  triggerButtonText = "Chat with us",
  title = "AI Assistant",
}: {
  triggerButtonText?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add initial greeting message when chat is opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content: "Hello! I'm your AI assistant. How can I help you today?",
        },
      ]);
    }
  }, [open, messages.length]);

  // Reset messages when modal closes
  useEffect(() => {
    if (!open) {
      setMessages([]);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate a short delay before bot responds
    setTimeout(() => {
      // Add hardcoded bot response
      const botMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        content: "Is there anything else I can help you with?",
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.triggerButtonText}>{triggerButtonText}</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView style={styles.messagesContainer}>
              {messages.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={48}
                    color="#9ca3af"
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyText}>How can I help you today?</Text>
                </View>
              ) : (
                messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.role === "user"
                        ? styles.userMessageContainer
                        : styles.assistantMessageContainer,
                    ]}
                  >
                    <View
                      style={[
                        styles.avatar,
                        message.role === "user"
                          ? styles.userAvatar
                          : styles.assistantAvatar,
                      ]}
                    >
                      {message.role === "user" ? (
                        <Ionicons name="person" size={16} color="white" />
                      ) : (
                        <Ionicons name="chatbubble" size={16} color="white" />
                      )}
                    </View>
                    <View
                      style={[
                        styles.messageBubble,
                        message.role === "user"
                          ? styles.userMessageBubble
                          : styles.assistantMessageBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          message.role === "user"
                            ? styles.userMessageText
                            : styles.assistantMessageText,
                        ]}
                      >
                        {message.content}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type your message..."
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!input.trim() || isLoading) && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoading || !input.trim()}
                >
                  <Ionicons
                    name="send"
                    size={18}
                    color={!input.trim() || isLoading ? "#9ca3af" : "white"}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </>
  );
}

// Mobile AI Assistant Chat Interface
export function ChatInterfaceMobile({ title = "AI Assistant" }: { title?: string }) {
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add initial greeting message when chat is opened
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content: "Hello! I'm your AI assistant. How can I help you today?",
        },
      ]);
    }
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate a short delay before bot responds
    setTimeout(() => {
      // Add hardcoded bot response
      const botMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        content: "Is there anything else I can help you with?",
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <View style={styles.mobileContainer}>
      {/* Header */}
      <View style={styles.mobileHeader}>
        <Ionicons name="chatbubble" size={18} color="#8b5cf6" />
        <Text style={styles.mobileTitle}>{title}</Text>
      </View>

      {/* Messages */}
      <ScrollView style={styles.mobileMessagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.mobileEmptyState}>
            <Ionicons
              name="chatbubble-outline"
              size={40}
              color="#d1d5db"
              style={styles.mobileEmptyIcon}
            />
            <Text style={styles.mobileEmptyText}>How can I help you today?</Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.mobileMessageContainer,
                message.role === "user"
                  ? styles.mobileUserMessageContainer
                  : styles.mobileAssistantMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.mobileAvatar,
                  message.role === "user"
                    ? styles.mobileUserAvatar
                    : styles.mobileAssistantAvatar,
                ]}
              >
                {message.role === "user" ? (
                  <Ionicons name="person" size={14} color="white" />
                ) : (
                  <Ionicons name="chatbubble" size={14} color="#8b5cf6" />
                )}
              </View>
              <View
                style={[
                  styles.mobileMessageBubble,
                  message.role === "user"
                    ? styles.mobileUserMessageBubble
                    : styles.mobileAssistantMessageBubble,
                ]}
              >
                <Text
                  style={[
                    styles.mobileMessageText,
                    message.role === "user"
                      ? styles.mobileUserMessageText
                      : styles.mobileAssistantMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.mobileInputContainer}>
          <TextInput
            style={styles.mobileTextInput}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            editable={!isLoading}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.mobileSendButton,
              (!input.trim() || isLoading) && styles.mobileSendButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={!input.trim() || isLoading ? "#9ca3af" : "white"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Modal styles
  triggerButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    alignSelf: "flex-start",
  },
  triggerButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 2,
    width: width * 0.9,
    height: height * 0.8,
    maxWidth: 425,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  userMessageContainer: {
    flexDirection: "row-reverse",
  },
  assistantMessageContainer: {
    flexDirection: "row",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatar: {
    backgroundColor: "#3b82f6",
  },
  assistantAvatar: {
    backgroundColor: "#6b7280",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 2,
  },
  userMessageBubble: {
    backgroundColor: "#3b82f6",
    borderTopRightRadius: 4,
  },
  assistantMessageBubble: {
    backgroundColor: "#f3f4f6",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "white",
  },
  assistantMessageText: {
    color: "#111827",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },

  // Mobile interface styles
  mobileContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  mobileTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  mobileMessagesContainer: {
    flex: 1,
    padding: 12,
  },
  mobileEmptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mobileEmptyIcon: {
    marginBottom: 8,
  },
  mobileEmptyText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  mobileMessageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  mobileUserMessageContainer: {
    flexDirection: "row-reverse",
  },
  mobileAssistantMessageContainer: {
    flexDirection: "row",
  },
  mobileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileUserAvatar: {
    backgroundColor: "#3b82f6",
  },
  mobileAssistantAvatar: {
    backgroundColor: "#e5e7eb",
  },
  mobileMessageBubble: {
    maxWidth: "75%",
    padding: 8,
    borderRadius: 8,
  },
  mobileUserMessageBubble: {
    backgroundColor: "#3b82f6",
    borderTopRightRadius: 2,
  },
  mobileAssistantMessageBubble: {
    backgroundColor: "#f3f4f6",
    borderTopLeftRadius: 2,
  },
  mobileMessageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  mobileUserMessageText: {
    color: "white",
  },
  mobileAssistantMessageText: {
    color: "#111827",
  },
  mobileInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  mobileTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  mobileSendButton: {
    backgroundColor: "#8b5cf6",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileSendButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
});
