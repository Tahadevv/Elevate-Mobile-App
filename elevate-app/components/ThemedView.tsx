import { View, type ViewProps } from 'react-native';

import { useTheme } from './theme-provider';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme();
  
  // Use provided colors if available, otherwise use theme colors
  const backgroundColor = lightColor && darkColor ? 
    (colors.background === '#0f172a' ? darkColor : lightColor) : 
    colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
