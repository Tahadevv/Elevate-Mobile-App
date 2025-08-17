import * as React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  style?: ViewStyle;
}

const Separator = React.forwardRef<View, SeparatorProps>(
  ({ orientation = "horizontal", decorative = true, style }, ref) => (
    <View
      ref={ref}
      style={[
        styles.separator,
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
      accessibilityRole={decorative ? "none" : "separator"}
    />
  )
);

Separator.displayName = "Separator";

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#e5e7eb",
    flexShrink: 0,
  },
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    height: "100%",
    width: 1,
  },
});

export { Separator };
