import React from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface HoverCardBorderProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  isActive?: boolean;
  style?: ViewStyle;
}

export function HoverCardBorder({
  children,
  width,
  height,
  isActive,
  style,
}: HoverCardBorderProps) {
  return (
    <View
      style={[
        styles.hoverCard,
        {
          width: width || "auto",
          height: height || "auto",
        },
        style,
      ]}
    >
      {/* Border shadow element */}
      <View style={styles.borderShadow} />

      {/* Background shadow element */}
      <View style={styles.bgShadow} />

      {/* Main card */}
      <View style={styles.mainCard}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hoverCard: {
    position: "relative",
  },
  borderShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#374151",
    borderRadius: 8,
    transform: [{ translateX: -15 }, { translateY: 15 }],
  },
  bgShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#374151",
    borderRadius: 8,
    transform: [{ translateX: -9 }, { translateY: 9 }],
  },
  mainCard: {
    position: "relative",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9ca3af",
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
});
