import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(isDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleTheme}>
      {isDark ? (
        <Sun size={16} color="#fbbf24" />
      ) : (
        <Moon size={16} color="#6b7280" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 