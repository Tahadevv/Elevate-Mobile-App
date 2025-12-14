import { logout } from "@/store/slices/authSlice";
import { fetchUserProfile } from "@/store/slices/userSlice";
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, HelpCircle, LogOut, Menu, ShieldCheck, User, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useColors } from "../theme-provider";

const menuOptions = [
  { icon: User, text: "My Profile", href: "/dashboard/account" },
  { icon: ShieldCheck, text: "Subscribed Domains", href: "/dashboard/current-subscription" },
  { icon: HelpCircle, text: "Help Center", href: "/dashboard/help" },
];

interface TopbarProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Topbar({ sidebarOpen = false, onToggleSidebar }: TopbarProps) {
  const [open, setOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const profileButtonRef = React.useRef<TouchableOpacity>(null);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const router = useRouter();

  // Get user data from Redux
  const { token, user: authUser } = useSelector((state: any) => state.auth);
  const { userProfile } = useSelector((state: any) => state.user);

  // Use user data from either auth.user or user.userProfile
  const user = authUser || userProfile;
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  // Fetch user profile if not available
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile(token) as any);
    }
  }, [token, user, dispatch]);

  const styles = createStyles(colors, insets);

  const handleLogout = async () => {
    console.log('========================================');
    console.log('🚪 LOGOUT INITIATED');
    console.log('========================================');
    
    try {
      // Dispatch logout action to clear Redux state
      await dispatch(logout() as any);
      
      console.log('✅ Logout successful - Clearing session');
      console.log('Navigating to splash screen...');
      console.log('========================================');
      
      // Close modals
      setLogoutOpen(false);
      setOpen(false);
      
      // Navigate to root index (splash screen)
      router.replace('/');
    } catch (error) {
      console.log('❌ Logout error:', error);
      console.log('========================================');
    }
  };

  const measureProfileButton = () => {
    if (profileButtonRef.current) {
      profileButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          top: pageY + height + 4,
          left: pageX + width - 240, // Align dropdown to right edge of button
          width: 240
        });
      });
    }
  };

  const toggleDropdown = () => {
    if (!open) {
      measureProfileButton();
    }
    setOpen(!open);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Hamburger Menu Button - Top Left */}
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={onToggleSidebar}
        >
          {sidebarOpen ? (
            <X size={24} color={colors.foreground} />
          ) : (
            <Menu size={24} color={colors.foreground} />
          )}
        </TouchableOpacity>

        {/* Profile Button - Top Right */}
        <TouchableOpacity 
          ref={profileButtonRef}
          style={styles.profileButton} 
          onPress={toggleDropdown}
        >
          {open ? (
            <ChevronUp size={24} color={colors.foreground} style={styles.chevron} />
          ) : (
            <ChevronDown size={24} color={colors.foreground} style={styles.chevron} />
          )}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.foreground }]}>{userName}</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown as Modal for proper layering */}
      <Modal
        visible={open}
        transparent={true}
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setOpen(false)}
        >
          <View style={[
            styles.dropdown,
            {
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }
          ]}>
            {menuOptions.map((option, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.menuItem}
                onPress={() => {
                  setOpen(false);
                  router.push(option.href as any);
                }}
              >
                <option.icon size={16} color={colors.foreground} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: colors.foreground }]}>{option.text}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.menuItem} onPress={() => setLogoutOpen(true)}>
              <LogOut size={16} color={colors.foreground} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: colors.foreground }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
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
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (colors: any, insets: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Math.max(insets.top, 8),
    paddingBottom: 12,
    backgroundColor: colors.background,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hamburgerButton: {
    padding: 8,
    zIndex: 10,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  chevron: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 9999,
    borderRadius: 8,
    paddingVertical: 8,
    zIndex: 99999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuIcon: {
    marginRight: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
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
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.destructive,
  },
  logoutButtonText: {
    color: colors.destructiveForeground,
    fontSize: 14,
    fontWeight: '500',
  },
}); 