import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useColors } from "../theme-provider";

export interface ReportProps {
  title?: string;
  content?: string;
  style?: ViewStyle;
}

const Report: React.FC<ReportProps> = ({ title, content, style }) => {
  const colors = useColors();
  
  return (
    <View style={[
      styles.report, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: colors.foreground
      }, 
      style
    ]}>
      {title && <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>}
      {content && <Text style={[styles.content, { color: colors.mutedForeground }]}>{content}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  report: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export { Report };
