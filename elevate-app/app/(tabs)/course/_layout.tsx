import { Ionicons } from '@expo/vector-icons';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CourseSidebar from '../../../components/CourseSidebar';
import Topbar from '../../../components/dashboardItems/topbar';
import { useColors } from '../../../components/theme-provider';
import { useAppSelector } from '../../../store/hooks';

const { width } = Dimensions.get('window');

export default function CourseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('course-details');
  const colors = useColors();
  const router = useRouter();
  // Get courseId from global search params (passed when navigating to course pages)
  const globalParams = useGlobalSearchParams<{ courseId?: string }>();
  // Also try to get from Redux courseDetails as fallback
  const { courseDetails } = useAppSelector((state: any) => state.courseDetails);
  // Use courseId from params, or from courseDetails, or undefined
  const courseId = globalParams.courseId || courseDetails?.id?.toString();

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);
      if (isMobileDevice) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    Dimensions.addEventListener('change', checkScreenSize);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleNavigate = (route: string, params?: { courseId?: string }) => {
    if (route.startsWith('/')) {
      const navigationParams = params || (courseId ? { courseId } : {});
      router.push({
        pathname: route,
        params: navigationParams,
      } as any);
    }
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Navigate to the corresponding course page with courseId
    const params = courseId ? { courseId } : {};
    
    switch (tabName) {
      case 'course-details':
        router.push({
          pathname: '/course/course-details',
          params,
        } as any);
        break;
      case 'notes':
        router.push({
          pathname: '/course/notes',
          params,
        } as any);
        break;
      case 'flashcards':
        router.push({
          pathname: '/course/pages/flashcards',
          params,
        } as any);
        break;
      case 'quiz':
        router.push({
          pathname: '/course/pages/exam',
          params,
        } as any);
        break;
      case 'analytics':
        router.push({
          pathname: '/course/result/stats',
          params,
        } as any);
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Topbar */}
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <CourseSidebar onNavigate={handleNavigate} courseId={courseId} isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="course-details" />
          <Stack.Screen name="notes" />
          <Stack.Screen name="tutorial" />
          <Stack.Screen name="result" />
          <Stack.Screen name="Information-Mock-Assessment" />
          <Stack.Screen name="result/stats" />
          <Stack.Screen name="result/quiz-analytics" />
          <Stack.Screen name="result/test-analytics" />
          <Stack.Screen name="Information-Mock-Assessment/assesment" />
          <Stack.Screen name="pages/chapters" />
          <Stack.Screen name="pages/flashcards" />
          <Stack.Screen name="pages/exam" />
          <Stack.Screen name="pages/test" />
          <Stack.Screen name="pages/test-analytics" />
          <Stack.Screen name="pages/build-your-own" />
          <Stack.Screen name="pages/assessment-result" />
        </Stack>
      </View>

      {/* Custom Course Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={[styles.bottomBarContent, { paddingBottom: isMobile ? 20 : 0 }]}>
        {[
          { key: 'course-details', name: 'Course', icon: 'book' },
          { key: 'notes', name: 'Notes', icon: 'create' },
          { key: 'flashcards', name: 'Flashcards', icon: 'layers' },
          { key: 'quiz', name: 'Quiz', icon: 'help-circle' },
          { key: 'analytics', name: 'Progress', icon: 'trending-up' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.tab}
            onPress={() => handleTabPress(item.key)}
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              color={
                activeTab === item.key
                  ? colors.yellow
                  : colors.foreground
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === item.key
                      ? colors.yellow
                      : colors.foreground,
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
        </View>
      </View>
      
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    // marginLeft will be set dynamically based on sidebar state
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
});
