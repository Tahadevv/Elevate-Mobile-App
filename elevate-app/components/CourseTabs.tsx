import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Map icon names to Ionicons
const iconMap: { [key: string]: string } = {
  ScrollText: 'document-text-outline',
  Briefcase: 'briefcase-outline',
  Award: 'trophy-outline',
  Cpu: 'hardware-chip-outline',
  Laptop: 'laptop-outline',
  ShieldCheck: 'shield-checkmark-outline',
  Code: 'code-slash-outline',
  Coffee: 'cafe-outline',
  SquareJs: 'logo-javascript',
  SquareC: 'code-outline',
  SquareG: 'git-branch-outline',
  Brackets: 'code-outline',
  Palette: 'color-palette-outline',
  Smartphone: 'phone-portrait-outline',
  Gamepad: 'game-controller-outline',
  CloudCog: 'cloud-outline',
  BarChart: 'bar-chart-outline',
  LineChart: 'trending-up-outline',
  Brain: 'bulb-outline',
  Bot: 'robot-outline',
  Cloud: 'cloud-outline',
};

const allSubjects = [
  { name: 'Code foundations', icon: 'Award' },
  { name: 'Professional skills', icon: 'Briefcase' },
  { name: 'Python', icon: 'Code' },
  { name: 'HTML & CSS', icon: 'Brackets' },
  { name: 'Data science', icon: 'BarChart' },
  { name: 'Java', icon: 'Coffee' },
  { name: 'Web development', icon: 'Code' },
  { name: 'Data analytics', icon: 'LineChart' },
  { name: 'Interview prep', icon: 'Award' },
  { name: 'JavaScript', icon: 'SquareJs' },
  { name: 'Web design', icon: 'Palette' },
  { name: 'Machine learning', icon: 'Brain' },
  { name: 'Computer science', icon: 'Cpu' },
  { name: 'C++', icon: 'SquareC' },
  { name: 'Mobile development', icon: 'Smartphone' },
  { name: 'AI', icon: 'Bot' },
  { name: 'IT', icon: 'Laptop' },
  { name: 'C#', icon: 'SquareC' },
  { name: 'Game development', icon: 'Gamepad' },
  { name: 'Cloud computing', icon: 'Cloud' },
  { name: 'Cybersecurity', icon: 'ShieldCheck' },
  { name: 'Go', icon: 'SquareG' },
  { name: 'DevOps', icon: 'CloudCog' },
  { name: 'Certification prep', icon: 'Award' },
  { name: 'Networking', icon: 'Cloud' },
  { name: 'Databases', icon: 'BarChart' },
  { name: 'Algorithms', icon: 'Brain' },
  { name: 'Operating Systems', icon: 'Cpu' },
  { name: 'Software Engineering', icon: 'Brain' },
  { name: 'Project Management', icon: 'Briefcase' },
];

const courseLibrarySubjects = [
  { name: 'AWS Certification', icon: 'Cloud' },
  { name: 'Microsoft Azure', icon: 'CloudCog' },
  { name: 'Google Cloud', icon: 'Cloud' },
  { name: 'Cisco Networking', icon: 'Cpu' },
  { name: 'CompTIA A+', icon: 'Laptop' },
  { name: 'CompTIA Security+', icon: 'ShieldCheck' },
  { name: 'PMP Certification', icon: 'Briefcase' },
  { name: 'Scrum Master', icon: 'Award' },
  { name: 'Data Science Professional', icon: 'BarChart' },
  { name: 'Machine Learning Engineer', icon: 'Brain' },
  { name: 'Full Stack Developer', icon: 'Code' },
  { name: 'DevOps Engineer', icon: 'CloudCog' },
  { name: 'Cybersecurity Analyst', icon: 'ShieldCheck' },
  { name: 'UI/UX Designer', icon: 'Palette' },
  { name: 'Mobile App Developer', icon: 'Smartphone' },
  { name: 'Game Developer', icon: 'Gamepad' },
  { name: 'Database Administrator', icon: 'BarChart' },
  { name: 'System Administrator', icon: 'Cpu' },
  { name: 'AI Engineer', icon: 'Bot' },
  { name: 'Blockchain Developer', icon: 'Code' },
  { name: 'Cloud Architect', icon: 'Cloud' },
  { name: 'Network Engineer', icon: 'Cpu' },
  { name: 'Software Architect', icon: 'Brain' },
  { name: 'QA Engineer', icon: 'ShieldCheck' },
  { name: 'Product Manager', icon: 'Briefcase' },
  { name: 'Technical Lead', icon: 'Award' },
];

