import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { CheckIcon, XIcon, ChevronDownIcon, ChevronUpIcon, Flag, Check, X, ChevronRight, ChevronUp, ChevronDown } from "lucide-react-native";

// Define question type
type QuestionStatus = "correct" | "incorrect" | "flagged" | "skipped";

interface Question {
  id: number;
  text: string;
  status: QuestionStatus;
  category: string;
  explanation: string;
}

export default function QuizResultsPage() {
  // State to track which explanations are open
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});

  // Toggle explanation visibility
  const toggleExplanation = (questionId: number) => {
    setOpenExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Sample questions data
  const questions: Question[] = [
    {
      id: 1,
      text: "IT & Cybersecurity is the practice of protecting systems ?",
      status: "correct",
      category: "IT & Cybersecurity",
      explanation:
        "Correct! IT & Cybersecurity is indeed the practice of protecting systems, networks, and programs from digital attacks.",
    },
    {
      id: 2,
      text: "IT & Cybersecurity is the practice of protecting systems ?",
      status: "incorrect",
      category: "IT & Cybersecurity",
      explanation:
        "The correct answer is that IT & Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.",
    },
    {
      id: 3,
      text: "IT & Cybersecurity is the practice of protecting systems ?",
      status: "skipped",
      category: "IT & Cybersecurity",
      explanation:
        "This question was skipped. The answer is that IT & Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.",
    },
  ];

  // Generate grid questions (24 items)
  const gridQuestions = Array.from({ length: 24 }).map((_, index) => {
    let status: QuestionStatus = "correct";
    if (index === 7) status = "incorrect";
    if (index === 15) status = "flagged";
    return { id: index + 1, status };
  });

  const renderStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case "correct":
        return (
          <View style={styles.statusIconContainer}>
            <View style={styles.correctIcon}>
              <Check size={12} color="white" strokeWidth={3.5} />
            </View>
          </View>
        );
      case "incorrect":
        return (
          <View style={styles.statusIconContainer}>
            <View style={styles.incorrectIcon}>
              <X size={16} color="white" strokeWidth={2.5} />
            </View>
          </View>
        );
      case "flagged":
        return (
          <View style={styles.statusIconContainer}>
            <View style={styles.flaggedIcon}>
              <ChevronRight size={16} color="white" strokeWidth={2.5} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}></Text>

        <View style={styles.headerContainer}>
          {/* Left side - Title and Status */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              IT & Cybersecurity is the practice of protecting systems
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Total Question:</Text>
                <Text style={styles.statusValue}>20</Text>
              </View>
            </View>
          </View>

          {/* Right side - Accuracy and Answered */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Accuracy</Text>
              <View style={styles.accuracyContainer}>
                <View style={styles.gaugeContainer}>
                  {/* Simplified accuracy display */}
                  <Text style={styles.accuracyText}>90%</Text>
                </View>
              </View>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Answered</Text>
              <Text style={styles.answeredText}>
                <Text style={styles.answeredNumber}>19</Text>/20
              </Text>
            </View>
          </View>
        </View>

        {/* Question Grid */}
        <View style={styles.questionGrid}>
          {gridQuestions.map((question) => (
            <View key={question.id} style={styles.questionItem}>
              {renderStatusIcon(question.status)}
              <Text style={styles.questionNumber}>{question.id}</Text>
            </View>
          ))}
        </View>

        {/* Detailed Questions */}
        <View style={styles.detailedQuestions}>
          {questions.map((question) => (
            <View key={question.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionInfo}>
                  <Text style={styles.questionText}>{question.text}</Text>
                  <Text style={styles.questionCategory}>{question.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => toggleExplanation(question.id)}
                >
                  {openExplanations[question.id] ? (
                    <ChevronUp size={20} color="#6b7280" />
                  ) : (
                    <ChevronDown size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>

              {openExplanations[question.id] && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationText}>{question.explanation}</Text>
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
    minHeight: '100%',
    padding: 24,
  },
  content: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    marginLeft: 40,
  },
  headerContainer: {
    flexDirection: 'column',
    marginBottom: 32,
  },
  titleSection: {
    marginBottom: 24,
    maxWidth: '60%',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusValue: {
    fontSize: 14,
    color: '#1d4ed8',
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gaugeContainer: {
    width: 24,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  answeredText: {
    fontSize: 14,
    color: '#6b7280',
  },
  answeredNumber: {
    color: '#374151',
    fontWeight: 'bold',
  },
  questionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 48,
  },
  questionItem: {
    position: 'relative',
    width: 64,
    height: 64,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  correctIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#15803d',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incorrectIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#dc2626',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flaggedIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#6b7280',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  detailedQuestions: {
    gap: 16,
  },
  questionCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  questionCategory: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggleButton: {
    padding: 4,
  },
  explanationContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
