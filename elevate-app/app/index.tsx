"use client"
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import OnboardingFlow from '../components/screens/OnboardingFlow';
import { ThemeProvider } from '../components/theme-provider';
import Home from './home';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <ThemeProvider>
      {showOnboarding ? (
        <View style={styles.container}>
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </View>
      ) : (
        <Home />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
