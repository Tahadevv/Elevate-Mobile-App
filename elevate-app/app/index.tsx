import SplashScreen from '@/components/screens/SplashScreen';
import { fetchPaidIndustries } from '@/store/slices/dashboardSlice';
import { fetchEvents } from '@/store/slices/eventsSlice';
import { fetchNotes } from '@/store/slices/notesSlice';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import API_CONFIG from '../config.api';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state: any) => state.auth);
  const { isLoadingPaid: isLoadingIndustries, paidIndustries } = useSelector((state: any) => state.dashboard);

  // Check if industries already exist in Redux (from previous session) - memoized to prevent infinite loops
  const hasIndustriesData = useMemo(() => {
    return paidIndustries && Array.isArray(paidIndustries) && paidIndustries.length > 0;
  }, [paidIndustries]);

  // Fetch all data during splash screen animation if user is authenticated and data doesn't exist
  useEffect(() => {
    if (isAuthenticated && token) {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      
      // Only fetch if data doesn't exist in Redux
      if (!hasIndustriesData) {
        console.log('🚀 Fetching initial data during splash screen...');
        dispatch(fetchPaidIndustries(authToken) as any);
        dispatch(fetchEvents(authToken) as any);
        dispatch(fetchNotes(authToken) as any);
      } else {
        console.log('✅ Industries data already exists in Redux, skipping fetch');
      }
    }
  }, [isAuthenticated, token, dispatch, hasIndustriesData]);

  const handleSplashComplete = () => {
    // Mark animation as complete
    setSplashAnimationComplete(true);
  };

  // Navigate logic: if data exists, navigate immediately. Otherwise wait for loading to complete
  useEffect(() => {
    if (splashAnimationComplete) {
      if (isAuthenticated && token) {
        // If industries data already exists in Redux (from previous session), navigate immediately
        if (hasIndustriesData) {
          console.log('✅ Industries data already exists in Redux, navigating immediately...');
          setShowSplash(false);
        } 
        // Otherwise wait for loading to complete
        else if (!isLoadingIndustries) {
          console.log('✅ Industries loading complete, navigating to dashboard...');
          setShowSplash(false);
        }
      } else {
        // Not authenticated, navigate immediately to login
        setShowSplash(false);
      }
    }
  }, [splashAnimationComplete, isLoadingIndustries, hasIndustriesData, isAuthenticated, token]);

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
