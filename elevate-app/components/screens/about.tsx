import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { Highlight } from "@/components/pages/Highlight";

interface CounterProps {
  value: number;
  label: string;
  duration?: number;
  suffix?: string;
}

const Counter = ({ value, label, duration = 2000, suffix = "+" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simplified visibility logic for React Native
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, isVisible]);

  return (
    <View style={styles.counterContainer}>
      <View style={styles.counterValue}>
        <Text style={styles.counterNumber}>{count}</Text>
        <Text style={styles.counterSuffix}>{suffix}</Text>
      </View>
      <Text style={styles.counterLabel}>{label}</Text>
    </View>
  );
};

export default function About() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>
            Achieve <Highlight>Your Goals</Highlight>
            {"\n"}With Encode
          </Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo.
          </Text>

          <View style={styles.countersGrid}>
            <Counter value={789} label="Creative Events" />
            <Counter value={387} label="Online Courses" />
            <Counter value={2183} label="People Worldwide" />
          </View>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.placeholderImage}>
            {/* Placeholder for image */}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1152,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  content: {
    flexDirection: 'column',
    gap: 32,
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    gap: 24,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 40,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    maxWidth: 448,
    lineHeight: 20,
  },
  countersGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 48,
  },
  imageSection: {
    flex: 1,
  },
  placeholderImage: {
    width: 300,
    height: 200,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  counterContainer: {
    alignItems: 'center',
  },
  counterValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  counterSuffix: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginLeft: 4,
  },
  counterLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginTop: 4,
  },
});

