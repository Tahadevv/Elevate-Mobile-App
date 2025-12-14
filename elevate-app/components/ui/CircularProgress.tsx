import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  showValue?: boolean;
  textColor?: string;
  labelColor?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 44,
  strokeWidth = 4,
  color = '#4CAF50',
  backgroundColor = '#E6E6E6',
  showPercentage = true,
  textColor = '#374151',
  labelColor = '#6B7280'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={[styles.percentageText, { color: textColor }]}>
            {Math.round(percentage)}%
          </Text>
        </View>
      )}
    </View>
  );
}

export function CircularProgressWithLabel({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  color = '#4CAF50',
  backgroundColor = '#E6E6E6',
  label,
  showValue = true,
  textColor = '#374151',
  labelColor = '#6B7280'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Ensure value and max are valid numbers, handle NaN cases
  const safeValue = Number(value) || 0;
  const safeMax = Number(max) || 100;
  const percentage = safeMax > 0 && !isNaN(safeValue) && !isNaN(safeMax)
    ? Math.min(Math.max((safeValue / safeMax) * 100, 0), 100)
    : 0;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.labelContainer}>
      <View style={styles.progressContainer}>
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={styles.svg}
        >
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
      </View>
      <View style={styles.textSection}>
        {label && (
          <Text style={[styles.labelText, { color: labelColor }]}>
            {label}
          </Text>
        )}
        {showValue && (
          <Text style={[styles.valueText, { color: textColor }]}>
            {Math.round(percentage)}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressContainer: {
    position: 'relative',
  },
  textSection: {
    flex: 1,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
