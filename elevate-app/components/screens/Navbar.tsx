import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Search, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HoverCardHard as HoverCard } from "../pages/hoverCardHard";

interface NavItem {
  title: string;
  href?: string;
  hasDropdown?: boolean;
  submenu?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/main/about" },
  {
    title: "Courses",
    hasDropdown: true,
    submenu: [
      { title: "Courses", href: "/main/courses" },
      { title: "Course Details", href: "/main/courses/single-course" },
    ],
  },
  {
    title: "Pages",
    hasDropdown: true,
    submenu: [
      { title: "About Us", href: "/main/about" },
      { title: "Contact Us", href: "/main/contact" },
      { title: "FAQ", href: "/main/faq" },
    ],
  },
  {
    title: "Blog",
    hasDropdown: true,
    submenu: [
      { title: "Blog Grid", href: "/main/blogs" },
      { title: "Blog Single", href: "/main/blogs/single-blog" },
    ],
  },
  { title: "Contact", href: "/main/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 500); // 500ms delay (half a second)
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoContainer}>
          <Logo />
        </TouchableOpacity>

        <View style={styles.nav}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {navItems.map((item) => (
              <View
                key={item.title}
                style={styles.navItem}
              >
                {item.hasDropdown ? (
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => handleMouseEnter(item.title)}
                  >
                    <Text style={styles.navText}>{item.title}</Text>
                    <ChevronDown size={16} color="#374151" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.navLink}>
                    <Text style={styles.navText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
                {item.hasDropdown && activeDropdown === item.title && (
                  <View style={styles.dropdown}>
                    {item.submenu?.map((subitem) => (
                      <TouchableOpacity key={subitem.title} style={styles.dropdownItem}>
                        <Text style={styles.dropdownText}>{subitem.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.actions}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Input placeholder="Search..." style={styles.searchInput} />
              <Search size={20} color="#6b7280" />
            </View>
          </View>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <TouchableOpacity style={styles.mobileMenuButton}>
                <HoverCard>
                  <Button variant="outline" size="icon" style={styles.mobileButton}>
                    <Text style={styles.srOnly}>Toggle menu</Text>
                    <View style={styles.hamburgerIcon}>
                      <View style={styles.hamburgerLine} />
                      <View style={styles.hamburgerLine} />
                      <View style={styles.hamburgerLine} />
                    </View>
                  </Button>
                </HoverCard>
              </TouchableOpacity>
            </SheetTrigger>
            <SheetContent side="left" style={styles.sheetContent}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity style={styles.sheetLogo}>
                  <Logo />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsOpen(false)}
                >
                  <HoverCard>
                    <X size={20} color="#374151" />
                    <Text style={styles.srOnly}>Close</Text>
                  </HoverCard>
                </TouchableOpacity>
              </View>
              <View style={styles.sheetNav}>
                <ScrollView>
                  {navItems.map((item) => (
                    <View key={item.title} style={styles.sheetNavItem}>
                      {item.hasDropdown ? (
                        <View>
                          <TouchableOpacity
                            style={styles.sheetDropdownButton}
                            onPress={() => toggleDropdown(item.title)}
                          >
                            <Text style={styles.sheetNavText}>{item.title}</Text>
                            <ChevronDown
                              size={20}
                              style={[
                                styles.dropdownIcon,
                                openDropdowns[item.title] ? styles.rotatedIcon : null,
                              ]}
                            />
                          </TouchableOpacity>
                          {openDropdowns[item.title] && item.submenu && (
                            <View style={styles.sheetDropdown}>
                              {item.submenu.map((subitem) => (
                                <TouchableOpacity
                                  key={subitem.title}
                                  style={styles.sheetDropdownItem}
                                >
                                  <Text style={styles.sheetDropdownText}>{subitem.title}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.sheetNavLink}>
                          <Text style={styles.sheetNavText}>{item.title}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </SheetContent>
          </Sheet>
        </View>
      </View>
    </View>
  );
}

function Logo() {
  return (
    <View style={styles.logo}>
      <Text style={styles.logoText}>LOGO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 48,
    backgroundColor: '#fdfbfb',
  },
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  nav: {
    display: 'none', // Hidden on mobile, shown on large screens
  },
  navItem: {
    position: 'relative',
    marginHorizontal: 16,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    top: '100%',
    zIndex: 10,
    marginTop: 20,
    width: 192,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    display: 'none', // Hidden on mobile, shown on large screens
    marginRight: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9ca3af',
    padding: 8,
    width: 208,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    paddingHorizontal: 8,
  },
  mobileMenuButton: {
    // Shown on mobile, hidden on large screens
  },
  mobileButton: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    height: 40,
    width: 40,
  },
  hamburgerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: '#374151',
    marginVertical: 1,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
  },
  sheetContent: {
    width: 300,
    padding: 0,
  },
  sheetHeader: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
  },
  sheetLogo: {
    alignItems: 'center',
  },
  closeButton: {
    marginLeft: 'auto',
    marginTop: -5,
    marginRight: -10,
  },
  sheetNav: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sheetNavItem: {
    paddingVertical: 4,
  },
  sheetNavText: {
    fontSize: 18,
    color: '#1a2352',
  },
  sheetNavLink: {
    alignItems: 'center',
  },
  sheetDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dropdownIcon: {
    // Icon styling
  },
  rotatedIcon: {
    transform: [{ rotate: '180deg' }],
  },
  sheetDropdown: {
    marginTop: 8,
    marginLeft: 16,
    gap: 8,
  },
  sheetDropdownItem: {
    paddingVertical: 8,
  },
  sheetDropdownText: {
    color: '#1a2352',
    opacity: 0.8,
  },
});

