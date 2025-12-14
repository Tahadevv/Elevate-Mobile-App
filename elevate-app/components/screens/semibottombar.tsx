import { useRouter } from "expo-router";
import { BookOpen, HelpCircle, Megaphone, Settings } from "lucide-react-native";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from "../theme-provider";

interface SemiBottomBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function SemiBottomBar({ activeTab, onTabPress }: SemiBottomBarProps) {
  const colors = useColors();
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const showText = windowWidth >= 400; // Only show text on screens wider than 400px
  const insets = useSafeAreaInsets();
  
  // Add bottom padding to account for system navigation bar
  const bottomPadding = insets.bottom > 0 ? insets.bottom + 8 : 8;
  
  const styles = createStyles(colors, bottomPadding);

  const navigationItems = [
    {
      name: "My Courses",
      key: "courses",
      icon: BookOpen,
      route: "/dashboard",
    },
    {
      name: "Announcements",
      key: "announcements",
      icon: Megaphone,
      route: "/dashboard/announcements",
    },
    {
      name: "Help Center",
      key: "help",
      icon: HelpCircle,
      route: "/dashboard/help",
    },
    {
      name: "Settings",
      key: "settings",
      icon: Settings,
      route: "/dashboard/account",
    },
  ];

  const handleTabPress = (item: any) => {
    if (item.key === "courses") {
      // For courses, navigate to dashboard and change tab
      router.push(item.route as any);
      onTabPress(item.key);
    } else {
      // For other items, navigate directly to the route
      router.push(item.route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.tab}
          onPress={() => handleTabPress(item)}
        >
          <item.icon
            size={24}
            color={
              activeTab === item.key
                ? colors.yellow
                : colors.foreground
            }
          />
          {showText && (
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === item.key
                      ? colors.yellow
                      : colors.foreground,
                },
              ]}
            >
              {item.name}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (colors: any, bottomPadding: number) => StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: bottomPadding, // Use safe area bottom padding
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
});

