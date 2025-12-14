import { useLocalSearchParams, useRouter } from 'expo-router';
import { BarChart2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../../components/theme-provider';
import { DotLoader } from '../../../components/ui/dot-loader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchQuizAnalytics, fetchTestAnalytics } from '../../../store/slices/analyticsSlice';

export default function ResultScreen() {
  const dispatch = useAppDispatch();
  const { analytics: quizAnalytics, isLoading: quizLoading, error: quizError } = useAppSelector((state: any) => state.quizAnalytics);
  const { analytics: testAnalytics, isLoading: testLoading, error: testError } = useAppSelector((state: any) => state.testAnalytics);
  const { token } = useAppSelector((state: any) => state.auth);
  
  const colors = useColors();
  const router = useRouter();

  // Get course ID from navigation params (same as other course pages)
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  // Fetch analytics from API
  useEffect(() => {
    if (token && courseId) {
      dispatch(fetchQuizAnalytics({ courseId, token }) as any);
      dispatch(fetchTestAnalytics({ courseId, token }) as any);
    }
  }, [token, courseId, dispatch]);

  // Handle errors
  useEffect(() => {
    if (quizError) {
      Alert.alert('Quiz Analytics Error', quizError);
    }
    if (testError) {
      Alert.alert('Test Analytics Error', testError);
    }
  }, [quizError, testError]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Loading State */}
      {(quizLoading || testLoading) && (
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading analytics..." />
        </View>
      )}

      {/* Content */}
      {!quizLoading && !testLoading && (
        <>
          {/* Main Content */}
          <View style={styles.mainContent}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <View style={styles.headerIcon}>
                    <BarChart2 size={24} color={colors.foreground} strokeWidth={3} />
                  </View>
                  <View style={styles.headerText}>
                    <Text style={[styles.title, { color: colors.foreground }]}>
                      Stats Of Quiz & Assessment
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.muted }]}>
                      Stats summary and insight highlights
                    </Text>
                  </View>
                </View>
              </View>

              {/* Analytics Summary */}
              {(quizAnalytics || testAnalytics) && (
                <View style={styles.analyticsSummary}>
                  {quizAnalytics && (
                    <View style={styles.analyticsCard}>
                      <Text style={[styles.analyticsTitle, { color: colors.foreground }]}>
                        Quiz Analytics
                      </Text>
                      <Text style={[styles.analyticsText, { color: colors.muted }]}>
                        Total Attempts: {quizAnalytics.total_attempts || 0}
                      </Text>
                      <Text style={[styles.analyticsText, { color: colors.muted }]}>
                        Average Score: {quizAnalytics.average_score || 0}%
                      </Text>
                      <Text style={[styles.analyticsText, { color: colors.muted }]}>
                        Best Score: {quizAnalytics.best_score || 0}%
                      </Text>
                    </View>
                  )}

                  {testAnalytics && testAnalytics.progress && (
                    <View style={styles.analyticsCard}>
                      <Text style={[styles.analyticsTitle, { color: colors.foreground }]}>
                        Test Analytics
                      </Text>
                      <Text style={[styles.analyticsText, { color: colors.muted }]}>
                        Total Questions: {testAnalytics.questions?.total_questions || 0}
                      </Text>
                      <Text style={[styles.analyticsText, { color: colors.muted }]}>
                        Correct: {testAnalytics.progress.correct_count || 0}
                      </Text>
                      <Text style={[styles.analyticsText, { color: colors.muted }]}>
                        Attempted: {testAnalytics.progress.attempted_questions || 0}
                      </Text>
                      <Text style={[styles.analyticsText, { color: colors.muted }]}>
                        Accuracy: {testAnalytics.questions?.total_questions 
                          ? Math.round((testAnalytics.progress.correct_count / testAnalytics.questions.total_questions) * 100) 
                          : 0}%
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Stats Links */}
              <View style={styles.statsSection}>
                <View style={styles.statsRow}>
                  <TouchableOpacity 
                    style={[styles.statsLink, { 
                      borderColor: colors.border,
                      backgroundColor: colors.card
                    }]}
                    onPress={() => router.push({
                      pathname: '/course/result/quiz-analytics',
                      params: { courseId }
                    } as any)}
                  >
                    <Text style={[styles.statsLinkText, { color: colors.foreground }]}>
                      Quiz Stats
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                  <TouchableOpacity 
                    style={[styles.statsLink, { 
                      borderColor: colors.border,
                      backgroundColor: colors.card
                    }]}
                    onPress={() => router.push({
                      pathname: '/course/result/test-analytics',
                      params: { courseId }
                    } as any)}
                  >
                    <Text style={[styles.statsLinkText, { color: colors.foreground }]}>
                      Assessment Stats
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={[styles.descriptionText, { color: colors.foreground }]}>
                  Each figure represents an important aspect of our operations, helping you quickly assess outcomes, identify patterns, and stay informed about ongoing progress.
                </Text>
                <Text style={[styles.descriptionText, { color: colors.foreground }]}>
                  These stats provide valuable insights into how we&apos;re progressing and where opportunities for improvement lie.
                </Text>
                <Text style={[styles.warningText, { color: colors.muted }]}>
                  Warning: You will NOT see these stats if exams are not attempted.
                </Text>
              </View>
            </ScrollView>
          </View>
        </>
      )}
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
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 48,
    marginTop: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsSection: {
    marginBottom: 32,
    marginTop: 80,
  },
  statsRow: {
    marginBottom: 16,
  },
  statsLink: {
    width: '100%',
    maxWidth: 448,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  statsLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionSection: {
    gap: 16,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  analyticsSummary: {
    marginBottom: 32,
    gap: 16,
  },
  analyticsCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  analyticsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
