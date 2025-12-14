import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";

const { width, height } = Dimensions.get("window");

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export interface SheetTriggerProps {
  children: React.ReactNode;
  onPress: () => void;
}

export interface SheetContentProps {
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface SheetHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface SheetFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface SheetTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface SheetDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface SheetCloseProps {
  onPress: () => void;
  style?: ViewStyle;
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="slide"
      onRequestClose={() => onOpenChange(false)}
    >
      {children}
    </Modal>
  );
};

const SheetTrigger: React.FC<SheetTriggerProps> = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
};

const SheetOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.overlay}>
      {children}
    </View>
  );
};

const SheetContent: React.FC<SheetContentProps> = ({
  side = "right",
  children,
  style,
}) => {
  return (
    <SheetOverlay>
      <View style={[styles.content, styles[side], style]}>
        <SheetClose onPress={() => {}} />
        {children}
      </View>
    </SheetOverlay>
  );
};

const SheetHeader: React.FC<SheetHeaderProps> = ({ children, style }) => {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
};

const SheetFooter: React.FC<SheetFooterProps> = ({ children, style }) => {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
};

const SheetTitle: React.FC<SheetTitleProps> = ({ children, style }) => {
  return (
    <Text style={[styles.title, style]}>
      {children}
    </Text>
  );
};

const SheetDescription: React.FC<SheetDescriptionProps> = ({ children, style }) => {
  return (
    <Text style={[styles.description, style]}>
      {children}
    </Text>
  );
};

const SheetClose: React.FC<SheetCloseProps> = ({ onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.closeButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="close" size={16} color="#6b7280" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  content: {
    position: "absolute",
    backgroundColor: "white",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  left: {
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    maxWidth: 400,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  right: {
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    maxWidth: 400,
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
    borderRadius: 2,
    backgroundColor: "#f3f4f6",
  },
});

export {
    Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger
};

