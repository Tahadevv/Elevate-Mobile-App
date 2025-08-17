import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function OnboardingScreen2({ onNext, onPrevious }: OnboardingScreen2Props) {
  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            We Provide The Best Courses Of{' '}
            <Text style={styles.highlight}>Multiple Domains</Text>
          </Text>
        </View>
        
        <Text style={styles.description}>
          Discover a structured learning path that guides you from beginner to advanced programming concepts.
        </Text>

        {/* Course Cards - Exact same layout as Next.js */}
        <View style={styles.coursesSection}>
          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>Programming Basic</Text>
            <View style={styles.courseArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>

          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>Get A Helpful Roadmap</Text>
            <View style={styles.courseArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>

          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>Build Tool With Logic</Text>
            <View style={styles.courseArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>

          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>Computer Science</Text>
            <View style={styles.courseArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>

          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>Data Structure</Text>
            <View style={styles.courseArrow}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>
        </View>

        {/* Benefits Section - Matching Next.js style */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Key Benefits</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitNumberContainer}>
                <Text style={styles.benefitNumber}>25x</Text>
                <Text style={styles.benefitText}>Cheaper Than Other Platforms</Text>
              </View>
            </View>
            
            <View style={styles.benefitSeparator} />
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitNumberContainer}>
                <Text style={styles.benefitNumber}>380+</Text>
                <Text style={styles.benefitText}>Mentors Join Encode</Text>
              </View>
            </View>
            
            <View style={styles.benefitSeparator} />
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitNumberContainer}>
                <Text style={styles.benefitNumber}>100%</Text>
                <Text style={styles.benefitText}>Lifetime Guarantee</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.paginationContainer}>
          <View style={styles.paginationDot} />
          <View style={[styles.paginationDot, styles.paginationDotActive]} />
          <View style={styles.paginationDot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background like Next.js
    paddingHorizontal: 32, // px-8 equivalent
    paddingTop: 28, // py-12 equivalent
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1f2937', // text-gray-800 from Next.js
    textAlign: 'center',
    lineHeight: 34,
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
    fontSize: 14,
    color: '#6b7280', // text-gray-500 from Next.js
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
    paddingHorizontal: 12,
    fontWeight: '400',
  },
  coursesSection: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 2,
  },
  courseCard: {
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
  courseTitle: {
    fontSize: 14, // text-sm from Next.js
    fontWeight: '600',
    color: '#1f2937', // text-gray-800 from Next.js
    flex: 1,
  },
  courseArrow: {
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
  benefitsSection: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937', // text-gray-800 from Next.js
    textAlign: 'center',
    marginBottom: 8,
  },
  benefitsList: {
    gap: 4, // space-y-4 equivalent
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 0, // No border radius like Next.js
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  benefitNumberContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  benefitNumber: {
    fontSize: 20, // text-xl from Next.js
    fontWeight: 'bold',
    color: '#475569', // text-slate-700 from Next.js
  },
  benefitText: {
    fontSize: 14, // text-sm from Next.js
    color: '#64748b', // text-slate-500 from Next.js
    marginLeft: 8, // ml-2 equivalent
  },
  benefitSeparator: {
    height: 1,
    backgroundColor: '#000000', // border-black from Next.js
    marginVertical: 4, // py-3 equivalent
  },
  benefitIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981', // emerald-500
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitIconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomContainer: {
    paddingBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  previousButton: {
    backgroundColor: '#f3f4f6', // bg-gray-100 from Next.js
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
  },
  previousButtonText: {
    color: '#374151', // text-gray-700 from Next.js
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  nextButton: {
    backgroundColor: '#2563eb', // bg-blue-600 from Next.js
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 13,
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
    backgroundColor: '#d1d5db', // bg-gray-300 from Next.js
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#2563eb', // bg-blue-600 from Next.js
    width: 20,
  },
});
