import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import { useColors } from "../theme-provider";

export interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface AccordionTriggerProps {
  children: React.ReactNode;
  onPress: () => void;
  isOpen: boolean;
  style?: ViewStyle;
}

export interface AccordionContentProps {
  children: React.ReactNode;
  isOpen: boolean;
  style?: ViewStyle;
}

const Accordion: React.FC<AccordionProps> = ({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  style,
}) => {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === "single" ? "" : [])
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string | string[]) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const contextValue = React.useMemo(
    () => ({
      type,
      value,
      onValueChange: handleValueChange,
    }),
    [type, value, onValueChange]
  );

  return (
    <View style={[styles.accordion, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { contextValue } as any);
        }
        return child;
      })}
    </View>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, style }) => {
  const colors = useColors();
  
  return (
    <View style={[styles.accordionItem, { borderBottomColor: colors.border }, style]}>
      {children}
    </View>
  );
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  onPress,
  isOpen,
  style,
}) => {
  const colors = useColors();
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <TouchableOpacity
      style={[styles.accordionTrigger, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.triggerContent}>
        <Ionicons name="help-circle" size={16} color={colors.yellow} />
        <View style={styles.triggerTextContainer}>
          {children}
        </View>
      </View>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons name="chevron-down" size={16} color={colors.yellow} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  isOpen,
  style,
}) => {
  const heightAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen, heightAnim]);

  return (
    <Animated.View
      style={[
        styles.accordionContent,
        {
          maxHeight: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
          opacity: heightAnim,
        },
        style,
      ]}
    >
      <View style={styles.contentInner}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  accordion: {
    width: "100%",
  },
  accordionItem: {
    borderBottomWidth: 1,
  },
  accordionTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  triggerTextContainer: {
    flex: 1,
  },
  accordionContent: {
    overflow: "hidden",
  },
  contentInner: {
    paddingBottom: 16,
    paddingTop: 0,
    paddingLeft: 24,
  },
});

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

