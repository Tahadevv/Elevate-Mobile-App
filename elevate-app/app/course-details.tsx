import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CourseDetailsPage() {
  const [activeTab, setActiveTab] = useState<'about' | 'announcement'>('about');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(3);

  const toggleChapter = (index: number) => {
    if (expandedChapter === index) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Explore the Gemini API</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>Total 20 questions</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="document-text-outline" size={16} color="#666" />
                <Text style={styles.statText}>7 Chapters</Text>
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
                <Text style={styles.description}>
                  Colab notebooks allow you to combine executable code and rich text in a single document, along with
                  images, HTML, LaTeX and more. When you create your own Colab notebooks, they are stored in your Google
                  Drive account. You can easily share your Colab notebooks with co-workers or friends, allowing them to
                  comment on your notebooks or even edit them.
                </Text>
                <Text style={styles.description}>
                  Colab notebooks allow you to combine executable code and rich text in a single document, along with
                  images, HTML, LaTeX and more. When you create your own Colab notebooks, they are stored in your Google
                  Drive account.
                </Text>

                <Text style={styles.learningTitle}>What will you learn here</Text>
                <View style={styles.learningList}>
                  {[
                    'Go to Google AI Studio and try working with your Google account.',
                    'Go to Google AI Studio and try working with your Google account.',
                    'Go to Google AI Studio and try working with your Google account.',
                    'Go to Google AI Studio and try working with the code and tools.',
                  ].map((item, index) => (
                    <View key={index} style={styles.learningItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#166534" />
                      <Text style={styles.learningItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'announcement' && (
              <View style={styles.tabContent}>
                <Text style={styles.tabTitle}>Announcement</Text>
                <View style={styles.announcementList}>
                  {[1, 2, 3].map((item, index) => (
                    <View key={index} style={styles.announcementItem}>
                      <View style={styles.announcementHeader}>
                        <Ionicons name="megaphone-outline" size={20} color="#333" />
                        <Text style={styles.announcementTitle}>Do you know ?</Text>
                      </View>
                      <Text style={styles.announcementText}>
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
        <View style={styles.sidebar}>
          <View style={styles.sidebarContent}>
            <Text style={styles.sidebarTitle}>Course Content & Chapters</Text>
            <View style={styles.chaptersList}>
              {[1, 2, 3, 4, 5, 6, 7].map((chapter, index) => (
                <View key={index} style={styles.chapterItem}>
                  <TouchableOpacity
                    style={styles.chapterButton}
                    onPress={() => toggleChapter(index)}
                  >
                    <Text style={styles.chapterTitle}>
                      {index < 3
                        ? '01 Intro'
                        : index === 3
                        ? '04 Introduction to gemini'
                        : '01 Introduction'}
                    </Text>
                    <Ionicons
                      name={expandedChapter === index ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#666"
                    />
                  </TouchableOpacity>
                  {expandedChapter === index && (
                    <View style={styles.chapterContent}>
                      <Text style={styles.chapterSubItem}>01 Introduction</Text>
                      <Text style={styles.chapterSubItem}>02 Introduction</Text>
                      <Text style={styles.chapterSubItem}>03 Introduction</Text>
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
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#f0f0ff',
  },
  activeTabButton: {
    backgroundColor: '#ffd404',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffd404',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  tabContent: {
    borderWidth: 2,
    padding: 24,
    borderRadius: 6,
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
    borderRadius: 6,
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
});
