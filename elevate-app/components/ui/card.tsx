import * as React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useColors } from "../theme-provider";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card = React.forwardRef<View, CardProps>(
  ({ children, style }, ref) => {
    const colors = useColors();
    return (
      <View
        ref={ref}
        style={[
          styles.card,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.foreground 
          },
          style
        ]}
      >
        {children}
      </View>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<View, CardHeaderProps>(
  ({ children, style }, ref) => (
    <View
      ref={ref}
      style={[styles.cardHeader, style]}
    >
      {children}
    </View>
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<Text, CardTitleProps>(
  ({ children, style }, ref) => {
    const colors = useColors();
    return (
      <Text
        ref={ref}
        style={[styles.cardTitle, { color: colors.foreground }, style]}
      >
        {children}
      </Text>
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<Text, CardDescriptionProps>(
  ({ children, style }, ref) => {
    const colors = useColors();
    return (
      <Text
        ref={ref}
        style={[styles.cardDescription, { color: colors.mutedForeground }, style]}
      >
        {children}
      </Text>
    );
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<View, CardContentProps>(
  ({ children, style }, ref) => (
    <View ref={ref} style={[styles.cardContent, style]}>
      {children}
    </View>
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<View, CardFooterProps>(
  ({ children, style }, ref) => (
    <View
      ref={ref}
      style={[styles.cardFooter, style]}
    >
      {children}
    </View>
  )
);
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 24,
    paddingBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.025,
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 6,
  },
  cardContent: {
    padding: 24,
    paddingTop: 0,
  },
  cardFooter: {
    padding: 24,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
});

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };

