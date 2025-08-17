import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

interface CustomButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  disabled?: boolean;
}

export function CustomButton({
  children,
  style,
  textStyle,
  variant = "primary",
  size = "md",
  onPress,
  disabled = false,
}: CustomButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <View style={styles.container}>
      {/* Gray background/shadow effect */}
      <View style={styles.shadow} />
      
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={buttonTextStyle}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    transform: [{ translateX: -5 }, { translateY: 5 }],
  },
  base: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    fontFamily: "System",
  },
  // Variants
  primary: {
    backgroundColor: "#3b82f6",
  },
  secondary: {
    backgroundColor: "#f3f4f6",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  md: {
    height: 44,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  lg: {
    height: 56,
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  // Text styles
  text: {
    fontWeight: "500",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: "#374151",
  },
  outlineText: {
    color: "#111827",
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 14,
  },
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

