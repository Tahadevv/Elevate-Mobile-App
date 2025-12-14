import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Logo from '../../assets/images/logo.svg';

const { width } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext: () => void;
  onPrevious?: () => void;
}

// Animated Counter Component
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  style?: any;
}

function AnimatedCounter({ value, duration = 2000, delay = 0, style }: AnimatedCounterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: value,
        duration: duration,
        useNativeDriver: false,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, duration, delay]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value: animatedVal }) => {
      setDisplayValue(Math.floor(animatedVal));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  return (
    <Text style={style}>
      {displayValue}<Text style={styles.metricPlus}> +</Text>
    </Text>
  );
}

export default function OnboardingScreen2({ onNext, onPrevious }: OnboardingScreen2Props) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Logo 
        width={Math.min(240, width * 0.7)} 
        height={60} 
        style={styles.logo}
      />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Achieve <Text style={styles.highlight}>Your Goals</Text>{'\n'}With Encode
        </Text>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
        </Text>

        {/* Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <AnimatedCounter 
              value={789} 
              duration={2000} 
              delay={500} 
              style={styles.metricNumber} 
            />
            <Text style={styles.metricLabel}>Creative Events</Text>
          </View>
          <View style={styles.metricItem}>
            <AnimatedCounter 
              value={387} 
              duration={2000} 
              delay={1000} 
              style={styles.metricNumber} 
            />
            <Text style={styles.metricLabel}>Online Courses</Text>
          </View>
          <View style={styles.metricItem}>
            <AnimatedCounter 
              value={2183} 
              duration={2000} 
              delay={1500} 
              style={styles.metricNumber} 
            />
            <Text style={styles.metricLabel}>People Worldwide</Text>
          </View>
        </View>
      </View>

      {/* Bottom Next Button matching Screen1 style */}
      <ButtonWithOffsetShadow label="Next" onPress={onNext} />
    </View>
  );
}

interface ButtonProps { label: string; onPress: () => void }
function ButtonWithOffsetShadow({ label, onPress }: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <View style={styles.buttonWrapper}>
      <View style={[styles.buttonShadow, isPressed ? styles.buttonShadowPressed : undefined]} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'left',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  highlight: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 18,
    paddingRight: 12,
    fontWeight: '400',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  metricItem: { width: '32%' },
  metricNumber: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  metricPlus: { color: '#7c3aed', fontWeight: '700' },
  metricLabel: { marginTop: 6, fontSize: 12, color: '#6b7280' },

  // Button styles copied from Screen1
  buttonWrapper: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: '10%',
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
  buttonShadowPressed: { transform: [{ translateX: -8 }, { translateY: 8 }] },
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
  ctaPressed: { opacity: 0.9 },
  ctaText: { color: '#FFFFFF', fontWeight: '700' },
});
