import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useColors } from '../../../components/theme-provider';

const { width } = Dimensions.get('window');

// Progress component
const Progress = ({ value, maxValue }: { value: number; maxValue: number }) => {
  const percentage = (value / maxValue) * 100;
  const colors = useColors();
  
  return (
    <View style={[styles.progressContainer, { backgroundColor: colors.muted }]}>
      <View 
        style={[
          styles.progressFill, 
          { 
            width: `${percentage}%`,
            backgroundColor: percentage >= 80 ? '#10b981' : 
                           percentage >= 60 ? '#f59e0b' : '#ef4444'
          }
        ]} 
      />
    </View>
  );
};

// Button component
const Button = ({ 
  onPress, 
  title, 
  variant = 'default', 
  size = 'default',
  disabled = false 
}: {
  onPress: () => void;
  title: string;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm';
  disabled?: boolean;
}) => {
  const colors = useColors();
  
  const buttonStyle = [
    styles.button,
    variant === 'default' && { backgroundColor: '#10b981' },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    size === 'default' && { height: 40, paddingHorizontal: 16, paddingVertical: 8 },
    size === 'sm' && { height: 32, paddingHorizontal: 12, paddingVertical: 4 },
    disabled && { opacity: 0.5 },
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'default' && { color: '#ffffff' },
    variant === 'ghost' && { color: colors.foreground },
    size === 'default' && { fontSize: 16 },
    size === 'sm' && { fontSize: 14 },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

// Course data structure
interface Option {
  text: string;
  isCorrect: boolean;
}

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

export default function QuizPage() {
  const colors = useColors();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(140 * 60); // 140 minutes in seconds
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Sample course data
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
            explanation: "TypeScript files use the .ts extension, while .tsx is used for TypeScript files with JSX.",
          },
          {
            question: "What is the main benefit of TypeScript?",
            options: ["Faster execution", "Static typing", "Smaller file size", "Better browser support"],
            correctOption: "Static typing",
            explanation: "TypeScript's main benefit is static typing, which helps catch errors at compile time.",
          },
        ],
      },
    ],
  };

  const allQuestions = course.chapters.flatMap(chapter => chapter.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleQuizComplete();
    }
  }, [timeLeft, isQuizComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleQuizComplete = () => {
    setIsQuizComplete(true);
    Alert.alert(
      'Quiz Complete!',
      'You have completed the assessment. Your results will be available shortly.',
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  const handleFlagQuestion = () => {
    Alert.alert('Question Flagged', 'This question has been flagged for review.');
  };

  if (isQuizComplete) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.completeContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#10b981" />
          <Text style={[styles.completeTitle, { color: colors.foreground }]}>
            Quiz Complete!
          </Text>
          <Text style={[styles.completeText, { color: colors.muted }]}>
            Thank you for completing the assessment. Your results will be available shortly.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.courseName, { color: colors.foreground }]}>
              {course.courseName}
            </Text>
            <TouchableOpacity style={styles.flagButton} onPress={handleFlagQuestion}>
              <Ionicons name="flag" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.foreground }]}>
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </Text>
            <Text style={[styles.timeText, { color: colors.foreground }]}>
              Time: {formatTime(timeLeft)}
            </Text>
          </View>
          
          <Progress value={currentQuestionIndex + 1} maxValue={allQuestions.length} />
        </View>

        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={[styles.questionText, { color: colors.foreground }]}>
            {currentQuestion.question}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: selectedOption === option ? 2 : 1,
                },
                selectedOption === option && styles.selectedOption,
                showExplanation && option === currentQuestion.correctOption && styles.correctOption,
                showExplanation && selectedOption === option && option !== currentQuestion.correctOption && styles.incorrectOption,
              ]}
              onPress={() => handleOptionSelect(option)}
              disabled={showExplanation}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                { color: colors.foreground },
                selectedOption === option && styles.selectedOptionText,
                showExplanation && option === currentQuestion.correctOption && styles.correctOptionText,
                showExplanation && selectedOption === option && option !== currentQuestion.correctOption && styles.incorrectOptionText,
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
              {showExplanation && option === currentQuestion.correctOption && (
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              )}
              {showExplanation && selectedOption === option && option !== currentQuestion.correctOption && (
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {showExplanation && (
          <View style={[styles.explanationSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.explanationTitle, { color: colors.foreground }]}>
              Explanation:
            </Text>
            <Text style={[styles.explanationText, { color: colors.muted }]}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <Button
            title="Previous"
            variant="ghost"
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          />
          
          <Button
            title={currentQuestionIndex === allQuestions.length - 1 ? "Finish" : "Next"}
            onPress={handleNextQuestion}
            disabled={!selectedOption}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flagButton: {
    padding: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    height: 8,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  optionsSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 2,
    borderWidth: 1,
  },
  selectedOption: {
    borderColor: '#3b82f6',
  },
  correctOption: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#10b981',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  explanationSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 2,
    borderWidth: 1,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  navigationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  button: {
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  completeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
