import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen3Props {
  onPrevious: () => void;
  onGetStarted: () => void;
}

export default function OnboardingScreen3({ onPrevious, onGetStarted }: OnboardingScreen3Props) {
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
          Ready to Start Your{' '}
              <Text style={styles.highlight}>Coding Journey</Text>?
        </Text>
          </View>
        
        <Text style={styles.description}>
            Join thousands of students who have already transformed their careers with our comprehensive programming courses.
          </Text>

          {/* Course Showcase */}
          

          {/* Testimonials */}
          <View style={styles.testimonials}>
            <Text style={styles.sectionTitle}>
              What Our <Text style={styles.highlight}>Students Say</Text>
        </Text>

            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>JS</Text>
                </View>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>John Smith</Text>
                  <Text style={styles.testimonialRole}>Software Developer</Text>
                </View>
                <View style={styles.testimonialRating}>
                  <Text style={styles.stars}>★★★★★</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "The course structure is excellent and the instructors are incredibly knowledgeable. 
                I went from beginner to landing my first developer job in just 6 months!"
              </Text>
            </View>

            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>SM</Text>
                </View>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>Sarah Miller</Text>
                  <Text style={styles.testimonialRole}>Frontend Developer</Text>
                </View>
                <View style={styles.testimonialRating}>
                  <Text style={styles.stars}>★★★★★</Text>
          </View>
          </View>
              <Text style={styles.testimonialText}>
                "Hands-on projects and real-world examples made learning so much easier. 
                The community support is amazing too!"
              </Text>
          </View>
        </View>

          {/* Final Stats */}
          <View style={styles.finalStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2M+</Text>
              <Text style={styles.statLabel}>Students Worldwide</Text>
          </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
          </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>
      </View>

        {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
              <View style={styles.previousButtonShadow} />
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
              <View style={styles.getStartedButtonShadow} />
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.paginationContainer}>
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
          <View style={[styles.paginationDot, styles.paginationDotActive]} />
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B', // slate-800
    textAlign: 'center',
    marginBottom: 20,
  },
  courseShowcase: {
    marginBottom: 40,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate-200
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  courseImage: {
    height: 100,
    backgroundColor: '#F1F5F9', // slate-100
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6', // blue-500
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  playIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 1,
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B', // slate-800
    marginBottom: 6,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#64748B', // slate-500
    marginBottom: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#F59E0B', // amber-500
    fontSize: 14,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 10,
    color: '#64748B', // slate-500
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9', // sky-500
  },
  enrollButton: {
    backgroundColor: '#3B82F6', // blue-500
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  testimonials: {
    marginBottom: 40,
  },
  testimonialCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate-200
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCE7F3', // pink-200
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#EC4899', // pink-500
    fontSize: 12,
    fontWeight: '600',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B', // slate-800
    marginBottom: 1,
  },
  testimonialRole: {
    fontSize: 10,
    color: '#64748B', // slate-500
  },
  testimonialRating: {
    marginLeft: 'auto',
  },
  testimonialText: {
    fontSize: 12,
    color: '#475569', // slate-600
    lineHeight: 18,
    fontStyle: 'italic',
  },
  finalStats: {
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
    fontSize: 24,
    fontWeight: '700',
    color: '#000000', // Black color
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: '#000000', // Black color
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomContainer: {
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  previousButton: {
    backgroundColor: '#F1F5F9', // slate-100
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate-200
    position: 'relative',
  },
  previousButtonShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: '#CBD5E1', // slate-300
    borderRadius: 10,
    zIndex: -1,
  },
  previousButtonText: {
    color: '#475569', // slate-600
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  getStartedButton: {
    backgroundColor: '#3B82F6', // blue-500 like website
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
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
  getStartedButtonShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#1E40AF', // blue-700
    borderRadius: 10,
    zIndex: -1,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 14,
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
