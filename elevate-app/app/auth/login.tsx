import { DotLoader } from '@/components/ui/dot-loader';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ElevateExamsTitle } from '../../components/pages/ElevateExamsTitle';
import { useColors } from '../../components/theme-provider';
import { login } from '../../store/slices/authSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const colors = useColors();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.auth);
  const insets = useSafeAreaInsets();

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

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.topTitleContainer, { paddingTop: insets.top + 8 }]}>
        <ElevateExamsTitle />
      </View>
    <KeyboardAvoidingView
        style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={[styles.card, { backgroundColor: '#ffffff', borderColor: '#cbd5e1' }]}>
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <Text style={styles.headerTitle}>Sign In to </Text>
                <ElevateExamsTitle size={0.625} />
              </View>
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  topTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'flex-start',
    paddingTop: '50%',
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
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
});
