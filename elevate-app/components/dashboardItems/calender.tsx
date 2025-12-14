import { ChevronLeft, ChevronRight, Edit, Trash, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API_CONFIG from "../../config.api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createEvent, deleteEvent, fetchEvents, updateEvent } from "../../store/slices/eventsSlice";
import { useColors } from "../theme-provider";
import { DotLoader } from "../ui/dot-loader";

interface Event {
  id: number;
  day: number;
  title: string;
  description?: string;
  time: string;
  color: string;
  hasAttachment?: boolean;
  eventMonth: number; // 0-indexed month from event_date
  eventYear: number;
}

const { width } = Dimensions.get("window");

export default function CalendarSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear().toString();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const dispatch = useAppDispatch();
  const { events: apiEvents, isLoading, error } = useAppSelector((state: any) => state.events);
  const { token } = useAppSelector((state: any) => state.auth);
  const colors = useColors();

  const styles = createStyles(colors);

  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  // Helper function to get current time in format like "3:30 PM"
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  // Helper function to get a random color for new events
  const getRandomColor = () => {
    const colors = ["#10b981", "#f97316", "#0ea5e9", "#8b5cf6", "#ef4444", "#f59e0b"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Fetch events on mount
  useEffect(() => {
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    dispatch(fetchEvents(authToken) as any);
  }, [token, dispatch]);

  // Map API events to our Event structure
  const events: Event[] = useMemo(() => {
    if (!apiEvents || !Array.isArray(apiEvents)) return [];
    
    return apiEvents.map((item: any, index: number) => {
      const dateObj = new Date(item.event_date);
      return {
        id: item.id ?? index + 1,
        day: dateObj.getDate(),
        title: item.title,
        description: item.description,
        time: getCurrentTime(),
        color: getRandomColor(),
        eventMonth: dateObj.getMonth(),
        eventYear: dateObj.getFullYear(),
      };
    });
  }, [apiEvents]);

  // Calendar data
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
      const today = new Date();
      const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) <
        new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (isPast) {
        Alert.alert("Error", "Cannot add events in the past");
        return;
      }
      setSelectedDay(day);
      setIsModalOpen(true);
    }
  };

  const handleSubmitEvent = async () => {
    if (!selectedDay || !newEventTitle.trim()) {
      Alert.alert("Error", "Please provide a title");
      return;
    }

    const eventDate = formatYmd(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);

    // Double-check block if user navigated back in time between select and submit
    const today = new Date();
    const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) <
      new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (isPast) {
      Alert.alert("Error", "Cannot add events in the past");
      return;
    }

    try {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      // @ts-ignore
      const result: any = await dispatch(createEvent({
        token: authToken,
        title: newEventTitle,
        event_date: eventDate,
        description: newEventDescription || undefined,
      }));

      if (createEvent.fulfilled.match(result)) {
        setNewEventTitle("");
        setNewEventDescription("");
        setIsModalOpen(false);
        setSelectedDay(null);
        Alert.alert("Success", "Event added successfully");
      } else {
        Alert.alert("Error", result.payload || "Failed to add event");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent || !editTitle.trim()) {
      Alert.alert("Error", "Please provide a title");
      return;
    }

    const eventDate = formatYmd(currentDate.getFullYear(), currentDate.getMonth(), editingEvent.day);

    try {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      // @ts-ignore
      const result: any = await dispatch(updateEvent({
        token: authToken,
        eventId: editingEvent.id,
        title: editTitle,
        event_date: eventDate,
        description: editDescription || undefined,
      }));

      if (updateEvent.fulfilled.match(result)) {
        setIsEditOpen(false);
        setEditingEvent(null);
        setEditTitle("");
        setEditDescription("");
        Alert.alert("Success", "Event updated successfully");
      } else {
        Alert.alert("Error", result.payload || "Failed to update event");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;

    try {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      // @ts-ignore
      const result: any = await dispatch(deleteEvent({
        token: authToken,
        eventId: deletingEvent.id,
      }));

      if (deleteEvent.fulfilled.match(result)) {
        setIsDeleteOpen(false);
        setDeletingEvent(null);
        Alert.alert("Success", "Event deleted successfully");
      } else {
        Alert.alert("Error", result.payload || "Failed to delete event");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  function formatYmd(year: number, zeroIndexedMonth: number, day: number) {
    const m = zeroIndexedMonth + 1;
    const mm = m < 10 ? `0${m}` : `${m}`;
    const dd = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${mm}-${dd}`;
  }

  function generateCalendarDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0..6
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarArray: (number | null)[][] = [];
    let week: (number | null)[] = [];

    // Leading blanks
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      if (week.length === 7) {
        calendarArray.push(week);
        week = [];
      }
      week.push(day);
    }

    // Trailing blanks
    while (week.length < 7) {
      week.push(null);
    }
    calendarArray.push(week);

    // Ensure a consistent 6-row grid by filling remaining weeks with blanks
    while (calendarArray.length < 6) {
      calendarArray.push([null, null, null, null, null, null, null]);
    }

    return calendarArray;
  }

  if (isLoading && events.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading calendar events..." />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <ChevronLeft size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
          <Text style={[styles.headerMonth, { color: colors.foreground }]}>{currentMonth}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <ChevronRight size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerYear, { color: colors.foreground }]}>{currentYear}</Text>
      </View>

      {/* Days of week */}
      <View style={styles.daysOfWeekGrid}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <View key={day} style={[styles.dayOfWeekBox, { backgroundColor: colors.muted }]}>
            <Text style={[styles.dayOfWeekText, { color: colors.mutedForeground }]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const isBlank = day === null;
              const isCurrentMonth = !isBlank;
              const hasEventInCurrentMonthYear = !isBlank && events.some(
                (event) =>
                  event.day === day &&
                  event.eventMonth === currentDate.getMonth() &&
                  event.eventYear === currentDate.getFullYear(),
              );
              const isHighlighted = !isBlank && hasEventInCurrentMonthYear && isCurrentMonth;
              const isPast = !isBlank && new Date(currentDate.getFullYear(), currentDate.getMonth(), day) <
                new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

              return (
                <TouchableOpacity
                  key={`${weekIndex}-${dayIndex}`}
                  style={[
                    styles.dayCell,
                    { borderTopColor: colors.border },
                    isHighlighted && { backgroundColor: "#3b82f6" },
                    !isCurrentMonth && styles.otherMonthDay,
                    isPast && styles.pastDay,
                  ]}
                  onPress={() => !isBlank && handleDayClick(day as number)}
                  disabled={isBlank || isPast}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      { color: isHighlighted ? "#ffffff" : isCurrentMonth ? colors.foreground : colors.mutedForeground },
                      hasEventInCurrentMonthYear && !isHighlighted && styles.dayNumberBold,
                    ]}
                  >
                    {!isBlank ? day : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Events Section */}
      <View style={styles.eventsSection}>
        <Text style={[styles.eventsTitle, { color: colors.mutedForeground }]}>EVENTS</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <DotLoader size="small" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : (
          <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <View style={styles.eventLeft}>
                  <View style={[styles.eventDayCircle, { backgroundColor: event.color }]}>
                    <Text style={styles.eventDayText}>{event.day}</Text>
                  </View>
                  <View style={styles.eventTextContainer}>
                    <Text style={[styles.eventTitle, { color: colors.foreground }]} numberOfLines={2} ellipsizeMode="tail">
                      {event.title}
                    </Text>
                    {event.description && (
                      <Text style={[styles.eventDescription, { color: colors.mutedForeground }]} numberOfLines={2} ellipsizeMode="tail">
                        {event.description}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.eventRight}>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setEditingEvent(event);
                      setEditTitle(event.title);
                      setEditDescription(event.description || "");
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit size={12} color={colors.primaryForeground || "#ffffff"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: colors.destructive }]}
                    onPress={() => {
                      setDeletingEvent(event);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash size={12} color={colors.primaryForeground || "#ffffff"} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Add Event Modal */}
      <Modal visible={isModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Add Event for {currentMonth} {selectedDay}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton}>
                <X size={18} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Event Title</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: titleFocused ? colors.ring : colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="Enter event title"
                placeholderTextColor={colors.mutedForeground}
                value={newEventTitle}
                onChangeText={setNewEventTitle}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: descFocused ? colors.ring : colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="Enter event description"
                placeholderTextColor={colors.mutedForeground}
                value={newEventDescription}
                onChangeText={setNewEventDescription}
                multiline
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => {
                  setIsModalOpen(false);
                  setNewEventTitle("");
                  setNewEventDescription("");
                  setSelectedDay(null);
                }}
              >
                <Text style={[styles.buttonText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.yellow || "#ffd404" }]}
                onPress={handleSubmitEvent}
              >
                <Text style={[styles.buttonText, { color: colors.background }]}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Event Modal */}
      <Modal visible={isEditOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Edit Event</Text>
              <TouchableOpacity onPress={() => setIsEditOpen(false)} style={styles.closeButton}>
                <X size={18} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Event Title</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: titleFocused ? colors.ring : colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="Enter event title"
                placeholderTextColor={colors.mutedForeground}
                value={editTitle}
                onChangeText={setEditTitle}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: descFocused ? colors.ring : colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="Enter event description"
                placeholderTextColor={colors.mutedForeground}
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => {
                  setIsEditOpen(false);
                  setEditingEvent(null);
                  setEditTitle("");
                  setEditDescription("");
                }}
              >
                <Text style={[styles.buttonText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.yellow || "#ffd404" }]}
                onPress={handleEditEvent}
              >
                <Text style={[styles.buttonText, { color: colors.background }]}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Delete Event</Text>
              <TouchableOpacity onPress={() => setIsDeleteOpen(false)} style={styles.closeButton}>
                <X size={18} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.deleteMessage, { color: colors.mutedForeground }]}>
              Are you sure you want to delete <Text style={{ color: colors.foreground, fontWeight: "600" }}>{deletingEvent?.title}</Text>?
              This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => {
                  setIsDeleteOpen(false);
                  setDeletingEvent(null);
                }}
              >
                <Text style={[styles.buttonText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.destructive }]}
                onPress={handleDeleteEvent}
              >
                <Text style={[styles.buttonText, { color: "#ffffff" }]}>Delete</Text>
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
      borderRadius: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: "100%",
      marginTop: 8,
      marginHorizontal: 0,
      marginBottom: 60,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 0,
      borderWidth: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    headerLeftGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    headerMonth: {
      fontSize: 14,
      fontWeight: "500",
      marginHorizontal: 8,
    },
    headerYear: {
      fontSize: 14,
      fontWeight: "500",
    },
    navButton: {
      padding: 4,
      borderRadius: 2,
    },
    daysOfWeekGrid: {
      flexDirection: "row",
      marginBottom: 8,
    },
    dayOfWeekBox: {
      flex: 1,
      paddingVertical: 6,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 2,
    },
    dayOfWeekText: {
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
      borderTopWidth: 1,
      borderRadius: 0,
      marginVertical: 1,
    },
    otherMonthDay: {
      opacity: 0.3,
    },
    pastDay: {
      opacity: 0.5,
    },
    dayNumber: {
      fontSize: 12,
      fontWeight: "500",
    },
    dayNumberBold: {
      fontWeight: "700",
    },
    eventsSection: {
      marginTop: 16,
    },
    eventsTitle: {
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 12,
    },
    eventsList: {
      maxHeight: 200,
    },
    eventRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    eventLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
      marginRight: 8,
    },
    eventDayCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    eventDayText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },
    eventTextContainer: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 4,
    },
    eventDescription: {
      fontSize: 12,
      lineHeight: 16,
    },
    eventRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    iconButton: {
      width: 24,
      height: 24,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingContainer: {
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    errorContainer: {
      padding: 20,
      alignItems: "center",
    },
    errorText: {
      fontSize: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      borderRadius: 16,
      padding: 20,
      width: width * 0.9,
      maxWidth: 400,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      textAlign: "left",
      flex: 1,
    },
    closeButton: {
      padding: 6,
      marginLeft: 8,
    },
    fieldGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 12,
      fontWeight: "500",
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      marginBottom: 4,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: "top",
      paddingTop: 12,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 8,
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
    deleteMessage: {
      fontSize: 14,
      marginBottom: 16,
      lineHeight: 20,
    },
  });
};
