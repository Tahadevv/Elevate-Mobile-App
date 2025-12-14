import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertTriangle,
  ChevronRight,
  Flag,
  FlagOff,
  SkipForward,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../../../components/theme-provider';
import API_CONFIG from '../../../../config.api';
import { useAppSelector } from '../../../../store/hooks';
import { useSupportModal, SupportModalProvider } from '../../../../components/dashboardItems/support-modal';
import { DotLoader } from '../../../../components/ui/dot-loader';

// API Response interfaces
export interface ApiQuestion {
  id: number;
  text: string;
  option0: string;
  option1: string;
  option2: string;
  option3: string;
  correct_option: number;
  explanation: string;
}

export interface QuestionsApiResponse {
  total_questions: number;
  questions: ApiQuestion[];
}

export interface ProgressQuestion {
  id: number;
  question: number;
  selected_option: number | null;
  is_flagged: boolean;
}

export interface ProgressApiResponse {
  id: number;
  course: number;
  attempted_questions: number;
  last_viewed_question: number | null;
  is_submitted: boolean;
  questions: ProgressQuestion[];
}

// Local question structure
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  selectedOption: number | null;
  isFlagged: boolean;
}

function TestScreenContent() {
  const { token } = useAppSelector((state: any) => state.auth);
  const { courseDetails } = useAppSelector((state: any) => state.courseDetails);
  const colors = useColors();
  const router = useRouter();
  const { openSupportModal } = useSupportModal();
  
  // Get course ID from navigation params
  const localParams = useLocalSearchParams<{ courseId?: string }>();
  const courseId = localParams.courseId || courseDetails?.id?.toString();
  const courseName = courseDetails?.name || '';

  // State for API data
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progressData, setProgressData] = useState<ProgressApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasShownMessage = useRef(false);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>([]);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      if (!courseId || !token) {
        throw new Error('Missing course ID or token');
      }

      const response = await fetch(`${API_CONFIG.baseURL}/courses/${courseId}/full_test_page/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data: QuestionsApiResponse = await response.json();

      // Transform API data to local format with null checks
      const transformedQuestions: Question[] = (data.questions || [])
        .filter((apiQ: ApiQuestion) => apiQ && apiQ.id && apiQ.text) // Filter out invalid questions
        .map((apiQ: ApiQuestion) => ({
          id: apiQ.id,
          question: apiQ.text || 'No question text available',
          options: [
            apiQ.option0 || 'Option A',
            apiQ.option1 || 'Option B',
            apiQ.option2 || 'Option C',
            apiQ.option3 || 'Option D',
          ].filter(opt => opt !== null && opt !== undefined), // Filter out null/undefined options
          correctOption: apiQ.correct_option ?? 0,
          explanation: apiQ.explanation || '',
          selectedOption: null,
          isFlagged: false,
        }));

      setQuestions(transformedQuestions);
      setCompletedQuestions(Array(transformedQuestions.length).fill(false));
      setFlaggedQuestions(Array(transformedQuestions.length).fill(false));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    }
  };

  // Submit handler function
  const submitHandler = async (question_id: number, selected_option: number | null, is_flagged: boolean) => {
    const payload = {
      question_id: question_id,
      selected_option: selected_option,
      is_flagged: is_flagged,
    };

    try {
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_CONFIG.baseURL}/test_progress/update_question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Success:', data);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  // Fetch progress from API
  const fetchProgress = async () => {
    try {
      if (!courseId || !token) {
        throw new Error('Missing course ID or token');
      }

      const response = await fetch(`${API_CONFIG.baseURL}/test_progress/${courseId}/progress/?source=content`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }

      const data: ProgressApiResponse = await response.json();
      setProgressData(data);

      // Update questions with progress data and calculate other state
      setQuestions((prevQuestions) => {
        if (!prevQuestions || prevQuestions.length === 0) return prevQuestions;
        if (!data || !data.questions) return prevQuestions;

        // Update completed questions based on progress
        const newCompletedQuestions = prevQuestions.map((q) => {
          if (!q || !q.id) return false;
          const progressQ = data.questions?.find((pq) => pq && pq.question === q.id);
          return progressQ?.selected_option !== null && progressQ?.selected_option !== undefined;
        });
        setCompletedQuestions(newCompletedQuestions);

        // Update flagged questions
        const newFlaggedQuestions = prevQuestions.map((q) => {
          if (!q || !q.id) return false;
          const progressQ = data.questions?.find((pq) => pq && pq.question === q.id);
          return progressQ?.is_flagged || false;
        });
        setFlaggedQuestions(newFlaggedQuestions);

        // Determine starting question based on last_viewed_question ID
        let startingIndex = 0;

        if (data.last_viewed_question !== null && data.last_viewed_question !== undefined) {
          const lastViewedIndex = prevQuestions.findIndex((q) => q && q.id === data.last_viewed_question);
          if (lastViewedIndex !== -1) {
            const nextIndex = lastViewedIndex + 1;
            if (nextIndex < prevQuestions.length) {
              startingIndex = nextIndex;
            } else {
              startingIndex = lastViewedIndex;
            }
          }
        } else {
          const lastAttemptedIndex = newCompletedQuestions.findIndex((completed) => !completed);
          if (lastAttemptedIndex !== -1) {
            startingIndex = lastAttemptedIndex;
          }
        }

        // Ensure startingIndex is valid
        if (startingIndex < 0 || startingIndex >= prevQuestions.length) {
          startingIndex = 0;
        }

        // Set current question index and restore its state
        setCurrentQuestionIndex(startingIndex);
        const startingQuestion = prevQuestions[startingIndex];
        if (startingQuestion && startingQuestion.id) {
          const progressQ = data.questions?.find((pq) => pq && pq.question === startingQuestion.id);
          if (
            progressQ?.selected_option !== null &&
            progressQ?.selected_option !== undefined &&
            progressQ.selected_option >= 0 &&
            progressQ.selected_option <= 3
          ) {
            setSelectedOption(progressQ.selected_option);
            setIsAnswered(true);
          } else {
            setSelectedOption(null);
            setIsAnswered(false);
          }
        }

        // Return updated questions
        return prevQuestions.map((q) => {
          if (!q || !q.id) return q;
          const progressQ = data.questions?.find((pq) => pq && pq.question === q.id);
          return {
            ...q,
            selectedOption: progressQ?.selected_option || null,
            isFlagged: progressQ?.is_flagged || false,
          };
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    }
  };

  // Load data on component mount
  const hasFetchedDataRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchQuestions();
      await fetchProgress();
      setLoading(false);
    };

    if (!hasFetchedDataRef.current && courseId && token) {
      hasFetchedDataRef.current = true;
      loadData();
    }
  }, [courseId, token]);

  // Show start/continue modal when data is loaded
  useEffect(() => {
    if (!loading && questions.length > 0 && !hasShownMessage.current) {
      const timer = setTimeout(() => {
        setShowStartModal(true);
        hasShownMessage.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, questions.length]);

  // Close start modal handler
  const closeStartModal = () => {
    setShowStartModal(false);
  };

  // Handle cancel - redirect to course page
  const handleCancel = () => {
    router.push('/course/course-details');
  };

  // Current question data
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Navigate to specific question
  const navigateToQuestion = (questionIdx: number) => {
    if (questionIdx < 0 || questionIdx >= questions.length) return;
    const question = questions[questionIdx];
    if (!question) return;
    
    setCurrentQuestionIndex(questionIdx);
    setSelectedOption(question.selectedOption || null);
    setIsAnswered(question.selectedOption !== null && question.selectedOption !== undefined);
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption === optionIndex) {
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setSelectedOption(optionIndex);
      setIsAnswered(true);
    }

    // Update questions state
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === currentQuestionIndex
          ? { ...q, selectedOption: optionIndex === selectedOption ? null : optionIndex }
          : q
      )
    );

    // Mark question as completed if an option is selected
    const newCompletedQuestions = [...completedQuestions];
    newCompletedQuestions[currentQuestionIndex] = optionIndex !== selectedOption && optionIndex !== null;
    setCompletedQuestions(newCompletedQuestions);
  };

  // Handle continue button
  const handleContinue = async () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ || !currentQ.id) {
      Alert.alert('Error', 'Invalid question data');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitHandler(
        currentQ.id,
        selectedOption,
        flaggedQuestions[currentQuestionIndex] || false
      );
      setSelectedOption(null);
      setIsAnswered(false);

      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        try {
          const res = await fetch(`${API_CONFIG.baseURL}/test_progress/${courseId}/submit/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (res.ok) {
            Alert.alert('Success', 'Quiz submitted successfully');
            router.push('/course/pages/test-analytics');
          }
        } catch (error) {
          console.error('Error submitting quiz:', error);
          Alert.alert('Error', 'Failed to submit quiz');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle skip button
  const handleSkip = async () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ || !currentQ.id) {
      Alert.alert('Error', 'Invalid question data');
      return;
    }

    await submitHandler(currentQ.id, null as any, flaggedQuestions[currentQuestionIndex] || false);
    setSelectedOption(null);
    setIsAnswered(false);

    // Mark question as completed
    const newCompletedQuestions = [...completedQuestions];
    newCompletedQuestions[currentQuestionIndex] = true;
    setCompletedQuestions(newCompletedQuestions);

    // Update questions state to reflect skipped status
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === currentQuestionIndex ? { ...q, selectedOption: 10 } : q
      )
    );

    // Move to next question or submit if it's the last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Handle flag button
  const handleFlag = () => {
    const newFlaggedQuestions = [...flaggedQuestions];
    newFlaggedQuestions[currentQuestionIndex] = !newFlaggedQuestions[currentQuestionIndex];
    setFlaggedQuestions(newFlaggedQuestions);

    // Update questions state
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === currentQuestionIndex ? { ...q, isFlagged: !q.isFlagged } : q
      )
    );
  };

  // Get question number out of total
  const getQuestionNumber = () => {
    return currentQuestionIndex + 1;
  };

  // Handle quit quiz button
  const handleQuitQuiz = () => {
    setShowQuitModal(true);
  };

  // Confirm quit quiz
  const confirmQuitQuiz = async () => {
    setShowQuitModal(false);
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/test_progress/${courseId}/quit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert('Success', 'Quiz Quitted.');
        router.push('/course/course-details');
      } else {
        Alert.alert('Error', 'Failed to quit quiz');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to quit quiz');
    }
  };

  // Cancel quit quiz
  const cancelQuitQuiz = () => {
    setShowQuitModal(false);
  };

  // Handle submit quiz button
  const handleSubmitQuiz = () => {
    setShowSubmitModal(true);
  };

  // Confirm submit quiz
  const confirmSubmitQuiz = async () => {
    setShowSubmitModal(false);
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/test_progress/${courseId}/submit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert('Success', 'Quiz submitted.');
        router.push('/course/pages/test-analytics');
      } else {
        Alert.alert('Error', 'Failed to submit quiz');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  // Cancel submit quiz
  const cancelSubmitQuiz = () => {
    setShowSubmitModal(false);
  };

  // Show error state
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
              fetchQuestions();
              fetchProgress();
              setLoading(false);
            }}
          >
            <Text style={[styles.retryButtonText, { color: colors.primaryForeground }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            No questions available
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading questions..." />
        </View>
      </View>
    );
  }

  // Calculate progress percentage
  const progressPercentage = totalQuestions > 0 ? ((getQuestionNumber() - 1) / totalQuestions) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Quit Confirmation Modal */}
      <Modal visible={showQuitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Quit Quiz?</Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>
              Are you sure you want to quit? All your progress will be lost and you won't be able to recover it.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.border }]}
                onPress={cancelQuitQuiz}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDanger, { backgroundColor: '#dc2626' }]}
                onPress={confirmQuitQuiz}
              >
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>Quit Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Submit Confirmation Modal */}
      <Modal visible={showSubmitModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Submit Quiz?</Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>
              Are you sure you want to submit your quiz? Once submitted, you won't be able to make any changes to your answers.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.border }]}
                onPress={cancelSubmitQuiz}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSuccess, { backgroundColor: '#16a34a' }]}
                onPress={confirmSubmitQuiz}
              >
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>Submit Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Start/Continue Test Modal */}
      <Modal visible={showStartModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {progressData && progressData.attempted_questions > 0 ? 'Continue Test' : 'Start Test'}
            </Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>
              You are now going to {progressData && progressData.attempted_questions > 0 ? 'continue' : 'start'} the full test of all the topics and subtopics of the course:{' '}
              <Text style={[styles.modalTextBold, { color: colors.foreground }]}>{courseName || 'the course'}</Text>
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.border }]}
                onPress={handleCancel}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSuccess, { backgroundColor: '#16a34a' }]}
                onPress={closeStartModal}
              >
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.courseTitle, { color: colors.foreground }]}>{courseName}</Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarContainer, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>

        {/* Question Header */}
        <View style={styles.questionHeader}>
          <Text style={[styles.questionNumber, { color: colors.mutedForeground }]}>
            Question <Text style={{ color: colors.primary }}>{getQuestionNumber()}</Text> of{' '}
            <Text style={{ color: colors.primary }}>{totalQuestions}</Text>
          </Text>
          <View style={styles.questionActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSkip}>
              <SkipForward size={16} color={colors.foreground} strokeWidth={3} />
              <Text style={[styles.actionButtonText, { color: colors.foreground }]}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleFlag}>
              {flaggedQuestions[currentQuestionIndex] ? (
                <>
                  <Flag size={16} color={colors.yellow} strokeWidth={3} />
                  <Text style={[styles.actionButtonText, { color: colors.yellow }]}>Flagged</Text>
                </>
              ) : (
                <>
                  <FlagOff size={16} color={colors.foreground} strokeWidth={3} />
                  <Text style={[styles.actionButtonText, { color: colors.foreground }]}>Flag</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleQuitQuiz}>
              <Text style={[styles.actionButtonText, { color: colors.foreground }]}>Quit</Text>
              <X size={16} color={colors.foreground} strokeWidth={3} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSubmitQuiz}>
              <Text style={[styles.actionButtonText, { color: colors.foreground }]}>Submit</Text>
              <ChevronRight size={16} color={colors.foreground} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionText, { color: colors.foreground }]}>
            {currentQuestion?.question || 'No question available'}
          </Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {(currentQuestion?.options || []).map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      selectedOption === idx ? colors.primary + '20' : colors.card,
                    borderColor: selectedOption === idx ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handleOptionSelect(idx)}
              >
                <View
                  style={[
                    styles.optionRadio,
                    {
                      borderColor: selectedOption === idx ? colors.primary : colors.border,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: selectedOption === idx ? colors.primary : colors.foreground,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue button */}
        {isAnswered && (
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                backgroundColor: colors.primary,
                opacity: isSubmitting ? 0.6 : 1,
              },
            ]}
            onPress={!isSubmitting ? handleContinue : undefined}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <DotLoader size="small" color={colors.primaryForeground} />
            ) : (
              <Text style={[styles.continueButtonText, { color: colors.primaryForeground }]}>
                {currentQuestionIndex === questions.length - 1 ? 'Continue and Submit' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Report issue */}
        <View style={styles.reportIssue}>
          <Text style={[styles.reportIssueText, { color: colors.mutedForeground }]}>
            have issue in this question?
          </Text>
          <TouchableOpacity onPress={openSupportModal}>
            <Text style={[styles.reportIssueLink, { color: colors.foreground }]}>
              report an issue
            </Text>
            <AlertTriangle size={12} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default function TestScreen() {
  return (
    <SupportModalProvider>
      <TestScreenContent />
    </SupportModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  },
  header: {
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '900',
  },
  questionActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionContainer: {
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
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  continueButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 44,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  reportIssue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
  },
  reportIssueText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reportIssueLink: {
    fontSize: 12,
    fontWeight: '900',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  modalTextBold: {
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonCancel: {
    borderWidth: 1,
  },
  modalButtonDanger: {
    backgroundColor: '#dc2626',
  },
  modalButtonSuccess: {
    backgroundColor: '#16a34a',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
