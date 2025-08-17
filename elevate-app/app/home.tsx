import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AnnouncementsScreen from "../components/screens/AnnouncementsScreen";
import HelpCenterScreen from "../components/screens/HelpCenterScreen";
import MyCoursesScreen from "../components/screens/MyCoursesScreen";
import SemiBottomBar from "../components/screens/semibottombar";
import SettingsScreen from "../components/screens/SettingsScreen";
import { useColors } from "../components/theme-provider";

function HomeContent() {
  const [activeTab, setActiveTab] = useState('courses');
  const colors = useColors();

  const styles = createStyles(colors);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'courses':
        return <MyCoursesScreen onNavigate={handleTabPress} />;
      case 'announcements':
        return <AnnouncementsScreen onNavigate={handleTabPress} />;
      case 'help':
        return <HelpCenterScreen onNavigate={handleTabPress} />;
      case 'settings':
        return <SettingsScreen onNavigate={handleTabPress} />;
      default:
        return <MyCoursesScreen onNavigate={handleTabPress} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderCurrentScreen()}
      
      {/* Bottom Navigation Bar */}
      <SemiBottomBar 
        activeTab={activeTab} 
        onTabPress={handleTabPress} 
      />
    </View>
  );
}

export default function Home() {
  return <HomeContent />;
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  contentSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100, // Space for bottom navigation
  },
});
