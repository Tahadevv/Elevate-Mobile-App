import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../components/theme-provider';

const { width } = Dimensions.get('window');

export default function TutorialPage() {
  const colors = useColors();

  const handleVideoPress = () => {
    // Open YouTube video in browser or app
    Linking.openURL('https://www.youtube.com/watch?v=25cpx_ThZhg');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Heading */}
          <View style={styles.heading}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Getting Started with Elevate Exams
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Learn how to make the most of your learning experience
            </Text>
          </View>

          {/* Video Container */}
          <View style={[styles.videoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.videoPlaceholder}
              onPress={handleVideoPress}
              activeOpacity={0.8}
            >
              <View style={styles.videoContent}>
                <View style={[styles.playButton, { backgroundColor: colors.background }]}>
                  <Ionicons name="play" size={32} color={colors.foreground} />
                </View>
                <Text style={[styles.videoText, { color: colors.muted }]}>
                  Tap to watch tutorial video
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.sections}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Welcome to Elevate Exams
              </Text>
              <Text style={[styles.sectionText, { color: colors.muted }]}>
                Elevate Exams is your comprehensive platform for exam preparation and learning. Our platform combines
                interactive flashcards, practice tests, and detailed analytics to help you achieve your learning goals.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Key Features
              </Text>
              <View style={styles.featuresGrid}>
                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="bookmark" size={24} color={colors.foreground} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    Interactive Flashcards
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Create and study with interactive flashcards that adapt to your learning pace.
                  </Text>
                </View>

                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="help-circle" size={24} color={colors.foreground} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    Practice Tests
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Take practice tests to assess your knowledge and identify areas for improvement.
                  </Text>
                </View>

                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="analytics" size={24} color={colors.foreground} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    Progress Tracking
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Monitor your progress with detailed analytics and performance metrics.
                  </Text>
                </View>

                <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="sparkles" size={24} color={colors.foreground} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                    AI-Powered Learning
                  </Text>
                  <Text style={[styles.featureText, { color: colors.muted }]}>
                    Get personalized recommendations and assistance from our AI learning assistant.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Getting Started
              </Text>
              <View style={styles.gettingStarted}>
                <Text style={[styles.gettingStartedText, { color: colors.muted }]}>
                  To begin your learning journey:
                </Text>
                <View style={styles.stepsList}>
                  {[
                    'Browse and select your course from the available options',
                    'Start with the flashcards to build your foundation',
                    'Take practice tests to assess your understanding',
                    'Review your performance and focus on areas that need improvement',
                    'Use the AI assistant for personalized help and guidance',
                  ].map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={[styles.stepNumber, { backgroundColor: colors.yellow }]}>
                        <Text style={[styles.stepNumberText, { color: colors.background }]}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={[styles.stepText, { color: colors.muted }]}>
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heading: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  videoContainer: {
    marginBottom: 32,
    borderRadius: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
  },
  videoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sections: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
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
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
