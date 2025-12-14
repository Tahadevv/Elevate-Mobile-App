import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../components/theme-provider';

const { width, height } = Dimensions.get('window');

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (route: string) => void;
}

function CourseSidebar({ isOpen, onToggle, onNavigate }: SidebarProps) {
  const [openSections, setOpenSections] = useState({
    Course: true,
    tools: true,
    practice: true,
  });
  const colors = useColors();

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const servicesSections = [
    {
      title: "Course Overview",
      key: "Course",
      items: [
        { label: "Course Home", route: "/course/course-details", icon: "home", color: "#3b82f6" },
      ],
    },
    {
      title: "Study Tools",
      key: "tools",
      color: "#10b981",
      items: [
        { label: "Flashcards", route: "/pages/flashcards", icon: "bookmark", color: "#8b5cf6" },
        { label: "Notes", route: "/course/notes", badge: 8, icon: "create", color: "#f97316" },
      ],
    },
    {
      title: "Practice",
      key: "practice",
      items: [
        {
          label: "Practice Quizzes",
          route: "",
          icon: "help-circle",
          color: "#10b981",
          subItems: [
            { label: "Take Quiz", route: "/pages/exam" },
            { label: "Quiz Analytics", route: "/course/result/stats" },
          ],
        },
        {
          label: "Mock Exams",
          route: "",
          icon: "target",
          color: "#ef4444",
          subItems: [
            { label: "Full Test", route: "jbh" },
            { label: "Test Analytics", route: "/course/vegdx-Mock-Assessment" },
          ],
        },
      ],
    },
  ];

  const renderIcon = (iconName: string, color: string) => {
    const iconMap: { [key: string]: string } = {
      home: "home",
      bookmark: "bookmark",
      create: "create",
      "help-circle": "help-circle",
      target: "target",
    };
    
    return <Ionicons name={iconMap[iconName] as any} size={20} color={color} />;
  };

  const Item = ({ name, badge, route, icon, color }: any) => (
    <TouchableOpacity
      style={styles.sidebarItem}
      onPress={() => route && onNavigate(route)}
    >
      <View style={styles.itemContent}>
        {icon && renderIcon(icon, color)}
        <Text style={[styles.itemText, { color: colors.foreground }]}>{name}</Text>
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ItemWithSubItems = ({ name, badge, route, subItems, icon, color }: any) => (
    <View style={styles.itemWithSubItems}>
      <View style={styles.itemContent}>
        {icon && renderIcon(icon, color)}
        <Text style={[styles.itemText, { color: colors.foreground }]}>{name}</Text>
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      
      {subItems && subItems.length > 0 && (
        <View style={styles.subItems}>
          {subItems.map((subItem: any, subIndex: number) => (
            <TouchableOpacity
              key={subIndex}
              style={styles.subItem}
              onPress={() => subItem.route && onNavigate(subItem.route)}
            >
              <Text style={[styles.subItemText, { color: colors.muted }]}>
                {subItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const Group = ({ title, openKey, children }: any) => (
    <View style={styles.group}>
      <TouchableOpacity
        style={styles.groupHeader}
        onPress={() => toggleSection(openKey)}
      >
        <Ionicons
          name={openSections[openKey] ? "chevron-down" : "chevron-right"}
          size={16}
          color={colors.foreground}
        />
        <Text style={[styles.groupTitle, { color: colors.foreground }]}>{title}</Text>
      </TouchableOpacity>
      {openSections[openKey] && <View style={styles.groupContent}>{children}</View>}
    </View>
  );

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.background, borderRightColor: colors.border }]}>
      <View style={styles.sidebarHeader}>
        <Text style={[styles.sidebarTitle, { color: colors.foreground }]}>Course Navigation</Text>
      </View>
      
      <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
        {servicesSections.map((section, sectionIndex) => (
          <Group key={sectionIndex} title={section.title} openKey={section.key}>
            {section.items.map((item, itemIndex) =>
              item.subItems ? (
                <ItemWithSubItems
                  key={itemIndex}
                  name={item.label}
                  badge={item.badge}
                  route={item.route}
                  subItems={item.subItems}
                  icon={item.icon}
                  color={item.color}
                />
              ) : (
                <Item
                  key={itemIndex}
                  name={item.label}
                  badge={item.badge}
                  route={item.route}
                  icon={item.icon}
                  color={item.color}
                />
              )
            )}
          </Group>
        ))}
      </ScrollView>
    </View>
  );
}

export default function CourseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const colors = useColors();
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);
      if (isMobileDevice) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    Dimensions.addEventListener('change', checkScreenSize);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route);
    }
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Mobile Toggle Button */}
      <TouchableOpacity
        style={[styles.mobileToggle, { backgroundColor: colors.card }]}
        onPress={toggleSidebar}
      >
        <Ionicons
          name={sidebarOpen ? "close" : "menu"}
          size={24}
          color={colors.foreground}
        />
      </TouchableOpacity>

      {/* Sidebar */}
      <View
        style={[
          styles.sidebarContainer,
          isMobile && !sidebarOpen && styles.sidebarHidden,
        ]}
      >
        <CourseSidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onNavigate={handleNavigate}
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground,
          }}
        />
      </View>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setSidebarOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileToggle: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    padding: 8,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  sidebarHidden: {
    transform: [{ translateX: -280 }],
  },
  sidebar: {
    width: 280,
    height: '100%',
    borderRightWidth: 1,
    paddingTop: 100,
  },
  sidebarHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sidebarContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  group: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  groupContent: {
    marginTop: 8,
    marginLeft: 16,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
    marginBottom: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  badge: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemWithSubItems: {
    marginBottom: 8,
  },
  subItems: {
    marginTop: 8,
    marginLeft: 24,
  },
  subItem: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  subItemText: {
    fontSize: 13,
    fontWeight: '400',
  },
  mainContent: {
    flex: 1,
    marginLeft: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 50,
  },
});
