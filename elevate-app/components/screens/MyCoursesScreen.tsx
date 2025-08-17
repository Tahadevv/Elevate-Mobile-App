import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarSchedule from '../dashboardItems/calender';
import CourseTabs from '../dashboardItems/coursestabs';
import Sidebar from '../dashboardItems/sidebar';
import Topbar from '../dashboardItems/topbar';
import { useColors } from '../theme-provider';

interface Course {
  id: number;
  title: string;
  category: string;
  badge: string;
  progress: number;
  total: number;
}

interface MyCoursesScreenProps {
  onNavigate?: (tabName: string) => void;
}

const inProgressCourses = [
  {   
    id: 1,    
    title: "Enhance your Python skills with real-world problems",    
    category: "Python Intermediate",    
    badge: "A",    
    progress: 65,    
    total: 85,  
  },  
  {    
    id: 2,    
    title: "Master advanced JS frameworks for web development",    
    category: "Advanced JavaScript",    
    badge: "A",    
    progress: 42,    
    total: 60,  
  },  
  {    
    id: 3,    
    title: "Learn the basics of cloud computing and services",    
    category: "Cloud Computing",    
    badge: "A",    
    progress: 28,    
    total: 50,  
  },  
  {    
    id: 4,    
    title: "Develop efficient algorithms and optimize data structures",    
    category: "Data Structures & Algorithms",    
    badge: "A",    
    progress: 75,    
    total: 90,  
  },  
  {    
    id: 5,    
    title: "Understand core ML concepts and algorithms",    
    category: "Machine Learning",    
    badge: "A",    
    progress: 15,    
    total: 40,  
  },  
  {    
    id: 6,    
    title: "Learn security best practices for web applications",    
    category: "Web Security",    
    badge: "A",    
    progress: 50,    
    total: 70,  
  },  
];

const popularCourses = [
  {    
    id: 1,    
    title: "Explore Python applications in data science",    
    category: "Python for Data Science",    
    badge: "A",    
    progress: 0,    
    total: 75,  
  },  
  {    
    id: 2,    
    title: "Learn full-stack development with modern tools",    
    category: "Full Stack Web Dev",    
    badge: "A",    
    progress: 0,    
    total: 90,  
  },  
  {    
    id: 3,    
    title: "Understand cybersecurity fundamentals and threats",    
    category: "Cybersecurity Fundamentals",    
    badge: "A",    
    progress: 0,    
    total: 65,  
  },  
  {    
    id: 4,    
    title: "Learn DevOps principles and CI/CD pipelines",    
    category: "DevOps & CI/CD",    
    badge: "A",    
    progress: 0,    
    total: 80,  
  },  
  {    
    id: 5,    
    title: "Build mobile apps for Android and iOS",    
    category: "Mobile App Dev",    
    badge: "A",    
    progress: 0,    
    total: 70,  
  },  
];

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
  const [selected, setSelected] = useState(industries[0]);
  const [inProgressIndex, setInProgressIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [industryStartIndex, setIndustryStartIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const colors = useColors();
  
  const windowWidth = Dimensions.get('window').width;
  const visibleCards = windowWidth >= 1024 ? 4 : windowWidth >= 640 ? 2 : 1;
  const industriesToShow = 12;

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
                ? industries.slice(industryStartIndex, industryStartIndex + industriesToShow).map((industry) => (
                    <TouchableOpacity
                      key={industry}
                      onPress={() => setSelected(industry)}
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
                : industries.map((industry) => (
                    <TouchableOpacity
                      key={industry}
                      onPress={() => setSelected(industry)}
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

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </View>
  );
}

function CourseCard({ course }: { course: Course }) {
  const progressPercentage = (course.progress / course.total) * 100;
  const colors = useColors();
  const styles = createStyles(colors);

  return (
    <View style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{course.category}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={[styles.courseTitle, { color: colors.foreground }]}>{course.title}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressBackground, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={[styles.progressBadge, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
          <Text style={[styles.progressText, { color: colors.background }]}>
            <Text style={styles.progressNumber}>{course.progress}</Text>/{course.total}
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
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  bottomPadding: {
    height: 100,
  },
});
