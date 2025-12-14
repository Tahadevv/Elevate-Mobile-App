import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useColors, useTheme } from '../../../components/theme-provider';
import { DotLoader } from '../../../components/ui/dot-loader';
import API_CONFIG from '../../../config.api';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCourseDetails } from '../../../store/slices/courseDetailsSlice';

const { width } = Dimensions.get('window');

export default function CoursePage() {
  const dispatch = useAppDispatch();
  const { courseDetails, isLoading, error } = useAppSelector((state: any) => state.courseDetails);
  const { token } = useAppSelector((state: any) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'about' | 'announcement'>('about');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  // Get course ID from navigation params
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  // Fetch course details from API
  useEffect(() => {
    if (courseId) {
      console.log('🚀 Fetching course details for ID:', courseId);
      const authToken = token || API_CONFIG.FIXED_TOKEN;
       
      dispatch(fetchCourseDetails({ courseId, token: authToken }) as any);
    }
  }, [courseId, dispatch, token]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const toggleChapter = (index: number) => {
    if (expandedChapter === index) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(index);
    }
  };

  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = width < 768;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading course details..." />
        </View>
      )}

      {/* Content */}
      {!isLoading && (
        <View style={[styles.content, isMobile && styles.mobileContent]}>
        {/* Main Content Left Side */}
        <View style={[styles.mainContent, isMobile && styles.mobileMainContent]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {courseDetails?.name || 'Explore the Gemini API'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>
                  Total {courseDetails?.total_questions || 20} questions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="document-outline" size={16} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>
                  {courseDetails?.chapters?.length || 7} Chapters
                </Text>
              </View>
            </View>
          </View>

          {/* Course Video Thumbnail */}
          <View style={styles.videoContainer}>
            <Image
              source={require('../../../assets/images/animation.png')}
              style={styles.videoImage}
              resizeMode="cover"
            />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  { backgroundColor: isDark ? '#f0f0ff' : '#f0f0ff' },
                  activeTab === 'about' && { backgroundColor: isDark ? '#f59e0b' : '#185abd' },
                ]}
                onPress={() => setActiveTab('about')}
              >
                <Text style={[
                  styles.tabText,
                  { color: isDark ? '#f59e0b' : '#185abd' },
                  activeTab === 'about' && { color: '#ffffff' }
                ]}>
                  About the Course
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  { backgroundColor: isDark ? '#f0f0ff' : '#f0f0ff' },
                  activeTab === 'announcement' && { backgroundColor: isDark ? '#f59e0b' : '#185abd' },
                ]}
                onPress={() => setActiveTab('announcement')}
              >
                <Text style={[
                  styles.tabText,
                  { color: isDark ? '#f59e0b' : '#185abd' },
                  activeTab === 'announcement' && { color: '#ffffff' }
                ]}>
                  Announcement
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <View style={[styles.tabContent, { borderColor: colors.border }]}>
                <Text style={[styles.tabTitle, { color: colors.foreground }]}>
                  About the Course
                </Text>
                {courseDetails?.about_primary && (
                  <Text style={[styles.tabDescription, { color: colors.muted }]}>
                    {courseDetails.about_primary}
                  </Text>
                )}
                {courseDetails?.about_secondary && (
                  <Text style={[styles.tabDescription, { color: colors.muted }]}>
                    {courseDetails.about_secondary}
                  </Text>
                )}
                {!courseDetails?.about_primary && !courseDetails?.about_secondary && (
                  <Text style={[styles.tabDescription, { color: colors.muted }]}>
                    Course description will be loaded from the API.
                  </Text>
                )}
              </View>
            )}

            {activeTab === 'announcement' && (
              <View style={[styles.tabContent, { borderColor: colors.border }]}>
                <Text style={[styles.tabTitle, { color: colors.foreground }]}>
                  Announcement
                </Text>
                {courseDetails?.announcements && courseDetails.announcements.length > 0 ? (
                  <View style={styles.announcementsList}>
                    {courseDetails.announcements.map((announcement: any, index: number) => (
                      <View key={index} style={styles.announcementItem}>
                        <View style={styles.announcementHeader}>
                          <Ionicons name="megaphone" size={20} color={colors.foreground} />
                          <Text style={[styles.announcementTitle, { color: colors.foreground }]}>
                            {announcement.title || 'Announcement'}
                          </Text>
                        </View>
                        <Text style={[styles.announcementText, { color: colors.muted }]}>
                          {announcement.content || announcement.message}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyAnnouncementContainer}>
                    <Ionicons name="information-circle-outline" size={40} color={colors.muted} />
                    <Text style={[styles.emptyAnnouncementText, { color: colors.muted }]}>
                      No announcements yet
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Right Sidebar - Course Content & Chapters */}
        <View style={[styles.sidebar, { borderColor: colors.border }, isMobile && styles.mobileSidebar]}>
          <View style={[styles.sidebarContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.sidebarTitle, { color: colors.foreground }]}>
              Course Content & Chapters
            </Text>

            <View style={styles.chaptersList}>
              {courseDetails?.chapters?.map((chapter: any, index: number) => (
                <View key={chapter.id || index} style={[styles.chapterItem, { borderColor: colors.border }]}>
                  <TouchableOpacity
                    style={styles.chapterHeader}
                    onPress={() => toggleChapter(index)}
                  >
                    <Text style={[styles.chapterTitle, { color: colors.foreground }]}>
                      {chapter.name || `Chapter ${index + 1}`}
                    </Text>
                    <Ionicons
                      name={expandedChapter === index ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                  
                  {expandedChapter === index && (
                    <View style={[styles.chapterContent, { backgroundColor: colors.background }]}>
                      <View style={styles.subItemsList}>
                        {chapter.subtopics?.map((subtopic: any, subIndex: number) => (
                          <Text key={subtopic.id || subIndex} style={[styles.subItem, { color: colors.muted }]}>
                            {subtopic.name || `Subchapter ${subIndex + 1}`}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )) || (
                // Fallback chapters if no API data
                [1, 2, 3, 4, 5, 6, 7].map((chapter, index) => (
                  <View key={index} style={[styles.chapterItem, { borderColor: colors.border }]}>
                    <TouchableOpacity
                      style={styles.chapterHeader}
                      onPress={() => toggleChapter(index)}
                    >
                      <Text style={[styles.chapterTitle, { color: colors.foreground }]}>
                        {index < 3
                          ? '01 Intro'
                          : index === 3
                            ? '04 Introduction to gemini'
                            : '01 Introduction'}
                      </Text>
                      <Ionicons
                        name={expandedChapter === index ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={colors.muted}
                      />
                    </TouchableOpacity>
                    
                    {expandedChapter === index && (
                      <View style={[styles.chapterContent, { backgroundColor: colors.background }]}>
                        <View style={styles.subItemsList}>
                          <Text style={[styles.subItem, { color: colors.muted }]}>01 Introduction</Text>
                          <Text style={[styles.subItem, { color: colors.muted }]}>02 Introduction</Text>
                          <Text style={[styles.subItem, { color: colors.muted }]}>03 Introduction</Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  mobileContent: {
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    paddingRight: 16,
  },
  mobileMainContent: {
    paddingRight: 0,
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  statsRow: {
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
    fontWeight: '700',
    marginLeft: 4,
  },
  videoContainer: {
    height: 256,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    marginRight: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '700',
    marginBottom: 16,
  },
  tabDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 20,
  },
  learningList: {
    marginTop: 24,
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  learningText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  announcementsList: {
    gap: 16,
  },
  announcementItem: {
    padding: 16,
    borderRadius: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  announcementText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  sidebar: {
    width: 320,
    height: '100%',
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 2,
  },
  mobileSidebar: {
    width: '100%',
    height: 'auto',
  },
  sidebarContent: {
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    padding: 16,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  chaptersList: {
    gap: 8,
  },
  chapterItem: {
    borderWidth: 1,
    borderRadius: 2,
    overflow: 'hidden',
  },
  chapterHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  chapterContent: {
    padding: 12,
    borderTopWidth: 1,
  },
  subItemsList: {
    gap: 8,
  },
  subItem: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyAnnouncementContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyAnnouncementText: {
    fontSize: 14,
    marginTop: 12,
  },
});
