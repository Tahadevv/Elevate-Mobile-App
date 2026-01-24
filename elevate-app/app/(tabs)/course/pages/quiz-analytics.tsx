import { useLocalSearchParams } from 'expo-router';
import {
    Check,
    ChevronDown,
    ChevronUp,
    FileText,
    Flag,
    SkipForward,
    X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useColors, useTheme } from '../../../../components/theme-provider';
import { PremiumLoader } from '../../../../components/ui/premium-loader';
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
  name?: string;
  chapters: {
    subtopics: {
      questions: APIQuestion[];
    }[];
  }[];
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
  chapters?: {
    subtopics: {
      questions: APIProgressQuestion[];
    }[];
  }[];
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

interface DonutChartData {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

interface DonutChartProps {
  data: DonutChartData[];
  size?: number;
  strokeWidth?: number;
  showCenterText?: boolean;
  centerText?: string;
  isDark?: boolean;
  colors: any;
}

// Donut Chart Component
const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 20,
  showCenterText = true,
  centerText = "Progress",
  isDark = false,
  colors
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const createPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", center, center,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  let cumulativePercentage = 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Data segments */}
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const startAngle = (cumulativePercentage / 100) * 360;
        const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
        
        cumulativePercentage += percentage;
        
        return (
          <Path
            key={index}
            d={createPath(startAngle, endAngle)}
            fill={item.color}
            stroke="none"
          />
        );
      })}
      
      {/* Center circle */}
      <Circle
        cx={center}
        cy={center}
        r={radius - strokeWidth}
        fill={isDark ? colors.card : '#ffffff'}
      />
      
      {/* Center text */}
      {showCenterText && (
        <SvgText
          x={center}
          y={center + 5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill={colors.muted}
        >
          {centerText}
        </SvgText>
      )}
    </Svg>
  );
};

