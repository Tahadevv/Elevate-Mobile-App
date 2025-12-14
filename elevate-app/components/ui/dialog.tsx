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
    ViewStyle,
} from "react-native";

const { width, height } = Dimensions.get("window");

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export interface DialogTriggerProps {
  children: React.ReactNode;
  onPress: () => void;
}

export interface DialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface DialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface DialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface DialogCloseProps {
  onPress: () => void;
  style?: ViewStyle;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
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

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
};

const DialogOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.overlay}>
      {children}
    </View>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ children, style }) => {
  return (
    <DialogOverlay>
      <View style={[styles.content, style]}>
        {children}
      </View>
    </DialogOverlay>
  );
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ children, style }) => {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
};

const DialogFooter: React.FC<DialogFooterProps> = ({ children, style }) => {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
};

const DialogTitle: React.FC<DialogTitleProps> = ({ children, style }) => {
  return (
    <Text style={[styles.title, style]}>
      {children}
    </Text>
  );
};

const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, style }) => {
  return (
    <Text style={[styles.description, style]}>
      {children}
    </Text>
  );
};

const DialogClose: React.FC<DialogCloseProps> = ({ onPress, style }) => {
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 2,
    padding: 24,
    margin: 20,
    width: width * 0.9,
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
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
    lineHeight: 24,
    letterSpacing: -0.025,
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
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
  },
});

export {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger
};

