import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useColors } from '../../components/theme-provider';

const { width } = Dimensions.get('window');

export default function CoursePage() {
  const [activeTab, setActiveTab] = useState<'about' | 'announcement'>('about');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(3);
  const { courseName } = useLocalSearchParams<{ courseName: string }>();
  const router = useRouter();
  const colors = useColors();

  const toggleChapter = (index: number) => {
    if (expandedChapter === index) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(index);
    }
  };



  // Default course name if none is provided
  const displayCourseName = courseName || 'Explore the Gemini API';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>


          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {displayCourseName}
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>
                  Total 20 questions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="document-text-outline" size={16} color={colors.muted} />
                <Text style={[styles.statText, { color: colors.muted }]}>
                  7 Chapters
                </Text>
              </View>
            </View>
          </View>

          {/* Course Image */}
          <View style={[styles.imageContainer, { borderColor: colors.border }]}>
            <Image
              source={require('../../assets/images/animation.png')}
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
                  { backgroundColor: '#f0f0ff' },
                  activeTab === 'about' && [styles.activeTabButton, { backgroundColor: colors.yellow }]
                ]}
                onPress={() => setActiveTab('about')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: colors.yellow },
                    activeTab === 'about' && [styles.activeTabButtonText, { color: '#ffffff' }]
                  ]}
                >
                  About the Course
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  { backgroundColor: '#f0f0ff' },
                  activeTab === 'announcement' && [styles.activeTabButton, { backgroundColor: colors.yellow }]
                ]}
                onPress={() => setActiveTab('announcement')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: colors.yellow },
                    activeTab === 'announcement' && [styles.activeTabButtonText, { color: '#ffffff' }]
                  ]}
                >
                  Announcement
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <View style={[styles.tabContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.tabTitle, { color: colors.foreground }]}>About the Course</Text>
                <Text style={[styles.description, { color: colors.muted }]}>
                  Colab notebooks allow you to combine executable code and rich text in a single document, along with
                  images, HTML, LaTeX and more. When you create your own Colab notebooks, they are stored in your Google
                  Drive account. You can easily share your Colab notebooks with co-workers or friends, allowing them to
                  comment on your notebooks or even edit them.
                </Text>
                <Text style={[styles.description, { color: colors.muted }]}>
                  Colab notebooks allow you to combine executable code and rich text in a single document, along with
                  images, HTML, LaTeX and more. When you create your own Colab notebooks, they are stored in your Google
                  Drive account.
                </Text>

                <Text style={[styles.learningTitle, { color: colors.foreground }]}>What will you learn here</Text>
                <View style={styles.learningList}>
                  {[
                    'Go to Google AI Studio and try working with your Google account.',
                    'Go to Google AI Studio and try working with your Google account.',
                    'Go to Google AI Studio and try working with your Google account.',
                    'Go to Google AI Studio and try working with the code and tools.',
                  ].map((item, index) => (
                    <View key={index} style={styles.learningItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#166534" />
                      <Text style={[styles.learningItemText, { color: colors.muted }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'announcement' && (
              <View style={[styles.tabContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.tabTitle, { color: colors.foreground }]}>Announcement</Text>
                <View style={styles.announcementList}>
                  {[1, 2, 3].map((item, index) => (
                    <View key={index} style={styles.announcementItem}>
                      <View style={styles.announcementHeader}>
                        <Ionicons name="megaphone-outline" size={20} color={colors.foreground} />
                        <Text style={[styles.announcementTitle, { color: colors.foreground }]}>Do you know ?</Text>
                      </View>
                      <Text style={[styles.announcementText, { color: colors.muted }]}>
                        Colab notebooks with co-workers or friends, allowing them to comment on your notebooks or even
                        edit them.
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Right Sidebar - Course Content */}
        <View style={[styles.sidebar, { borderColor: colors.border }]}>
          <View style={styles.sidebarContent}>
            <Text style={[styles.sidebarTitle, { color: colors.foreground }]}>Course Content & Chapters</Text>
            <View style={styles.chaptersList}>
              {[1, 2, 3, 4, 5, 6, 7].map((chapter, index) => (
                <View key={index} style={[styles.chapterItem, { borderColor: colors.border }]}>
                  <TouchableOpacity
                    style={styles.chapterButton}
                    onPress={() => toggleChapter(index)}
                  >
                    <Text style={[styles.chapterTitle, { color: colors.foreground }]}>
                      {index < 3
                        ? `0${index + 1} Intro`
                        : index === 3
                          ? `04 Introduction to gemini`
                          : `0${index + 1} Introduction`
                      }
                    </Text>
                    {expandedChapter === index ? (
                      <Ionicons name="chevron-up" size={16} color={colors.muted} />
                    ) : (
                      <Ionicons name="chevron-down" size={16} color={colors.muted} />
                    )}
                  </TouchableOpacity>
                  {expandedChapter === index && (
                    <View style={[styles.chapterContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                      <Text style={[styles.chapterSubItem, { color: colors.muted }]}>01 Introduction</Text>
                      <Text style={[styles.chapterSubItem, { color: colors.muted }]}>02 Introduction</Text>
                      <Text style={[styles.chapterSubItem, { color: colors.muted }]}>03 Introduction</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
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
    marginLeft: 4,
  },
  imageContainer: {
    height: 256,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 0,
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
  },
  activeTabButton: {
    // backgroundColor will be set dynamically
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    // color will be set dynamically
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
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
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
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  announcementList: {
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
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  announcementText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  sidebar: {
    width: width * 0.9,
    maxWidth: 384,
    paddingVertical: 16,
    borderWidth: 2,
    alignSelf: 'center',
    marginBottom: 40,
    borderRadius: 2,
  },
  sidebarContent: {
    padding: 16,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chaptersList: {
    gap: 8,
  },
  chapterItem: {
    borderWidth: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  chapterButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f0f0ff',
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chapterContent: {
    padding: 12,
    borderTopWidth: 1,
  },
  chapterSubItem: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});
