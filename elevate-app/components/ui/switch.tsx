import * as React from "react";
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const Switch = React.forwardRef<View, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled = false, style }, ref) => {
    const translateX = React.useRef(new Animated.Value(checked ? 16 : 0)).current;

    React.useEffect(() => {
      Animated.timing(translateX, {
        toValue: checked ? 16 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [checked, translateX]);

    const handlePress = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.switch,
          checked && styles.switchChecked,
          disabled && styles.switchDisabled,
          style,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </TouchableOpacity>
    );
  }
);

Switch.displayName = "Switch";

const styles = StyleSheet.create({
  switch: {
    height: 20,
    width: 36,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
    padding: 2,
    justifyContent: "center",
  },
  switchChecked: {
    backgroundColor: "#3b82f6",
  },
  switchDisabled: {
    opacity: 0.5,
  },
  thumb: {
    height: 16,
    width: 16,
    borderRadius: 2,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export { Switch };
