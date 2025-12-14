import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  active?: boolean;
  style?: ViewStyle;
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  style,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: handleValueChange,
    }),
    [value, onValueChange]
  );

  return (
    <View style={[styles.tabs, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { contextValue } as any);
        }
        return child;
      })}
    </View>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, style }) => {
  return (
    <View style={[styles.tabsList, style]}>
      {children}
    </View>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  onPress,
  active = false,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabsTrigger,
        active && styles.tabsTriggerActive,
        disabled && styles.tabsTriggerDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.tabsTriggerText,
          active && styles.tabsTriggerTextActive,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  active = false,
  style,
}) => {
  if (!active) return null;

  return (
    <View style={[styles.tabsContent, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
  },
  tabsList: {
    flexDirection: "row",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: "#f3f4f6",
    padding: 2,
  },
  tabsTrigger: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabsTriggerActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabsTriggerDisabled: {
    opacity: 0.5,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabsTriggerTextActive: {
    color: "#111827",
  },
  tabsContent: {
    marginTop: 8,
  },
});

export { Tabs, TabsContent, TabsList, TabsTrigger };

