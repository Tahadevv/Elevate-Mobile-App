import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Sidebar from '../../components/dashboardItems/sidebar';
import Topbar from '../../components/dashboardItems/topbar';
import SemiBottomBar from '../../components/screens/semibottombar';
import { useColors } from '../../components/theme-provider';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile, updateUserProfile } from '../../store/slices/userSlice';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { userProfile, isLoading, error, operationLoading } = useAppSelector((state: any) => state.user);
  const { token } = useAppSelector((state: any) => state.auth);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Fetch user profile from API
  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile(token) as any);
    }
  }, [token, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Update form data when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.name || '',
        email: userProfile.email || '',
        password: '',
        confirmPassword: '',
        bio: userProfile.description || ''
      });
    }
  }, [userProfile]);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!token) {
      Alert.alert('Error', 'No authentication token found');
      return;
    }

    // Validate passwords if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const updateData: any = {
        name: formData.fullName,
        email: formData.email,
        description: formData.bio,
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      await dispatch(updateUserProfile({ profileData: updateData, token }) as any).unwrap();
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset form to original values from user profile
    if (userProfile) {
      setFormData({
        fullName: userProfile.name || '',
        email: userProfile.email || '',
        password: '',
        confirmPassword: '',
        bio: userProfile.description || ''
      });
    }
  };

  const styles = createStyles(colors, insets);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      {/* Topbar */}
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onStateChange={setSidebarOpen} currentPage="settings" />
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Account Settings
            </Text>
          </View>

          <View style={styles.content}>
            {/* Account Settings Card */}
            <Card style={styles.settingsCard}>
              <CardHeader>
                <CardTitle style={styles.cardTitle}>
                  <View style={styles.titleRow}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="person-circle" size={20} color={colors.primary} />
                      <Ionicons name="information-circle" size={16} color={colors.muted} style={styles.infoIcon} />
                    </View>
                    <Text style={[styles.titleText, { color: colors.foreground }]}>
                      Personal Information
                    </Text>
                  </View>
                </CardTitle>
                <CardDescription>
                  Update your account details and profile information.
                </CardDescription>
              </CardHeader>
              <CardContent style={styles.cardContent}>
                {/* Full Name */}
                <View style={styles.formField}>
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                    placeholder="Enter your full name"
                  />
                </View>

                {/* Email Address */}
                <View style={styles.formField}>
                  <Label>Email Address</Label>
                  <Input 
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password */}
                <View style={styles.formField}>
                  <Label>Password</Label>
                  <View style={styles.passwordContainer}>
                    <Input 
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color={colors.mutedForeground} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.formField}>
                  <Label>Confirm Password</Label>
                  <View style={styles.passwordContainer}>
                    <Input 
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      placeholder="Confirm your password"
                      secureTextEntry={!showConfirmPassword}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color={colors.mutedForeground} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Bio */}
                <View style={styles.formField}>
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChangeText={(value) => handleInputChange('bio', value)}
                    placeholder="Tell us about yourself"
                    style={styles.bioTextarea}
                  />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Button 
                    variant="outline" 
                    onPress={handleCancel}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onPress={handleSaveChanges}
                    style={styles.saveButton}
                  >
                    Save Changes
                  </Button>
                </View>
              </CardContent>
            </Card>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
      <SemiBottomBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

function createStyles(colors: any, insets: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      paddingBottom: 32 + insets.bottom, // Account for semi bottom bar height
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    settingsCard: {
      marginBottom: 0,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      position: 'relative',
    },
    infoIcon: {
      position: 'absolute',
      bottom: -2,
      right: -2,
    },
    titleText: {
      fontSize: 18,
      fontWeight: '600',
    },
    cardContent: {
      gap: 20,
    },
    formField: {
      gap: 8,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordInput: {
      paddingRight: 48, // Make room for eye icon
    },
    eyeIcon: {
      position: 'absolute',
      right: 12,
      top: 8,
      zIndex: 1,
    },
    bioTextarea: {
      minHeight: 100,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    cancelButton: {
      flex: 1,
    },
    saveButton: {
      flex: 1,
    },
    bottomPadding: {
      height: 80, // Increased padding to ensure buttons are visible above semi bottom bar
    },
  });
}
