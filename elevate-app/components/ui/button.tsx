import * as React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { useColors } from "../theme-provider";

export interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ variant = "default", size = "default", children, onPress, disabled = false, style, textStyle }, ref) => {
    const colors = useColors();
    
    const buttonStyle = [
      styles.base,
      styles[size],
      disabled && styles.disabled,
      style,
    ];

    const buttonTextStyle = [
      styles.text,
      styles[`${size}Text`],
      disabled && styles.disabledText,
      textStyle,
    ];

    // Apply theme-based styles
    const themeStyles = {
      backgroundColor: variant === "default" ? colors.primary : 
                     variant === "destructive" ? colors.destructive :
                     variant === "outline" ? "transparent" :
                     variant === "secondary" ? colors.secondary :
                     variant === "ghost" ? "transparent" :
                     variant === "link" ? "transparent" : colors.primary,
      borderColor: variant === "outline" ? colors.input : "transparent",
      borderWidth: variant === "outline" ? 1 : 0,
    };

    const textColor = variant === "default" ? colors.primaryForeground :
                     variant === "destructive" ? colors.destructiveForeground :
                     variant === "outline" ? colors.foreground :
                     variant === "secondary" ? colors.secondaryForeground :
                     variant === "ghost" ? colors.foreground :
                     variant === "link" ? colors.primary : colors.primaryForeground;

    return (
      <TouchableOpacity
        ref={ref}
        style={[buttonStyle, themeStyles]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {typeof children === "string" ? (
          <Text style={[buttonTextStyle, { color: textColor }]}>{children}</Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Sizes
  default: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    borderRadius: 2,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
    borderRadius: 2,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    minHeight: 40,
    borderRadius: 2,
  },
  icon: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 36,
    minWidth: 36,
    borderRadius: 2,
  },

  // Text styles
  text: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  // Size text styles
  defaultText: {
    fontSize: 14,
  },
  smText: {
    fontSize: 12,
  },
  lgText: {
    fontSize: 16,
  },
  iconText: {
    fontSize: 14,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export { Button };

