import { Eye, EyeOff } from 'lucide-react-native';
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
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/components/theme-provider';
import { Highlight } from '@/components/pages/Highlight';
import { signup } from '@/store/slices/authSlice';
import { DotLoader } from '@/components/ui/dot-loader';

// Password Validation Component
const PasswordValidation = ({ password }: { password: string }) => {
  if (!password) return null;

  return (
    <View style={styles.passwordHint}>
      <Text style={styles.passwordHintText}>
        Password should be 8 digits, 1 upper case, 1 lowercase, 1 number, 1 symbol
      </Text>
    </View>
  );
};

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: '',
  });
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: any) => state.auth);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!hasUpperCase) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumbers) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password is strong' };
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(validatePassword(text));
  };

  const handleSignup = async () => {
    if (!name || !email || !description || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!passwordStrength.isValid) {
      Alert.alert('Error', 'Password does not meet strength requirements');
      return;
    }

    try {
      const result = await dispatch(signup({ email, name, description, password }) as any);

      if (signup.fulfilled.match(result)) {
        Alert.alert('Success', 'Please check your email for the Activation Link.', [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                router.replace('/auth/login');
              }, 100);
            },
          },
        ]);
      } else {
        Alert.alert('Signup Failed', result.payload || 'Could not create account');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
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
          <View style={[styles.card, { backgroundColor: '#ffffff' }]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Create an <Highlight>Elevate Exams</Highlight> account
              </Text>
              <Text style={styles.subtitle}>Fill in the details below and sign up.</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, { borderColor: '#cbd5e1' }]}
                placeholder="Enter your name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!isLoading}
              />
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
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { borderColor: '#cbd5e1' }]}
                placeholder="e.g., Computer Systems Engineer"
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
                autoCapitalize="words"
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
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
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
              <PasswordValidation password={password} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, { borderColor: '#cbd5e1' }]}
                  placeholder="Enter your password again"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color="#6b7280" />
                  ) : (
                    <Eye size={18} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
              {confirmPassword && password !== confirmPassword && (
                <Text style={styles.passwordMismatchText}>Passwords do not match</Text>
              )}
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.linksContainer}>
              <Text style={styles.linkText}>
                Already have an account?{' '}
                <Text
                  style={styles.link}
                  onPress={() => router.push('/auth/login')}
                >
                  Sign In
                </Text>
              </Text>
              <Text style={styles.termsText}>
                By signing up, you are accepting our{' '}
                <Text style={styles.link}>terms and conditions</Text>.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.signUpButton,
                {
                  backgroundColor:
                    isLoading || !passwordStrength.isValid || password !== confirmPassword
                      ? '#9ca3af'
                      : '#1e40af',
                },
              ]}
              onPress={handleSignup}
              disabled={isLoading || !passwordStrength.isValid || password !== confirmPassword}
            >
              {isLoading ? (
                <DotLoader size="small" color="#ffffff" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
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
    paddingTop: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  passwordHint: {
    marginTop: 8,
  },
  passwordHintText: {
    fontSize: 12,
    color: '#475569',
  },
  passwordMismatchText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
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
  linksContainer: {
    marginBottom: 16,
    gap: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#475569',
  },
  link: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#475569',
  },
  signUpButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 44,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
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
