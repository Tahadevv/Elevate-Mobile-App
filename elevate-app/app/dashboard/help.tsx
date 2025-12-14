import {
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert as RNAlert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import Sidebar from '../../components/dashboardItems/sidebar';
import Topbar from '../../components/dashboardItems/topbar';
import SemiBottomBar from '../../components/screens/semibottombar';
import { useColors } from '../../components/theme-provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordioncustom';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetSubmission, submitHelpRequest } from '../../store/slices/helpCenterSlice';

export default function HelpCenterScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, error, isSubmitted } = useAppSelector((state: any) => state.helpCenter);
  
  // Debug API states
  console.log('📊 Help Center State:', { isLoading, error, isSubmitted });
  
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("technical");
  const [activeTab, setActiveTab] = useState('help');
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    topic: "technical"
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      RNAlert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    console.log('🚀 Submitting help request with data:', formData);
    // Submit help request
    dispatch(submitHelpRequest(formData) as any);
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      console.log('❌ Help request error:', error);
      RNAlert.alert('Error', error);
    }
  }, [error]);

  // Reset form after successful submission
  useEffect(() => {
    if (isSubmitted) {
      console.log('✅ Help request submitted successfully!');
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        topic: "technical"
      });
      // Reset submission state after 3 seconds
      setTimeout(() => {
        dispatch(resetSubmission());
      }, 3000);
    }
  }, [isSubmitted, dispatch]);

  const colors = useColors();

  const styles = createStyles(colors, insets);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      {/* Topbar */}
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onStateChange={setSidebarOpen} currentPage="help" />
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Help & Support
            </Text>
          </View>

          <View style={styles.main}>
            <View style={styles.grid}>
              {/* Contact Form */}
              <View style={styles.formSection}>
                <Card style={styles.contactCard}>
                  <CardHeader>
                    <CardTitle style={styles.cardTitle}>
                      <View style={styles.titleRow}>
                        <MessageSquare size={20} color={colors.yellow} />
                        <Text style={[styles.titleText, { color: colors.foreground }]}>
                          Contact Support
                        </Text>
                      </View>
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below to report an issue or get help with your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <Alert variant="default" style={styles.successAlert}>
                        <CheckCircle2 size={16} color={colors.primary} />
                        <AlertTitle>Message Sent!</AlertTitle>
                        <AlertDescription>
                          Thank you for reaching out. Our support team will get back to you within 24 hours.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <View style={styles.form}>
                        <View style={styles.formField}>
                          <Label>Your Name</Label>
                          <Input 
                            placeholder="Enter your name" 
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                          />
                        </View>

                        <View style={styles.formField}>
                          <Label>Your Email</Label>
                          <Input 
                            placeholder="mk0906145@gmail.com" 
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                          />
                        </View>

                        <View style={styles.formField}>
                          <Label>Topic</Label>
                          <Select 
                            value={formData.topic}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
                            options={[
                              { value: "technical", label: "Technical Issue" },
                              { value: "billing", label: "Billing Question" },
                              { value: "account", label: "Account Help" },
                              { value: "course", label: "Course Content" },
                              { value: "other", label: "Other" }
                            ]}
                          />
                        </View>

                        <View style={styles.formField}>
                          <Label>Subject</Label>
                          <Input 
                            placeholder="Brief description of your issue" 
                            value={formData.subject}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
                          />
                        </View>

                        <View style={styles.formField}>
                          <Label>Message</Label>
                          <Textarea
                            placeholder="Please describe your issue in detail"
                            style={styles.messageTextarea}
                            value={formData.message}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                          />
                        </View>

                        <View style={styles.submitSection}>
                          <Button 
                            onPress={handleSubmit} 
                            disabled={isLoading}
                            style={styles.submitButton}
                          >
                            {isLoading ? "Sending..." : "Send Message"}
                          </Button>
                        </View>
                      </View>
                    )}
                  </CardContent>
                </Card>
              </View>

              {/* Help Resources */}
              <View style={styles.resourcesSection}>
                {/* Contact Information */}
                <Card style={styles.resourceCard}>
                  <CardHeader>
                    <CardTitle style={styles.resourceTitle}>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent style={styles.resourceContent}>
                    <View style={styles.contactItem}>
                      <Mail size={20} color={colors.primary} />
                      <View style={styles.contactDetails}>
                        <Text style={[styles.contactLabel, { color: colors.foreground }]}>
                          Email Support
                        </Text>
                        <Text style={[styles.contactValue, { color: colors.primary }]}>
                          support@elevate.com
                        </Text>
                      </View>
                    </View>

                    <View style={styles.contactItem}>
                      <Phone size={20} color={colors.primary} />
                      <View style={styles.contactDetails}>
                        <Text style={[styles.contactLabel, { color: colors.foreground }]}>
                          Phone Support
                        </Text>
                        <Text style={[styles.contactText, { color: colors.mutedForeground }]}>
                          Mon-Fri, 9AM-5PM EST
                        </Text>
                        <Text style={[styles.contactValue, { color: colors.primary }]}>
                          +1 (800) 123-4567
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card style={styles.resourceCard}>
                  <CardHeader>
                    <CardTitle style={styles.resourceTitle}>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>   
                    <Accordion type="single">
                      <AccordionItem value="item-1">
                        <AccordionTrigger 
                          onPress={() => toggleAccordion("item-1")} 
                          isOpen={openAccordion === "item-1"}
                        >
                          <Text style={[styles.faqTriggerText, { color: colors.foreground }]}>
                            How do I reset my password?
                          </Text>
                        </AccordionTrigger>
                        <AccordionContent isOpen={openAccordion === "item-1"}>
                          <Text style={[styles.faqText, { color: colors.mutedForeground }]}>
                            To reset your password:{'\n'}
                            1. Click on the &quot;Forgot Password&quot; link on the login page{'\n'}
                            2. Enter the email address associated with your account{'\n'}
                            3. Check your email for a password reset link{'\n'}
                            4. Click the link and follow the instructions to create a new password{'\n\n'}
                            If you don&apos;t receive the email within 5 minutes, check your spam folder or contact support.
                          </Text>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger 
                          onPress={() => toggleAccordion("item-2")} 
                          isOpen={openAccordion === "item-2"}
                        >
                          <Text style={[styles.faqTriggerText, { color: colors.foreground }]}>
                            Where are my certificates?
                          </Text>
                        </AccordionTrigger>
                        <AccordionContent isOpen={openAccordion === "item-2"}>
                          <Text style={[styles.faqText, { color: colors.mutedForeground }]}>
                            You can find your course completion certificates in your profile section:{'\n'}
                            1. Go to your account dashboard{'\n'}
                            2. Click on &apos;My Profile&apos; in the navigation menu{'\n'}
                            3. Select the &apos;Certificates&apos; tab{'\n'}
                            4. Here you&apos;ll find all certificates for completed courses{'\n\n'}
                            Certificates are only issued for fully completed courses with a passing grade of 70% or higher.
                          </Text>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger 
                          onPress={() => toggleAccordion("item-3")} 
                          isOpen={openAccordion === "item-3"}
                        >
                          <Text style={[styles.faqTriggerText, { color: colors.foreground }]}>
                            How do I update my payment method?
                          </Text>
                        </AccordionTrigger>
                        <AccordionContent isOpen={openAccordion === "item-3"}>
                          <Text style={[styles.faqText, { color: colors.mutedForeground }]}>
                            To update your payment method:{'\n'}
                            1. Go to your account settings{'\n'}
                            2. Click on the &apos;Billing&apos; tab{'\n'}
                            3. Under &apos;Payment Methods&apos;, click &apos;Edit&apos; next to your current payment method{'\n'}
                            4. Enter your new payment details and click &quot;Save&quot;{'\n\n'}
                            Changes to your payment method will apply to your next billing cycle. If you have any issues,
                            please contact our billing department.
                          </Text>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger 
                          onPress={() => toggleAccordion("item-4")} 
                          isOpen={openAccordion === "item-4"}
                        >
                          <Text style={[styles.faqTriggerText, { color: colors.foreground }]}>
                            How do I track my course progress?
                          </Text>
                        </AccordionTrigger>
                        <AccordionContent isOpen={openAccordion === "item-4"}>
                          <Text style={[styles.faqText, { color: colors.mutedForeground }]}>
                            Your course progress is automatically tracked as you complete lessons and quizzes:{'\n'}
                            • Progress bars on your dashboard show completion percentage for each course{'\n'}
                            • Within each course, you&apos;ll see checkmarks next to completed lessons{'\n'}
                            • The &apos;My Learning&apos; section provides detailed progress reports{'\n\n'}
                            Your progress is saved automatically, so you can always pick up where you left off, even if you
                            switch devices.
                          </Text>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </View>
            </View>
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
    main: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    grid: {
      gap: 24,
    },
    formSection: {
      flex: 2,
      zIndex: 1,
    },
    resourcesSection: {
      gap: 24,
    },
    contactCard: {
      marginBottom: 0,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    titleText: {
      fontSize: 18,
      fontWeight: '600',
    },
    form: {
      gap: 16,
    },
    formField: {
      gap: 8,
    },
    messageTextarea: {
      minHeight: 150,
    },
    submitSection: {
      paddingTop: 8,
    },
    submitButton: {
      width: '100%',
    },
    resourceCard: {
      marginBottom: 0,
    },
    resourceTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    resourceContent: {
      gap: 16,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    contactDetails: {
      flex: 1,
    },
    contactLabel: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 4,
    },
    contactText: {
      fontSize: 14,
      marginBottom: 4,
    },
    contactValue: {
      fontSize: 14,
    },
    faqTriggerText: {
      fontSize: 12,
      fontWeight: '500',
    },
    faqText: {
      fontSize: 12,
      lineHeight: 20,
    },
    successAlert: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    bottomPadding: {
      height: 80, // Increased padding to ensure content is visible above semi bottom bar
    },
  });
}
