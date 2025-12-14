import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Flag,
  SkipForward,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../../../components/theme-provider';
import { DotLoader } from '../../../../components/ui/dot-loader';
import API_CONFIG from '../../../../config.api';
import { useAppSelector } from '../../../../store/hooks';

// API Response Interfaces
interface APIQuestion {
  id: number;
  text: string;
  option0: string;
  option1: string;
  option2: string;
  option3: string;
  correct_option: number;
  explanation: string;
}

interface APISubtopic {
  id: number;
  name: string;
  question_count: number;
  questions: APIQuestion[];
}

interface APIChapter {
  id: number;
  name: string;
  subtopics: APISubtopic[];
}

interface APIQuestionsResponse {
  id: number;
  name: string;
  total_questions: number;
  chapters: APIChapter[];
}

interface APIProgressQuestion {
  id: number;
  question: number;
  selected_option: number | null;
  is_flagged: boolean;
}

interface APIProgressResponse {
  id: number;
  course: number;
  attempted_questions: number;
  flagged_count: number;
  skipped_count: number;
  correct_count: number;
  last_viewed_question: number | null;
  is_submitted: boolean;
  questions?: APIProgressQuestion[];
  chapters?: any[];
}

interface APIProgressWrapper {
  id: number;
  course: number;
  data: APIProgressResponse;
  updated_at: string;
}

type QuestionStatus = 'correct' | 'incorrect' | 'skipped' | 'flagged';

interface Question {
  id: number;
  text: string;
  status: QuestionStatus;
  category: string;
  explanation: string;
  correct_option: string;
  isFlagged: boolean;
}

