import React from "react";
import { Text, View, StyleSheet, TextStyle, ViewStyle } from "react-native";

interface HighlightProps {
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
}

export function Highlight({ children, style, color = "#fce7f3" }: HighlightProps) {
  return (
    <View style={styles.container}>
      {/* The highlight background */}
      <View
        style={[
          styles.highlight,
          { backgroundColor: color },
        ]}
      />
      
      {/* The text content */}
      <Text style={[styles.text, style]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  highlight: {
    position: "absolute",
    top: "50%",
    left: -4,
    right: -4,
    bottom: -2,
    borderRadius: 8,
    zIndex: -1,
  },
  text: {
    position: "relative",
    zIndex: 1,
  },
});

