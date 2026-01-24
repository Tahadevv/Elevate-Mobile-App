import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Start animation when component mounts
    animationRef.current?.play();

    // Auto-advance after animation duration (180 frames / 30 fps = 6 seconds)
    // The onAnimationFinish callback will also handle completion
    const timer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../../assets/animated-splash/elevateExams.json')}
        style={styles.animation}
        autoPlay
        loop={false}
        resizeMode="contain"
        onAnimationFinish={onComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  animation: {
    width: width,
    height: height,
  },
});
