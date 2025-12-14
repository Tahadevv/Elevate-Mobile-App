import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../../../components/theme-provider';

export default function TutorialScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tutorial');
  const colors = useColors();
  const router = useRouter();

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Navigate to the corresponding course page
    switch (tabName) {
      case 'course-details':
        router.push('/course/course-details');
        break;
      case 'notes':
        router.push('/course/notes');
        break;
      case 'tutorial':
        router.push('/course/tutorial');
        break;
      case 'result':
        router.push('/course/result');
        break;
      case 'assessment':
        router.push('/course/Information-Mock-Assessment');
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      
      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { marginLeft: sidebarOpen ? 300 : 0 }
      ]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Heading */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Getting Started with Elevate Exams
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Learn how to make the most of your learning experience
            </Text>
          </View>

          {/* Video Container */}
          <View style={[styles.videoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={64} color={colors.muted} />
              <Text style={[styles.videoText, { color: colors.muted }]}>
                Tutorial Video
              </Text>
              <Text style={[styles.videoSubtext, { color: colors.muted }]}>
                https://www.youtube.com/embed/25cpx_ThZhg
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Welcome to Elevate Exams
              </Text>
              <Text style={[styles.sectionText, { color: colors.muted }]}>
                Elevate Exams is your comprehensive platform for exam preparation and learning. Our platform combines
                interactive flashcards, practice tests, and detailed analytics to help you achieve your learning goals.
              </Text>
            </View>

            {/* Key Features Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Key Features
              </Text>
              <View style={styles.featuresGrid}>
                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    Interactive Flashcards
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Create and study with interactive flashcards that adapt to your learning pace.
                  </Text>
                </View>
                
                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    Practice Tests
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Take practice tests to assess your knowledge and identify areas for improvement.
                  </Text>
                </View>
                
                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    Progress Tracking
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Monitor your progress with detailed analytics and performance metrics.
                  </Text>
                </View>
                
                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    AI-Powered Learning
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Get personalized recommendations and assistance from our AI learning assistant.
                  </Text>
                </View>
              </View>
            </View>

            {/* Getting Started Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Getting Started
              </Text>
              <View style={styles.gettingStarted}>
                <Text style={[styles.gettingStartedText, { color: colors.muted }]}>
                  To begin your learning journey:
                </Text>
                <View style={styles.stepsList}>
                  <View style={styles.stepItem}>
                    <Text style={[styles.stepNumber, { color: colors.foreground }]}>1.</Text>
                    <Text style={[styles.stepText, { color: colors.muted }]}>
                      Browse and select your course from the available options
                    </Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={[styles.stepNumber, { color: colors.foreground }]}>2.</Text>
                    <Text style={[styles.stepText, { color: colors.muted }]}>
                      Start with the flashcards to build your foundation
                    </Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={[styles.stepNumber, { color: colors.foreground }]}>3.</Text>
                    <Text style={[styles.stepText, { color: colors.muted }]}>
                      Take practice tests to assess your understanding
                    </Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={[styles.stepNumber, { color: colors.foreground }]}>4.</Text>
                    <Text style={[styles.stepText, { color: colors.muted }]}>
                      Review your performance and focus on areas that need improvement
                    </Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={[styles.stepNumber, { color: colors.foreground }]}>5.</Text>
                    <Text style={[styles.stepText, { color: colors.muted }]}>
                      Use the AI assistant for personalized help and guidance
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 8,
  },
  header: {
    marginBottom: 32,
    maxWidth: 896,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  videoContainer: {
    height: 0,
    paddingBottom: '56.25%',
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 32,
    overflow: 'hidden',
    maxWidth: 896,
    alignSelf: 'center',
    width: '100%',
  },
  videoPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  videoText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoSubtext: {
    fontSize: 12,
    opacity: 0.7,
  },
  content: {
    maxWidth: 896,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    padding: 16,
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
  gettingStarted: {
    gap: 16,
  },
  gettingStartedText: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepsList: {
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 20,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
});
