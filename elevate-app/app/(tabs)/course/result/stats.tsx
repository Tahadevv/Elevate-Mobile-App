import { useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown, ChevronUp, FileText, Flag, SkipForward, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useColors, useTheme } from '../../../../components/theme-provider';
import { CircularProgressWithLabel } from '../../../../components/ui/CircularProgress';
import { DotLoader } from '../../../../components/ui/dot-loader';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchQuizAnalytics } from '../../../../store/slices/analyticsSlice';

// Define question type
type QuestionStatus = "correct" | "incorrect" | "flagged" | "skipped"

interface Question {
  id: number;
  text: string;
  status: QuestionStatus;
  category: string;
  explanation: string;
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
      {/* Background circle */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={isDark ? '#374151' : '#f3f4f6'}
        strokeWidth={strokeWidth}
      />
      
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

// API Response Types
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
  name: string;
  total_questions: number;
  chapters: Array<{
    id: number;
    name: string;
    subtopics: Array<{
      id: number;
      name: string;
      questions: APIQuestion[];
    }>;
  }>;
}

interface APIProgressResponse {
  correct_count: number;
  attempted_questions: number;
  flagged_count: number;
  skipped_count: number;
  chapters?: Array<{
    chapter: number;
    subtopics: Array<{
      subtopic: number;
      questions: Array<{
        question: number;
        selected_option: number | null;
        is_flagged: boolean;
      }>;
    }>;
  }>;
  questions?: Array<{
    question: number;
    selected_option: number | null;
    is_flagged: boolean;
  }>;
}

export default function StatsScreen() {
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const colors = useColors();
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: any) => state.auth);
  const { analytics, isLoading, error, noAnalytics } = useAppSelector((state: any) => state.quizAnalytics);
  // Get courseId from params with fallback to Redux courseDetails
  const localParams = useLocalSearchParams<{ courseId?: string }>();
  const { courseDetails } = useAppSelector((state: any) => state.courseDetails);
  const courseId = localParams.courseId || courseDetails?.id?.toString();

  // Fetch quiz analytics
  useEffect(() => {
    if (token && courseId) {
      console.log('📊 Fetching quiz analytics for stats screen, course ID:', courseId);
      // @ts-ignore - dispatch type issue
      dispatch(fetchQuizAnalytics({ courseId, token }) as any);
    } else {
      console.warn('⚠️ Missing courseId or token for quiz analytics:', { courseId, hasToken: !!token });
    }
  }, [token, courseId, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Quiz Analytics Error', error);
    }
  }, [error]);

  // Transform API data to component format
  useEffect(() => {
    if (analytics && analytics.questions) {
      // Handle case where progress might be null (no analytics yet)
      if (!analytics.progress) {
        // If no progress data, show empty state
        setQuestions([]);
        return;
      }
      const questionsData: APIQuestionsResponse = analytics.questions;
      const progressData: APIProgressResponse = analytics.progress;

      // Create progress map
      const progressMap = new Map<number, { selected_option: number | null; is_flagged: boolean }>();
      
      // Handle both nested chapters structure and flat questions array
      if (progressData.questions && Array.isArray(progressData.questions)) {
        progressData.questions.forEach(progressQuestion => {
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
                status = progressQuestion.selected_option === apiQuestion.correct_option ? "correct" : "incorrect";
              } else if (progressQuestion.is_flagged) {
                status = "flagged";
              } else {
                status = "skipped";
              }
            }

            const correctOptionText = apiQuestion[`option${apiQuestion.correct_option}` as keyof APIQuestion] as string;

            transformedQuestions.push({
              id: questionNumber++,
              text: apiQuestion.text,
              status,
              category: questionsData.name || courseDetails?.name || "Quiz",
              explanation: apiQuestion.explanation,
            });
          });
        });
      });

      setQuestions(transformedQuestions);
    }
  }, [analytics, courseDetails]);

  // Calculate statistics from API data (use API values directly, not calculated from questions array)
  const questionsData = analytics?.questions as APIQuestionsResponse | null;
  const progressData = analytics?.progress as APIProgressResponse | null;
  
  // Use API values directly - these come from the backend
  // Ensure all values are numbers, not undefined/null
  const totalQuestions = Number(questionsData?.total_questions) || 0;
  const correctCount = Number(progressData?.correct_count) || 0; // From API
  const attemptedQuestions = Number(progressData?.attempted_questions) || 0; // From API
  const incorrectCount = Math.max(0, attemptedQuestions - correctCount); // Calculated: attempted - correct
  const flaggedCount = Number(progressData?.flagged_count) || 0; // From API
  const skippedCount = Number(progressData?.skipped_count) ?? Math.max(0, totalQuestions - attemptedQuestions); // Use API skipped_count if available, else calculate
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const answeredCount = attemptedQuestions; // This is the actual answered count from API

  // Toggle explanation visibility
  const toggleExplanation = (questionId: number) => {
    setOpenExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Calculate chart data from API values (not from questions array to ensure accuracy)
  const chartData = useMemo(() => {
    // Use API values directly instead of counting from questions array
    const correct = correctCount; // From API
    const incorrect = incorrectCount; // From API (attempted - correct)
    const flagged = flaggedCount; // From API
    const skipped = skippedCount; // From API or calculated

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
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading quiz analytics..." />
        </View>
      </View>
    );
  }

  // No analytics state
  if (noAnalytics || (!analytics?.progress && !isLoading)) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: colors.foreground }]}>
                No Quiz Analytics Found
              </Text>
              <Text style={[styles.noDataSubtext, { color: colors.mutedForeground }]}>
                Complete a quiz to see detailed analytics here.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }



  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              {questionsData?.name || courseDetails?.name || 'Quiz Analytics'}
            </Text>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Total Questions:</Text>
                <Text style={[styles.statValue, { color: '#2563eb' }]}>{String(totalQuestions)}</Text>
              </View>
            </View>
          </View>

          {/* Accuracy and Answered Section */}
          <View style={styles.accuracySection}>
            <CircularProgressWithLabel
              value={Number(correctCount) || 0}
              max={Number(totalQuestions) || 1}
              label="Accuracy"
              size={36}
              color="#4CAF50"
              backgroundColor="#E6E6E6"
              textColor={colors.foreground}
              labelColor={colors.muted}
            />
            
            <View style={styles.accuracyItem}>
              <Text style={[styles.accuracyLabel, { color: colors.muted }]}>Answered</Text>
              <Text style={[styles.answeredValue, { color: colors.foreground }]}>
                <Text style={[styles.answeredBold, { color: colors.foreground }]}>{String(answeredCount)}</Text>/{String(totalQuestions)}
              </Text>
            </View>
          </View>

          {/* Progress Chart Section */}
          <View style={styles.progressSection}>
            <Text style={[styles.progressTitle, { color: colors.foreground }]}>Overall Progress</Text>
            <View style={styles.chartContainer}>
              <DonutChart
                data={chartData}
                size={200}
                strokeWidth={20}
                showCenterText={true}
                centerText="Progress"
                isDark={isDark}
                colors={colors}
              />
            </View>
            
            {/* Legend */}
            <View style={styles.legend}>
              {chartData.map((item, index) => {
                const total = chartData.reduce((sum, data) => sum + data.value, 0);
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                
                return (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendIcon, { backgroundColor: item.color }]}>
                      {item.icon}
                    </View>
                    <Text style={[styles.legendText, { color: colors.foreground }]}>
                      {String(percentage)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Question Details */}
          <View style={styles.questionsSection}>
            {questions.map((question) => (
              <View key={question.id} style={[styles.questionCard, { 
                backgroundColor: colors.card, 
                borderColor: colors.border 
              }]}>
                                 <View style={styles.questionHeader}>
                   <View style={styles.questionInfo}>
                     <View style={styles.questionIcon}>
                       <FileText size={20} color={colors.foreground} />
                     </View>
                     <Text style={[styles.questionNumber, { color: colors.foreground }]}>
                       {question.id}
                     </Text>

                     {/* Status Indicator */}
                     {question.status === "correct" && (
                       <View style={styles.statusIndicator}>
                         <View style={[styles.statusIcon, { backgroundColor: '#22c55e' }]}>
                           <Check size={12} color="#ffffff" />
                         </View>
                       </View>
                     )}

                     {question.status === "incorrect" && (
                       <View style={styles.statusIndicator}>
                         <View style={[styles.statusIcon, { backgroundColor: '#dc2626' }]}>
                           <X size={12} color="#ffffff" />
                         </View>
                       </View>
                     )}

                     {question.status === "flagged" && (
                       <View style={styles.statusIndicator}>
                         <View style={[styles.statusIcon, { backgroundColor: '#6b7280' }]}>
                           <Flag size={12} color="#ffffff" />
                         </View>
                       </View>
                     )}

                     {question.status === "skipped" && (
                       <View style={styles.statusIndicator}>
                         <View style={[styles.statusIcon, { backgroundColor: '#9ca3af' }]}>
                           <SkipForward size={12} color="#ffffff" />
                         </View>
                       </View>
                     )}
                   </View>

                   <View style={styles.questionActions}>
                                           <View style={styles.categoryContainer}>
                        <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                          <Text style={[styles.categoryText, { color: colors.foreground }]}>
                            {question.category}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.explanationButton}
                        onPress={() => toggleExplanation(question.id)}
                      >
                        {openExplanations[question.id] ? (
                          <ChevronUp size={16} color={colors.muted} />
                        ) : (
                          <ChevronDown size={16} color={colors.muted} />
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
                   <View style={[styles.explanationContent, { backgroundColor: colors.background }]}>
                     <Text style={[styles.explanationLabel, { color: colors.foreground }]}>Explanation:</Text>
                     <Text style={[styles.explanationBody, { color: colors.foreground }]}>
                       {question.explanation}
                     </Text>
                   </View>
                 )}                
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  accuracySection: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 32,
  },
  accuracyItem: {
    alignItems: 'flex-start',
  },
  accuracyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  accuracyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  semiCircle: {
    width: 24,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeBackground: {
    width: 20,
    height: 16,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 0,
  },
  gaugeFill: {
    position: 'absolute',
    width: 20,
    height: 16,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 0,
    transform: [{ rotate: '90deg' }],
  },
  accuracyValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  answeredValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  answeredBold: {
    fontWeight: '900',
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
  chartWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutChart: {
    width: 200,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  chartSegments: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  donutSlice: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: 0,
    left: 0,
    transformOrigin: 'center',
  },
  centerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  legend: {
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
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
  },
  questionsSection: {
    gap: 16,
  },
  questionCard: {
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    marginLeft: 8,
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  categoryContainer: {
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  explanationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  explanationContent: {
    padding: 16,
    paddingTop: 0,
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanationBody: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
  },
});
