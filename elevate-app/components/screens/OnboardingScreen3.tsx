import React, { useState } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../../assets/images/logo.svg';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen3Props {
  onPrevious: () => void;
  onGetStarted: () => void;
}

export default function OnboardingScreen3({ onPrevious, onGetStarted }: OnboardingScreen3Props) {
  // State to track which accordion is open (only one at a time)
  const [openAccordion, setOpenAccordion] = useState<number | null>(0); // First one open by default
  const insets = useSafeAreaInsets();

  // Topics data with descriptions
  const topics = [
    {
      title: "Programming Basic",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cum sociis natoque penatibus consectetuer adipiscing elit.",
    },
    {
      title: "Get A Helpful Roadmap",
      description: "Discover a structured learning path that guides you from beginner to advanced programming concepts. Our roadmap is designed to help you progress efficiently through your learning journey.",
    },
    {
      title: "Build Tool With Logic",
      description: "Learn how to create practical tools and applications by applying logical thinking and programming principles. This hands-on approach will strengthen your problem-solving abilities.",
    },
    {
      title: "Computer Science",
      description: "Explore fundamental computer science concepts including algorithms, data structures, and computational thinking. Understanding these principles will make you a more effective programmer.",
    },
    {
      title: "Data Structure",
      description: "Master essential data structures like arrays, linked lists, trees, and graphs. Learn when and how to implement each structure to optimize your code for different scenarios.",
    },
  ];

  // Toggle accordion open/close (only one at a time)
  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const styles = createStyles(insets);

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <View style={styles.backgroundGradient} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Container - Centered */}
        <View style={styles.logoContainer}>
          <Logo 
            width={Math.min(240, width * 0.7)} 
            height={60} 
            style={styles.logo}
          />
          </View>
        
        {/* FAQ Section - Center */}
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>
            We Also Provide <Text style={styles.highlight}>Online Programming Videos</Text>
          </Text>
          
          <View style={styles.faqContent}>
            {topics.map((topic, index) => (
              <View key={index} style={styles.accordionItem}>
                <TouchableOpacity 
                  style={[
                    styles.accordionHeader,
                    openAccordion === index && styles.accordionHeaderActive
                  ]}
                  onPress={() => toggleAccordion(index)}
                >
                  <Text style={styles.accordionTitle}>{topic.title}</Text>
                  <Text style={styles.accordionIcon}>
                    {openAccordion === index ? '▼' : '▶'}
        </Text>
                </TouchableOpacity>
                
                {openAccordion === index && (
                  <Animated.View style={styles.accordionContent}>
                    <Text style={styles.accordionDescription}>{topic.description}</Text>
                  </Animated.View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

        {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <ButtonWithOffsetShadow label="Get Started" onPress={onGetStarted} styles={styles} />
      </View>
    </View>
  );
}

interface ButtonProps {
  label: string;
  onPress: () => void;
}

function ButtonWithOffsetShadow({ label, onPress, styles }: ButtonProps & { styles: any }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.buttonWrapper}>
      <View
        style={[
          styles.buttonShadow,
          isPressed ? styles.buttonShadowPressed : undefined,
        ]}
      />
      <Pressable
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={({ pressed }) => [styles.cta, pressed ? styles.ctaPressed : undefined]}
      >
        <Text style={styles.ctaText}>{label}</Text>
      </Pressable>
    </View>
  );
}

function createStyles(insets: any) {
  return StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#FDFBFB', // Light gray background like website
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32 + insets.bottom, // Account for semi bottom bar height
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
    marginTop: height * 0.08,
    marginBottom: 10,
  },
  logo: {
    alignSelf: 'center',
  },
  faqContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 30,
  },
  faqContent: {
    marginBottom: 40,
  },
  accordionItem: {
    marginBottom: 8,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#1F2937', // Dark gray border like the original
  },
  accordionHeaderActive: {
    borderColor: '#1F2937',
    backgroundColor: 'white',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937', // Dark gray text
    flex: 1,
  },
  accordionIcon: {
    fontSize: 16,
    color: '#3B82F6', // Blue color for arrow
    marginLeft: 8,
  },
  accordionContent: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 12,
  },
  accordionDescription: {
    fontSize: 12,
    color: '#6B7280', // Gray text color
    lineHeight: 18,
  },
  highlight: {
    backgroundColor: '#FCE7F3', // pink-200 like website
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bottomContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: '10%', // 90% of screen height
  },
  buttonWrapper: {
    alignSelf: 'stretch',
    position: 'relative',
  },
  buttonShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    transform: [{ translateX: -5 }, { translateY: 5 }],
  },
  buttonShadowPressed: {
    transform: [{ translateX: -8 }, { translateY: 8 }],
  },
  cta: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 2,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: { 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },
});
}
