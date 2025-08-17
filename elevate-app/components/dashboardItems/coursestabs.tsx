import {
    ArrowRight,
    Award,
    BarChart,
    Bot,
    Brackets,
    Brain,
    Briefcase,
    Cloud,
    CloudCog,
    Code,
    Coffee,
    Cpu,
    Gamepad,
    Laptop,
    LineChart,
    Palette,
    ScrollText,
    ShieldCheck,
    Smartphone,
    SquareIcon as SquareC,
    SquareIcon as SquareG,
    SquareIcon as SquareJs,
} from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "../theme-provider";

// Map icon names to Lucide React Native components
const iconMap: { [key: string]: any } = {
  ScrollText,
  Briefcase,
  Award,
  Cpu,
  Laptop,
  ShieldCheck,
  Code,
  Coffee,
  SquareJs,
  SquareC,
  SquareG,
  Brackets,
  Palette,
  Smartphone,
  Gamepad,
  CloudCog,
  BarChart,
  LineChart,
  Brain,
  Bot,
  Cloud,
};

const allSubjects = [
  { name: "Code foundations", icon: "Award" },
  { name: "Professional skills", icon: "Briefcase" },
  { name: "Python", icon: "Code" },
  { name: "HTML & CSS", icon: "Brackets" },
  { name: "Data science", icon: "BarChart" },
  { name: "Java", icon: "Coffee" },
  { name: "Web development", icon: "Code" },
  { name: "Data analytics", icon: "LineChart" },
  { name: "Interview prep", icon: "Award" },
  { name: "JavaScript", icon: "SquareJs" },
  { name: "Web design", icon: "Palette" },
  { name: "Machine learning", icon: "Brain" },
  { name: "Computer science", icon: "Cpu" },
  { name: "C++", icon: "SquareC" },
  { name: "Mobile development", icon: "Smartphone" },
  { name: "AI", icon: "Bot" },
  { name: "IT", icon: "Laptop" },
  { name: "C#", icon: "SquareC" },
  { name: "Game development", icon: "Gamepad" },
  { name: "Cloud computing", icon: "Cloud" },
  { name: "Cybersecurity", icon: "ShieldCheck" },
  { name: "Go", icon: "SquareG" },
  { name: "DevOps", icon: "CloudCog" },
  { name: "Certification prep", icon: "Award" },
  { name: "Networking", icon: "Cloud" },
  { name: "Databases", icon: "BarChart" },
  { name: "Algorithms", icon: "Brain" },
  { name: "Operating Systems", icon: "Cpu" },
  { name: "Software Engineering", icon: "Brain" },
  { name: "Project Management", icon: "Briefcase" },
];

const courseLibrarySubjects = [
  { name: "AWS Certification", icon: "Cloud" },
  { name: "Microsoft Azure", icon: "CloudCog" },
  { name: "Google Cloud", icon: "Cloud" },
  { name: "Cisco Networking", icon: "Cpu" },
  { name: "CompTIA A+", icon: "Laptop" },
];

export default function CourseTabs() {
  const [activeTab, setActiveTab] = useState("currently-studying");
  const [displayedSubjects, setDisplayedSubjects] = useState(allSubjects.slice(0, 8));
  const [displayedLibrarySubjects, setDisplayedLibrarySubjects] = useState(courseLibrarySubjects.slice(0, 4));
  const colors = useColors();

  const styles = createStyles(colors);

  const handleLoadMore = () => {
    const currentCount = displayedSubjects.length;
    const newCount = Math.min(currentCount + 8, allSubjects.length);
    setDisplayedSubjects(allSubjects.slice(0, newCount));
  };

  const handleLoadMoreLibrary = () => {
    const currentCount = displayedLibrarySubjects.length;
    const newCount = Math.min(currentCount + 4, courseLibrarySubjects.length);
    setDisplayedLibrarySubjects(courseLibrarySubjects.slice(0, newCount));
  };

  const renderSubjectCard = (subject: any, index: number) => {
    const IconComponent = iconMap[subject.icon];
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.subjectCard,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}
      >
        {IconComponent && <IconComponent size={24} color={colors.foreground} />}
        <Text style={[styles.subjectName, { color: colors.foreground }]}>{subject.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Our path to exam success starts here
        </Text>
        
        <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.tabTrigger, 
              activeTab === "currently-studying" && styles.activeTabTrigger
            ]} 
            onPress={() => setActiveTab("currently-studying")}
          >
            <Text style={[
              styles.tabText,
              { color: colors.foreground },
              activeTab === "currently-studying" && styles.activeTabText
            ]}>
              Currently studying
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabTrigger, 
              activeTab === "course-library" && styles.activeTabTrigger
            ]} 
            onPress={() => setActiveTab("course-library")}
          >
            <Text style={[
              styles.tabText,
              { color: colors.foreground },
              activeTab === "course-library" && styles.activeTabText
            ]}>
              Course library
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "currently-studying" && (
          <View style={styles.tabContent}>
            <View style={styles.subjectsGrid}>
              {displayedSubjects.map((subject, index) => renderSubjectCard(subject, index))}
            </View>
            {displayedSubjects.length < allSubjects.length && (
              <View style={styles.loadMoreContainer}>
                <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                  <Text style={[styles.loadMoreText, { color: colors.yellow }]}>load more</Text>
                  <ArrowRight size={16} color={colors.yellow} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === "course-library" && (
          <View style={styles.tabContent}>
            <View style={styles.subjectsGrid}>
              {displayedLibrarySubjects.map((subject, index) => renderSubjectCard(subject, index))}
            </View>
            {displayedLibrarySubjects.length < courseLibrarySubjects.length && (
              <View style={styles.loadMoreContainer}>
                <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMoreLibrary}>
                  <Text style={[styles.loadMoreText, { color: colors.yellow }]}>load more</Text>
                  <ArrowRight size={16} color={colors.yellow} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    minHeight: 600,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  content: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 32,
    justifyContent: 'flex-start',
  },
  tabTrigger: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 32,
  },
  activeTabTrigger: {
    borderBottomWidth: 3,
    borderBottomColor: colors.yellow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  tabContent: {
    // Tab content styling
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 8,
    width: '48%',
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  loadMoreContainer: {
    marginTop: 36,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    textTransform: 'lowercase',
  },
});
