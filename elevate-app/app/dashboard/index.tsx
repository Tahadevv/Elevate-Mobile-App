import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarSchedule from '../../components/dashboardItems/calender';
import DashboardIndustries from '../../components/dashboardItems/DashboardIndustries';
import Sidebar from '../../components/dashboardItems/sidebar';
import Topbar from '../../components/dashboardItems/topbar';
import SemiBottomBar from '../../components/screens/semibottombar';
import { useColors } from '../../components/theme-provider';

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;

  const styles = createStyles(colors, insets, sidebarOpen, isMobile);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      {/* Topbar */}
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <View style={styles.mainContainer}>
        {/* Sidebar */}
        <View 
          style={styles.sidebarContainer}
          pointerEvents={isMobile && !sidebarOpen ? 'none' : 'auto'}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onStateChange={setSidebarOpen}
            currentPage="dashboard"
          />
        </View>

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

            {/* Calendar Section */}
            <View style={styles.calendarSection}>
              <View style={styles.calendarHeader}>
                <Text style={[styles.calendarTitle, { color: colors.foreground }]}>Calendar</Text>
              </View>
              <CalendarSchedule />
            </View>
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
  sidebarContainer: {
    width: isMobile ? (sidebarOpen ? 280 : 0) : 280,
    ...(isMobile && {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: sidebarOpen ? 1000 : -1,
      elevation: sidebarOpen ? 5 : 0,
      overflow: 'hidden',
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
