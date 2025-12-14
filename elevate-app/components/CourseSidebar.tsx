import { usePathname } from 'expo-router';
import {
  Bell,
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  HelpCircle,
  Home,
  LogOut,
  Megaphone,
  PenTool,
  Settings,
  Target,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../assets/images/logo.svg';
import { useTheme } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

interface CourseSidebarProps {
  onNavigate: (route: string, params?: { courseId?: string }) => void;
  courseId?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

interface IconItem {
  icon?: any;
  label: string;
  link?: string;
  color?: string;
  hasSeparator?: boolean;
  component?: React.ComponentType;
}

interface SubItem {
  label: string;
  link: string;
}

interface ServiceItem {
  name: string;
  link?: string;
  badge?: number;
  subItems?: SubItem[];
  icon: any;
  color: string;
}

interface ServiceSection {
  title: string;
  key: string;
  items: ServiceItem[];
}

export default function CourseSidebar({ onNavigate, courseId, isOpen: externalIsOpen, onToggle }: CourseSidebarProps) {
  const { colors, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? true);
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState({
    Course: true,
    tools: true,
    practice: true,
    results: true,
  });
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  useEffect(() => {
    const checkScreenSize = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < 768);
      if (width < 768) {
        const newState = false;
        setIsOpen(newState);
        onToggle?.(newState);
      } else {
        const newState = true;
        setIsOpen(newState);
        onToggle?.(newState);
      }
    };

    checkScreenSize();
    const subscription = Dimensions.addEventListener('change', checkScreenSize);
    return () => subscription?.remove();
  }, [onToggle]);

  // Sync with external state
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const iconItems: IconItem[] = [
    { icon: BookOpen, label: "Home", link: "/dashboard", color: "#eab308" },
    { icon: Megaphone, label: "Announcements", link: "/dashboard/announcements", color: "#ef4444", hasSeparator: true },
    { icon: Bell, label: "Notifications", color: "#22c55e" },
    { icon: HelpCircle, label: "Help Center", link: "/dashboard/help", color: "#a855f7", hasSeparator: true },
    { icon: Settings, label: "Settings", link: "/dashboard/account", color: "#6b7280", hasSeparator: true },
    { component: ThemeToggle, label: "Theme" },
  ];

  const servicesSections: ServiceSection[] = [
    {
      title: "Course Overview",
      key: "Course",
      items: [
        { name: "Course Home", link: "/course/course-details", icon: Home, color: "#3b82f6" },
      ]
    },
    {
      title: "Study Tools",
      key: "tools",
      items: [
        { name: "Notes", link: "/course/notes", badge: 8, icon: PenTool, color: "#f97316" },
        { name: "Flashcards", link: "/course/pages/flashcards", icon: BookMarked, color: "#8b5cf6" },
        
      ],
    },
    {
      title: "Practice",
      key: "practice",
      items: [
        {
          name: "Practice Quizzes",
          icon: FileQuestion,
          color: "#10b981",
          subItems: [
            { label: "Take Quiz", link: "/course/pages/exam" },
            { label: "Quiz Analytics", link: "/course/result/stats" },
          ]
        },
        {
          name: "Full Exams",
          icon: Target,
          color: "#ef4444",
          subItems: [
            { label: "Full Test", link: "/course/pages/test" },
            { label: "Test Analytics", link: "/course/pages/test-analytics" },
           
          ]
        }
      ]
    }
  ];

  const renderIcon = (IconComponent: any, color: string, size: number = 20) => (
    <IconComponent size={size} color={color} />
  );

  const Item = ({ name, badge, link, icon, color }: ServiceItem) => {
    const isActive = pathname === link;
    return (
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => link && onNavigate(link, courseId ? { courseId } : undefined)}
        >
          {icon && renderIcon(icon, isActive ? colors.yellow : color, 16)}
          <Text style={[styles.itemText, { 
            color: isActive ? colors.yellow : colors.foreground 
          }]}>
            {name}
          </Text>
        </TouchableOpacity>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    );
  };

  const ItemWithSubItems = ({ name, badge, link, subItems, icon, color }: ServiceItem) => {
    const isActive = subItems?.some(item => pathname === item.link) || pathname === link;
    return (
      <View style={styles.itemWithSubItems}>
        <View style={styles.itemContent}>
          {icon && renderIcon(icon, isActive ? colors.yellow : color, 16)}
          <Text style={[styles.itemText, { 
            color: isActive ? colors.yellow : colors.foreground 
          }]}>
            {name}
          </Text>
        </View>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {subItems && (
          <View style={styles.subItems}>
            {subItems.map((subItem, index) => {
              const isSubItemActive = pathname === subItem.link;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.subItem}
                  onPress={() => onNavigate(subItem.link, courseId ? { courseId } : undefined)}
                >
                  <Text style={[styles.subItemText, { 
                    color: isSubItemActive ? colors.yellow : colors.muted 
                  }]}>
                    {subItem.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const Group = ({ title, openKey, children }: { title: string; openKey: keyof typeof openSections; children: React.ReactNode }) => (
    <View style={styles.group}>
      <TouchableOpacity
        style={styles.groupHeader}
        onPress={() => toggleSection(openKey)}
      >
        {openSections[openKey] ? 
          <ChevronDown size={14} color={colors.foreground} /> : 
          <ChevronRight size={14} color={colors.foreground} />
        }
        <Text style={[styles.groupTitle, { color: colors.foreground }]}>
          {title}
        </Text>
      </TouchableOpacity>
      {openSections[openKey] && (
        <View style={styles.groupContent}>
          {children}
        </View>
      )}
    </View>
  );

  return (
    <>
      {/* Sidebar */}
      <View
        style={[
          styles.sidebar,
          isOpen ? styles.sidebarOpen : styles.sidebarClosed,
        ]}
      >
        {/* Left Icon Strip (60px) */}
        <View style={[styles.iconStrip, { 
          backgroundColor: colors.card, 
          borderRightColor: colors.border 
        }]}>
          {/* Logo Space */}
          <View style={styles.logoSpace} />
          
          {/* Icon Navigation */}
          <View style={styles.iconNav}>
            {iconItems.map((item, index) => (
              <View key={index} style={styles.iconItem}>
                {item.hasSeparator && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
                {item.component ? (
                  <View style={styles.iconButton}>
                    <item.component />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => item.link && onNavigate(item.link, courseId ? { courseId } : undefined)}
                  >
                    {renderIcon(item.icon, item.color || colors.foreground, 20)}
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Logout Icon at Bottom */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.iconButton}>
              <LogOut size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Content Strip (240px) */}
        <View style={[styles.contentStrip, { 
          backgroundColor: colors.card, 
          borderRightColor: colors.border 
        }]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            {isDark ? (
              <Image
                source={require('../assets/images/logo-white.png')}
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

          {/* Services Navigation */}
          <ScrollView style={styles.servicesNav} showsVerticalScrollIndicator={false}>
            {servicesSections.map((section, sectionIndex) => (
              <Group key={sectionIndex} title={section.title} openKey={section.key as keyof typeof openSections}>
                {section.items.map((item, itemIndex) =>
                  item.subItems ? 
                    <ItemWithSubItems
                      key={itemIndex}
                      name={item.name}
                      badge={item.badge}
                      link={item.link}
                      subItems={item.subItems}
                      icon={item.icon}
                      color={item.color}
                    /> : 
                    <Item
                      key={itemIndex}
                      name={item.name}
                      badge={item.badge}
                      link={item.link}
                      icon={item.icon}
                      color={item.color}
                    />
                )}
              </Group>
            ))}
          </ScrollView>
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
    </>
  );
}

const createStyles = (insets: any) => StyleSheet.create({
  mobileToggle: {
    position: 'absolute',
    top: insets.top + 16,
    left: 16,
    zIndex: 1001,
    backgroundColor: 'transparent',
    padding: 8,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    width: 300,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingTop: insets.top,
  },
  sidebarScrollView: {
    flex: 1,
  },
  sidebarContent: {
    flexGrow: 1,
    paddingBottom: insets.bottom,
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }],
  },
  sidebarClosed: {
    transform: [{ translateX: -300 }],
  },
  iconStrip: {
    width: 60,
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  logoSpace: {
    height: 80,
  },
  iconNav: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconItem: {
    alignItems: 'center',
    marginBottom: 8,
  },
  separator: {
    width: 32,
    height: 1,
    marginVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  logoutSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  contentStrip: {
    width: 240,
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  logoContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 100,
    height: 100,
  },
  servicesNav: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  group: {
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  groupContent: {
    marginTop: 4,
    marginLeft: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemWithSubItems: {
    marginBottom: 8,
  },
  subItems: {
    marginTop: 8,
    marginLeft: 12,
  },
  subItem: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  subItemText: {
    fontSize: 13,
    fontWeight: '400',
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
});
