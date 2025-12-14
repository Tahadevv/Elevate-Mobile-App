import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from "../components/theme-provider";

export default function Home() {
  const colors = useColors();
  const router = useRouter();
  const styles = createStyles(colors);

  const handleNavigateToDashboard = () => {
    router.push('/dashboard' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Welcome to Elevate
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Your learning journey starts here
        </Text>
        
        <TouchableOpacity 
          style={[styles.dashboardButton, { backgroundColor: colors.primary }]}
          onPress={handleNavigateToDashboard}
        >
          <Text style={[styles.dashboardButtonText, { color: colors.primaryForeground }]}>
            Go to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  dashboardButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 2,
  },
  dashboardButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
