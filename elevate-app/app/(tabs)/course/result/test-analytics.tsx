import { useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown, ChevronUp, FileText, Flag, SkipForward, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useColors, useTheme } from '../../../../components/theme-provider';
import { CircularProgressWithLabel } from '../../../../components/ui/CircularProgress';
import { DotLoader } from '../../../../components/ui/dot-loader';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchTestAnalytics } from '../../../../store/slices/analyticsSlice';

// Define question type
type QuestionStatus = "correct" | "incorrect" | "flagged" | "skipped"

interface Question {
  id: number;
  text: string;
  status: QuestionStatus;
  category: string;
  explanation: string;
  correct_option: string;
  isFlagged: boolean;
}

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

export default function TestAnalyticsScreen() {
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const colors = useColors();
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: any) => state.auth);
  const { analytics, isLoading, error, noAnalytics } = useAppSelector((state: any) => state.testAnalytics);
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  // Toggle explanation visibility
  const toggleExplanation = (questionId: number) => {
    setOpenExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Fetch test analytics
  useEffect(() => {
    if (token && courseId) {
      dispatch(fetchTestAnalytics({ courseId, token }) as any);
    }
  }, [token, courseId, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Test Analytics Error', error);
    }
  }, [error]);

  // Transform API data to component format
  useEffect(() => {
    if (analytics && analytics.questions && analytics.progress) {
      const questionsData: APIQuestionsResponse = analytics.questions;
      const progressData: APIProgressResponse = analytics.progress;

      const transformedQuestions = questionsData.questions.map((apiQuestion, index) => {
        const progressQuestion = progressData.questions.find(pq => pq.question === apiQuestion.id);
        
        let status: QuestionStatus = "skipped";
        
        // Determine status based on answer
        if (progressQuestion && progressQuestion.selected_option !== null) {
          status = progressQuestion.selected_option === apiQuestion.correct_option ? "correct" : "incorrect";
        } else {
          status = "skipped";
        }

        // Get correct option text
        const correctOptionText = apiQuestion[`option${apiQuestion.correct_option}` as keyof APIQuestion] as string;

        return {
          id: index + 1,
          text: apiQuestion.text,
          status,
          category: "Test", // You can modify this based on your needs
          explanation: apiQuestion.explanation,
          correct_option: correctOptionText,
          isFlagged: progressQuestion?.is_flagged || false
        };
      });

      setQuestions(transformedQuestions);
    }
  }, [analytics]);

  // Calculate statistics from API data
  const questionsData = analytics?.questions as APIQuestionsResponse | null;
  const progressData = analytics?.progress as APIProgressResponse | null;
  
  const totalQuestions = questionsData?.total_questions || 0;
  const correctCount = progressData?.correct_count || 0;
  const attemptedQuestions = progressData?.attempted_questions || 0;
  const incorrectCount = attemptedQuestions - correctCount;
  const flaggedCount = progressData?.flagged_count || 0;
  const skippedCount = totalQuestions - attemptedQuestions;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const answeredCount = attemptedQuestions;

  // Calculate chart data from questions
  const chartData = useMemo(() => {
    const correct = questions.filter(q => q.status === 'correct').length;
    const incorrect = questions.filter(q => q.status === 'incorrect').length;
    const flagged = questions.filter(q => q.status === 'flagged' || q.isFlagged).length;
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
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading test results..." />
        </View>
      </View>
    );
  }

  // No analytics state
  if (noAnalytics || !analytics || !analytics.questions) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.noDataContainer}>
              <Text style={[styles.noDataText, { color: colors.foreground }]}>
                No test analytics found
              </Text>
              <Text style={[styles.noDataSubtext, { color: colors.mutedForeground }]}>
                Complete a test to see detailed analytics here.
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
              Test Analytics
            </Text>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Total Questions:</Text>
                <Text style={[styles.statValue, { color: '#2563eb' }]}>{totalQuestions}</Text>
              </View>
            </View>
          </View>

          {/* Accuracy and Answered Section */}
          <View style={styles.accuracySection}>
            <CircularProgressWithLabel
              value={correctCount}
              max={totalQuestions}
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
                <Text style={[styles.answeredBold, { color: colors.foreground }]}>{answeredCount}</Text>/{totalQuestions}
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
                      {percentage}%
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
                    <Text style={[styles.correctAnswerLabel, { color: colors.foreground }]}>Correct Answer:</Text>
                    <Text style={[styles.correctAnswerBody, { color: '#22c55e' }]}>
                      {question.correct_option}
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
    marginBottom: 8,
  },
  correctAnswerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  correctAnswerBody: {
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
});

