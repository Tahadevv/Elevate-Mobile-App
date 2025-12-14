import { useRouter } from 'expo-router';
import { ArrowRight, ChevronLeft, ChevronRight, Code } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPaidIndustries } from '../../store/slices/dashboardSlice';
import { useColors } from '../theme-provider';

interface Course {
  id: number;
  name: string;
}

interface Industry {
  id: number;
  name: string;
  currently_studying: Course[];
  course_library: Course[];
}

interface PaidIndustriesComponentProps {
  industries: Industry[];
}

const SUBJECTS_PER_LOAD = 8;

export default function PaidIndustriesComponent({ industries }: PaidIndustriesComponentProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    industries && industries.length > 0 ? industries[0] : null
  );
  const [visibleSubjectsCount, setVisibleSubjectsCount] = useState(SUBJECTS_PER_LOAD);
  const [visibleLibraryCount, setVisibleLibraryCount] = useState(SUBJECTS_PER_LOAD);
  const [industryStartIndex, setIndustryStartIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'currently-studying' | 'course-library'>('currently-studying');
  
  const colors = useColors();
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const industriesToShow = windowWidth >= 1024 ? 12 : windowWidth >= 640 ? 6 : 4;

  // Update selected industry when industries change
  React.useEffect(() => {
    if (industries && industries.length > 0 && !selectedIndustry) {
      setSelectedIndustry(industries[0]);
    }
  }, [industries]);

  const handleIndustryLeft = () => {
    if (industryStartIndex > 0) {
      setIndustryStartIndex(industryStartIndex - 1);
    }
  };

  const handleIndustryRight = () => {
    if (industryStartIndex < industries.length - industriesToShow) {
      setIndustryStartIndex(industryStartIndex + 1);
    } else if (industries.length > industriesToShow) {
      // Allow scrolling to see the last industry even if it means showing fewer items
      setIndustryStartIndex(Math.min(industryStartIndex + 1, industries.length - 1));
    }
  };

  const isIndustryLeftDisabled = industryStartIndex === 0;
  // Show right button if there are more industries to scroll to
  const isIndustryRightDisabled = industries.length <= industriesToShow || industryStartIndex >= industries.length - 1;

  const currentlyStudyingCourses = selectedIndustry?.currently_studying || [];
  const courseLibraryCourses = selectedIndustry?.course_library || [];

  const subjectsToDisplay = currentlyStudyingCourses.slice(0, visibleSubjectsCount);
  const libraryToDisplay = courseLibraryCourses.slice(0, visibleLibraryCount);
  const hasMoreSubjects = visibleSubjectsCount < currentlyStudyingCourses.length;
  const hasMoreLibrary = visibleLibraryCount < courseLibraryCourses.length;

  const handleLoadMore = () => {
    setVisibleSubjectsCount((prevCount) => prevCount + SUBJECTS_PER_LOAD);
  };

  const handleLoadMoreLibrary = () => {
    setVisibleLibraryCount((prevCount) => prevCount + SUBJECTS_PER_LOAD);
  };

  const handleCoursePress = (course: Course) => {
    router.push({
      pathname: '/course/course-details',
      params: {
        courseId: course.id.toString(),
        courseName: course.name,
      },
    });
  };

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: any) => state.auth);

  const handleRegisterCourse = async (course: Course) => {
    try {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      
      console.log('========================================');
      console.log('🔵 REGISTER COURSE');
      console.log('========================================');
      console.log('Course ID:', course.id);
      console.log('Course Name:', course.name);
      console.log('========================================');

      const response = await fetch(buildURL(API_CONFIG.courses.registerCourse), {
        method: 'POST',
        headers: getAuthHeaders(authToken),
        body: JSON.stringify({
          course: course.id.toString(),
          status: 'studying',
        }),
      });

      console.log('Response Status:', response.status, response.statusText);
      console.log('Response OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ COURSE REGISTERED SUCCESSFULLY');
        console.log('Response Data:', JSON.stringify(data, null, 2));
        console.log('========================================');
        
        Alert.alert('Success', 'Course registered successfully');
        
        // Refresh the paid industries data to reflect the change
        dispatch(fetchPaidIndustries(authToken) as any);
        
        // Navigate to course details
        handleCoursePress(course);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to register course' }));
        console.log('❌ REGISTER COURSE FAILED');
        console.log('Error Data:', JSON.stringify(errorData, null, 2));
        console.log('========================================');
        
        const errorMessage = errorData.detail || errorData.error || errorData.message || 'Failed to register course';
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      console.log('========================================');
      console.log('❌ REGISTER COURSE NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  const styles = createStyles(colors);

  if (!industries || industries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          No paid industries available. Purchase a domain first.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Industry Carousel */}
      <View style={styles.industrySection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>All Domains</Text>
        <View style={styles.carouselContainer}>
          {industryStartIndex > 0 && (
            <TouchableOpacity
              style={[styles.carouselButton, { backgroundColor: colors.card }]}
              onPress={handleIndustryLeft}
              disabled={isIndustryLeftDisabled}
            >
              <ChevronLeft size={20} color={colors.foreground} />
            </TouchableOpacity>
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.industryList}
          >
            {industries.slice(industryStartIndex, Math.min(industryStartIndex + industriesToShow, industries.length)).map((industry) => (
              <TouchableOpacity
                key={industry.id}
                style={[
                  styles.industryChip,
                  selectedIndustry?.id === industry.id && styles.selectedIndustryChip,
                  { borderColor: colors.border },
                ]}
                onPress={() => {
                  setSelectedIndustry(industry);
                  setVisibleSubjectsCount(SUBJECTS_PER_LOAD);
                  setVisibleLibraryCount(SUBJECTS_PER_LOAD);
                }}
              >
                <Text
                  style={[
                    styles.industryChipText,
                    { color: colors.foreground },
                    selectedIndustry?.id === industry.id && styles.selectedIndustryChipText,
                  ]}
                >
                  {industry.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {!isIndustryRightDisabled && (
            <TouchableOpacity
              style={[styles.carouselButton, { backgroundColor: colors.card }]}
              onPress={handleIndustryRight}
            >
              <ChevronRight size={20} color={colors.foreground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Course Tabs */}
      <Text style={[styles.title, { color: colors.foreground }]}>
        Our path to exam success starts here
      </Text>

      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'currently-studying' && styles.activeTab]}
          onPress={() => setActiveTab('currently-studying')}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.mutedForeground },
              activeTab === 'currently-studying' && { color: colors.foreground, fontWeight: 'bold' },
            ]}
          >
            Currently studying
          </Text>
          {activeTab === 'currently-studying' && <View style={[styles.tabUnderline, { backgroundColor: colors.yellow || '#ffd404' }]} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'course-library' && styles.activeTab]}
          onPress={() => setActiveTab('course-library')}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.mutedForeground },
              activeTab === 'course-library' && { color: colors.foreground, fontWeight: 'bold' },
            ]}
          >
            Course library
          </Text>
          {activeTab === 'course-library' && <View style={[styles.tabUnderline, { backgroundColor: colors.yellow || '#ffd404' }]} />}
        </TouchableOpacity>
      </View>

      {/* Course Content */}
      {activeTab === 'currently-studying' ? (
        <View style={styles.coursesContainer}>
          {subjectsToDisplay.length === 0 ? (
            <View style={styles.emptyCoursesContainer}>
              <Text style={[styles.emptyCoursesText, { color: colors.mutedForeground }]}>
                No courses in currently studying
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.coursesGrid}>
                {subjectsToDisplay.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => handleCoursePress(course)}
                  >
                    <Code size={24} color={colors.foreground} />
                    <Text style={[styles.courseName, { color: colors.foreground }]} numberOfLines={2}>
                      {course.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {hasMoreSubjects && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                  <Text style={[styles.loadMoreText, { color: colors.yellow || '#ffd404' }]}>
                    load more
                  </Text>
                  <ArrowRight size={16} color={colors.yellow || '#ffd404'} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      ) : (
        <View style={styles.coursesContainer}>
          {libraryToDisplay.length === 0 ? (
            <View style={styles.emptyCoursesContainer}>
              <Text style={[styles.emptyCoursesText, { color: colors.mutedForeground }]}>
                No courses in library
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.coursesGrid}>
                {libraryToDisplay.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => handleRegisterCourse(course)}
                  >
                    <Code size={24} color={colors.foreground} />
                    <Text style={[styles.courseName, { color: colors.foreground }]} numberOfLines={2}>
                      {course.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {hasMoreLibrary && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMoreLibrary}>
                  <Text style={[styles.loadMoreText, { color: colors.yellow || '#ffd404' }]}>
                    load more
                  </Text>
                  <ArrowRight size={16} color={colors.yellow || '#ffd404'} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  industrySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carouselButton: {
    padding: 8,
    borderRadius: 8,
  },
  industryList: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  industryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  selectedIndustryChip: {
    borderBottomWidth: 2,
    borderBottomColor: colors.yellow || '#ffd404',
  },
  industryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndustryChipText: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  coursesContainer: {
    marginTop: 16,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  courseCard: {
    width: '48%',
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 80,
  },
  courseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyCoursesContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCoursesText: {
    fontSize: 14,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

