/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0f172a'; // slate-900
const tintColorDark = '#f8fafc'; // slate-50

export default {
  light: {
    text: '#0f172a', // slate-900 - primary text
    background: '#ffffff', // white
    tint: tintColorLight,
    tabIconDefault: '#64748b', // slate-500
    tabIconSelected: tintColorLight,
    // Design system colors
    primary: '#0f172a', // slate-900
    primaryForeground: '#f8fafc', // slate-50
    secondary: '#f1f5f9', // slate-100
    secondaryForeground: '#0f172a', // slate-900
    muted: '#f1f5f9', // slate-100
    mutedForeground: '#64748b', // slate-500
    accent: '#f1f5f9', // slate-100
    accentForeground: '#0f172a', // slate-900
    destructive: '#ef4444', // red-500
    destructiveForeground: '#f8fafc', // slate-50
    border: '#e2e8f0', // slate-200
    input: '#e2e8f0', // slate-200
    ring: '#0f172a', // slate-900
    card: '#ffffff', // white
    cardForeground: '#0f172a', // slate-900
    // Custom colors
    highlight: '#0ea5e9', // sky-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    info: '#3b82f6', // blue-500
  },
  dark: {
    text: '#f8fafc', // slate-50
    background: '#0f172a', // slate-900
    tint: tintColorDark,
    tabIconDefault: '#94a3b8', // slate-400
    tabIconSelected: tintColorDark,
    // Design system colors
    primary: '#f8fafc', // slate-50
    primaryForeground: '#0f172a', // slate-900
    secondary: '#1e293b', // slate-800
    secondaryForeground: '#f8fafc', // slate-50
    muted: '#1e293b', // slate-800
    mutedForeground: '#94a3b8', // slate-400
    accent: '#1e293b', // slate-800
    accentForeground: '#f8fafc', // slate-50
    destructive: '#7f1d1d', // red-900
    destructiveForeground: '#f8fafc', // slate-50
    border: '#1e293b', // slate-800
    input: '#1e293b', // slate-800
    ring: '#cbd5e1', // slate-300
    card: '#0f172a', // slate-900
    cardForeground: '#f8fafc', // slate-50
    // Custom colors
    highlight: '#0ea5e9', // sky-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    info: '#3b82f6', // blue-500
  },
};
