import * as React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useColors } from "../theme-provider";

export interface AlertProps {
  variant?: "default" | "destructive";
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const Alert = React.forwardRef<View, AlertProps>(
  ({ variant = "default", children, style }, ref) => {
    const colors = useColors();
    
    const alertStyle = {
      backgroundColor: variant === "default" ? colors.background : colors.destructive,
      borderColor: variant === "default" ? colors.border : colors.destructive,
    };
    
    return (
      <View
        ref={ref}
        style={[styles.alert, alertStyle, style]}
        accessibilityRole="alert"
      >
        {children}
      </View>
    );
  }
);

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<Text, AlertTitleProps>(
  ({ children, style }, ref) => {
    const colors = useColors();
    
    return (
      <Text
        ref={ref}
        style={[styles.alertTitle, { color: colors.foreground }, style]}
      >
        {children}
      </Text>
    );
  }
);

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<Text, AlertDescriptionProps>(
  ({ children, style }, ref) => {
    const colors = useColors();
    
    return (
      <Text
        ref={ref}
        style={[styles.alertDescription, { color: colors.mutedForeground }, style]}
      >
        {children}
      </Text>
    );
  }
);

AlertDescription.displayName = "AlertDescription";

const styles = StyleSheet.create({
  alert: {
    width: "100%",
    borderRadius: 2,
    borderWidth: 1,
    padding: 16,
    paddingVertical: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: -0.025,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export { Alert, AlertDescription, AlertTitle };