export default function QuizAnalyticsScreen() {
  const { token } = useAppSelector((state: any) => state.auth);
  const { courseDetails } = useAppSelector((state: any) => state.courseDetails);
  const colors = useColors();
  const router = useRouter();

  // Get course ID from navigation params
  const localParams = useLocalSearchParams<{ courseId?: string }>();
  const courseId = localParams.courseId || courseDetails?.id?.toString();
  const courseName = courseDetails?.name || '';

  // State to track which explanations are open
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});

  // API data states
  const [questionsData, setQuestionsData] = useState<APIQuestionsResponse | null>(null);
  const [progressData, setProgressData] = useState<APIProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noAnalytics, setNoAnalytics] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Toggle explanation visibility
  const toggleExplanation = (questionId: number) => {
    setOpenExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Fetch API data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseId || !token) {
          throw new Error('Missing course ID or token');
        }

        let questionsData: APIQuestionsResponse;
        let progressData: APIProgressResponse;

        try {
          // Fetch questions and progress in parallel
          const [questionsResponse, progressResponse] = await Promise.all([
            fetch(`${API_CONFIG.baseURL}/courses/${courseId}/question_page`, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(`${API_CONFIG.baseURL}/quiz_progress/${courseId}/latest-submitted-analytics/`, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
            }),
          ]);

          if (!questionsResponse.ok) {
            throw new Error(`Questions API failed: ${questionsResponse.status} ${questionsResponse.statusText}`);
          }

          if (!progressResponse.ok) {
            // Check for 404 or "No analytics found"
            if (progressResponse.status === 404) {
              const errorData = await progressResponse.json().catch(() => ({}));
              if (errorData.detail === 'No analytics found' || errorData.detail?.includes('No analytics')) {
                setNoAnalytics(true);
                setLoading(false);
                return;
              }
            }
            throw new Error(`Progress API failed: ${progressResponse.status} ${progressResponse.statusText}`);
          }

          questionsData = await questionsResponse.json();
          const progressWrapper: APIProgressWrapper = await progressResponse.json();

          // Check if response contains "No analytics found" message
          if (progressWrapper && typeof progressWrapper === 'object' && 'detail' in progressWrapper) {
            const detail = (progressWrapper as any).detail;
            if (detail === 'No analytics found' || detail?.includes('No analytics')) {
              setNoAnalytics(true);
              setLoading(false);
              return;
            }
          }

          // Extract data from the wrapper
          progressData = progressWrapper.data;
        } catch (fetchError) {
          console.error('Error fetching data:', fetchError);
          throw fetchError;
        }

        console.log('Questions API Response:', questionsData);
        console.log('Progress API Response:', progressData);

        setQuestionsData(questionsData);
        setProgressData(progressData);

        // Create progress map
        const progressMap = new Map<number, { selected_option: number | null; is_flagged: boolean }>();
        
        // Handle both nested chapters structure and flat questions array
        if (progressData.questions && Array.isArray(progressData.questions)) {
          // New structure: flat questions array
          progressData.questions.forEach(progressQuestion => {
            progressMap.set(progressQuestion.question, {
              selected_option: progressQuestion.selected_option,
              is_flagged: progressQuestion.is_flagged
            });
          });
        } else if (progressData.chapters && Array.isArray(progressData.chapters)) {
          // Old structure: nested chapters
          progressData.chapters.forEach((chapter: any) => {
            chapter.subtopics.forEach((subtopic: any) => {
              subtopic.questions.forEach((progressQuestion: any) => {
                progressMap.set(progressQuestion.question, {
                  selected_option: progressQuestion.selected_option,
                  is_flagged: progressQuestion.is_flagged
                });
              });
            });
          });
        }

        // Flatten questions and transform
        const transformedQuestions: Question[] = [];
        let questionNumber = 1;

        questionsData.chapters.forEach(chapter => {
          chapter.subtopics.forEach(subtopic => {
            subtopic.questions.forEach(apiQuestion => {
              const progressQuestion = progressMap.get(apiQuestion.id);
              
              let status: QuestionStatus = "skipped";
              
              if (progressQuestion) {
                if (progressQuestion.selected_option !== null) {
                  // Question has an answer - check if correct or incorrect
                  status = progressQuestion.selected_option === apiQuestion.correct_option ? "correct" : "incorrect";
                } else if (progressQuestion.is_flagged) {
                  // Question was flagged but not answered
                  status = "flagged";
                } else {
                  // Question was touched but not answered and not flagged
                  status = "skipped";
                }
              }
              // If no progressQuestion, status remains "skipped" (already set as default)

              // Get correct option text based on correct_option number
              const correctOptionText = apiQuestion[`option${apiQuestion.correct_option}` as keyof APIQuestion] as string;

              transformedQuestions.push({
                id: questionNumber++,
                text: apiQuestion.text,
                status,
                category: questionsData.name || courseName || "Quiz",
                explanation: apiQuestion.explanation,
                correct_option: correctOptionText,
                isFlagged: progressQuestion?.is_flagged || false
              });
            });
          });
        });

        setQuestions(transformedQuestions);
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) {
      fetchQuizData();
    }
  }, [courseId, token, courseName]);

  // Calculate statistics from API data (same approach as test analytics)
  const totalQuestions = questionsData?.total_questions || 0;
  const correctCount = progressData?.correct_count || 0;
  const attemptedQuestions = progressData?.attempted_questions || 0;
  const incorrectCount = attemptedQuestions - correctCount;
  const flaggedCount = progressData?.flagged_count || 0;
  const skippedCount = totalQuestions - attemptedQuestions;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const answeredCount = attemptedQuestions;

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading quiz results..." />
        </View>
      </View>
    );
  }

  // No analytics found state
  if (noAnalytics) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Quiz Not Submitted</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Complete a quiz first to see detailed analytics here.
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>Error: {error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setError(null);
              setLoading(true);
              // Retry fetch
              const fetchQuizData = async () => {
                // Retry logic here
                setLoading(false);
              };
              fetchQuizData();
            }}
          >
            <Text style={[styles.retryButtonText, { color: colors.primaryForeground }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.courseTitle, { color: colors.foreground }]}>
            {questionsData?.name || courseName || 'Quiz Analytics'}
          </Text>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: colors.mutedForeground }]}>
              Total Questions:{' '}
              <Text style={[styles.statsValue, { color: colors.primary }]}>{totalQuestions}</Text>
            </Text>
          </View>
        </View>

        {/* Accuracy and Answered Section */}
        <View style={styles.accuracySection}>
          <View style={styles.accuracyItem}>
            <Text style={[styles.accuracyLabel, { color: colors.mutedForeground }]}>Accuracy</Text>
            <Text style={[styles.accuracyValue, { color: colors.foreground }]}>{accuracy}%</Text>
          </View>
          <View style={styles.accuracyItem}>
            <Text style={[styles.accuracyLabel, { color: colors.mutedForeground }]}>Answered</Text>
            <Text style={[styles.answeredValue, { color: colors.foreground }]}>
              <Text style={[styles.answeredBold, { color: colors.foreground }]}>{answeredCount}</Text>/{totalQuestions}
            </Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: '#22c55e' }]}>
              <Check size={20} color="#ffffff" />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{correctCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Correct</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: '#dc2626' }]}>
              <X size={20} color="#ffffff" />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{incorrectCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Incorrect</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b' }]}>
              <Flag size={20} color="#ffffff" />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{flaggedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Flagged</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: '#6b7280' }]}>
              <SkipForward size={20} color="#ffffff" />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{skippedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Skipped</Text>
          </View>
        </View>

        {/* Questions List */}
        <View style={styles.questionsContainer}>
          <Text style={[styles.questionsTitle, { color: colors.foreground }]}>Question Details</Text>
          {questions.map((question) => (
            <View
              key={question.id}
              style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.questionHeader}>
                <View style={styles.questionInfo}>
                  <Text style={[styles.questionNumber, { color: colors.foreground }]}>
                    Question {question.id}
                  </Text>
                  <View style={styles.questionStatus}>
                    {question.status === 'correct' && (
                      <View style={[styles.statusBadge, { backgroundColor: '#22c55e' }]}>
                        <Check size={14} color="#ffffff" />
                        <Text style={styles.statusText}>Correct</Text>
                      </View>
                    )}
                    {question.status === 'incorrect' && (
                      <View style={[styles.statusBadge, { backgroundColor: '#dc2626' }]}>
                        <X size={14} color="#ffffff" />
                        <Text style={styles.statusText}>Incorrect</Text>
                      </View>
                    )}
                    {question.status === 'flagged' && (
                      <View style={[styles.statusBadge, { backgroundColor: '#f59e0b' }]}>
                        <Flag size={14} color="#ffffff" />
                        <Text style={styles.statusText}>Flagged</Text>
                      </View>
                    )}
                    {question.status === 'skipped' && (
                      <View style={[styles.statusBadge, { backgroundColor: '#6b7280' }]}>
                        <SkipForward size={14} color="#ffffff" />
                        <Text style={styles.statusText}>Skipped</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.explanationToggle}
                  onPress={() => toggleExplanation(question.id)}
                >
                  <Text style={[styles.explanationToggleText, { color: colors.primary }]}>
                    Explanation
                  </Text>
                  {openExplanations[question.id] ? (
                    <ChevronUp size={16} color={colors.primary} />
                  ) : (
                    <ChevronDown size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={[styles.questionText, { color: colors.foreground }]}>{question.text}</Text>

              {openExplanations[question.id] && (
                <View style={[styles.explanationContent, { backgroundColor: colors.background }]}>
                  <View style={styles.explanationSection}>
                    <Text style={[styles.explanationLabel, { color: colors.foreground }]}>
                      Correct Answer:
                    </Text>
                    <Text style={[styles.explanationValue, { color: '#22c55e' }]}>
                      {question.correct_option}
                    </Text>
                  </View>
                  <View style={styles.explanationSection}>
                    <Text style={[styles.explanationLabel, { color: colors.foreground }]}>
                      Explanation:
                    </Text>
                    <Text style={[styles.explanationBody, { color: colors.foreground }]}>
                      {question.explanation}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  accuracySection: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  accuracyItem: {
    alignItems: 'flex-start',
  },
  accuracyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  accuracyValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  answeredValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  answeredBold: {
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  questionsContainer: {
    marginBottom: 32,
  },
  questionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questionInfo: {
    flex: 1,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  questionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  explanationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  explanationToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 12,
  },
  explanationContent: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  explanationSection: {
    marginBottom: 12,
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanationValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  explanationBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
