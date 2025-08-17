import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useColors } from "../theme-provider";

interface Event {
  id: number;
  day: number;
  title: string;
  description?: string;
  time: string;
  color: string;
  hasAttachment?: boolean;
}

const { width } = Dimensions.get("window");

export default function CalendarSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 2, 1)); // March 2023 (0-indexed months)
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear().toString();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const colors = useColors();

  const styles = createStyles(colors);

  // Sample data for the calendar - now using state so we can add to it
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      day: 4,
      title: "Development planning",
      time: "5:20 PM",
      color: "#10b981",
    },
    {
      id: 2,
      day: 12,
      title: "Design new UI and check slides",
      description: "design@company.com",
      time: "3:30 PM",
      color: "#f97316",
      hasAttachment: true,
    },
    {
      id: 3,
      day: 25,
      title: "Weekly catch-up",
      description: "team@yourcompany.com",
      time: "2:15 PM",
      color: "#0ea5e9",
    },
  ]);

  // Calendar data for March 2023
  const calendarDays = generateCalendarDays(currentDate);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDayClick = (day: number) => {
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    // Only allow clicking on days in the current month
    if (day >= 1 && day <= lastDayOfMonth) {
      setSelectedDay(day);
      setIsModalOpen(true);
    }
  };

  const handleSubmitEvent = () => {
    if (selectedDay && newEventTitle.trim()) {
      // Create a new event
      const newEvent: Event = {
        id: events.length + 1,
        day: selectedDay,
        title: newEventTitle,
        description: newEventDescription || undefined,
        time: getCurrentTime(),
        color: getRandomColor(),
      };

      // Add the new event to the events array
      setEvents([...events, newEvent]);

      // Reset form and close modal
      setNewEventTitle("");
      setNewEventDescription("");
      setIsModalOpen(false);
      setSelectedDay(null);
    }
  };

  const handleCancelEvent = () => {
    setNewEventTitle("");
    setNewEventDescription("");
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRandomColor = () => {
    const colors = [
      "#10b981", // emerald
      "#f97316", // orange
      "#0ea5e9", // sky
      "#8b5cf6", // violet
      "#ef4444", // red
      "#f59e0b", // amber
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  function generateCalendarDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Total days in the month
    const daysInMonth = lastDay.getDate();

    // Previous month's last day
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const calendarArray = [];
    let week = [];

    // Add days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(prevMonthLastDay - firstDayOfWeek + i + 1);
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      if (week.length === 7) {
        calendarArray.push(week);
        week = [];
      }
      week.push(day);
    }

    // Add days from next month
    let nextMonthDay = 1;
    while (week.length < 7) {
      week.push(nextMonthDay++);
    }
    calendarArray.push(week);

    // Add one more week if we have less than 6 weeks
    if (calendarArray.length < 6) {
      week = [];
      for (let i = 0; i < 7; i++) {
        week.push(nextMonthDay++);
      }
      calendarArray.push(week);
    }

    return calendarArray;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.monthYear, { color: colors.foreground }]}>
          {currentMonth} {currentYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Days of week */}
      <View style={styles.daysOfWeek}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text key={day} style={[styles.dayOfWeek, { color: colors.muted }]}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const dayEvents = events.filter((event) => event.day === day);
              const isCurrentMonth = day >= 1 && day <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    !isCurrentMonth && styles.otherMonthDay,
                    dayEvents.length > 0 && styles.dayWithEvents
                  ]}
                  onPress={() => handleDayClick(day)}
                  disabled={!isCurrentMonth}
                >
                  <Text style={[
                    styles.dayNumber,
                    { color: isCurrentMonth ? colors.foreground : colors.muted }
                  ]}>
                    {day}
                  </Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventIndicator}>
                      <Text style={[styles.eventCount, { color: colors.background }]}>
                        {dayEvents.length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Events list */}
      <View style={styles.eventsSection}>
        <Text style={[styles.eventsTitle, { color: colors.foreground }]}>Upcoming Events</Text>
        <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
          {events.map((event) => (
            <View key={event.id} style={[styles.eventItem, { borderLeftColor: event.color }]}>
              <View style={styles.eventHeader}>
                <Text style={[styles.eventTitle, { color: colors.foreground }]}>{event.title}</Text>
                <Text style={[styles.eventTime, { color: colors.muted }]}>{event.time}</Text>
              </View>
              {event.description && (
                <Text style={[styles.eventDescription, { color: colors.muted }]}>
                  {event.description}
                </Text>
              )}
              {event.hasAttachment && (
                <View style={styles.attachmentIndicator}>
                  <Ionicons name="attach" size={16} color={colors.muted} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Add Event Modal */}
      <Modal visible={isModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Add Event for {selectedDay}
            </Text>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.foreground 
              }]}
              placeholder="Event title"
              placeholderTextColor={colors.muted}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.foreground 
              }]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.muted}
              value={newEventDescription}
              onChangeText={setNewEventDescription}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleCancelEvent}
              >
                <Text style={[styles.buttonText, { color: colors.muted }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.yellow }]}
                onPress={handleSubmitEvent}
              >
                <Text style={[styles.buttonText, { color: colors.background }]}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      backgroundColor: "white",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      margin: 16,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    monthYear: {
      fontSize: 18,
      fontWeight: "600",
    },
    navButton: {
      padding: 4,
      borderRadius: 20,
    },
    daysOfWeek: {
      flexDirection: "row",
      marginBottom: 16,
    },
    dayOfWeek: {
      flex: 1,
      textAlign: "center",
      fontSize: 12,
      fontWeight: "500",
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 24,
    },
    weekRow: {
      flexDirection: "row",
      width: "100%",
    },
    dayCell: {
      width: `${100 / 7}%`,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 8,
      margin: 1,
    },
    otherMonthDay: {
      opacity: 0.3,
    },
    dayWithEvents: {
      borderWidth: 2,
    },
    dayNumber: {
      fontSize: 14,
      fontWeight: "500",
    },
    eventIndicator: {
      position: "absolute",
      top: 2,
      right: 2,
      backgroundColor: colors.destructive,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    eventCount: {
      fontSize: 10,
      fontWeight: "bold",
    },
    eventsSection: {
      marginTop: 16,
    },
    eventsTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
    },
    eventsList: {
      maxHeight: 200,
    },
    eventItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
      paddingLeft: 12,
      borderLeftWidth: 4,
    },
    eventHeader: {
      flex: 1,
      marginLeft: 8,
    },
    eventTitle: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 4,
    },
    eventTime: {
      fontSize: 12,
      fontWeight: "400",
    },
    eventDescription: {
      fontSize: 12,
      marginTop: 4,
      lineHeight: 16,
    },
    attachmentIndicator: {
      marginLeft: 8,
      padding: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      borderRadius: 12,
      padding: 20,
      width: width * 0.9,
      maxWidth: 400,
      borderWidth: 1,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    cancelButton: {
      borderWidth: 1,
    },
    submitButton: {
      // backgroundColor will be set dynamically
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "500",
    },
  });
};
