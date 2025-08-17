import * as React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useColors } from "../theme-provider";

export interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function Badge({ variant = "default", children, style, textStyle }: BadgeProps) {
  const colors = useColors();
  
  const badgeStyle = {
    backgroundColor: variant === "default" ? colors.primary :
                   variant === "secondary" ? colors.secondary :
                   variant === "destructive" ? colors.destructive :
                   variant === "outline" ? "transparent" : colors.primary,
    borderColor: variant === "outline" ? colors.border : "transparent",
  };

  const textColor = variant === "default" ? colors.primaryForeground :
                   variant === "secondary" ? colors.secondaryForeground :
                   variant === "destructive" ? colors.destructiveForeground :
                   variant === "outline" ? colors.foreground : colors.primaryForeground;

  return (
    <View style={[styles.badge, badgeStyle, style]}>
      <Text style={[styles.badgeText, { color: textColor }, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
});

export { Badge };
