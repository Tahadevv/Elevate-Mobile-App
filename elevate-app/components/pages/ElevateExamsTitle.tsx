import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface ElevateExamsTitleProps {
  /**
   * Custom text style for the title
   */
  textStyle?: TextStyle;
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  /**
   * Custom highlight color (default: light pink #fce7f3)
   */
  highlightColor?: string;
  /**
   * Text size multiplier (default: 1)
   */
  size?: number;
}

/**
 * ElevateExamsTitle - A dynamic component displaying "Elevate Exams" with a light pink highlight
 * Perfect for use at the top of login/signup screens
 */
export function ElevateExamsTitle({
  textStyle,
  containerStyle,
  highlightColor = '#fce7f3',
  size = 1,
}: ElevateExamsTitleProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Highlight background */}
      <View
        style={[
          styles.highlight,
          {
            backgroundColor: highlightColor,
            height: 14 * size,
            bottom: 2 * size,
            left: -4 * size,
            right: -4 * size,
          },
        ]}
      />
      
      {/* Title text */}
      <Text
        style={[
          styles.text,
          {
            fontSize: 32 * size,
            lineHeight: 40 * size,
          },
          textStyle,
        ]}
      >
        Elevate Exams
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  highlight: {
    position: 'absolute',
    zIndex: 0,
    borderRadius: 2,
  },
  text: {
    position: 'relative',
    zIndex: 1,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: -0.5,
  },
});

