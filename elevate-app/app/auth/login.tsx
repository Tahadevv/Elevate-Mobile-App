import { Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';
import { useColors } from '../../components/theme-provider';
import { Highlight } from '../../components/pages/Highlight';
import { login, setToken } from '../../store/slices/authSlice';
import { DotLoader } from '@/components/ui/dot-loader';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleWebView, setShowGoogleWebView] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const colors = useColors();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(login({ email, password }) as any);

      if (login.fulfilled.match(result)) {
        setTimeout(() => {
          router.replace('/dashboard');
        }, 100);
      } else {
        Alert.alert('Login Failed', result.payload || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const redirectUri = 'https://elevate-exam-website-api.vercel.app/google_callback';
      const authUrl = `${buildURL(API_CONFIG.auth.googleOAuth)}?redirect_uri=${encodeURIComponent(redirectUri)}`;

      const response = await fetch(authUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }

      const data = await response.json();
      if (data.authorization_url) {
        setGoogleAuthUrl(data.authorization_url);
        setShowGoogleWebView(true);
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initiate Google sign-in');
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleCallback = async (url: string) => {
    try {
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      const state = urlObj.searchParams.get('state');
      const error = urlObj.searchParams.get('error');

      if (error) {
        Alert.alert('Error', 'Google authentication failed');
        setShowGoogleWebView(false);
        setIsGoogleLoading(false);
        return;
      }

      if (!code || !state) {
        Alert.alert('Error', 'Invalid callback from Google');
        setShowGoogleWebView(false);
        setIsGoogleLoading(false);
        return;
      }

      setShowGoogleWebView(false);
      const callbackUrl = `${buildURL(API_CONFIG.auth.googleOAuth)}?state=${encodeURIComponent(state)}&code=${encodeURIComponent(code)}`;

      const response = await fetch(callbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.access) {
        const token = data.access.replace('Bearer ', '').trim();
        dispatch(setToken({ token, user: null }));

        try {
          const userResponse = await fetch(buildURL(API_CONFIG.auth.getUserProfile), {
            method: 'GET',
            headers: getAuthHeaders(token),
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            dispatch(setToken({ token, user: userData }));
            setTimeout(() => {
              router.replace('/dashboard');
            }, 100);
          } else {
            setTimeout(() => {
              router.replace('/dashboard');
            }, 100);
          }
        } catch (userErr) {
          setTimeout(() => {
            router.replace('/dashboard');
          }, 100);
        }
      } else {
        Alert.alert('Error', data.detail || data.message || 'Google authentication failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete Google sign-in');
    } finally {
      setIsGoogleLoading(false);
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
                Sign In to <Highlight>Elevate Exams</Highlight>
              </Text>
              <Text style={styles.subtitle}>
                Don't have an account?{' '}
                <Text
                  style={styles.link}
                  onPress={() => router.push('/auth/signup')}
                >
                  Create one here
                </Text>
              </Text>
            </View>

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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, { borderColor: '#cbd5e1' }]}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#6b7280" />
                  ) : (
                    <Eye size={18} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.signInButton, { backgroundColor: '#1e40af' }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <DotLoader size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <DotLoader size="small" color="#1f2937" />
              ) : (
                <Text style={styles.googleButtonText}>Sign In with Google</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Google OAuth WebView Modal */}
      <Modal
        visible={showGoogleWebView}
        animationType="slide"
        onRequestClose={() => {
          setShowGoogleWebView(false);
          setIsGoogleLoading(false);
        }}
      >
        <View style={styles.webViewContainer}>
          <View style={[styles.webViewHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              style={styles.webViewCloseButton}
              onPress={() => {
                setShowGoogleWebView(false);
                setIsGoogleLoading(false);
              }}
            >
              <Text style={styles.webViewCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.webViewTitle, { color: colors.foreground }]}>
              Sign in with Google
            </Text>
            <View style={{ width: 24 }} />
          </View>
          {googleAuthUrl && (
            <WebView
              source={{ uri: googleAuthUrl }}
              onNavigationStateChange={(navState) => {
                const url = navState.url;
                if (url.includes('google_callback') || url.includes('code=')) {
                  handleGoogleCallback(url);
                }
              }}
              onShouldStartLoadWithRequest={(request) => {
                const url = request.url;
                if (url.includes('google_callback') || url.includes('code=')) {
                  handleGoogleCallback(url);
                  return false;
                }
                return true;
              }}
              style={styles.webView}
            />
          )}
        </View>
      </Modal>
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
  link: {
    color: '#1d4ed8',
    fontWeight: '600',
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingRight: 45,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
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
  forgotPasswordLink: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#1d4ed8',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  signInButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  googleButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 44,
  },
  googleButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  webViewCloseButton: {
    padding: 8,
  },
  webViewCloseText: {
    fontSize: 24,
    color: '#1f2937',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
});
