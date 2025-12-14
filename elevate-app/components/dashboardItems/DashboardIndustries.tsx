import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import API_CONFIG from '../../config.api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPaidIndustries, fetchUnpaidIndustries } from '../../store/slices/dashboardSlice';
import { useColors } from '../theme-provider';
import { DotLoader } from '../ui/dot-loader';
import PaidIndustriesComponent from './PaidIndustriesComponent';
import UnpaidIndustriesComponent from './UnpaidIndustriesComponent';

export default function DashboardIndustries() {
  const [activeTab, setActiveTab] = useState<'paid' | 'unpaid'>('paid');
  const dispatch = useAppDispatch();
  const { 
    paidIndustries, 
    unpaidIndustries, 
    isLoading, 
    isLoadingPaid,
    isLoadingUnpaid,
    error,
    paidError,
    unpaidError
  } = useAppSelector((state: any) => state.dashboard);
  const { token } = useAppSelector((state: any) => state.auth);
  const colors = useColors();

  // Fetch data on mount and when token changes
  useEffect(() => {
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    dispatch(fetchPaidIndustries(authToken) as any);
    dispatch(fetchUnpaidIndustries(authToken) as any);
  }, [token, dispatch]);

  // Refresh data when tab changes
  const handleTabChange = (tab: 'paid' | 'unpaid') => {
    setActiveTab(tab);
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    
    // Refresh the data for the selected tab
    if (tab === 'paid') {
      dispatch(fetchPaidIndustries(authToken) as any);
    } else {
      dispatch(fetchUnpaidIndustries(authToken) as any);
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'paid' && styles.activeTab]}
          onPress={() => handleTabChange('paid')}
        >
          <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>
            Paid Industries
          </Text>
          {activeTab === 'paid' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unpaid' && styles.activeTab]}
          onPress={() => handleTabChange('unpaid')}
        >
          <Text style={[styles.tabText, activeTab === 'unpaid' && styles.activeTabText]}>
            Unpaid Industries
          </Text>
          {activeTab === 'unpaid' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'paid' ? (
        isLoadingPaid ? (
          <View style={styles.loadingContainer}>
            <DotLoader size="large" color={colors.primary} text="Loading paid industries..." />
          </View>
        ) : paidError ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>{paidError}</Text>
          </View>
        ) : (
          <PaidIndustriesComponent industries={paidIndustries || []} />
        )
      ) : (
        isLoadingUnpaid ? (
          <View style={styles.loadingContainer}>
            <DotLoader size="large" color={colors.primary} text="Loading unpaid industries..." />
          </View>
        ) : unpaidError ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>{unpaidError}</Text>
          </View>
        ) : (
          <UnpaidIndustriesComponent industries={unpaidIndustries || []} />
        )
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: colors.foreground,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.yellow || '#ffd404',
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

