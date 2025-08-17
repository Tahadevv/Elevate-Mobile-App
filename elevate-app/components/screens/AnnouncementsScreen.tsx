import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Info,
    Megaphone
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sidebar from '../dashboardItems/sidebar';
import Topbar from '../dashboardItems/topbar';
import { useColors } from '../theme-provider';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface Announcement {
  id: number;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "urgent";
  date: string;
  time: string;
  isRead: boolean;
}

const sampleAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "New Course Available: Advanced Python Programming",
    description: "We've just launched our new Advanced Python Programming course. This comprehensive course covers advanced topics including decorators, generators, async programming, and more. Enroll now to enhance your Python skills!",
    type: "info",
    date: "2024-01-15",
    time: "10:30 AM",
    isRead: true
  },
  {
    id: 2,
    title: "System Maintenance Scheduled",
    description: "Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM EST. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience.",
    type: "warning",
    date: "2024-01-14",
    time: "3:45 PM",
    isRead: true
  },
  {
    id: 3,
    title: "Congratulations! we have new feature",
    description: "We have added a new feature to the platform. You can now create your own study groups and connect with other learners. This is a great way to study together and get help from other learners.",
    type: "success",
    date: "2024-01-13",
    time: "9:15 AM",
    isRead: true
  },
  {
    id: 4,
    title: "Urgent: Security Update Required",
    description: "Please update your password immediately due to a recent security enhancement. This is mandatory for all users to ensure account security.",
    type: "urgent",
    date: "2024-01-12",
    time: "11:20 AM",
    isRead: true
  },
];

interface AnnouncementsScreenProps {
  onNavigate?: (tabName: string) => void;
}

export default function AnnouncementsScreen({ onNavigate }: AnnouncementsScreenProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const colors = useColors();

  const getTypeIcon = (type: string) => {
    const iconSize = 20;
    
    switch (type) {
      case "info":
        return <Info size={iconSize} color={colors.primary} />;
      case "warning":
        return <AlertCircle size={iconSize} color={colors.accent} />;
      case "success":
        return <CheckCircle size={iconSize} color={colors.primary} />;
      case "urgent":
        return <AlertCircle size={iconSize} color={colors.destructive} />;
      default:
        return <Info size={iconSize} color={colors.primary} />;
    }
  };

  const getTypeBadge = (type: string) => {
    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    
    switch (type) {
      case "info":
        badgeVariant = "default";
        break;
      case "warning":
        badgeVariant = "outline";
        break;
      case "success":
        badgeVariant = "default";
        break;
      case "urgent":
        badgeVariant = "destructive";
        break;
    }

    const badgeText = type.charAt(0).toUpperCase() + type.slice(1);
    
    return (
      <Badge variant={badgeVariant}>
        {badgeText}
      </Badge>
    );
  };

  const markAsRead = (id: number) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id 
          ? { ...announcement, isRead: true }
          : announcement
      )
    );
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === "unread") return !announcement.isRead;
    if (filter === "urgent") return announcement.type === "urgent";
    return true;
  });

  const unreadCount = announcements.filter(a => !a.isRead).length;
  const urgentCount = announcements.filter(a => a.type === "urgent").length;

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Topbar */}
      <Topbar />
      
      {/* Sidebar */}
      <Sidebar onStateChange={setSidebarOpen} currentPage="announcements" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { marginLeft: sidebarOpen ? 256 : 0 }
      ]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Announcements
            </Text>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Megaphone size={16} color={colors.foreground} />
                <Text style={[styles.statText, { color: colors.foreground }]}>
                  {unreadCount} unread
                </Text>
              </View>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === "all" && styles.activeFilterTab
              ]}
              onPress={() => setFilter("all")}
            >
              <Text style={[
                styles.filterTabText,
                { color: filter === "all" ? colors.background : colors.foreground }
              ]}>
                All ({announcements.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === "unread" && styles.activeFilterTab
              ]}
              onPress={() => setFilter("unread")}
            >
              <Text style={[
                styles.filterTabText,
                { color: filter === "unread" ? colors.background : colors.foreground }
              ]}>
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                filter === "urgent" && styles.activeFilterTab
              ]}
              onPress={() => setFilter("urgent")}
            >
              <Text style={[
                styles.filterTabText,
                { color: filter === "urgent" ? colors.background : colors.foreground }
              ]}>
                Urgent ({urgentCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Announcements List */}
          <View style={styles.announcementsList}>
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} style={styles.announcementCard}>
                <CardHeader style={styles.cardHeader}>
                  <View style={styles.announcementHeader}>
                    <View style={styles.announcementContent}>
                      <View style={styles.titleRow}>
                        <View style={styles.iconContainer}>
                          {getTypeIcon(announcement.type)}
                        </View>
                        <View style={styles.titleContent}>
                          <CardTitle style={styles.announcementTitle}>
                            {announcement.title}
                          </CardTitle>
                          <View style={styles.badgeRow}>
                            {getTypeBadge(announcement.type)}
                            {!announcement.isRead && (
                              <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                            )}
                          </View>
                        </View>
                      </View>
                      <CardDescription style={[styles.announcementDescription, { color: colors.mutedForeground }] as any}>
                        {announcement.description}
                      </CardDescription>
                    </View>
                  </View>
                </CardHeader>
                <CardContent style={styles.cardContent}>
                  <View style={styles.announcementFooter}>
                    <View style={styles.dateTimeInfo}>
                      <View style={styles.dateTimeItem}>
                        <Calendar size={12} color={colors.mutedForeground} />
                        <Text style={[styles.dateTimeText, { color: colors.mutedForeground }]}>
                          {new Date(announcement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Text>
                      </View>
                      <View style={styles.dateTimeItem}>
                        <Clock size={12} color={colors.mutedForeground} />
                        <Text style={[styles.dateTimeText, { color: colors.mutedForeground }]}>
                          {announcement.time}
                        </Text>
                      </View>
                    </View>
                    {!announcement.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => markAsRead(announcement.id)}
                        style={[styles.markAsReadButton, { backgroundColor: colors.primary }] as any}
                        textStyle={{ color: colors.primaryForeground }}
                      >
                        Mark as read
                      </Button>
                    )}
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          {filteredAnnouncements.length === 0 && (
            <View style={styles.emptyState}>
              <Megaphone size={48} color={colors.muted} />
              <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
                No announcements found
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.mutedForeground }]}>
                {filter === "all" 
                  ? "There are no announcements at the moment."
                  : filter === "unread" 
                  ? "You've read all announcements."
                  : "There are no urgent announcements."
                }
              </Text>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </View>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
    },
    headerStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statText: {
      fontSize: 14,
      fontWeight: '500',
    },
    filterTabs: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 16,
      gap: 12,
    },
    filterTab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeFilterTab: {
      backgroundColor: colors.yellow,
      borderColor: colors.yellow,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '500',
    },
    announcementsList: {
      paddingHorizontal: 24,
      gap: 16,
    },
    announcementCard: {
      marginBottom: 16,
    },
    cardHeader: {
      paddingBottom: 12,
    },
    announcementHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    announcementContent: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: 8,
    },
    iconContainer: {
      marginTop: 2,
    },
    titleContent: {
      flex: 1,
    },
    announcementTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    announcementDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    cardContent: {
      paddingTop: 0,
    },
    announcementFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateTimeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    dateTimeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dateTimeText: {
      fontSize: 12,
    },
    markAsReadButton: {
      height: 28,
      paddingHorizontal: 8,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    bottomPadding: {
      height: 24,
    },
  });
}
