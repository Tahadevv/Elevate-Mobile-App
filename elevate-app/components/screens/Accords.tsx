import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProgrammingCourse() {
  // State to track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<number[]>([0]); // First one open by default

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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Column - Video Section */}
        <View style={styles.leftColumn}>
          <View style={styles.videoContainer}>
            {/* Placeholder for video - React Native doesn't support iframe */}
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>Video Content</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            <Text style={styles.tag}>#programming</Text>
            <Text style={styles.tag}>#course</Text>
            <Text style={styles.tag}>#logic</Text>
          </View>

          <Text style={styles.videoTitle}>Programming Basic Full Course</Text>

          <Text style={styles.videoDescription}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusant doloremque laudatium totam rem
            aperiam vitae ullamcorper. Ut enim ad minim veniam, quis nostrud exercitation dolore magna aliqua.
          </Text>

          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn More</Text>
            <ArrowRight size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Right Column - Topics List */}
        <View style={styles.rightColumn}>
          <Text style={styles.sectionTitle}>We Also Provide Online Programming Videos</Text>

          <View style={styles.accordionContainer}>
            {/* Accordion Topics */}
            {topics.map((topic, index) => (
              <View key={index} style={styles.accordionItem}>
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
  videoContainer: {
    justifyContent: 'center',
  },
  videoPlaceholder: {
    width: 450,
    height: 300,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    color: '#6b7280',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  videoDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
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
    gap: 24,
  },
  accordionItem: {
    // Accordion item styling
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  accordionContent: {
    marginTop: 8,
    marginBottom: 8,
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
    paddingVertical: 8,
    color: '#6b7280',
  },
});

