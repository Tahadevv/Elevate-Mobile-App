import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '../../components/theme-provider';

export default function MockAssessmentPage() {
  const colors = useColors();
  const router = useRouter();

  const handleAssessmentPress = () => {
    router.push('/course/Information-Mock-Assessment/assesment');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="document-text" size={32} color={colors.foreground} strokeWidth={3} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.foreground }]}>
                Information of Mock Assessment
              </Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Domaine Name
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
            onPress={handleAssessmentPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, { color: colors.foreground }]}>
              length of exam - 140
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { 
              borderColor: colors.border,
              backgroundColor: colors.card 
            }]}
            onPress={handleAssessmentPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, { color: colors.foreground }]}>
              length of exam - 140
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { 
              borderColor: colors.border,
              backgroundColor: colors.card 
            }]}
            onPress={handleAssessmentPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, { color: colors.foreground }]}>
              length of exam - 140
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Our mock exam imitates both the time limit and question count of the AMFTBB MFT exam.
          </Text>
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Pocketubject matter experts developed this content to prepare you for the types of questions you will
            see on the official examination. We aim to cover all testing materials on the AMFTBB MFT Content Outline.
          </Text>
          <Text style={[styles.warningText, { color: colors.muted }]}>
            Warning: You will NOT see these exam questions on exam day.
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
