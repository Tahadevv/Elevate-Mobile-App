import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useColors } from '../../components/theme-provider';

export default function MockAssessmentPage() {
  const colors = useColors();
  const router = useRouter();

  const handleQuizStats = () => {
    router.push('/course/result/stats');
  };

  const handleAssessmentStats = () => {
    router.push('/course/result/stats');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="analytics" size={24} color={colors.foreground} strokeWidth={3} />
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

        <View style={styles.navigationSection}>
          <TouchableOpacity
            style={[styles.navButton, { 
              borderColor: colors.border,
              backgroundColor: colors.card 
            }]}
            onPress={handleQuizStats}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, { color: colors.foreground }]}>
              Quiz Stats
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { 
              borderColor: colors.border,
              backgroundColor: colors.card 
            }]}
            onPress={handleAssessmentStats}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, { color: colors.foreground }]}>
              Assessment Stats
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Each figure represents an important aspect of our operations, helping you quickly assess outcomes, identify patterns, and stay informed about ongoing progress.
          </Text>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            These stats provide valuable insights into how we&apos;re progressing and where opportunities for improvement lie.
          </Text>
          <Text style={[styles.warningText, { color: colors.muted }]}>
            Warning: You will NOT see these stats if exams are not attempted.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 48,
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
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  navigationSection: {
    gap: 16,
    marginBottom: 32,
  },
  navButton: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: 2,
    padding: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    gap: 16,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
