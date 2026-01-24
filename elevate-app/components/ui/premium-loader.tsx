import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../theme-provider';

interface PremiumLoaderProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export function PremiumLoader({ text, size = 'large' }: PremiumLoaderProps) {
  const animationRef = useRef<LottieView>(null);
  const colors = useColors();

  useEffect(() => {
    // Start animation when component mounts
    try {
      animationRef.current?.play();
    } catch (error) {
      console.error('Error playing animation:', error);
    }
  }, []);

  const animationSize = size === 'small' ? 200 : size === 'medium' ? 300 : 400;

  // Import animation source safely
  let animationSource;
  try {
    animationSource = require('../../assets/animated-splash/elevateExams.json');
  } catch (error) {
    console.error('Error loading animation:', error);
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.animationContainer}>
          {text && (
            <View style={styles.textContainer}>
              <Text style={[styles.text, { color: colors.foreground }]}>{text}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Premium blur overlay backdrop */}
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} style={styles.blurOverlay}>
          <View style={[styles.overlay, { backgroundColor: colors.background, opacity: 0.3 }]} />
        </BlurView>
      ) : (
        <View style={[styles.overlay, { backgroundColor: colors.background, opacity: 0.95 }]} />
      )}
      
      {/* Lottie Animation Container */}
      <View style={styles.animationContainer}>
        <View style={styles.animationWrapper}>
          <LottieView
            ref={animationRef}
            source={animationSource}
            style={[styles.animation, { width: animationSize, height: animationSize }]}
            autoPlay
            loop={true}
            resizeMode="contain"
          />
        </View>
        {text && (
          <View style={styles.textContainer}>
            <Text style={[styles.text, { color: colors.foreground }]}>{text}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: '25%',
    zIndex: 9999,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  animationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  animation: {
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: -85,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

