import { useRouter } from "expo-router";
import {
  Bell,
  BookOpen,
  HelpCircle,
  LogOut,
  Megaphone,
  Settings,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../../assets/images/logo.svg';
import { NotificationModal } from "../shared/notification-modal";
import { useTheme } from "../theme-provider";
import { ThemeToggle } from "../theme-toggle";

interface SidebarProps {
  style?: any;
  onStateChange?: (isOpen: boolean) => void;
  currentPage?: string; // Add current page prop
  onNavigate?: (tabName: string) => void; // Add navigation callback
  isOpen?: boolean; // Controlled state from parent
}

type MenuItem = {
  icon?: any;
  component?: React.ComponentType;
  label: string;
  link?: string;
  iconColor?: string;
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
};

export default function Sidebar({ style, onStateChange, currentPage = 'courses', onNavigate, isOpen: controlledIsOpen }: SidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const styles = createStyles(colors, insets);

  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get('window');
      if (width < 768) {
        if (controlledIsOpen === undefined) {
          setInternalIsOpen(false);
        }
      } else {
        if (controlledIsOpen === undefined) {
          setInternalIsOpen(true);
        }
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener for dimension changes
    const subscription = Dimensions.addEventListener('change', checkScreenSize);

    // Cleanup
    return () => subscription?.remove();
  }, [controlledIsOpen]);

  // Update internal state when controlled state changes
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setInternalIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  // Notify parent component when sidebar state changes (only if not controlled)
  useEffect(() => {
    if (controlledIsOpen === undefined) {
      onStateChange?.(internalIsOpen);
    }
  }, [internalIsOpen, onStateChange, controlledIsOpen]);

  const handleMenuItemClick = (label: string) => {
    console.log('Menu item clicked:', label); // Debug log
    
    if (label === "Notifications") {
      setNotificationOpen(true);
    } else if (label === "Logout") {
      setLogoutOpen(true);
    } else {
      // Map menu labels to routes and navigate
      let route = '';
      let tabName = '';
      
      switch (label) {
        case "My Courses":
          route = '/dashboard';
          tabName = 'courses';
          break;
        case "Announcements":
          route = '/dashboard/announcements';
          tabName = 'announcements';
          break;
        case "Help Center":
          route = '/dashboard/help';
          tabName = 'help';
          break;
        case "Settings":
          route = '/dashboard/account';
          tabName = 'settings';
          break;
        default:
          return;
      }
      
      console.log('Navigating to:', route, 'with tab:', tabName); // Debug log
      
      // Force sidebar to close immediately
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(false);
      }
      onStateChange?.(false);
      
      // Navigate to the route
      router.push(route as any);
      
      // Notify parent component about tab change if needed
      if (onNavigate) {
        onNavigate(tabName);
      }
    }
  };

  const menuCategories: MenuCategory[] = [
    {
      title: "LEARNING",
      items: [
        { icon: BookOpen, label: "My Courses", link: "/dashboard", iconColor: "#3b82f6" } // text-blue-500
      ]
    },
    {
      title: "COMMUNICATION",
      items: [
        { icon: Megaphone, label: "Announcements", link: "/dashboard/announcements", iconColor: "#ef4444" }, // text-red-500
        { icon: Bell, label: "Notifications", iconColor: "#10b981" } // text-green-500
      ]
    },
    {
      title: "SUPPORT",
      items: [
        { icon: HelpCircle, label: "Help Center", link: "/dashboard/help", iconColor: "#8b5cf6" } // text-purple-500
      ]
    },
    {
      title: "ACCOUNT",
      items: [
        { icon: Settings, label: "Settings", link: "/dashboard/account", iconColor: "#6b7280" }, // text-gray-500
        { component: ThemeToggle, label: "Theme" }
      ]
    }
  ];

  const logoutItem = { icon: LogOut, label: "Logout" };

  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;

  return (
    <>
      {/* Sidebar */}
      <View
        style={[
          styles.sidebar,
          isOpen ? styles.sidebarOpen : styles.sidebarClosed,
          style,
        ]}
        pointerEvents={isMobile && !isOpen ? 'none' : 'auto'}
      >
        <ScrollView 
          style={styles.sidebarScrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sidebarContent}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            {isDark ? (
              <Image
                source={require('../../assets/images/logo-white.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <Logo 
                width={200} 
                height={60} 
                style={styles.logo}
              />
            )}
          </View>

          {/* Navigation */}
          <View style={styles.navigation}>
            {menuCategories.map((category, categoryIndex) => (
              <View key={categoryIndex} style={styles.category}>
                <Text style={[styles.categoryTitle, { color: colors.foreground }]}>
                  {category.title}
                </Text>
                <View style={styles.menuItems}>
                  {category.items.map((item, itemIndex) => {
                    const isActive = (item.label === "My Courses" && currentPage === 'courses') || 
                                    (item.label === "Announcements" && currentPage === 'announcements') ||
                                    (item.label === "Help Center" && currentPage === 'help') ||
                                    (item.label === "Settings" && currentPage === 'settings');
                    
                    return (
                      <View key={itemIndex}>
                        {item.component ? (
                          // If item has a component -> render the component
                          <View style={[
                            styles.menuItem,
                            isActive && styles.activeMenuItem
                          ]}>
                            <item.component />
                            <Text style={[
                              styles.menuItemText, 
                              { color: isActive ? colors.yellow : colors.foreground }
                            ]}>
                              {item.label}
                            </Text>
                          </View>
                        ) : item.link ? (
                          // If item has link -> normal link
                          <TouchableOpacity 
                            style={[
                              styles.menuItem,
                              isActive && styles.activeMenuItem
                            ]}
                            onPress={() => handleMenuItemClick(item.label)}
                          >
                            {item.icon && (
                              <item.icon 
                                size={16} 
                                color={isActive ? colors.yellow : (item.iconColor || colors.foreground)} 
                                style={styles.menuIcon} 
                              />
                            )}
                            <Text style={[
                              styles.menuItemText, 
                              { color: isActive ? colors.yellow : colors.foreground }
                            ]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          // If item has NO link -> behave like a button
                          <TouchableOpacity
                            style={[
                              styles.menuItem,
                              isActive && styles.activeMenuItem
                            ]}
                            onPress={() => handleMenuItemClick(item.label)}
                          >
                            {item.icon && (
                              <item.icon 
                                size={16} 
                                color={isActive ? colors.yellow : (item.iconColor || colors.foreground)} 
                                style={styles.menuIcon} 
                              />
                            )}
                            <Text style={[
                              styles.menuItemText, 
                              { color: isActive ? colors.yellow : colors.foreground }
                            ]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          {/* Upgrade Card */}
          <View style={styles.upgradeCardContainer}>
            <View style={[styles.upgradeCard, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.upgradeTitle, { color: colors.yellow }]}>Access to all Domains</Text>
              <Text style={[styles.upgradeSubtitle, { color: colors.foreground }]}>
                Elevate Exam is Ready{'\n'}to help You Grow.
              </Text>
              <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: colors.yellow }]}>
                <Text style={[styles.upgradeButtonText, { color: colors.background }]}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Section */}
          <View style={[styles.logoutSection, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => handleMenuItemClick(logoutItem.label)}
            >
              <logoutItem.icon size={20} color={colors.foreground} style={styles.logoutIcon} />
              <Text style={[styles.logoutText, { color: colors.foreground }]}>{logoutItem.label}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Overlay - Only show on mobile when sidebar is open */}
      {isOpen && isMobile && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => {
            // Always notify parent to close, parent will handle the state
            onStateChange?.(false);
          }}
          activeOpacity={1}
          pointerEvents="auto"
        />
      )}

      {/* Notification Modal */}
      <NotificationModal open={notificationOpen} onOpenChange={setNotificationOpen} />

      {/* Logout Confirmation Modal */}
      <View style={logoutOpen ? styles.modalOverlay : { display: 'none' }}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Confirm Logout</Text>
            <Text style={[styles.modalDescription, { color: colors.foreground }]}>
              Are you sure you want to log out of your account?
            </Text>
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: colors.border }]} 
              onPress={() => setLogoutOpen(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutConfirmButton}
              onPress={() => {
                setLogoutOpen(false);
                console.log("User logged out");
              }}
            >
              <Text style={styles.logoutConfirmButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const createStyles = (colors: any, insets: any) => StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    width: 256,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingTop: insets.top,
    elevation: 5,
  },
  sidebarScrollView: {
    flex: 1,
  },
  sidebarContent: {
    flexGrow: 1,
    paddingBottom: 32 + insets.bottom, // Account for semi bottom bar height
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }],
  },
  sidebarClosed: {
    transform: [{ translateX: -256 }],
  },
  logoContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    paddingHorizontal: 16,
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 60,
  },
  navigation: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  category: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  menuItems: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 2,
  },
  activeMenuItem: {
    color: colors.yellow,
    paddingLeft: 5, // Adjust padding to account for border
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  upgradeCardContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeCard: {
    width: 180,
    height: 150,
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  upgradeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeSubtitle: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  upgradeButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1002,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 2,
    padding: 24,
    width: '90%',
    maxWidth: 425,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 2,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutConfirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 2,
    backgroundColor: colors.destructive,
  },
  logoutConfirmButtonText: {
    color: colors.destructiveForeground,
    fontSize: 14,
    fontWeight: '500',
  },
});
