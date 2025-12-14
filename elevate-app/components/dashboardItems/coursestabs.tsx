import { useRouter } from "expo-router";
import {
  ArrowRight,
  Award,
  BarChart,
  Bot,
  Brackets,
  Brain,
  Briefcase,
  Cloud,
  CloudCog,
  Code,
  Coffee,
  Cpu,
  Gamepad,
  Laptop,
  LineChart,
  Palette,
  ScrollText,
  ShieldCheck,
  Smartphone,
  SquareIcon as SquareC,
  SquareIcon as SquareG,
  SquareIcon as SquareJs,
} from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "../../store/hooks";
import { useColors } from "../theme-provider";

// Map icon names to Lucide React Native components
const iconMap: { [key: string]: any } = {
  ScrollText,
  Briefcase,
  Award,
  Cpu,
  Laptop,
  ShieldCheck,
  Code,
  Coffee,
  SquareJs,
  SquareC,
  SquareG,
  Brackets,
  Palette,
  Smartphone,
  Gamepad,
  CloudCog,
  BarChart,
  LineChart,
  Brain,
  Bot,
  Cloud,
};

const SUBJECTS_PER_LOAD = 8;

interface Course {
  id: number;
  name: string;
}

export default function CourseTabs() {
  const [activeTab, setActiveTab] = useState("currently-studying");
  const [visibleSubjectsCount, setVisibleSubjectsCount] = useState(SUBJECTS_PER_LOAD);
  const [visibleLibraryCount, setVisibleLibraryCount] = useState(SUBJECTS_PER_LOAD);
  
  const colors = useColors();
  const router = useRouter();
  
  // Get dashboard data and selected domain from Redux
  const { dashboardData, selectedDomain } = useAppSelector((state: any) => state.courses);
  
  // Find the domain in dashboardData that matches selectedDomain by id
  const matchingDomain = dashboardData?.find((domain: any) => domain.id === selectedDomain?.id);
  
  // Get courses from matching domain
  const currentlyStudyingCourses = matchingDomain?.currently_studying || [];
  const courseLibraryCourses = matchingDomain?.course_library || [];
  
  console.log('🎯 CourseTabs - Selected Domain ID:', selectedDomain?.id);
  console.log('🎯 CourseTabs - Matching Domain:', matchingDomain);
  console.log('🎯 Currently Studying:', currentlyStudyingCourses);
  console.log('🎯 Course Library:', courseLibraryCourses);
  
  // Get displayed courses based on load more state
  const subjectsToDisplay = currentlyStudyingCourses.slice(0, visibleSubjectsCount);
  const libraryToDisplay = courseLibraryCourses.slice(0, visibleLibraryCount);
  const hasMoreSubjects = visibleSubjectsCount < currentlyStudyingCourses.length;
  const hasMoreLibrary = visibleLibraryCount < courseLibraryCourses.length;

  const styles = createStyles(colors);

  const handleLoadMore = () => {
    setVisibleSubjectsCount((prevCount) => prevCount + SUBJECTS_PER_LOAD);
  };

  const handleLoadMoreLibrary = () => {
    setVisibleLibraryCount((prevCount) => prevCount + SUBJECTS_PER_LOAD);
  };

  const handleCoursePress = (course: Course) => {
    // Navigate to course details screen with the course ID
    router.push({
      pathname: "/course/course-details",
      params: { 
        courseId: course.id.toString(),
        courseName: course.name
      }
    });
  };

  const renderCourseCard = (course: Course, index: number) => {
    // Use Code icon as default for all courses
    const IconComponent = iconMap["Code"] || Code;
    return (
      <TouchableOpacity
        key={course.id}
        style={[
          styles.subjectCard,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}
        onPress={() => handleCoursePress(course)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {IconComponent && <IconComponent size={24} color={colors.foreground} />}
        </View>
        <Text style={[styles.subjectName, { color: colors.foreground }]} numberOfLines={2} ellipsizeMode="tail">
          {course.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Our path to exam success starts here
        </Text>
        
        <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.tabTrigger, 
              activeTab === "currently-studying" && styles.activeTabTrigger
            ]} 
            onPress={() => setActiveTab("currently-studying")}
          >
            <Text style={[
              styles.tabText,
              { color: colors.foreground },
              activeTab === "currently-studying" && styles.activeTabText
            ]}>
              Currently studying
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabTrigger, 
              activeTab === "course-library" && styles.activeTabTrigger
            ]} 
            onPress={() => setActiveTab("course-library")}
          >
            <Text style={[
              styles.tabText,
              { color: colors.foreground },
              activeTab === "course-library" && styles.activeTabText
            ]}>
              Course library
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "currently-studying" && (
          <View style={styles.tabContent}>
            {subjectsToDisplay.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No courses currently being studied
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.subjectsGrid}>
                  {subjectsToDisplay.map((course: Course, index: number) => renderCourseCard(course, index))}
                </View>
                {hasMoreSubjects && (
                  <View style={styles.loadMoreContainer}>
                    <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                      <Text style={[styles.loadMoreText, { color: colors.yellow }]}>load more</Text>
                      <ArrowRight size={16} color={colors.yellow} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {activeTab === "course-library" && (
          <View style={styles.tabContent}>
            {libraryToDisplay.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No courses in library
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.subjectsGrid}>
                  {libraryToDisplay.map((course: Course, index: number) => renderCourseCard(course, index))}
                </View>
                {hasMoreLibrary && (
                  <View style={styles.loadMoreContainer}>
                    <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMoreLibrary}>
                      <Text style={[styles.loadMoreText, { color: colors.yellow }]}>load more</Text>
                      <ArrowRight size={16} color={colors.yellow} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    minHeight: 600,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  content: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 32,
    justifyContent: 'flex-start',
  },
  tabTrigger: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 32,
  },
  activeTabTrigger: {
    borderBottomWidth: 3,
    borderBottomColor: colors.yellow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  tabContent: {
    // Tab content styling
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 8,
    width: '47%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 0,
    flex: 1,
    flexWrap: 'wrap',
  },
  loadMoreContainer: {
    marginTop: 36,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    textTransform: 'lowercase',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
