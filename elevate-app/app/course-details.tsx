import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import API_CONFIG from '../config.api';
import { DotLoader } from '../components/ui/dot-loader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCourseDetails } from '../store/slices/courseDetailsSlice';

const { width } = Dimensions.get('window');

export default function CourseDetailsPage() {
  const [activeTab, setActiveTab] = useState<'about' | 'announcement'>('about');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  
  const { courseName, courseId } = useLocalSearchParams<{ 
    courseName: string;
    courseId: string;
  }>();
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get course details from Redux
  const { courseDetails, isLoading, error } = useAppSelector((state: any) => state.courseDetails);
  const { token } = useAppSelector((state: any) => state.auth);
  
  // Fetch course details when component mounts
  useEffect(() => {
    if (courseId) {
      console.log('🚀 Fetching course details for ID:', courseId);
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      dispatch(fetchCourseDetails({ courseId, token: authToken }) as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);
  
  const toggleChapter = (index: number) => {
    if (expandedChapter === index) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(index);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  // Use API data or fallback
  const displayCourseName = courseDetails?.name || courseName || 'Course';
  const aboutPrimary = courseDetails?.about_primary || '';
  const aboutSecondary = courseDetails?.about_secondary || '';
  const totalQuestions = courseDetails?.total_questions || 0;
  const totalChapters = courseDetails?.total_chapters || 0;
  const chapters = courseDetails?.chapters || [];
  const announcements = courseDetails?.announcements || [];


  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color="#185abd" text="Loading course details..." />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleBackPress}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{displayCourseName}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>Total {totalQuestions} questions</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="document-text-outline" size={16} color="#666" />
                <Text style={styles.statText}>{totalChapters} Chapters</Text>
              </View>
            </View>
          </View>

          {/* Course Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/animation.png')}
              style={styles.courseImage}
              resizeMode="cover"
            />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabButtons}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'about' && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab('about')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'about' && styles.activeTabButtonText,
                  ]}
                >
                  About the Course
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'announcement' && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab('announcement')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'announcement' && styles.activeTabButtonText,
                  ]}
                >
                  Announcement
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <View style={styles.tabContent}>
                <Text style={styles.tabTitle}>About the Course</Text>
                {aboutPrimary && (
                  <Text style={styles.description}>
                    {aboutPrimary}
                  </Text>
                )}
                {aboutSecondary && (
                  <Text style={styles.description}>
                    {aboutSecondary}
                  </Text>
                )}
                {!aboutPrimary && !aboutSecondary && (
                  <Text style={styles.description}>
                    Explore this comprehensive course designed to enhance your skills and knowledge in this field.
                  </Text>
                )}
              </View>
            )}

            {activeTab === 'announcement' && (
              <View style={styles.tabContent}>
                <Text style={styles.tabTitle}>Announcement</Text>
                {announcements.length > 0 ? (
                  <View style={styles.announcementList}>
                    {announcements.map((announcement: any, index: number) => (
                      <View key={index} style={styles.announcementItem}>
                        <View style={styles.announcementHeader}>
                          <Ionicons name="megaphone-outline" size={20} color="#333" />
                          <Text style={styles.announcementTitle}>{announcement.title || 'Announcement'}</Text>
                        </View>
                        <Text style={styles.announcementText}>
                          {announcement.content || announcement.message}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyAnnouncementContainer}>
                    <Ionicons name="information-circle-outline" size={40} color="#999" />
                    <Text style={styles.emptyAnnouncementText}>No announcements yet</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Right Sidebar - Course Content */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarContent}>
            <Text style={styles.sidebarTitle}>Course Content & Chapters</Text>
            {chapters.length > 0 ? (
              <View style={styles.chaptersList}>
                {chapters.map((chapter: any, index: number) => (
                  <View key={chapter.id} style={styles.chapterItem}>
                    <TouchableOpacity
                      style={styles.chapterButton}
                      onPress={() => toggleChapter(index)}
                    >
                      <Text style={styles.chapterTitle}>
                        {`${String(index + 1).padStart(2, '0')} ${chapter.name}`}
                      </Text>
                      <Ionicons
                        name={expandedChapter === index ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#666"
                      />
                    </TouchableOpacity>
                    {expandedChapter === index && chapter.subtopics && chapter.subtopics.length > 0 && (
                      <View style={styles.chapterContent}>
                        {chapter.subtopics.map((subtopic: any, subIndex: number) => (
                          <Text key={subtopic.id} style={styles.chapterSubItem}>
                            {`${String(subIndex + 1).padStart(2, '0')} ${subtopic.name}`}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyChaptersContainer}>
                <Ionicons name="document-outline" size={40} color="#999" />
                <Text style={styles.emptyChaptersText}>No chapters available</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 4,
  },
  imageContainer: {
    height: 256,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    marginRight: 8,
    backgroundColor: '#f0f0ff',
  },
  activeTabButton: {
            backgroundColor: '#185abd',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
            color: '#185abd',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  tabContent: {
    borderWidth: 2,
    padding: 24,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 20,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#000',
  },
  learningList: {
    gap: 12,
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  learningItemText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  announcementList: {
    gap: 16,
  },
  announcementItem: {
    padding: 16,
    borderRadius: 6,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  announcementText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 20,
  },
  sidebar: {
    width: width * 0.9,
    maxWidth: 384,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 40,
  },
  sidebarContent: {
    padding: 16,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  chaptersList: {
    gap: 8,
  },
  chapterItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  chapterButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  chapterContent: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  chapterSubItem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#185abd',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyAnnouncementContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyAnnouncementText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  emptyChaptersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyChaptersText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});
