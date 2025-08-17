import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme-provider';
import Topbar from '../dashboardItems/topbar';
import Sidebar from '../dashboardItems/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export default function SettingsScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: '********',
    confirmPassword: '********',
    bio: 'I\'m a software developer interested in Python programming and cybersecurity.'
  });
  const colors = useColors();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log('Saving changes:', formData);
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: '********',
      confirmPassword: '********',
      bio: 'I\'m a software developer interested in Python programming and cybersecurity.'
    });
  };

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Topbar */}
      <Topbar />
      
      {/* Sidebar */}
      <Sidebar onStateChange={setSidebarOpen} currentPage="settings" />
      
      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { marginLeft: sidebarOpen ? 256 : 0 }
      ]}>
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
    </View>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 16,
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
      height: 24,
    },
  });
}
