import { useRouter } from 'expo-router';
import { ChevronRight, Flag } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../../../components/theme-provider';

interface Chapter {
  id: number;
  title: string;
  description: string;
  enabled: boolean;
}

export default function ChaptersScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: "Chapter 1",
      description: "But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.",
      enabled: true,
    },
    {
      id: 2,
      title: "Chapter 2",
      description: "But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.",
      enabled: false,
    },
    {
      id: 3,
      title: "Chapter 3",
      description: "But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.",
      enabled: false,
    },
    {
      id: 5,
      title: "Chapter 5",
      description: "But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.",
      enabled: false,
    },
  ]);
  
  const colors = useColors();
  const router = useRouter();

  const toggleChapter = (id: number) => {
    setChapters(chapters.map((chapter) => 
      chapter.id === id ? { ...chapter, enabled: !chapter.enabled } : chapter
    ));
  };

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    switch (tabName) {
      case 'course-details':
        router.push('/course/course-details');
        break;
      case 'notes':
        router.push('/course/notes');
        break;
      case 'tutorial':
        router.push('/course/tutorial');
        break;
      case 'result':
        router.push('/course/result');
        break;
      case 'assessment':
        router.push('/course/Information-Mock-Assessment');
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
     
      
      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { marginLeft: sidebarOpen ? 300 : 0 }
      ]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.foreground }]}>
                Chapters
              </Text>
              <TouchableOpacity 
                style={[styles.nextButton, { backgroundColor: colors.accent }]}
                onPress={() => {}}
              >
                <Text style={[styles.nextButtonText, { color: colors.background }]}>
                  Next
                </Text>
                <ChevronRight size={16} color={colors.background} />
              </TouchableOpacity>
            </View>

            {/* Select Label */}
            <View style={styles.selectSection}>
              <Text style={[styles.selectLabel, { color: colors.foreground }]}>
                select
              </Text>
            </View>

            {/* Chapters List */}
            <View style={styles.chaptersList}>
              {chapters.map((chapter) => (
                <View
                  key={chapter.id}
                  style={[
                    styles.chapterCard,
                    { 
                      backgroundColor: colors.card,
                      borderColor: chapter.enabled ? colors.accent : colors.border,
                      borderWidth: chapter.enabled ? 2 : 1
                    }
                  ]}
                >
                  <View style={styles.chapterContent}>
                    <View style={styles.chapterInfo}>
                      <View style={styles.chapterIcon}>
                        <Flag size={16} color={colors.foreground} />
                      </View>
                      <View style={styles.chapterText}>
                        <Text style={[styles.chapterTitle, { color: colors.foreground }]}>
                          {chapter.title}
                        </Text>
                        <Text style={[styles.chapterDescription, { color: colors.muted }]}>
                          {chapter.description}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Custom Switch */}
                    <TouchableOpacity
                      style={[
                        styles.switch,
                        { 
                          backgroundColor: chapter.enabled ? colors.accent : colors.border,
                          borderColor: colors.border
                        }
                      ]}
                      onPress={() => toggleChapter(chapter.id)}
                    >
                      <View style={[
                        styles.switchThumb,
                        { 
                          backgroundColor: colors.background,
                          transform: [{ translateX: chapter.enabled ? 16 : 0 }]
                        }
                      ]} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: 'white',
  },
  selectSection: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  chaptersList: {
    gap: 12,
  },
  chapterCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  chapterContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  chapterIcon: {
    marginTop: 2,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterText: {
    flex: 1,
    paddingRight: 32,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  chapterDescription: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
});
