import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { HoverCard } from "@/components/pages/hoverCardstill";

export default function Faq() {
  // State to track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<number[]>([0]); // First one open by default
  const [openAccordionsright, setOpenAccordionsright] = useState<number[]>([0]); 
  
  // Topics data with descriptions
  const topics = [
    {
      title: "Programming Basic",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cum sociis natoque penatibus consectetuer adipiscing elit.",
    },
    {
      title: "Get A Helpful Roadmap",
      description:
        "Discover a structured learning path that guides you from beginner to advanced programming concepts. Our roadmap is designed to help you progress efficiently through your learning journey.",
    },
    {
      title: "Build Tool With Logic",
      description:
        "Learn how to create practical tools and applications by applying logical thinking and programming principles. This hands-on approach will strengthen your problem-solving abilities.",
    },
    {
      title: "Computer Science",
      description:
        "Explore fundamental computer science concepts including algorithms, data structures, and computational thinking. Understanding these principles will make you a more effective programmer.",
    },
    {
      title: "Data Structure",
      description:
        "Master essential data structures like arrays, linked lists, trees, and graphs. Learn when and how to implement each structure to optimize your code for different scenarios.",
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
        {/* Left Column - Video Section */}
        <View style={styles.leftColumn}>
          <Text style={styles.sectionTitle}>We Also Provide Online Programming Videos</Text>

          <View style={styles.accordionContainer}>
            {/* Accordion Topics */}
            {topics.map((topic, index) => (
              <View key={index} style={styles.accordionItem}>
                <HoverCard isActive={index === 0 ? true : false}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => toggleAccordion(index)}
                  >
                    <Text style={styles.accordionTitle}>{topic.title}</Text>
                    {openAccordions.includes(index) ? (
                      <ArrowDownRight size={20} color="#2563eb" />
                    ) : (
                      <ArrowUpRight size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </HoverCard>
                <View
                  style={[
                    styles.accordionContent,
                    openAccordions.includes(index) ? styles.accordionOpen : styles.accordionClosed,
                  ]}
                >
                  <Text style={styles.accordionDescription}>{topic.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Right Column - Topics List */}
        <View style={styles.rightColumn}>
          <Text style={styles.sectionTitle}>We Also Provide Online Programming Videos</Text>

          <View style={styles.accordionContainer}>
            {/* Accordion Topics */}
            {topics.map((topic, index) => (
              <View key={index} style={styles.accordionItem}>
                <HoverCard isActive={index === 0 ? true : false}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => toggleAccordionright(index)}
                  >
                    <Text style={styles.accordionTitle}>{topic.title}</Text>
                    {openAccordionsright.includes(index) ? (
                      <ArrowDownRight size={20} color="#2563eb" />
                    ) : (
                      <ArrowUpRight size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </HoverCard>
                <View
                  style={[
                    styles.accordionContent,
                    openAccordionsright.includes(index) ? styles.accordionOpen : styles.accordionClosed,
                  ]}
                >
                  <Text style={styles.accordionDescription}>{topic.description}</Text>
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
  sectionTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 32,
  },
  accordionContainer: {
    gap: 4,
  },
  accordionItem: {
    // Accordion item styling
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  accordionContent: {
    marginTop: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  accordionOpen: {
    maxHeight: 160,
    opacity: 1,
  },
  accordionClosed: {
    maxHeight: 0,
    opacity: 0,
  },
  accordionDescription: {
    fontSize: 12,
    paddingVertical: 12,
    paddingLeft: 20,
    color: '#6b7280',
  },
});

