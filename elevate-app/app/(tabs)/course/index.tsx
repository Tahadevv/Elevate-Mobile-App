import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useColors } from '../../../components/theme-provider';

const { width } = Dimensions.get('window');

interface CourseCategory {
  name: string;
  icon: string;
  description: string;
  chapters: number;
  questions: number;
}

const courseCategories: CourseCategory[] = [
  {
    name: "Code foundations",
    icon: "school",
    description: "Master the fundamental concepts of programming and computer science",
    chapters: 8,
    questions: 25
  },
  {
    name: "Professional skills",
    icon: "briefcase",
    description: "Develop essential workplace skills and professional development",
    chapters: 6,
    questions: 20
  },
  {
    name: "Python",
    icon: "code",
    description: "Learn Python programming from basics to advanced concepts",
    chapters: 10,
    questions: 30
  },
  {
    name: "HTML & CSS",
    icon: "globe",
    description: "Master web development fundamentals with HTML and CSS",
    chapters: 7,
    questions: 22
  },
  {
    name: "Data science",
    icon: "analytics",
    description: "Explore data analysis, statistics, and machine learning",
    chapters: 12,
    questions: 35
  },
  {
    name: "Java",
    icon: "code",
    description: "Learn Java programming fundamentals and OOP concepts",
    chapters: 9,
    questions: 28
  },
  {
    name: "Web development",
    icon: "globe",
    description: "Full-stack web development with modern tools",
    chapters: 15,
    questions: 45
  },
  {
    name: "Data analytics",
    icon: "analytics",
    description: "Master data visualization and business intelligence",
    chapters: 8,
    questions: 24
  }
];

const iconMap: { [key: string]: string } = {
  school: "school",
  briefcase: "briefcase",
  code: "code",
  globe: "globe",
  analytics: "analytics",
};

export default function CourseIndex() {
  const router = useRouter();
  const colors = useColors();

  const handleCoursePress = (courseName: string) => {
    router.push({
      pathname: "/course/course-details",
      params: { courseName }
    });
  };

  const renderIcon = (iconName: string, color: string) => {
    const iconKey = iconMap[iconName] || "school";
    return <Ionicons name={iconKey as any} size={24} color={color} />;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Navigation Menu */}
        <View style={styles.navMenu}>
          <TouchableOpacity
            style={[styles.navItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/course/notes')}
          >
            <Ionicons name="create" size={20} color={colors.foreground} />
            <Text style={[styles.navText, { color: colors.foreground }]}>Notes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/course/tutorial')}
          >
            <Ionicons name="play-circle" size={20} color={colors.foreground} />
            <Text style={[styles.navText, { color: colors.foreground }]}>Tutorial</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/course/result')}
          >
            <Ionicons name="analytics" size={20} color={colors.foreground} />
            <Text style={[styles.navText, { color: colors.foreground }]}>Results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/course/Information-Mock-Assessment')}
          >
            <Ionicons name="document-text" size={20} color={colors.foreground} />
            <Text style={[styles.navText, { color: colors.foreground }]}>Assessment</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Our path to exam success starts here
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Choose a course category to begin your learning journey
          </Text>
        </View>

        {/* Course Categories Grid */}
        <View style={styles.categoriesGrid}>
          {courseCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleCoursePress(category.name)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  {renderIcon(category.icon, colors.foreground)}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.categoryName, { color: colors.foreground }]}>
                    {category.name}
                  </Text>
                  <Text style={[styles.categoryDescription, { color: colors.muted }]} numberOfLines={2}>
                    {category.description}
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="document-text-outline" size={16} color={colors.muted} />
                    <Text style={[styles.statText, { color: colors.muted }]}>
                      {category.chapters} Chapters
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="help-circle-outline" size={16} color={colors.muted} />
                    <Text style={[styles.statText, { color: colors.muted }]}>
                      {category.questions} Questions
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.arrowContainer, { backgroundColor: colors.yellow }]}>
                  <Ionicons name="arrow-forward" size={16} color={colors.background} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  navMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  categoriesGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 48) / 2,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  categoryDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});
