import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import React, { ReactNode } from "react";
import {
    Dimensions,
    Modal as RNModal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <RNModal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {Platform.OS !== 'web' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]} />
        )}
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          {children}
        </View>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 16,
    padding: 24,
    borderRadius: 4,
    width: screenWidth - 32,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
  },
});

export { Modal };
