import { BookOpen, HelpCircle, Megaphone, Settings } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "../theme-provider";

interface SemiBottomBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function SemiBottomBar({ activeTab, onTabPress }: SemiBottomBarProps) {
  const colors = useColors();

  const styles = createStyles(colors);

  const navigationItems = [
    {
      name: "My Courses",
      key: "courses",
      icon: BookOpen,
    },
    {
      name: "Announcements",
      key: "announcements",
      icon: Megaphone,
    },
    {
      name: "Help Center",
      key: "help",
      icon: HelpCircle,
    },
    {
      name: "Settings",
      key: "settings",
      icon: Settings,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.tab}
          onPress={() => onTabPress(item.key)}
        >
          <item.icon
            size={24}
            color={
              activeTab === item.key
                ? colors.yellow
                : colors.foreground
            }
          />
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
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
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
});