const SUBJECTS_PER_LOAD = 8;

export default function CourseTabs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'top-subjects' | 'certification-prep'>('top-subjects');
  const [visibleSubjectsCount, setVisibleSubjectsCount] = useState(SUBJECTS_PER_LOAD);
  const [visibleLibraryCount, setVisibleLibraryCount] = useState(SUBJECTS_PER_LOAD);

  const handleLoadMore = () => {
    setVisibleSubjectsCount((prevCount) => prevCount + SUBJECTS_PER_LOAD);
  };

  const handleLoadMoreLibrary = () => {
    setVisibleLibraryCount((prevCount) => prevCount + SUBJECTS_PER_LOAD);
  };

  const subjectsToDisplay = allSubjects.slice(0, visibleSubjectsCount);
  const libraryToDisplay = courseLibrarySubjects.slice(0, visibleLibraryCount);
  const hasMoreSubjects = visibleSubjectsCount < allSubjects.length;
  const hasMoreLibrary = visibleLibraryCount < courseLibrarySubjects.length;

  const navigateToCourseDetails = () => {
    router.push('/course-details');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our path to exam success starts here</Text>

      {/* Tab Headers */}
      <View style={styles.tabHeaders}>
        <TouchableOpacity
          style={[
            styles.tabHeader,
            activeTab === 'top-subjects' && styles.activeTabHeader,
          ]}
          onPress={() => setActiveTab('top-subjects')}
        >
          <Text
            style={[
              styles.tabHeaderText,
              activeTab === 'top-subjects' && styles.activeTabHeaderText,
            ]}
          >
            Currently studying
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabHeader,
            activeTab === 'certification-prep' && styles.activeTabHeader,
          ]}
          onPress={() => setActiveTab('certification-prep')}
        >
          <Text
            style={[
              styles.tabHeaderText,
              activeTab === 'certification-prep' && styles.activeTabHeaderText,
            ]}
          >
            Course library
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'top-subjects' && (
        <View style={styles.tabContent}>
          <View style={styles.courseGrid}>
            {subjectsToDisplay.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.courseCard}
                onPress={navigateToCourseDetails}
              >
                <Ionicons
                  name={iconMap[subject.icon] as any}
                  size={24}
                  color="#000"
                />
                <Text style={styles.courseName}>{subject.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {hasMoreSubjects && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
              <Text style={styles.loadMoreText}>load more</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffd404" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab === 'certification-prep' && (
        <View style={styles.tabContent}>
          <View style={styles.courseGrid}>
            {libraryToDisplay.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.courseCard}
                onPress={navigateToCourseDetails}
              >
                <Ionicons
                  name={iconMap[subject.icon] as any}
                  size={24}
                  color="#000"
                />
                <Text style={styles.courseName}>{subject.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {hasMoreLibrary && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMoreLibrary}>
              <Text style={styles.loadMoreText}>load more</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffd404" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#000',
    textAlign: 'center',
  },
  tabHeaders: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d8',
    marginBottom: 32,
  },
  tabHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  activeTabHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#ffd404',
  },
  tabHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717a',
  },
  activeTabHeaderText: {
    color: '#000',
  },
  tabContent: {
    minHeight: 200,
  },
  courseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  courseCard: {
    width: (width - 64) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    backgroundColor: '#fff',
    gap: 12,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffd404',
    marginRight: 8,
  },
});
