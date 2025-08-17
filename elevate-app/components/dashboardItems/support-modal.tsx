import { Ionicons } from "@expo/vector-icons";
import React, { createContext, useContext, useState } from "react";
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

const { width } = Dimensions.get("window");

// ===== Context =====
interface SupportModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SupportModalContext = createContext<SupportModalContextType | undefined>(
  undefined
);

// ===== Provider Component =====
export const SupportModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <SupportModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
      <SupportModal />
    </SupportModalContext.Provider>
  );
};

// ===== Hook =====
export const useSupportModal = () => {
  const context = useContext(SupportModalContext);
  if (context === undefined) {
    throw new Error("useSupportModal must be used within a SupportModalProvider");
  }
  return {
    openSupportModal: context.openModal,
  };
};

// ===== Modal Component =====
export const SupportModal = () => {
  const { isOpen, closeModal } = useContext(SupportModalContext)!;
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState("technical");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const topics = [
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing Question" },
    { value: "account", label: "Account Help" },
    { value: "course", label: "Course Content" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!email.trim() || !subject.trim() || !message.trim()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);

    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setSubmitted(false);
      closeModal();
      // Reset form
      setEmail("");
      setSubject("");
      setMessage("");
      setTopic("technical");
    }, 3000);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Ionicons name="chatbubble" size={16} color="#8b5cf6" />
                <Text style={styles.title}>Contact Support</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>
              Fill out the form below to report an issue or get help with your
              account
            </Text>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {submitted ? (
                <View style={styles.successAlert}>
                  <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  <View style={styles.successContent}>
                    <Text style={styles.successTitle}>Message Sent!</Text>
                    <Text style={styles.successDescription}>
                      Thank you for reaching out. Our support team will get back to
                      you within 24 hours.
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Your Email</Text>
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="mk0906145@gmail.com"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Topic</Text>
                    <View style={styles.pickerContainer}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {topics.map((topicItem) => (
                          <TouchableOpacity
                            key={topicItem.value}
                            style={[
                              styles.topicButton,
                              topic === topicItem.value && styles.topicButtonActive,
                            ]}
                            onPress={() => setTopic(topicItem.value)}
                          >
                            <Text
                              style={[
                                styles.topicButtonText,
                                topic === topicItem.value &&
                                  styles.topicButtonTextActive,
                              ]}
                            >
                              {topicItem.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                      style={styles.textInput}
                      value={subject}
                      onChangeText={setSubject}
                      placeholder="Brief description of your issue"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={message}
                      onChangeText={setMessage}
                      placeholder="Please describe your issue in detail"
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? "Sending..." : "Send Message"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    width: "100%",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  successAlert: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 8,
    padding: 16,
    alignItems: "flex-start",
    gap: 12,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065f46",
    marginBottom: 4,
  },
  successDescription: {
    fontSize: 12,
    color: "#047857",
    lineHeight: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    backgroundColor: "white",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    marginTop: 4,
  },
  topicButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "white",
    marginRight: 8,
  },
  topicButtonActive: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  topicButtonText: {
    fontSize: 12,
    color: "#6b7280",
  },
  topicButtonTextActive: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#c4b5fd",
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
