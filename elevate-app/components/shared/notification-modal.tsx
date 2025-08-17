import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent={true}
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            <TouchableOpacity
              onPress={() => onOpenChange(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.notificationItem}>
              <View style={styles.iconContainer}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="trophy" size={24} color="#8b5cf6" />
                </View>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>
                      You&apos;ve studied 3 sets! You&apos;ve earned set stacker status.
                    </Text>
                    <Text style={styles.notificationTime}>5 days ago</Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View all achievements</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.iconContainer}>
                <View style={styles.homeworkIcon}>
                  <Ionicons name="book" size={24} color="#10b981" />
                </View>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>
                      Double check your Engineering homework with expert-verified solutions.
                    </Text>
                    <Text style={styles.notificationTime}>3 weeks ago</Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Search for your textbook</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.flashcardCard}>
              <View style={styles.flashcardContent}>
                <View style={styles.flashcardInfo}>
                  <Text style={styles.flashcardTitle}>
                    CompTIA A+ 220-1102 (Core 2)
                  </Text>
                  <Text style={styles.flashcardSubtitle}>
                    Flashcard set • 50 terms • by ITUlearning
                  </Text>
                </View>
                <View style={styles.flashcardIcon}>
                  <Ionicons name="card" size={30} color="#3b82f6" />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  notificationsContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  iconContainer: {
    flexShrink: 0,
  },
  achievementIcon: {
    backgroundColor: "#f3e8ff",
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  homeworkIcon: {
    backgroundColor: "#d1fae5",
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  moreButton: {
    padding: 4,
  },
  actionButton: {
    alignSelf: "flex-start",
  },
  actionButtonText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
  flashcardCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  flashcardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flashcardInfo: {
    flex: 1,
  },
  flashcardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  flashcardSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  flashcardIcon: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
}); 