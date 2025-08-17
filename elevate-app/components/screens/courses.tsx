import { HoverCard } from "@/components/pages/hoverCardstill";
import { ArrowDownRight, ArrowUpRight, BookOpen, Code, Database, ExternalLink, FileText, Laptop } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Courses() {
  // State to track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<number[]>([0]); // First one open by default
  const [openAccordionsright, setOpenAccordionsright] = useState<number[]>([0]);

  // Topics data with descriptions and links
  const topics = [
    {
      title: "Programming Basic",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cum sociis natoque penatibus consectetuer adipiscing elit.",
      icon: <BookOpen size={16} color="#000" />,
      links: [
        { text: "Introduction to Programming", url: "#intro-programming" },
        { text: "Variables and Data Types", url: "#variables" },
        { text: "Control Structures", url: "#control-structures" },
        { text: "Functions and Methods", url: "#functions" },
      ],
    },
    {
      title: "Get A Helpful Roadmap",
      description:
        "Discover a structured learning path that guides you from beginner to advanced programming concepts. Our roadmap is designed to help you progress efficiently through your learning journey.",
      icon: <FileText size={16} color="#000" />,
      links: [
        { text: "Beginner Roadmap", url: "#beginner-roadmap" },
        { text: "Intermediate Path", url: "#intermediate-path" },
        { text: "Advanced Concepts", url: "#advanced-concepts" },
        { text: "Specialization Tracks", url: "#specialization" },
      ],
    },
    {
      title: "Build Tool With Logic",
      description:
        "Learn how to create practical tools and applications by applying logical thinking and programming principles. This hands-on approach will strengthen your problem-solving abilities.",
      icon: <Code size={16} color="#000" />,
      links: [
        { text: "Logic Building Exercises", url: "#logic-exercises" },
        { text: "Tool Development Basics", url: "#tool-basics" },
        { text: "Project-Based Learning", url: "#project-learning" },
        { text: "Problem Solving Techniques", url: "#problem-solving" },
      ],
    },
    {
      title: "Computer Science",
      description:
        "Explore fundamental computer science concepts including algorithms, data structures, and computational thinking. Understanding these principles will make you a more effective programmer.",
      icon: <Laptop size={16} color="#000" />,
      links: [
        { text: "Algorithm Fundamentals", url: "#algorithm-fundamentals" },
        { text: "Computational Thinking", url: "#computational-thinking" },
        { text: "Computer Architecture", url: "#computer-architecture" },
        { text: "Operating Systems", url: "#operating-systems" },
      ],
    },
    {
      title: "Data Structure",
      description:
        "Master essential data structures like arrays, linked lists, trees, and graphs. Learn when and how to implement each structure to optimize your code for different scenarios.",
      icon: <Database size={16} color="#000" />,
      links: [
        { text: "Arrays and Strings", url: "#arrays-strings" },
        { text: "Linked Lists", url: "#linked-lists" },
        { text: "Trees and Graphs", url: "#trees-graphs" },
        { text: "Hash Tables", url: "#hash-tables" },
      ],
    },
  ];

  // Toggle accordion open/close
  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const toggleAccordionright = (index: number) => {
    setOpenAccordionsright((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Column - Topics Section */}
        <View style={styles.leftColumn}>
          <View style={styles.topicsContainer}>
            {/* Accordion Topics */}
            {topics.map((topic, index) => (
              <View key={index} style={styles.topicItem}>
                <HoverCard isActive={index === 0 ? true : false}>
                  <TouchableOpacity
                    style={styles.topicHeader}
                    onPress={() => toggleAccordion(index)}
                  >
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    {openAccordions.includes(index) ? (
                      <ArrowDownRight size={20} color="#2563eb" />
                    ) : (
                      <ArrowUpRight size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </HoverCard>
                <View
                  style={[
                    styles.topicContent,
                    openAccordions.includes(index) ? styles.topicOpen : styles.topicClosed,
                  ]}
                >
                  <Text style={styles.topicDescription}>{topic.description}</Text>

                  {/* Links List */}
                  <View style={styles.linksList}>
                    {topic.links.map((link, linkIndex) => (
                      <TouchableOpacity key={linkIndex} style={styles.linkItem}>
                        <View style={styles.linkContent}>
                          <View style={styles.linkIcon}>
                            {topic.icon}
                          </View>
                          <Text style={styles.linkText}>{link.text}</Text>
                          <ExternalLink size={12} color="#3b82f6" />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Right Column - Topics List */}
        <View style={styles.rightColumn}>
          <View style={styles.topicsContainer}>
            {/* Accordion Topics */}
            {topics.map((topic, index) => (
              <View key={index} style={styles.topicItem}>
                <HoverCard isActive={index === 0 ? true : false}>
                  <TouchableOpacity
                    style={styles.topicHeader}
                    onPress={() => toggleAccordionright(index)}
                  >
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    {openAccordionsright.includes(index) ? (
                      <ArrowDownRight size={20} color="#2563eb" />
                    ) : (
                      <ArrowUpRight size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </HoverCard>
                <View
                  style={[
                    styles.topicContent,
                    openAccordionsright.includes(index) ? styles.topicOpen : styles.topicClosed,
                  ]}
                >
                  <Text style={styles.topicDescription}>{topic.description}</Text>

                  {/* Links List */}
                  <View style={styles.linksList}>
                    {topic.links.map((link, linkIndex) => (
                      <TouchableOpacity key={linkIndex} style={styles.linkItem}>
                        <View style={styles.linkContent}>
                          <View style={styles.linkIcon}>
                            {topic.icon}
                          </View>
                          <Text style={styles.linkText}>{link.text}</Text>
                          <ExternalLink size={12} color="#3b82f6" />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 48,
    paddingBottom: 72,
    paddingHorizontal: 32,
  },
  content: {
    maxWidth: 1152,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
  },
  leftColumn: {
    flex: 1,
    minWidth: 300,
    gap: 16,
  },
  rightColumn: {
    flex: 1,
    minWidth: 300,
    gap: 16,
  },
  topicsContainer: {
    gap: 4,
  },
  topicItem: {
    // Topic item styling
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  topicContent: {
    marginTop: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  topicOpen: {
    maxHeight: 384,
    opacity: 1,
  },
  topicClosed: {
    maxHeight: 0,
    opacity: 0,
  },
  topicDescription: {
    fontSize: 12,
    paddingVertical: 12,
    paddingLeft: 20,
    color: '#6b7280',
  },
  linksList: {
    marginTop: 8,
    paddingLeft: 20,
    gap: 8,
  },
  linkItem: {
    // Link item styling
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    backgroundColor: '#dbeafe',
    borderRadius: 10,
  },
  linkText: {
    fontSize: 12,
    color: '#2563eb',
    flex: 1,
  },
});

