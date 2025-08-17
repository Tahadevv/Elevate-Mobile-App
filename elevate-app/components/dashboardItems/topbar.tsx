import { ChevronDown, ChevronUp, HelpCircle, LogOut, Settings, User } from "lucide-react-native";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "../theme-provider";

const menuOptions = [
  { icon: User, text: "My Profile", href: "/dashboard/account" },
  { icon: Settings, text: "Billing and subscription", href: "/dashboard/settings" },
  { icon: HelpCircle, text: "Help Center", href: "/dashboard/help" },
];

export default function Topbar() {
  const [open, setOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const profileButtonRef = React.useRef<TouchableOpacity>(null);
  const colors = useColors();

  const styles = createStyles(colors);

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
            <Text style={styles.avatarText}>J</Text>
          </View>
          <Text style={[styles.userName, { color: colors.foreground }]}>John Drew</Text>
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
              <TouchableOpacity key={idx} style={styles.menuItem}>
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
                onPress={() => {
                  setLogoutOpen(false);
                  // Add your logout logic here
                }}
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

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.background,
    position: 'relative',
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