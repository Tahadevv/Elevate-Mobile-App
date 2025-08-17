import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Define theme types
export type Theme = 'light' | 'dark' | 'system';

// Define color palette
export const colors = {
  light: {
    background: '#ffffff',
    foreground: '#111827',
    muted: '#6b7280',
    mutedForeground: '#9ca3af',
    border: '#e5e7eb',
    input: '#ffffff',
    ring: '#0f172a',
    primary: '#0f172a',
    primaryForeground: '#f8fafc',
    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    card: '#ffffff',
    cardForeground: '#111827',
    popover: '#ffffff',
    popoverForeground: '#111827',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    yellow: '#ffd404',
    yellowAccent: '#fbbf24',
  },
  dark: {
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    border: '#1e293b',
    input: '#1e293b',
    ring: '#cbd5e1',
    primary: '#f8fafc',
    primaryForeground: '#0f172a',
    secondary: '#1e293b',
    secondaryForeground: '#f8fafc',
    destructive: '#7f1d1d',
    destructiveForeground: '#f8fafc',
    card: '#0f172a',
    cardForeground: '#f8fafc',
    popover: '#0f172a',
    popoverForeground: '#f8fafc',
    accent: '#1e293b',
    accentForeground: '#f8fafc',
    yellow: '#ffd404',
    yellowAccent: '#fbbf24',
  },
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: typeof colors.light;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  // Determine actual theme based on system preference
  const actualTheme = theme === 'system' ? systemColorScheme || 'light' : theme;
  const isDark = actualTheme === 'dark';
  const currentColors = colors[actualTheme];

  // Update theme when system changes
  useEffect(() => {
    if (theme === 'system') {
      // Theme will automatically update when systemColorScheme changes
    }
  }, [theme, systemColorScheme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    colors: currentColors,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to use colors
export function useColors() {
  const { colors } = useTheme();
  return colors;
}
