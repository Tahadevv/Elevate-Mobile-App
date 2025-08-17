import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen1Props {
  onNext: () => void;
  onPrevious?: () => void;
}

export default function OnboardingScreen1({ onNext }: OnboardingScreen1Props) {
  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <View style={styles.backgroundGradient} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Container */}
       

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Learn <Text style={styles.highlight}>Coding Online</Text> With{' '}
              <Text style={styles.highlight}>Professional Instructors</Text>
            </Text>
          </View>
          
          <Text style={styles.description}>
            Start your coding journey with expert guidance and structured learning paths. 
            Master programming fundamentals with hands-on projects and real-world applications.
          </Text>

          {/* Feature Cards - Vertical layout like OnboardingScreen2 */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Professional Instructors</Text>
            <View style={styles.featureArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Structured Learning</Text>
            <View style={styles.featureArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Hands-on Projects</Text>
            <View style={styles.featureArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>
        </View>
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>25k+</Text>
              <Text style={styles.statLabel}>Active Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100+</Text>
              <Text style={styles.statLabel}>Expert Instructors</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>250+</Text>
              <Text style={styles.statLabel}>Courses Available</Text>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <View style={styles.buttonShadow} />
            <Text style={styles.nextButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <View style={styles.paginationContainer}>
            <View style={[styles.paginationDot, styles.paginationDotActive]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#FDFBFB', // Light gray background like website
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    backgroundColor: '#F8FAFC', // Very light blue-gray
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: 32,
  },
  logoWrapper: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 60,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1E293B', // slate-800
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  highlight: {
    backgroundColor: '#FCE7F3', // pink-200 like website
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  description: {
    fontSize: 16,
    color: '#64748B', // slate-500
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 12,
    fontWeight: '400',
  },
  featuresSection: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1f2937', // border-gray-800 from Next.js
    paddingVertical: 12, // p-3 equivalent
    paddingHorizontal: 12,
    marginBottom: 16, // space-y-4 equivalent
    borderRadius: 0, // No border radius like Next.js
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  featureTitle: {
    fontSize: 14, // text-sm from Next.js
    fontWeight: '600',
    color: '#1f2937', // text-gray-800 from Next.js
    flex: 1,
  },
  featureArrow: {
    width: 20, // h-5 w-5 from Next.js
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#2563eb', // text-blue-600 from Next.js
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000', // Black color
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#000000', // Black color
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomContainer: {
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#3B82F6', // blue-500 like website
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#1E40AF', // blue-700
    borderRadius: 12,
    zIndex: -1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1', // slate-300
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#3B82F6', // blue-500
    width: 24,
  },
});
