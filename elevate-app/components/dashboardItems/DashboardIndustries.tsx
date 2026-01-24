import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import API_CONFIG from '../../config.api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPaidIndustries } from '../../store/slices/dashboardSlice';
import { useColors } from '../theme-provider';
import { DashboardPremiumLoader } from '../ui/dashboard-premium-loader';
import PaidIndustriesComponent from './PaidIndustriesComponent';

export default function DashboardIndustries() {
  const dispatch = useAppDispatch();
  const { 
    paidIndustries, 
    isLoadingPaid,
    paidError
  } = useAppSelector((state: any) => state.dashboard);
  const { token } = useAppSelector((state: any) => state.auth);
  const colors = useColors();

  // Fetch paid industries on mount and when token changes
  useEffect(() => {
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    dispatch(fetchPaidIndustries(authToken) as any);
  }, [token, dispatch]);

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {isLoadingPaid ? (
          <View style={styles.loadingContainer}>
          <DashboardPremiumLoader size="large" text="Please wait while we prepare your courses..." />
          </View>
        ) : paidError ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>{paidError}</Text>
          </View>
        ) : (
          <PaidIndustriesComponent industries={paidIndustries || []} />
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
  },
});

