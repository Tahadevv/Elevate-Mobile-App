import React from "react";
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface HoverCardProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export function HoverCard({ children, width, height, style }: HoverCardProps) {
  const shadowAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(shadowAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(shadowAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const shadowTranslateX = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, -8],
  });

  const shadowTranslateY = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 8],
  });

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
      <Animated.View
        style={[
          styles.shadow,
          {
            transform: [
              { translateX: shadowTranslateX },
              { translateY: shadowTranslateY },
            ],
          },
        ]}
      />

      {/* Main card */}
      <TouchableOpacity
        style={styles.mainCard}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
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

