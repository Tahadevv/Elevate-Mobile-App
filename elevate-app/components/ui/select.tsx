import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import { useColors } from "../theme-provider";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  style?: ViewStyle;
}

export interface SelectTriggerProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export interface SelectContentProps {
  children: React.ReactNode;
  visible: boolean;
  style?: ViewStyle;
}

export interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export interface SelectLabelProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface SelectValueProps {
  children: React.ReactNode;
  placeholder?: string;
  style?: TextStyle;
}

const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  options,
  disabled = false,
  style,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <View style={styles.selectContainer}>
      <SelectTrigger 
        onPress={toggleDropdown} 
        disabled={disabled} 
        style={style}
      >
        <SelectValue placeholder={placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </SelectValue>
        <Ionicons 
          name={open ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#6b7280" 
        />
      </SelectTrigger>

      {open && (
        <SelectContent 
          visible={open} 
          triggerRef={null}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              onPress={() => handleSelect(option.value)}
              selected={option.value === value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </View>
  );
};

const SelectTrigger = React.forwardRef<TouchableOpacity, SelectTriggerProps>(({
  children,
  onPress,
  disabled = false,
  style,
}, ref) => {
  const colors = useColors();
  
  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.trigger, 
        { 
          borderColor: colors.border,
          backgroundColor: colors.input,
          shadowColor: colors.foreground
        },
        disabled && styles.triggerDisabled, 
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );
});

const SelectContent: React.FC<SelectContentProps> = ({
  children,
  visible,
  triggerRef,
  style,
}) => {
  const colors = useColors();
  
  if (!visible) return null;
  
  return (
    <View style={[
      styles.dropdownContent, 
      { 
        backgroundColor: colors.popover,
        borderColor: colors.border,
        shadowColor: colors.foreground
      }, 
      style
    ]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({
  children,
  onPress,
  selected = false,
  disabled = false,
  style,
}) => {
  const colors = useColors();
  
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: selected ? colors.accent : 'transparent' },
        selected && styles.itemSelected,
        disabled && styles.itemDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.itemText, 
        { color: colors.foreground },
        selected && [styles.itemTextSelected, { color: colors.primary }]
      ]}>
        {children}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={16} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
};

const SelectLabel: React.FC<SelectLabelProps> = ({ children, style }) => {
  const colors = useColors();
  
  return (
    <Text style={[styles.label, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
};

const SelectValue: React.FC<SelectValueProps> = ({ children, style }) => {
  const colors = useColors();
  
  return (
    <Text style={[styles.value, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  selectContainer: {
    width: "100%",
  },
  trigger: {
    height: 36,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  dropdownContent: {
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 9999,
    zIndex: 99999,
  },
  content: {
    padding: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  itemSelected: {
    // backgroundColor handled dynamically
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemText: {
    fontSize: 14,
    flex: 1,
  },
  itemTextSelected: {
    fontWeight: "500",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  value: {
    fontSize: 14,
    flex: 1,
  },
});

export {
    Select, SelectContent,
    SelectItem,
    SelectLabel, SelectTrigger, SelectValue
};

