import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import API_CONFIG from '../../config.api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDashboardData, fetchDomainsCourses, setSelectedDomain } from '../../store/slices/coursesSlice';
import CalendarSchedule from '../dashboardItems/calender';
import CourseTabs from '../dashboardItems/coursestabs';
import Sidebar from '../dashboardItems/sidebar';
import Topbar from '../dashboardItems/topbar';
import { useColors } from '../theme-provider';

interface Course {
  id: number;
  name: string;
  title?: string;
  category?: string;
  badge?: string;
  progress?: number;
  total?: number;
  icon?: string;
  color?: string;
}

interface Domain {
  id: number;
  name: string;
  courses?: Course[];
  currently_studying?: Course[];
  course_library?: Course[];
  icon?: string;
  color?: string;
}

interface MyCoursesScreenProps {
  onNavigate?: (tabName: string) => void;
}

const industries = [
  "Cyber Security & IT",
  "Finance & Accounting",
  "Healthcare",
  "Engineering",
  "Marketing",
  "Business",
  "Design",
  "Education",
  "Law",
  "Data Science",
  "Project Management",
  "Sales",
  "Hospitality",
  "Language",
  "Personal Development",
];

export default function MyCoursesScreen({ onNavigate }: MyCoursesScreenProps) {
  const dispatch = useAppDispatch();
  const { domains, dashboardData, isLoading, error, selectedDomain } = useAppSelector((state: any) => state.courses);
  const { token, isAuthenticated } = useAppSelector((state: any) => state.auth);
  
  // Log auth state
  useEffect(() => {
    console.log('🔐 Auth state - Token:', token);
    console.log('🔐 Auth state - IsAuthenticated:', isAuthenticated);
  }, [token, isAuthenticated]);
  
  const [inProgressIndex, setInProgressIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [industryStartIndex, setIndustryStartIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const colors = useColors();
  
  const windowWidth = Dimensions.get('window').width;
  const visibleCards = windowWidth >= 1024 ? 4 : windowWidth >= 640 ? 2 : 1;
  const industriesToShow = 12;

  // Fetch data from API
  useEffect(() => {
    console.log('========================================');
    console.log('🔍 MyCoursesScreen - useEffect triggered');
    console.log('Token:', token);
    console.log('Domains:', domains);
    console.log('Dashboard Data:', dashboardData);
    console.log('========================================');
    
    // Use fixed token if no user token is available
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    console.log('🔑 Using auth token:', authToken);
    
    console.log('🚀 Fetching domains and courses with token:', authToken);
    dispatch(fetchDomainsCourses(authToken) as any);
    dispatch(fetchDashboardData(authToken) as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.log('❌ Courses API error:', error);
      Alert.alert('Error', error);
    }
  }, [error]);

  // Set selected domain when dashboard data is loaded
  useEffect(() => {
    if (dashboardData?.length > 0 && !selectedDomain) {
      console.log('🏢 Dashboard data loaded - setting first domain as selected');
      dispatch(setSelectedDomain(dashboardData[0]));
    }
  }, [dashboardData, selectedDomain, dispatch]);

  // Log dashboard data when loaded
  useEffect(() => {
    if (dashboardData) {
      console.log('========================================');
      console.log('📊 DASHBOARD API RESPONSE - RAW DATA:');
      console.log('========================================');
      console.log(JSON.stringify(dashboardData, null, 2));
      console.log('========================================');
      console.log('📊 Dashboard data loaded:', dashboardData);
    }
  }, [dashboardData]);

  // Get industries from dashboard data
  const industries = dashboardData?.map((domain: any) => domain.name) || [];
  const selected = selectedDomain?.name || industries[0] || '';

  // Find matching domain in dashboardData
  const matchingDashboardDomain = dashboardData?.find((domain: any) => domain.id === selectedDomain?.id);
  
  // Get courses from dashboard data - using real API data
  const inProgressCourses = matchingDashboardDomain?.currently_studying?.map((course: any) => ({
    id: course.id,
    title: course.name,
    category: selectedDomain?.name,
    badge: course.badge || 'A',
    progress: course.progress || 0, // Use real progress from API
    total: course.total || 100, // Use real total from API
    icon: course.icon,
    color: course.color,
  })) || [];

  const popularCourses = matchingDashboardDomain?.course_library?.map((course: any) => ({
    id: course.id,
    title: course.name,
    category: selectedDomain?.name,
    badge: course.badge || 'A',
    progress: course.progress || 0, // Use real progress from API
    total: course.total || 100, // Use real total from API
    icon: course.icon,
    color: course.color,
  })) || [];

  // Debug course data
  console.log('📚 In Progress Courses:', inProgressCourses);
  console.log('🔥 Popular Courses:', popularCourses);

  const handleIndustrySelect = (industryName: string) => {
    const domain = dashboardData?.find((d: any) => d.name === industryName);
    if (domain) {
      console.log('🎯 Selecting domain:', domain);
      dispatch(setSelectedDomain(domain));
    }
  };

  const handleIndustryLeft = () => {
    if (industryStartIndex > 0) {
      setIndustryStartIndex(industryStartIndex - 1);
    }
  };

  const handleIndustryRight = () => {
    if (industryStartIndex < industries.length - industriesToShow) {
      setIndustryStartIndex(industryStartIndex + 1);
    }
  };

  const handleInProgressPrev = () => {
    if (inProgressIndex > 0) {
      setInProgressIndex(inProgressIndex - 1);
    }
  };

  const handleInProgressNext = () => {
    if (inProgressIndex < inProgressCourses.length - visibleCards) {
      setInProgressIndex(inProgressIndex + 1);
    }
  };

  const handlePopularPrev = () => {
    if (popularIndex > 0) {
      setPopularIndex(popularIndex - 1);
    }
  };

  const handlePopularNext = () => {
    if (popularIndex < popularCourses.length - visibleCards) {
      setPopularIndex(popularIndex + 1);
    }
  };

  const isIndustryLeftDisabled = industryStartIndex === 0;
  const isIndustryRightDisabled = industryStartIndex >= industries.length - industriesToShow + 2;
  const isInProgressPrevDisabled = inProgressIndex === 0;
  const isInProgressNextDisabled = inProgressIndex >= inProgressCourses.length - visibleCards;
  const isPopularPrevDisabled = popularIndex === 0;
  const isPopularNextDisabled = popularIndex >= popularCourses.length - visibleCards;

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Topbar */}
      <Topbar />
      
      {/* Sidebar */}
      <Sidebar onStateChange={setSidebarOpen} currentPage="courses" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { marginLeft: sidebarOpen ? 256 : 0 }
      ]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
                Loading courses...
              </Text>
            </View>
          )}

          {/* Content */}
          {!isLoading && (
            <>
              {/* All Domains Section */}
              <View style={styles.domainsSection}>
                <View style={styles.domainsHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>All Domains</Text>
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        { borderColor: isIndustryLeftDisabled ? colors.muted : colors.yellow },
                        isIndustryLeftDisabled && styles.navButtonDisabled
                      ]}
                      onPress={handleIndustryLeft}
                      disabled={isIndustryLeftDisabled}
                    >
                      <ChevronLeft size={16} color={isIndustryLeftDisabled ? colors.foreground : colors.yellow} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        { borderColor: isIndustryRightDisabled ? colors.muted : colors.yellow },
                        isIndustryRightDisabled && styles.navButtonDisabled
                      ]}
                      onPress={handleIndustryRight}
                      disabled={isIndustryRightDisabled}
                    >
                      <ChevronRight size={16} color={isIndustryRightDisabled ? colors.foreground : colors.yellow} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.industriesScroll}
                  contentContainerStyle={styles.industriesContainer}
                >
                  {windowWidth >= 1024 
                    ? industries.slice(industryStartIndex, industryStartIndex + industriesToShow).map((industry: string) => (
                        <TouchableOpacity
                          key={industry}
                          onPress={() => handleIndustrySelect(industry)}
                          style={[
                            styles.industryButton,
                            selected === industry && [styles.industryButtonActive, { borderBottomColor: colors.yellow }]
                          ]}
                        >
                          <Text style={[
                            styles.industryText,
                            { color: selected === industry ? colors.foreground : colors.foreground }
                          ]}>
                            {industry}
                          </Text>
                        </TouchableOpacity>
                      ))
                    : industries.map((industry: string) => (
                        <TouchableOpacity
                          key={industry}
                          onPress={() => handleIndustrySelect(industry)}
                          style={[
                            styles.industryButton,
                            selected === industry && [styles.industryButtonActive, { borderBottomColor: colors.yellow }]
                          ]}
                        >
                          <Text style={[
                            styles.industryText,
                            { color: selected === industry ? colors.foreground : colors.foreground }
                          ]}>
                            {industry}
                          </Text>
                        </TouchableOpacity>
                      ))
                  }
                </ScrollView>
              </View>

              {/* Course Tabs Section */}
              <View style={styles.courseTabsSection}>
                <CourseTabs />
              </View>

              {/* Calendar Section */}
              <View style={styles.calendarSection}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Calendar</Text>
                <CalendarSchedule />
              </View>
            </>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </View>
  );
}

