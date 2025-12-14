import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AlertTriangle, Flag, SkipForward, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CourseSidebar from '../../../../components/CourseSidebar';
import Topbar from '../../../../components/dashboardItems/topbar';
import { useColors } from '../../../../components/theme-provider';

// Course data structure
interface Question {
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

interface Chapter {
  name: string;
  questions: Question[];
}

interface Course {
  courseName: string;
  chapters: Chapter[];
}

export default function AssessmentScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('assessment');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapterProgress, setChapterProgress] = useState<number[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[][]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[][]>([]);
  
  const colors = useColors();
  const router = useRouter();

  // Course data
  const course: Course = {
    courseName: "Introduction to TypeScript",
    chapters: [
      {
        name: "Chapter 1: Basics",
        questions: [
          {
            question: "What is TypeScript?",
            options: ["A programming language", "A database", "A CSS framework", "A text editor"],
            correctOption: "A programming language",
            explanation: "TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript.",
          },
          {
            question: "Which extension is used for TypeScript files?",
            options: [".js", ".ts", ".tsx", ".json"],
            correctOption: ".ts",
            explanation: ".ts is the standard file extension for TypeScript files.",
          },
          {
            question: "What does TypeScript improve over JavaScript?",
            options: ["Speed", "Type safety", "File size", "Performance"],
            correctOption: "Type safety",
            explanation: "TypeScript adds static type checking to JavaScript, improving developer experience and reducing bugs.",
          },
        ],
      },
      {
        name: "Chapter 2: Types",
        questions: [
          {
            question: "Which is a basic type in TypeScript?",
            options: ["string", "file", "document", "element"],
            correctOption: "string",
            explanation: "TypeScript supports basic types like string, number, and boolean.",
          },
          {
            question: "How do you annotate a number type?",
            options: ["let x: int", "let x: number", "let x: float", "let x: numeric"],
            correctOption: "let x: number",
            explanation: "TypeScript uses 'number' for all numeric values.",
          },
        ],
      },
    ],
  };

  // Initialize state arrays
  useEffect(() => {
    setChapterProgress(course.chapters.map(() => 0));
    setCompletedQuestions(course.chapters.map((chapter) => Array(chapter.questions.length).fill(false)));
    setFlaggedQuestions(course.chapters.map((chapter) => Array(chapter.questions.length).fill(false)));
  }, []);

  // Current question data
  const currentChapter = course.chapters[currentChapterIndex];
  const currentQuestion = currentChapter.questions[currentQuestionIndex];
  const totalQuestions = course.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0);

  // Calculate total progress and chapter progress
  useEffect(() => {
    if (completedQuestions.length === 0) return;
    
    // Calculate overall progress
    const completedCount = completedQuestions.flat().filter(Boolean).length;
    setProgress((completedCount / totalQuestions) * 100);

    // Calculate progress for each chapter
    const newChapterProgress = completedQuestions.map((chapterQuestions, idx) => {
      const completed = chapterQuestions.filter(Boolean).length;
      const total = course.chapters[idx].questions.length;
      return (completed / total) * 100;
    });
    setChapterProgress(newChapterProgress);
  }, [completedQuestions, totalQuestions]);

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    // Mark question as completed
    const newCompletedQuestions = [...completedQuestions];
    newCompletedQuestions[currentChapterIndex][currentQuestionIndex] = true;
    setCompletedQuestions(newCompletedQuestions);
  };

  // Handle continue button
  const handleContinue = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    // Move to next question or chapter
    if (currentQuestionIndex < currentChapter.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentChapterIndex < course.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  // Handle skip button
  const handleSkip = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    // Move to next question or chapter
    if (currentQuestionIndex < currentChapter.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentChapterIndex < course.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  // Handle flag button
  const handleFlag = () => {
    const newFlaggedQuestions = [...flaggedQuestions];
    newFlaggedQuestions[currentChapterIndex][currentQuestionIndex] =
      !newFlaggedQuestions[currentChapterIndex][currentQuestionIndex];
    setFlaggedQuestions(newFlaggedQuestions);
  };

  // Get question number out of total
  const getQuestionNumber = () => {
    let questionNumber = 1;
    for (let i = 0; i < currentChapterIndex; i++) {
      questionNumber += course.chapters[i].questions.length;
    }
    questionNumber += currentQuestionIndex;
    return questionNumber;
  };

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Navigate to the corresponding course page
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
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.accent,
                    width: `${progress}%`
                  }
                ]} 
              />
            </View>
          </View>

          {/* Question content */}
          <View style={styles.questionContainer}>
            <View style={styles.questionHeader}>
              <View style={styles.questionCounter}>
                <Text style={[styles.questionCounterText, { color: colors.muted }]}>
                  Question <Text style={[styles.questionNumber, { color: colors.accent }]}>{getQuestionNumber()}</Text> of <Text style={[styles.questionNumber, { color: colors.accent }]}>{totalQuestions}</Text>
                </Text>
              </View>
              
              <View style={styles.questionActions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleSkip}>
                  <SkipForward size={12} color={colors.muted} />
                  <Text style={[styles.actionText, { color: colors.muted }]}>Skip</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    flaggedQuestions[currentChapterIndex]?.[currentQuestionIndex] && { color: colors.yellow }
                  ]} 
                  onPress={handleFlag}
                >
                  <Flag size={12} color={flaggedQuestions[currentChapterIndex]?.[currentQuestionIndex] ? colors.yellow : colors.muted} />
                  <Text style={[
                    styles.actionText, 
                    { color: flaggedQuestions[currentChapterIndex]?.[currentQuestionIndex] ? colors.yellow : colors.muted }
                  ]}>Flag</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/course/course-details')}
                >
                  <X size={16} color={colors.muted} />
                  <Text style={[styles.actionText, { color: colors.muted }]}>Quit</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Question */}
            <View style={styles.questionSection}>
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {currentQuestion.question}
              </Text>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionItem,
                      { borderColor: colors.border },
                      selectedOption === option && option === currentQuestion.correctOption && {
                        backgroundColor: colors.accent + '20',
                        borderColor: colors.accent,
                      },
                      selectedOption === option && option !== currentQuestion.correctOption && {
                        backgroundColor: colors.destructive + '20',
                        borderColor: colors.destructive,
                      },
                    ]}
                    onPress={() => handleOptionSelect(option)}
                    disabled={isAnswered}
                  >
                    <View style={styles.optionContent}>
                      <View style={[
                        styles.optionRadio,
                        { borderColor: colors.border },
                        selectedOption === option && { backgroundColor: colors.background },
                      ]} />
                      <Text style={[styles.optionText, { color: colors.foreground }]}>
                        {option}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Explanation */}
              {isAnswered && (
                <View style={[styles.explanationContainer, { 
                  backgroundColor: colors.accent + '20', 
                  borderColor: colors.accent 
                }]}>
                  <Text style={[styles.explanationTitle, { color: colors.foreground }]}>
                    Explanation:
                  </Text>
                  <Text style={[styles.explanationText, { color: colors.foreground }]}>
                    {currentQuestion.explanation}
                  </Text>
                </View>
              )}
            </View>

            {/* Continue button */}
            {isAnswered && (
              <TouchableOpacity 
                style={[styles.continueButton, { 
                  borderColor: colors.border,
                  backgroundColor: colors.card
                }]}
                onPress={handleContinue}
              >
                <Text style={[styles.continueButtonText, { color: colors.foreground }]}>
                  Continue
                </Text>
              </TouchableOpacity>
            )}

            {/* Report issue */}
            <View style={styles.reportSection}>
              <Text style={[styles.reportText, { color: colors.muted }]}>
                have issue in this question?
              </Text>
              <TouchableOpacity style={styles.reportButton}>
                <Text style={[styles.reportButtonText, { color: colors.foreground }]}>
                  report an issue
                </Text>
                <AlertTriangle size={12} color={colors.foreground} />
              </TouchableOpacity>
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
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 48,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  questionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionCounter: {
    flex: 1,
  },
  questionCounterText: {
    fontSize: 14,
    fontWeight: '900',
  },
  questionNumber: {
    fontWeight: '900',
  },
  questionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionSection: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  optionItem: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  explanationContainer: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  continueButton: {
    width: 128,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  reportSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportButtonText: {
    fontSize: 12,
    fontWeight: '900',
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
