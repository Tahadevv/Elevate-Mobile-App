import { useRouter } from 'expo-router';
import { FileText } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../../components/theme-provider';
import { DotLoader } from '../../../components/ui/dot-loader';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMockAssessment } from '../../../store/slices/mockAssessmentSlice';

export default function AssessmentScreen() {
  const dispatch = useAppDispatch();
  const { assessmentData, isLoading, error, currentChapterIndex, currentQuestionIndex, answers, score, isCompleted, chapterProgress } = useAppSelector((state: any) => state.mockAssessment);
  const { token } = useAppSelector((state: any) => state.auth);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('assessment');
  const colors = useColors();
  const router = useRouter();

  // Mock course ID - in real app, this would come from navigation params
  const courseId = '1';

  // Fetch mock assessment from API
  useEffect(() => {
    if (token && courseId) {
      dispatch(fetchMockAssessment({ courseId, token }) as any);
    }
  }, [token, courseId, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Navigate to the corresponding course page
    switch (tabName) {
      case 'course-details':
        router.push('/course/course-details');
        break;
      case 'notes':
        router.push('/course/notes');
        break;
      case 'tutorial':
        router.push('/course/tutorial');
        break;
      case 'result':
        router.push('/course/result');
        break;
      case 'assessment':
        router.push('/course/Information-Mock-Assessment');
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading mock assessment..." />
        </View>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Main Content */}
          <View style={[
            styles.mainContent,
            { marginLeft: sidebarOpen ? 300 : 0 }
          ]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <FileText size={32} color={colors.foreground} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  {assessmentData?.name || 'Information of Mock Assessment'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  {assessmentData?.domain_name || 'Domain Name'}
                </Text>
              </View>
            </View>
          </View>

          {/* Assessment Info */}
          {assessmentData && (
            <View style={styles.assessmentInfo}>
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                Total Questions: {assessmentData.total_questions || 0}
              </Text>
              <Text style={[styles.infoText, { color: colors.foreground }]}>
                Duration: {assessmentData.duration || '140'} minutes
              </Text>
              {score && (
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  Score: {score}%
                </Text>
              )}
            </View>
          )}

          {/* Assessment Links */}
          <View style={styles.assessmentSection}>
            <View style={styles.assessmentRow}>
              <TouchableOpacity 
                style={[styles.assessmentLink, { 
                  borderColor: colors.border,
                  backgroundColor: colors.card
                }]}
                onPress={() => router.push('/course/Information-Mock-Assessment/assesment')}
              >
                <Text style={[styles.assessmentLinkText, { color: colors.foreground }]}>
                  length of exam - 140
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.assessmentRow}>
              <TouchableOpacity 
                style={[styles.assessmentLink, { 
                  borderColor: colors.border,
                  backgroundColor: colors.card
                }]}
                onPress={() => router.push('/course/Information-Mock-Assessment/assesment')}
              >
                <Text style={[styles.assessmentLinkText, { color: colors.foreground }]}>
                  length of exam - 140
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.assessmentRow}>
              <TouchableOpacity 
                style={[styles.assessmentLink, { 
                  borderColor: colors.border,
                  backgroundColor: colors.card
                }]}
                onPress={() => router.push('/course/Information-Mock-Assessment/assesment')}
              >
                <Text style={[styles.assessmentLinkText, { color: colors.foreground }]}>
                  length of exam - 140
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={[styles.descriptionText, { color: colors.foreground }]}>
              Our mock exam imitates both the time limit and question count of the AMFTBB MFT exam.
            </Text>
            <Text style={[styles.descriptionText, { color: colors.foreground }]}>
              Pocketubject matter experts developed this content to prepare you for the types of questions you will
              see on the official examination. We aim to cover all testing materials on the AMFTBB MFT Content Outline.
            </Text>
            <Text style={[styles.warningText, { color: colors.muted }]}>
              Warning: You will NOT see these exam questions on exam day.
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
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    marginBottom: 48,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
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
  assessmentSection: {
    marginBottom: 32,
  },
  assessmentRow: {
    marginBottom: 16,
  },
  assessmentLink: {
    width: '100%',
    maxWidth: 448,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  assessmentLinkText: {
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
  assessmentInfo: {
    marginBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    marginVertical: 4,
    fontWeight: '600',
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
});