function CourseCard({ course }: { course: Course }) {
  const progressPercentage = course.progress && course.total ? (course.progress / course.total) * 100 : 0;
  const colors = useColors();
  const styles = createStyles(colors);

  return (
    <View style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: course.color || colors.accent }]}>
          <Text style={styles.categoryText}>{course.category}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={[styles.courseTitle, { color: colors.foreground }]}>{course.title}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressBackground, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%`, backgroundColor: course.color || colors.yellow }]} />
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={[styles.progressBadge, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
          <Text style={[styles.progressText, { color: colors.background }]}>
            <Text style={styles.progressNumber}>{course.progress || 0}</Text>/{course.total || 0}
          </Text>
        </View>
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.background, borderColor: colors.foreground }]}>
          <Text style={[styles.continueText, { color: colors.foreground }]}>Continue</Text>
          <View style={[styles.arrowContainer, { borderColor: colors.foreground }]}>
            <ArrowRight size={8} color={colors.foreground} strokeWidth={3} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    // marginLeft will be set dynamically based on sidebar state
  },
  scrollView: {
    flex: 1,
  },
  domainsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  domainsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  industriesScroll: {
    marginBottom: 20,
  },
  industriesContainer: {
    paddingBottom: 10,
  },
  industryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
  industryButtonActive: {
    borderBottomWidth: 4,
  },
  industryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  coursesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coursesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  courseCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    minWidth: 200,
  },
  cardHeader: {
    padding: 12,
    paddingBottom: 0,
  },
  categoryBadge: {
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  cardContent: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  progressBar: {
    marginBottom: 4,
  },
  progressBackground: {
    width: '100%',
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.yellow,
    color: colors.foreground,
    borderRadius: 4,
  },
  cardFooter: {
    padding: 12,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBadge: {
    backgroundColor: colors.foreground,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressText: {
    fontSize: 12,
    color: colors.background,
  },
  progressNumber: {
    fontWeight: 'bold',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.foreground,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  continueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  arrowContainer: {
    borderWidth: 2,
    borderColor: colors.foreground,
    borderRadius: 12,
    padding: 2,
  },
  courseTabsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  calendarSection: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  bottomPadding: {
    height: 100,
  },
});
