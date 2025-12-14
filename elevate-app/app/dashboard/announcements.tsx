import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  Megaphone
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Sidebar from '../../components/dashboardItems/sidebar';
import Topbar from '../../components/dashboardItems/topbar';
import SemiBottomBar from '../../components/screens/semibottombar';
import { useColors } from '../../components/theme-provider';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { DotLoader } from '../../components/ui/dot-loader';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGeneralAnnouncements } from '../../store/slices/generalAnnouncementsSlice';

interface GeneralAnnouncement {
  id: number;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "urgent";
  date: string;
  time: string;
  isRead: boolean;
}

// Helper function to determine notification type based on message content
const getNotificationType = (message: string): "info" | "warning" | "success" | "urgent" => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('urgent') || lowerMessage.includes('security') || lowerMessage.includes('critical')) {
    return 'urgent';
  }
  if (lowerMessage.includes('maintenance') || lowerMessage.includes('warning') || lowerMessage.includes('issue')) {
    return 'warning';
  }
  if (lowerMessage.includes('congratulations') || lowerMessage.includes('success') || lowerMessage.includes('completed')) {
    return 'success';
  }
  return 'info';
};

// Helper function to format time from ISO string
const formatTime = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Helper function to format date from ISO string
const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface AnnouncementsScreenProps {
  onNavigate?: (tabName: string) => void;
}

export default function AnnouncementsScreen({ onNavigate }: AnnouncementsScreenProps) {
  const dispatch = useAppDispatch();
  const { announcements, isLoading, error } = useAppSelector((state: any) => state.generalAnnouncements);
  const { token } = useAppSelector((state: any) => state.auth);
  
  // Debug API states
  console.log('📢 Announcements State:', { announcements, isLoading, error });
  
  // Log detailed announcements data when loaded
  useEffect(() => {
    if (announcements && announcements.length > 0) {
      console.log('📋 Detailed Announcements Data:', announcements);
      console.log('📊 Announcements Count:', announcements.length);
    }
  }, [announcements]);
  
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('announcements');
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Fetch announcements on component mount
  useEffect(() => {
    if (token) {
      console.log('🚀 Fetching announcements with token:', token);
      dispatch(fetchGeneralAnnouncements(token) as any);
    }
  }, [token, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.log('❌ Announcements API error:', error);
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

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
    // For general announcements, we'll just mark as read locally
    // Since the API doesn't seem to have mark as read functionality
    console.log('Marking announcement as read:', id);
  };

  const markAllAsRead = () => {
    // For general announcements, we'll just mark all as read locally
    console.log('Marking all announcements as read');
  };

  // Calculate unread count from announcements
  const unreadCount = announcements.filter((a: any) => !a.isRead).length;

  const filteredAnnouncements = announcements.filter((announcement: any) => {
    if (filter === "unread") return !announcement.isRead;
    if (filter === "urgent") return announcement.type === "urgent";
    return true;
  });

  const urgentCount = announcements.filter((a: any) => a.type === "urgent").length;

  const styles = createStyles(colors, insets);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      {/* Topbar */}
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onStateChange={setSidebarOpen} currentPage="announcements" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <View style={styles.mainContent}>
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
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={[styles.markAllButton, { backgroundColor: colors.primary }]}
                  onPress={markAllAsRead}
                >
                  <Text style={[styles.markAllButtonText, { color: colors.primaryForeground }]}>
                    Mark All Read
                  </Text>
                </TouchableOpacity>
              )}
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

          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <DotLoader size="large" color={colors.primary} text="Loading announcements..." />
            </View>
          )}

          {/* Announcements List */}
          {!isLoading && (
            <View style={styles.announcementsList}>
              {filteredAnnouncements.map((announcement: any) => (
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
          )}

          {!isLoading && filteredAnnouncements.length === 0 && (
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
      <SemiBottomBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

function createStyles(colors: any, insets: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      paddingBottom: 32 + insets.bottom, // Account for semi bottom bar height
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 16,
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
    markAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    markAllButtonText: {
      fontSize: 12,
      fontWeight: '600',
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
      height: 80, // Increased padding to ensure content is visible above semi bottom bar
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
    },
  });
}
