import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../components/theme-provider';
import { DotLoader } from '../../components/ui/dot-loader';
import { Highlight } from '../../components/pages/Highlight';
import API_CONFIG, { buildURL } from '../../config.api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const colors = useColors();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // Use the reset_password endpoint as shown in the website
      const response = await fetch(`${API_CONFIG.baseURL}/auth/users/reset_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const rawBody = await response.text();
      let data: { detail?: string; error?: string } | null = null;
      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        setError(data?.detail || data?.error || 'Failed to send reset email');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmail('');
      Alert.alert('Success', 'Password reset email sent. Please check your email for the reset link.');
      // Navigate to sign in after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={[styles.card, { backgroundColor: '#ffffff', borderColor: '#cbd5e1' }]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Reset password for <Highlight>Elevate Exams</Highlight>
              </Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a secure link to reset your password.
              </Text>
            </View>

            {!success ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, { borderColor: '#cbd5e1' }]}
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!isLoading}
                  />
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={styles.linksRow}>
                  <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={styles.link}>Back to Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                    <Text style={styles.link}>Create Account</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: '#1e40af' }]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <DotLoader size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.sendButtonText}>Send Link</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>
                    Password reset link has been sent to your email address.
                  </Text>
                </View>

                <View style={styles.successActions}>
                  <Text style={styles.successQuestion}>Didn't receive the email?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                  >
                    <Text style={styles.tryAgainLink}>Try again with a different email</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.push('/auth/login')}
                  >
                    <Text style={styles.cancelButtonText}>Back to Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: '#1e40af' }]}
                    onPress={() => router.push('/')}
                  >
                    <Text style={styles.sendButtonText}>Go Home</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    paddingTop: 80,
  },
  formContainer: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 8,
    padding: 24,
    borderWidth: 2,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 8,
  },
  link: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    minHeight: 44,
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  successActions: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successQuestion: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
  },
  tryAgainLink: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: '600',
  },
});

