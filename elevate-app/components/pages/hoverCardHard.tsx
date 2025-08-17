import React from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface HoverCardHardProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  isActive?: boolean;
  style?: ViewStyle;
}

export function HoverCardHard({
  children,
  width,
  height,
  isActive,
  style,
}: HoverCardHardProps) {
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
      {/* Shadow element */}
      <View style={styles.shadow} />

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
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#374151",
    borderRadius: 8,
    transform: [{ translateX: -5 }, { translateY: 5 }],
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
