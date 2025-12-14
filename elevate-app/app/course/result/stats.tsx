import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useColors } from '../../../components/theme-provider';

const { width } = Dimensions.get('window');

export default function QuizResultsPage() {
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="analytics" size={24} color={colors.foreground} strokeWidth={3} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  Quiz Results & Analytics
                </Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  Detailed performance insights and statistics
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.statHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                <Text style={[styles.statTitle, { color: colors.foreground }]}>Correct Answers</Text>
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>85%</Text>
              <Text style={[styles.statDescription, { color: colors.muted }]}>
                17 out of 20 questions
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.statHeader}>
                <Ionicons name="time" size={24} color="#f59e0b" />
                <Text style={[styles.statTitle, { color: colors.foreground }]}>Time Taken</Text>
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>45:30</Text>
              <Text style={[styles.statDescription, { color: colors.muted }]}>
                Minutes and seconds
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.statHeader}>
                <Ionicons name="trending-up" size={24} color="#3b82f6" />
                <Text style={[styles.statTitle, { color: colors.foreground }]}>Performance</Text>
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>Excellent</Text>
              <Text style={[styles.statDescription, { color: colors.muted }]}>
                Top 10% of students
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.statHeader}>
                <Ionicons name="repeat" size={24} color="#8b5cf6" />
                <Text style={[styles.statTitle, { color: colors.foreground }]}>Attempts</Text>
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>3</Text>
              <Text style={[styles.statDescription, { color: colors.muted }]}>
                Total attempts made
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Performance Breakdown
            </Text>
            <View style={styles.breakdownList}>
              {[
                { category: 'Programming Fundamentals', score: 90, questions: 8 },
                { category: 'Data Structures', score: 75, questions: 6 },
                { category: 'Algorithms', score: 80, questions: 4 },
                { category: 'System Design', score: 70, questions: 2 },
              ].map((item, index) => (
                <View key={index} style={[styles.breakdownItem, { borderColor: colors.border }]}>
                  <View style={styles.breakdownHeader}>
                    <Text style={[styles.breakdownCategory, { color: colors.foreground }]}>
                      {item.category}
                    </Text>
                    <Text style={[styles.breakdownScore, { color: colors.foreground }]}>
                      {item.score}%
                    </Text>
                  </View>
                  <View style={styles.breakdownBar}>
                    <View 
                      style={[
                        styles.breakdownFill, 
                        { 
                          width: `${item.score}%`,
                          backgroundColor: item.score >= 80 ? '#10b981' : 
                                         item.score >= 70 ? '#f59e0b' : '#ef4444'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.breakdownQuestions, { color: colors.muted }]}>
                    {item.questions} questions
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recommendations
            </Text>
            <View style={styles.recommendationsList}>
              {[
                'Focus on Data Structures concepts for better understanding',
                'Practice more algorithm problems to improve speed',
                'Review System Design fundamentals',
                'Continue with current study plan for Programming Fundamentals',
              ].map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="bulb" size={20} color={colors.yellow} />
                  <Text style={[styles.recommendationText, { color: colors.foreground }]}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>
          </View>
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 2,
    borderWidth: 1,
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  breakdownList: {
    gap: 16,
  },
  breakdownItem: {
    borderWidth: 1,
    borderRadius: 2,
    padding: 16,
    gap: 8,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  breakdownBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 2,
  },
  breakdownQuestions: {
    fontSize: 12,
    fontWeight: '500',
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
