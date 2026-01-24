import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { BackHandler, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarSchedule from '../../components/dashboardItems/calender';
import DashboardIndustries from '../../components/dashboardItems/DashboardIndustries';
import Sidebar from '../../components/dashboardItems/sidebar';
import Topbar from '../../components/dashboardItems/topbar';
import SemiBottomBar from '../../components/screens/semibottombar';
import { useColors } from '../../components/theme-provider';
import { useAppSelector } from '../../store/hooks';

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;
  const router = useRouter();
  
  // Get industries loading state to conditionally show calendar
  const { isLoadingPaid } = useAppSelector((state: any) => state.dashboard);

  // Prevent back button from going to welcome/login screen when on dashboard home
  // Since this is dashboard/index.tsx, we're always on the dashboard home screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Prevent default back behavior - stay on dashboard home
        // This prevents going back to login/welcome screen
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  const styles = createStyles(colors, insets, sidebarOpen, isMobile);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      {/* Topbar */}
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Overlay - Click outside to close sidebar */}
      {isMobile && sidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setSidebarOpen(false)}
          activeOpacity={1}
        />
      )}

      {/* Sidebar - Positioned outside mainContainer to start from top */}
      {isMobile && (
        <View 
          style={styles.sidebarContainer}
          pointerEvents={sidebarOpen ? 'auto' : 'none'}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onStateChange={setSidebarOpen}
            currentPage="dashboard"
          />
        </View>
      )}

      <View style={styles.mainContainer}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <View 
            style={styles.sidebarContainer}
            pointerEvents="auto"
          >
            <Sidebar
              isOpen={true}
              onStateChange={setSidebarOpen}
              currentPage="dashboard"
            />
          </View>
        )}

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Industries Section */}
            <View style={styles.industriesSection}>
              <DashboardIndustries />
            </View>

            {/* Calendar Section - Only show after industries are loaded */}
            {!isLoadingPaid && (
            <View style={styles.calendarSection}>
              <View style={styles.calendarHeader}>
                <Text style={[styles.calendarTitle, { color: colors.foreground }]}>Calendar</Text>
              </View>
              <CalendarSchedule />
            </View>
            )}
          </ScrollView>
        </View>
      </View>
      <SemiBottomBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}

const createStyles = (colors: any, insets: any, sidebarOpen: boolean, isMobile: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  sidebarContainer: {
    ...(isMobile ? {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 280,
      zIndex: sidebarOpen ? 1000 : -1,
      elevation: sidebarOpen ? 5 : 0,
      overflow: 'hidden',
    } : {
      width: 280,
    }),
  },
  contentContainer: {
    flex: 1,
    marginLeft: isMobile ? 0 : 280,
    zIndex: isMobile && !sidebarOpen ? 1 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Add extra padding for bottom navigation bar
  },
  industriesSection: {
    marginBottom: 32,
  },
  calendarSection: {
    marginTop: 24,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    paddingBottom: 80, // Add padding to account for bottom navigation bar
  },
});
