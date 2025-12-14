import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import SplashScreen from '@/components/screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const { isAuthenticated, token } = useSelector((state: any) => state.auth);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (!showSplash) {
      // After splash, check authentication status
      if (isAuthenticated && token) {
        // User is authenticated, navigate to dashboard (home page)
        router.replace('/dashboard');
      } else {
        // User is not authenticated, navigate to login
        router.replace('/auth/login');
      }
    }
  }, [showSplash, isAuthenticated, token]);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <SplashScreen onComplete={handleSplashComplete} />
      </View>
    );
  }

  // This will be replaced by navigation, but we need to return something
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
