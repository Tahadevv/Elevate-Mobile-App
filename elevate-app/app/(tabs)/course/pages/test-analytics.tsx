import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Flag,
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

interface APIQuestionsResponse {
  total_questions: number;
  questions: APIQuestion[];
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
  questions: APIProgressQuestion[];
}

interface APIProgressWrapper {
  id: number;
  course: number;
  data: APIProgressResponse;
  updated_at: string;
}

type QuestionStatus = 'correct' | 'incorrect' | 'skipped';

interface Question {
  id: number;
  text: string;
  status: QuestionStatus;
  category: string;
  explanation: string;
  correct_option: string;
  isFlagged: boolean;
}

export default function TestAnalyticsScreen() {
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
            fetch(`${API_CONFIG.baseURL}/courses/${courseId}/full_test_page/`, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(`${API_CONFIG.baseURL}/test_progress/${courseId}/latest-submitted-analytics/`, {
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

        // Transform API data to component format
        const transformedQuestions = questionsData.questions.map((apiQuestion, index) => {
          const progressQuestion = progressData.questions.find((pq) => pq.question === apiQuestion.id);

          let status: QuestionStatus = 'skipped';

          // Determine status based on answer (not flagged status)
          if (progressQuestion && progressQuestion.selected_option !== null) {
            // Check if answer is correct or incorrect
            status = progressQuestion.selected_option === apiQuestion.correct_option ? 'correct' : 'incorrect';
          } else {
            // No answer selected = skipped
            status = 'skipped';
          }

          // Get correct option text based on correct_option number
          const correctOptionText = apiQuestion[`option${apiQuestion.correct_option}` as keyof APIQuestion] as string;

          return {
            id: index + 1, // Serial number instead of question ID
            text: apiQuestion.text,
            status,
            category: courseName,
            explanation: apiQuestion.explanation,
            correct_option: correctOptionText,
            isFlagged: progressQuestion?.is_flagged || false,
          };
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

  // Calculate statistics from API data
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
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Test Not Submitted</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Attempt full test first
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
          <Text style={[styles.courseTitle, { color: colors.foreground }]}>{courseName}</Text>
          <View style={styles.statsRow}>
            <Text style={[styles.statsLabel, { color: colors.mutedForeground }]}>
              Total Questions:{' '}
              <Text style={[styles.statsValue, { color: colors.primary }]}>{totalQuestions}</Text>
            </Text>
          </View>
        </View>

        {/* Accuracy and Answered */}
        <View style={styles.accuracySection}>
          <View style={styles.accuracyItem}>
            <Text style={[styles.accuracyLabel, { color: colors.mutedForeground }]}>Accuracy</Text>
            <View style={styles.accuracyValueContainer}>
              <View style={[styles.semicircleProgress, { borderColor: colors.primary }]}>
                <Text style={[styles.accuracyValue, { color: colors.foreground }]}>{accuracy}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.accuracyItem}>
            <Text style={[styles.accuracyLabel, { color: colors.mutedForeground }]}>Answered</Text>
            <Text style={[styles.answeredValue, { color: colors.foreground }]}>
              <Text style={{ fontWeight: '900' }}>{answeredCount}</Text>/{totalQuestions}
            </Text>
          </View>
        </View>

        {/* Overall Progress Stats */}
        <View style={styles.progressStats}>
          <View style={styles.progressStatItem}>
            <View style={[styles.statIcon, { backgroundColor: '#86efac' }]}>
              <Check size={12} color="#16a34a" strokeWidth={3.5} />
            </View>
            <Text style={[styles.statText, { color: colors.foreground }]}>
              correct {correctCount} Questions
            </Text>
          </View>
          <View style={styles.progressStatItem}>
            <View style={[styles.statIcon, { backgroundColor: '#fecaca' }]}>
              <X size={12} color="#dc2626" strokeWidth={2.5} />
            </View>
            <Text style={[styles.statText, { color: colors.foreground }]}>
              incorrect {incorrectCount} Questions
            </Text>
          </View>
          <View style={styles.progressStatItem}>
            <View style={[styles.statIcon, { backgroundColor: '#fef08a' }]}>
              <Flag size={12} color="#ca8a04" />
            </View>
            <Text style={[styles.statText, { color: colors.foreground }]}>
              flagged {flaggedCount} Questions
            </Text>
          </View>
          <View style={styles.progressStatItem}>
            <View style={[styles.statIcon, { backgroundColor: '#d1d5db' }]}>
              <ChevronUp size={12} color="#6b7280" strokeWidth={2.5} />
            </View>
            <Text style={[styles.statText, { color: colors.foreground }]}>
              skipped {skippedCount} Questions
            </Text>
          </View>
        </View>

        {/* Question Details */}
        <View style={styles.questionsContainer}>
          {questions.map((question) => (
            <View
              key={question.id}
              style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.questionHeader}>
                {/* Left side: Question info */}
                <View style={styles.questionInfo}>
                  <Text style={[styles.questionNumber, { color: colors.foreground }]}>
                    Question No. {question.id}
                  </Text>

                  <View style={styles.statusBadges}>
                    {/* Status badge (correct/incorrect/skipped) */}
                    {question.status === 'correct' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIcon, { backgroundColor: '#16a34a' }]}>
                          <Check size={12} color="#ffffff" />
                        </View>
                        <Text style={[styles.statusText, { color: '#16a34a' }]}>Correct</Text>
                      </View>
                    )}

                    {question.status === 'incorrect' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIcon, { backgroundColor: '#dc2626' }]}>
                          <X size={12} color="#ffffff" />
                        </View>
                        <Text style={[styles.statusText, { color: '#dc2626' }]}>Incorrect</Text>
                      </View>
                    )}

                    {question.status === 'skipped' && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIcon, { backgroundColor: '#6b7280' }]}>
                          <ChevronUp size={12} color="#ffffff" strokeWidth={2.5} />
                        </View>
                        <Text style={[styles.statusText, { color: '#6b7280' }]}>Skipped</Text>
                      </View>
                    )}

                    {/* Flagged indicator */}
                    {question.isFlagged && (
                      <View style={styles.statusBadge}>
                        <View style={[styles.statusIcon, { backgroundColor: '#ca8a04' }]}>
                          <Flag size={12} color="#ffffff" />
                        </View>
                        <Text style={[styles.statusText, { color: '#ca8a04' }]}>Flagged</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Right side: Category and Explanation toggle */}
                <View style={styles.questionActions}>
                  <View style={[styles.categoryBadge, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.categoryText, { color: colors.foreground }]}>
                      {question.category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.explanationToggle}
                    onPress={() => toggleExplanation(question.id)}
                  >
                    <Text style={[styles.explanationToggleText, { color: colors.mutedForeground }]}>
                      Explanation
                    </Text>
                    {openExplanations[question.id] ? (
                      <ChevronUp size={16} color={colors.mutedForeground} />
                    ) : (
                      <ChevronDown size={16} color={colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Question Text */}
              <Text style={[styles.questionText, { color: colors.foreground }]}>{question.text}</Text>

              {/* Explanation Content */}
              {openExplanations[question.id] && (
                <View style={styles.explanationContainer}>
                  <View style={styles.explanationSection}>
                    <Text style={[styles.explanationLabel, { color: colors.foreground }]}>
                      Correct Answer:
                    </Text>
                    <Text style={[styles.explanationText, { color: colors.foreground }]}>
                      {question.correct_option}
                    </Text>
                  </View>
                  <View style={styles.explanationSection}>
                    <Text style={[styles.explanationLabel, { color: colors.foreground }]}>
                      Explanation:
                    </Text>
                    <Text style={[styles.explanationText, { color: colors.foreground }]}>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
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
    gap: 24,
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsValue: {
    fontWeight: '900',
  },
  accuracySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 24,
  },
  accuracyItem: {
    alignItems: 'flex-start',
  },
  accuracyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  accuracyValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  semicircleProgress: {
    width: 40,
    height: 20,
    borderWidth: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accuracyValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  answeredValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressStats: {
    marginBottom: 24,
    gap: 12,
  },
  progressStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
  },
  questionsContainer: {
    gap: 16,
  },
  questionCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  questionInfo: {
    flex: 1,
    marginRight: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  explanationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  explanationToggleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  explanationContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  explanationSection: {
    marginBottom: 12,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
});

