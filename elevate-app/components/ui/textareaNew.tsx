import * as React from "react";
import { StyleSheet, TextInput, TextInputProps, ViewStyle } from "react-native";

export interface TextareaNewProps extends TextInputProps {
  style?: ViewStyle;
}

const TextareaNew = React.forwardRef<TextInput, TextareaNewProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.textarea, style]}
        placeholderTextColor="#9ca3af"
        multiline
        textAlignVertical="top"
        {...props}
      />
    );
  }
);

TextareaNew.displayName = "TextareaNew";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export { TextareaNew };

