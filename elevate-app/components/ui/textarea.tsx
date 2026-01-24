import * as React from "react";
import { StyleSheet, TextInput, TextInputProps, ViewStyle } from "react-native";
import { useColors } from "../theme-provider";

export interface TextareaProps extends TextInputProps {
  style?: ViewStyle;
}

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref) => {
    const colors = useColors();
    
    return (
      <TextInput
        ref={ref}
        style={[
          styles.textarea, 
          { 
            borderColor: colors.border,
            color: colors.foreground,
            backgroundColor: colors.input,
          }, 
          style
        ]}
        placeholderTextColor={colors.muted}
        multiline
        textAlignVertical="top"
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 60,
    width: "100%",
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
});

export { Textarea };
