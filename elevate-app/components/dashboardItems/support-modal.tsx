import { MessageSquare, X } from 'lucide-react-native';
import React, { createContext, useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
} from 'react-native';
import { useColors } from '../theme-provider';
import API_CONFIG, { buildURL } from '../../config.api';
import { useAppSelector } from '../../store/hooks';

const { width } = Dimensions.get('window');

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
    throw new Error('useSupportModal must be used within a SupportModalProvider');
  }
  return {
    openSupportModal: context.openModal,
  };
};

// ===== Modal Component =====
export const SupportModal = () => {
  const { isOpen, closeModal } = useContext(SupportModalContext)!;
  const [loading, setLoading] = useState(false);
  const colors = useColors();
  const { token, user } = useAppSelector((state: any) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    topic: 'technical',
  });

  const topics = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'course', label: 'Course Content' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/help_center/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to send message. Please try again.');
      }

      Alert.alert(
        'Success',
        'Message sent successfully! Our support team will get back to you within 24 hours.'
      );

      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
        topic: 'technical',
      });

      closeModal();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.titleContainer}>
                <MessageSquare size={20} color={colors.yellow || '#ffd404'} strokeWidth={2.5} />
                <Text style={[styles.title, { color: colors.foreground }]}>
                  Contact Support
                </Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.description, { color: colors.mutedForeground }]}>
              Fill out the form below to report an issue or get help with your account
            </Text>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.form}>
                {/* Topic Selection */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.foreground }]}>Topic</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.topicScrollView}
                  >
                    <View style={styles.topicContainer}>
                      {topics.map((topicItem) => (
                        <TouchableOpacity
                          key={topicItem.value}
                          style={[
                            styles.topicButton,
                            {
                              backgroundColor:
                                formData.topic === topicItem.value
                                  ? colors.yellow || '#ffd404'
                                  : colors.card,
                              borderColor:
                                formData.topic === topicItem.value
                                  ? colors.yellow || '#ffd404'
                                  : colors.border,
                            },
                          ]}
                          onPress={() => handleInputChange('topic', topicItem.value)}
                        >
                          <Text
                            style={[
                              styles.topicButtonText,
                              {
                                color:
                                  formData.topic === topicItem.value
                                    ? colors.background
                                    : colors.foreground,
                              },
                            ]}
                          >
                            {topicItem.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Subject */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.foreground }]}>Subject</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: colors.input || colors.card,
                        borderColor: colors.border,
                        color: colors.foreground,
                      },
                    ]}
                    placeholder="Brief description of your issue"
                    placeholderTextColor={colors.mutedForeground}
                    value={formData.subject}
                    onChangeText={(value) => handleInputChange('subject', value)}
                    editable={!loading}
                  />
                </View>

                {/* Message */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.foreground }]}>Message</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.textArea,
                      {
                        backgroundColor: colors.input || colors.card,
                        borderColor: colors.border,
                        color: colors.foreground,
                      },
                    ]}
                    placeholder="Please describe your issue in detail"
                    placeholderTextColor={colors.mutedForeground}
                    value={formData.message}
                    onChangeText={(value) => handleInputChange('message', value)}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    editable={!loading}
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor: colors.yellow || '#ffd404',
                      opacity: loading ? 0.6 : 1,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color={colors.background} />
                      <Text style={[styles.submitButtonText, { color: colors.background }]}>
                        Sending...
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.submitButtonText, { color: colors.background }]}>
                      Send Message
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    width: width * 0.9,
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  description: {
    fontSize: 12,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  topicScrollView: {
    marginTop: 4,
  },
  topicContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  topicButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  topicButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
