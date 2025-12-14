import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import OnboardingScreen1 from './OnboardingScreen1';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';
import SplashScreen from './SplashScreen';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'screen1' | 'screen2' | 'screen3'>('splash');
  const router = useRouter();

  const handleSplashComplete = () => {
    setCurrentScreen('screen1');
  };

  const handleScreen1Next = () => {
    setCurrentScreen('screen2');
  };

  const handleScreen2Next = () => {
    setCurrentScreen('screen3');
  };

  const handleScreen2Previous = () => {
    setCurrentScreen('screen1');
  };

  const handleScreen3Previous = () => {
    setCurrentScreen('screen2');
  };

  const handleGetStarted = () => {
    // Navigate directly to dashboard instead of calling onComplete
    router.push('/dashboard' as any);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'screen1':
        return <OnboardingScreen1 onNext={handleScreen1Next} />;
      case 'screen2':
        return (
          <OnboardingScreen2
            onNext={handleScreen2Next}
            onPrevious={handleScreen2Previous}
          />
        );
      case 'screen3':
        return (
          <OnboardingScreen3
            onPrevious={handleScreen3Previous}
            onGetStarted={handleGetStarted}
          />
        );
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