export default function QuizAnalyticsScreen() {
  const { token } = useAppSelector((state: any) => state.auth);
  const { courseDetails } = useAppSelector((state: any) => state.courseDetails);
  const colors = useColors();
  const { isDark } = useTheme();

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
          // Fetch questions and progress in parallel - QUIZ API ENDPOINTS
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

        // Create progress map for quick lookup
        const progressMap = new Map<number, { selected_option: number | null; is_flagged: boolean }>();
        
        // Handle both nested chapters structure and flat questions array
        if (progressData.questions && Array.isArray(progressData.questions)) {
          // Flat questions array
          progressData.questions.forEach(progressQuestion => {
            progressMap.set(progressQuestion.question, {
              selected_option: progressQuestion.selected_option,
              is_flagged: progressQuestion.is_flagged
            });
          });
        } else if (progressData.chapters && Array.isArray(progressData.chapters)) {
          // Nested chapters structure
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

        // Transform API data to component format - Handle nested structure
        const transformedQuestions: Question[] = [];
        let questionNumber = 1;

        questionsData.chapters.forEach(chapter => {
          chapter.subtopics.forEach(subtopic => {
            subtopic.questions.forEach(apiQuestion => {
              const progressQuestion = progressMap.get(apiQuestion.id);

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

              transformedQuestions.push({
                id: questionNumber++, // Serial number instead of question ID
                text: apiQuestion.text,
                status,
                category: questionsData.name || courseName || 'Quiz',
                explanation: apiQuestion.explanation,
                correct_option: correctOptionText,
                isFlagged: progressQuestion?.is_flagged || false,
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

  // Calculate statistics from API data
  const totalQuestions = questions.length > 0 ? questions.length : (questionsData?.total_questions || 0);
  const correctCount = questions.length > 0 
    ? questions.filter(q => q.status === 'correct').length 
    : (progressData?.correct_count || 0);
  const attemptedQuestions = questions.length > 0
    ? questions.filter(q => q.status === 'correct' || q.status === 'incorrect').length
    : (progressData?.attempted_questions || 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const answeredCount = attemptedQuestions;

  // Calculate chart data from questions
  const chartData = useMemo(() => {
    const correct = questions.filter(q => q.status === 'correct').length;
    const incorrect = questions.filter(q => q.status === 'incorrect').length;
    const flagged = questions.filter(q => q.isFlagged).length;
    const skipped = questions.filter(q => q.status === 'skipped').length;

    return [
      {
        label: 'Correct',
        value: correct,
        color: '#22c55e',
        icon: <Check size={16} color="white" />
      },
      {
        label: 'Incorrect',
        value: incorrect,
        color: '#dc2626',
        icon: <X size={16} color="white" />
      },
      {
        label: 'Flagged',
        value: flagged,
        color: '#6b7280',
        icon: <Flag size={16} color="white" />
      },
      {
        label: 'Skipped',
        value: skipped,
        color: '#d1d5db',
        icon: <SkipForward size={16} color="white" />
      }
    ];
  }, [questions]);

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <PremiumLoader text="Loading quiz results..." size="large" />
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
                try {
                  if (!courseId || !token) {
                    throw new Error('Missing course ID or token');
                  }

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

                  if (!questionsResponse.ok || !progressResponse.ok) {
                    throw new Error('Failed to fetch data');
                  }

                  const questionsData = await questionsResponse.json();
                  const progressWrapper = await progressResponse.json();
                  const progressData = progressWrapper.data;

                  // Create progress map
                  const progressMap = new Map<number, { selected_option: number | null; is_flagged: boolean }>();
                  
                  if (progressData.questions && Array.isArray(progressData.questions)) {
                    progressData.questions.forEach((progressQuestion: any) => {
                      progressMap.set(progressQuestion.question, {
                        selected_option: progressQuestion.selected_option,
                        is_flagged: progressQuestion.is_flagged
                      });
                    });
                  } else if (progressData.chapters && Array.isArray(progressData.chapters)) {
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

                  // Transform questions
                  const transformedQuestions: Question[] = [];
                  let questionNumber = 1;

                  questionsData.chapters.forEach((chapter: any) => {
                    chapter.subtopics.forEach((subtopic: any) => {
                      subtopic.questions.forEach((apiQuestion: any) => {
                        const progressQuestion = progressMap.get(apiQuestion.id);
                        let status: QuestionStatus = 'skipped';

                        if (progressQuestion && progressQuestion.selected_option !== null) {
                          status = progressQuestion.selected_option === apiQuestion.correct_option ? 'correct' : 'incorrect';
                        }

                        const correctOptionText = apiQuestion[`option${apiQuestion.correct_option}` as keyof APIQuestion] as string;

                        transformedQuestions.push({
                          id: questionNumber++,
                          text: apiQuestion.text,
                          status,
                          category: questionsData.name || courseName || 'Quiz',
                          explanation: apiQuestion.explanation,
                          correct_option: correctOptionText,
                          isFlagged: progressQuestion?.is_flagged || false,
                        });
                      });
                    });
                  });

                  setQuestionsData(questionsData);
                  setProgressData(progressData);
                  setQuestions(transformedQuestions);
                  setError(null);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to load quiz data');
                } finally {
                  setLoading(false);
                }
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
              <View style={styles.semicircleContainer}>
                <Svg width={60} height={30} viewBox="0 0 60 30">
                  {/* Background semicircle */}
                  <Path
                    d="M 5 25 A 25 25 0 0 1 55 25"
                    stroke="#E6E6E6"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Progress semicircle */}
                  {accuracy > 0 && (
                    <Path
                      d={`M 5 25 A 25 25 0 ${accuracy > 50 ? 1 : 0} 1 ${5 + (accuracy / 100) * 50} ${25 - Math.sin((accuracy / 100) * Math.PI) * 25}`}
                      stroke="#4CAF50"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />
                  )}
                </Svg>
              </View>
              <Text style={[styles.accuracyValue, { color: colors.foreground }]}>{accuracy}%</Text>
            </View>
          </View>
          <View style={styles.accuracyItem}>
            <Text style={[styles.accuracyLabel, { color: colors.mutedForeground }]}>Answered</Text>
            <Text style={[styles.answeredValue, { color: colors.foreground }]}>
              <Text style={{ fontWeight: '900' }}>{answeredCount}</Text>/{totalQuestions}
            </Text>
          </View>
        </View>

        {/* Progress Chart Section */}
        <View style={styles.progressSection}>
          <Text style={[styles.progressTitle, { color: colors.foreground }]}>Overall Progress</Text>
          <View style={styles.chartContainer}>
            <DonutChart
              data={chartData}
              size={240}
              strokeWidth={30}
              showCenterText={true}
              centerText="Progress"
              isDark={isDark}
              colors={colors}
            />
          </View>
          
          {/* Legend */}
          <View style={styles.legend}>
            {/* First row: Correct and Incorrect */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: chartData[0].color }]}>
                  {chartData[0].icon}
                </View>
                <Text style={[styles.legendText, { color: colors.foreground }]}>
                  {chartData[0].label.toLowerCase()} {chartData[0].value}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: chartData[1].color }]}>
                  {chartData[1].icon}
                </View>
                <Text style={[styles.legendText, { color: colors.foreground }]}>
                  {chartData[1].label.toLowerCase()} {chartData[1].value}
                </Text>
              </View>
            </View>
            {/* Second row: Flagged and Skipped */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: chartData[2].color }]}>
                  {chartData[2].icon}
                </View>
                <Text style={[styles.legendText, { color: colors.foreground }]}>
                  {chartData[2].label.toLowerCase()} {chartData[2].value}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, { backgroundColor: chartData[3].color }]}>
                  {chartData[3].icon}
                </View>
                <Text style={[styles.legendText, { color: colors.foreground }]}>
                  {chartData[3].label.toLowerCase()} {chartData[3].value}
                </Text>
              </View>
            </View>
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
                {/* Left side: Icon, Question number, and Status */}
                <View style={styles.questionInfo}>
                  <View style={styles.questionIcon}>
                    <FileText size={20} color={colors.foreground} />
                  </View>
                  <Text style={[styles.questionNumber, { color: colors.foreground }]}>
                    {question.id}
                  </Text>
                  {/* Status indicator */}
                  {question.status === 'correct' && (
                    <View style={[styles.statusIndicator, { backgroundColor: '#16a34a' }]}>
                      <Check size={12} color="#ffffff" />
                    </View>
                  )}
                  {question.status === 'incorrect' && (
                    <View style={[styles.statusIndicator, { backgroundColor: '#dc2626' }]}>
                      <X size={12} color="#ffffff" />
                    </View>
                  )}
                  {question.status === 'skipped' && (
                    <View style={[styles.statusIndicator, { backgroundColor: '#6b7280' }]}>
                      <SkipForward size={12} color="#ffffff" />
                    </View>
                  )}
                  {question.isFlagged && (
                    <View style={[styles.statusIndicator, { backgroundColor: '#ca8a04' }]}>
                      <Flag size={12} color="#ffffff" />
                    </View>
                  )}
                </View>

                {/* Right side: Category badge with chevron */}
                <View style={styles.questionActions}>
                  <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                    <Text style={[styles.categoryText, { color: colors.foreground }]}>
                      {question.category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleExplanation(question.id)}
                  >
                    {openExplanations[question.id] ? (
                      <ChevronUp size={16} color={colors.mutedForeground} />
                    ) : (
                      <ChevronDown size={16} color={colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Question Text */}
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {question.text}
              </Text>


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
                      Explaination:
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 32,
    gap: 40,
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
    gap: 12,
  },
  semicircleContainer: {
    width: 60,
    height: 30,
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
  progressSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    width: '100%',
    height: 250,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    gap: 12,
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  questionIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 16,
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
