import * as React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { useColors } from "../theme-provider";

export interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const Label = React.forwardRef<Text, LabelProps>(
  ({ children, style }, ref) => {
    const colors = useColors();
    
    return (
      <Text
        ref={ref}
        style={[styles.label, { color: colors.foreground }, style]}
      >
        {children}
      </Text>
    );
  }
);

Label.displayName = "Label";

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});

export { Label };
