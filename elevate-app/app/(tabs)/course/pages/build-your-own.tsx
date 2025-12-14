import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Flag } from 'lucide-react-native';
import CourseSidebar from '../../../../components/CourseSidebar';
import Topbar from '../../../../components/dashboardItems/topbar';
import { useColors } from '../../../../components/theme-provider';

interface QuestionSection {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function BuildYourOwnScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('build-your-own');
  const [flaggedQuestions, setFlaggedQuestions] = useState<QuestionSection[]>([
    {
      id: "flagged-1",
      title: "Flagged Questions",
      description: "But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.But make this panel take up the entire length of the dashboard.",
      enabled: false,
    },
    {
      id: "flagged-2",
      title: "Flagged Questions",
      description: "But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.But make this panel take up the entire length of the dashboard.",
      enabled: false,
    },
    {
      id: "flagged-3",
      title: "Flagged Questions",
      description: "But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.But make this panel take up the entire length of the dashboard.",
      enabled: false,
    },
  ]);

  const [quantitySection, setQuantitySection] = useState({
    enabled: false,
    value: "50",
  });
  
  const colors = useColors();
  const router = useRouter();

  const toggleFlaggedQuestion = (id: string) => {
    setFlaggedQuestions(
      flaggedQuestions.map((question) => 
        question.id === id ? { ...question, enabled: !question.enabled } : question
      ),
    );
  };

  const toggleQuantitySection = () => {
    setQuantitySection({
      ...quantitySection,
      enabled: !quantitySection.enabled,
    });
  };

  const handleQuantityChange = (text: string) => {
    setQuantitySection({
      ...quantitySection,
      value: text,
    });
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
                Build your own quiz
              </Text>
              <TouchableOpacity 
                style={[styles.startButton, { backgroundColor: colors.accent }]}
                onPress={() => {}}
              >
                <Text style={[styles.startButtonText, { color: colors.background }]}>
                  Start Quiz
                </Text>
              </TouchableOpacity>
            </View>

            {/* Questions Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Questions
              </Text>
              <View style={styles.questionsList}>
                {flaggedQuestions.map((question) => (
                  <View
                    key={question.id}
                    style={[
                      styles.questionCard,
                      { 
                        backgroundColor: colors.card,
                        borderColor: question.enabled ? colors.foreground : colors.border,
                        borderWidth: question.enabled ? 2 : 1
                      }
                    ]}
                  >
                    <View style={styles.questionContent}>
                      <View style={styles.questionInfo}>
                        <View style={styles.questionIcon}>
                          <Flag size={16} color={colors.foreground} />
                        </View>
                        <View style={styles.questionText}>
                          <Text style={[styles.questionTitle, { color: colors.foreground }]}>
                            {question.title}
                          </Text>
                          <Text style={[styles.questionDescription, { color: colors.muted }]}>
                            {question.description}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Custom Switch */}
                      <TouchableOpacity
                        style={[
                          styles.switch,
                          { 
                            backgroundColor: question.enabled ? colors.foreground : colors.border,
                            borderColor: colors.border
                          }
                        ]}
                        onPress={() => toggleFlaggedQuestion(question.id)}
                      >
                        <View style={[
                          styles.switchThumb,
                          { 
                            backgroundColor: colors.background,
                            transform: [{ translateX: question.enabled ? 16 : 0 }]
                          }
                        ]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Quantity Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Quantity
              </Text>
              <View
                style={[
                  styles.quantityCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: quantitySection.enabled ? colors.yellow : colors.border,
                    borderWidth: quantitySection.enabled ? 2 : 1
                  }
                ]}
              >
                <View style={styles.quantityHeader}>
                  <View style={styles.quantityInfo}>
                    <View style={styles.quantityIcon}>
                      <Flag size={16} color={colors.foreground} />
                    </View>
                    <View style={styles.quantityText}>
                      <Text style={[styles.quantityTitle, { color: colors.foreground }]}>
                        Quantity of questions
                      </Text>
                      <Text style={[styles.quantityDescription, { color: colors.muted }]}>
                        But make this panel take up the entire length of the dashboard. But make this panel take up the entire length of the dashboard.But make this panel take up the entire length of the dashboard.
                      </Text>
                    </View>
                  </View>
                  
                  {/* Custom Switch */}
                  <TouchableOpacity
                    style={[
                      styles.switch,
                      { 
                        backgroundColor: quantitySection.enabled ? colors.yellow : colors.border,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={toggleQuantitySection}
                  >
                    <View style={[
                      styles.switchThumb,
                      { 
                        backgroundColor: colors.background,
                        transform: [{ translateX: quantitySection.enabled ? 16 : 0 }]
                      }
                    ]} />
                  </TouchableOpacity>
                </View>

                <View style={styles.quantityInputSection}>
                  <Text style={[styles.quantityInputLabel, { color: colors.foreground }]}>
                    Value
                  </Text>
                  <TextInput
                    style={[
                      styles.quantityInput,
                      { 
                        color: colors.foreground,
                        borderColor: colors.border,
                        backgroundColor: colors.background
                      }
                    ]}
                    value={quantitySection.value}
                    onChangeText={handleQuantityChange}
                    maxLength={200}
                  />
                </View>
              </View>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  questionsList: {
    gap: 12,
  },
  questionCard: {
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  questionIcon: {
    marginTop: 2,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
  },
  questionText: {
    flex: 1,
    paddingRight: 32,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  questionDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  quantityCard: {
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
  },
  quantityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  quantityIcon: {
    marginTop: 2,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
  },
  quantityText: {
    flex: 1,
    paddingRight: 32,
  },
  quantityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  quantityDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  quantityInputSection: {
    paddingLeft: 36,
  },
  quantityInputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  quantityInput: {
    maxWidth: 200,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
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
