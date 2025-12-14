import React, { useState } from 'react';
import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Logo from '../../assets/images/logo.svg';

const { width } = Dimensions.get('window');

interface OnboardingScreen1Props {
  onNext: () => void;
  onPrevious?: () => void;
}

export default function OnboardingScreen1({ onNext }: OnboardingScreen1Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo 
          width={Math.min(240, width * 0.7)} 
          height={60} 
          style={styles.logo}
        />

        <Text style={styles.title}>
          Learn <Text style={styles.titleHighlight}>Coding</Text> <Text style={styles.titleHighlight}>Online</Text>{'\n'}
          With Professional Instructors
        </Text>

        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit ametis consectetur adipiscing elit sedao eiusmod tempor.
        </Text>

        <ButtonWithOffsetShadow label="Get Started" onPress={onNext} />
      </View>
    </SafeAreaView>
  );
}

interface ButtonProps {
  label: string;
  onPress: () => void;
}

function ButtonWithOffsetShadow({ label, onPress }: ButtonProps) {
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 16,
  },
  titleHighlight: {
    backgroundColor: '#fde2e4', // soft pink highlight like screenshot
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  buttonWrapper: {
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: '10%', // ~90% of screen height
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
  ctaText: { color: '#FFFFFF', fontWeight: '700' },
});