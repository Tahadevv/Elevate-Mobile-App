import {
    CheckCircle2,
    Mail,
    MessageSquare,
    Phone
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Sidebar from '../dashboardItems/sidebar';
import Topbar from '../dashboardItems/topbar';
import { useColors } from '../theme-provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordioncustom';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

export default function HelpCenterScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("technical");
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const colors = useColors();

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Topbar */}
      <Topbar />
      
      {/* Sidebar */}
      <Sidebar onStateChange={setSidebarOpen} currentPage="help" />
      
      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { marginLeft: sidebarOpen ? 256 : 0 }
      ]}>
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
                    {submitted ? (
                      <Alert variant="default" style={styles.successAlert}>
                        <CheckCircle2 size={16} color={colors.success} />
                        <AlertTitle>Message Sent!</AlertTitle>
                        <AlertDescription>
                          Thank you for reaching out. Our support team will get back to you within 24 hours.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <View style={styles.form}>
                        <View style={styles.formField}>
                          <Label>Your Email</Label>
                          <Input 
                            placeholder="mk0906145@gmail.com" 
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        </View>

                        <View style={styles.formField}>
                          <Label>Topic</Label>
                          <Select 
                            value={selectedTopic}
                            onValueChange={(value) => setSelectedTopic(value)}
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
                          <Input placeholder="Brief description of your issue" />
                        </View>

                        <View style={styles.formField}>
                          <Label>Message</Label>
                          <Textarea
                            placeholder="Please describe your issue in detail"
                            style={styles.messageTextarea}
                          />
                        </View>

                        <View style={styles.submitSection}>
                          <Button 
                            onPress={handleSubmit} 
                            disabled={loading}
                            style={styles.submitButton}
                          >
                            {loading ? "Sending..." : "Send Message"}
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
                            1. Click on the "Forgot Password" link on the login page{'\n'}
                            2. Enter the email address associated with your account{'\n'}
                            3. Check your email for a password reset link{'\n'}
                            4. Click the link and follow the instructions to create a new password{'\n\n'}
                            If you don't receive the email within 5 minutes, check your spam folder or contact support.
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
                            2. Click on 'My Profile' in the navigation menu{'\n'}
                            3. Select the 'Certificates' tab{'\n'}
                            4. Here you'll find all certificates for completed courses{'\n\n'}
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
                            2. Click on the 'Billing' tab{'\n'}
                            3. Under 'Payment Methods', click 'Edit' next to your current payment method{'\n'}
                            4. Enter your new payment details and click "Save"{'\n\n'}
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
                            • Within each course, you'll see checkmarks next to completed lessons{'\n'}
                            • The 'My Learning' section provides detailed progress reports{'\n\n'}
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
      height: 24,
    },
  });
}
