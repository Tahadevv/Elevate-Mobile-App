import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface HoverCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  width?: number;
  height?: number;
  isActive?: boolean; // Only used as the initial state
}

export function HoverCard({
  children,
  style,
  width,
  height,
  isActive, // Used only for initialization
}: HoverCardProps) {
  const [isClicked, setIsClicked] = useState(isActive ?? false);

  // Ensure isActive is only used once for initial state
  useEffect(() => {
    if (isActive !== undefined) {
      setIsClicked(isActive);
    }
  }, []); // Runs only once on mount

  const handlePress = () => {
    setIsClicked((prev) => !prev);
  };

  const cardStyle: ViewStyle = {
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
  };

  return (
    <TouchableOpacity
      style={[styles.container, cardStyle]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Shadow element */}
      <View
        style={[
          styles.shadow,
          isClicked ? styles.shadowActive : styles.shadowInactive,
        ]}
      />

      {/* Main card */}
      <View
        style={[
          styles.mainCard,
          style,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  shadowActive: {
    transform: [{ translateX: -5 }, { translateY: 5 }],
  },
  shadowInactive: {
    transform: [{ translateX: 0 }, { translateY: 0 }],
  },
  mainCard: {
    position: 'relative',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9ca3af',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
});
