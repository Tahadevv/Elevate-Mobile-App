import * as React from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";

export interface SkeletonProps {
  style?: ViewStyle;
  width?: number | string;
  height?: number | string;
}

function Skeleton({ style, width = "100%", height = 20 }: SkeletonProps) {
  const pulseAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity: pulseAnim },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
  },
});

export { Skeleton };
