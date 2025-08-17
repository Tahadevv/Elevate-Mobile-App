import {
    Bell,
    BookOpen,
    HelpCircle,
    LogOut,
    Megaphone,
    Menu,
    Settings,
    X
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NotificationModal } from "../shared/notification-modal";
import { useTheme } from "../theme-provider";
import { ThemeToggle } from "../theme-toggle";

interface SidebarProps {
  style?: any;
  onStateChange?: (isOpen: boolean) => void;
  currentPage?: string; // Add current page prop
  onNavigate?: (tabName: string) => void; // Add navigation callback
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

export default function Sidebar({ style, onStateChange, currentPage = 'courses', onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { colors, isDark } = useTheme();

  const styles = createStyles(colors);

  // Use the prop instead of hardcoded value
  // const currentPage = 'courses'; // This should come from your navigation state

  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < 768);
      if (width < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener for dimension changes
    const subscription = Dimensions.addEventListener('change', checkScreenSize);

    // Cleanup
    return () => subscription?.remove();
  }, []);

  // Notify parent component when sidebar state changes
  useEffect(() => {
    onStateChange?.(isOpen);
  }, [isOpen, onStateChange]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (label: string) => {
    if (label === "Notifications") {
      setNotificationOpen(true);
    } else if (label === "Logout") {
      setLogoutOpen(true);
    } else if (onNavigate) {
      // Map menu labels to tab names
      let tabName = '';
      switch (label) {
        case "My Courses":
          tabName = 'courses';
          break;
        case "Announcements":
          tabName = 'announcements';
          break;
        case "Help Center":
          tabName = 'help';
          break;
        case "Settings":
          tabName = 'settings';
          break;
        default:
          return;
      }
      onNavigate(tabName);
      setIsOpen(false); // Close sidebar after navigation
    }
  };

  const menuCategories: MenuCategory[] = [
    {
      title: "LEARNING",
      items: [
        { icon: BookOpen, label: "My Courses", link: "/dashboard", iconColor: colors.primary }
      ]
    },
    {
      title: "COMMUNICATION",
      items: [
        { icon: Megaphone, label: "Announcements", link: "/dashboard/announcements", iconColor: colors.destructive },
        { icon: Bell, label: "Notifications", iconColor: colors.accent }
      ]
    },
    {
      title: "SUPPORT",
      items: [
        { icon: HelpCircle, label: "Help Center", link: "/dashboard/help", iconColor: colors.accent }
      ]
    },
    {
      title: "ACCOUNT",
      items: [
        { icon: Settings, label: "Settings", link: "/dashboard/account", iconColor: colors.accent },
        { component: ThemeToggle, label: "Theme" }
      ]
    }
  ];

  const logoutItem = { icon: LogOut, label: "Logout" };

  return (
    <>
      {/* Mobile Toggle Button */}
      <TouchableOpacity
        style={[styles.mobileToggle, isMobile ? {} : { display: 'none' }]}
        onPress={toggleSidebar}
      >
        {isOpen ? (
          <X size={24} color={colors.foreground} />
        ) : (
          <Menu size={24} color={colors.foreground} />
        )}
      </TouchableOpacity>

      {/* Sidebar */}
      <View
        style={[
          styles.sidebar,
          isOpen ? styles.sidebarOpen : styles.sidebarClosed,
          style,
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={isDark ? require('../../assets/images/logo-white.png') : require('../../public/logo.svg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Navigation */}
        <ScrollView style={styles.navigation} showsVerticalScrollIndicator={false}>
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
        </ScrollView>

        {/* Upgrade Card */}
        <View style={styles.upgradeCardContainer}>
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeTitle}>Access to all Domains</Text>
            <Text style={styles.upgradeSubtitle}>
              Elevate Exam is Ready{'\n'}to help You Grow.
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
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
      </View>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleSidebar}
          activeOpacity={1}
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

const createStyles = (colors: any) => StyleSheet.create({
  mobileToggle: {
    position: 'absolute',
    top: 17,
    left: 16,
    zIndex: 50,
    backgroundColor: 'transparent',
    padding: 8,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 40,
    width: 256,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderRightColor: colors.border,
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
    width: 200,
    height: 150,
  },
  navigation: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
    borderRadius: 6,
  },
  activeMenuItem: {
    backgroundColor: colors.yellow + '1A', // 10% opacity yellow background
    borderLeftWidth: 3,
    borderLeftColor: colors.yellow,
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
    backgroundColor: colors.secondary,
    width: 180,
    height: 150,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.yellow,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeSubtitle: {
    color: colors.foreground,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: colors.background,
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
    borderRadius: 6,
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
    zIndex: 30,
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
    zIndex: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 8,
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
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutConfirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.destructive,
  },
  logoutConfirmButtonText: {
    color: colors.destructiveForeground,
    fontSize: 14,
    fontWeight: '500',
  },
});
