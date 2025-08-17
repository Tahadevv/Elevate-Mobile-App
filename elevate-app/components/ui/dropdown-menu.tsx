import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface DropdownMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onPress: () => void;
}

export interface DropdownMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface DropdownMenuItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  inset?: boolean;
  style?: ViewStyle;
}

export interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export interface DropdownMenuRadioItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export interface DropdownMenuLabelProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: TextStyle;
}

export interface DropdownMenuSeparatorProps {
  style?: ViewStyle;
}

export interface DropdownMenuShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ open, onOpenChange, children }) => {
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      {children}
    </Modal>
  );
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
};

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, style }) => {
  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={() => {}}
    >
      <View style={[styles.content, style]}>
        <TouchableOpacity activeOpacity={1}>
          {children}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onPress,
  disabled = false,
  inset = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        inset && styles.itemInset,
        disabled && styles.itemDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const DropdownMenuCheckboxItem: React.FC<DropdownMenuCheckboxItemProps> = ({
  children,
  checked = false,
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        styles.checkboxItem,
        disabled && styles.itemDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxIndicator}>
        {checked && <Ionicons name="checkmark" size={16} color="#3b82f6" />}
      </View>
      {children}
    </TouchableOpacity>
  );
};

const DropdownMenuRadioItem: React.FC<DropdownMenuRadioItemProps> = ({
  children,
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        styles.radioItem,
        disabled && styles.itemDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.radioIndicator}>
        <View style={styles.radioDot} />
      </View>
      {children}
    </TouchableOpacity>
  );
};

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  children,
  inset = false,
  style,
}) => {
  return (
    <Text style={[styles.label, inset && styles.labelInset, style]}>
      {children}
    </Text>
  );
};

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ style }) => {
  return <View style={[styles.separator, style]} />;
};

const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({ children, style }) => {
  return (
    <Text style={[styles.shortcut, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 100,
    paddingLeft: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    padding: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 8,
  },
  itemInset: {
    paddingLeft: 32,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  checkboxItem: {
    paddingLeft: 32,
  },
  radioItem: {
    paddingLeft: 32,
  },
  checkboxIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  radioIndicator: {
    position: "absolute",
    left: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  labelInset: {
    paddingLeft: 32,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 4,
    marginVertical: 4,
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 12,
    letterSpacing: 0.05,
    opacity: 0.6,
    color: "#6b7280",
  },
});

export {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuShortcut, DropdownMenuTrigger
};

