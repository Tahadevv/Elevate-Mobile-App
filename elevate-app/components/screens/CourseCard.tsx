import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Highlight } from "@/components/pages/Highlight";
import { CustomButton } from "@/components/pages/CustomButton";
import { HoverCardHard } from "../pages/hoverCardHard";

interface CourseCardProps {
  title: string;
  price: number;
  image: string;
  rating: number;
  mentor: string;
  tag: string;
  tagColor: string;
}

function CourseCard({ title, price, image, rating, mentor, tag, tagColor }: CourseCardProps) {
  return (
    <View style={styles.courseCard}>
      <Text style={styles.courseTitle}>{title}</Text>

      <View style={styles.courseContent}>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < rating ? "star" : "star-outline"}
              size={16}
              color={i < rating ? "#ffd404" : "#d1d5db"}
            />
          ))}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        </View>

        <View style={styles.mentorContainer}>
          <Text style={styles.mentorLabel}>Domain : </Text>
          <Text style={styles.mentorText}>{mentor}</Text>
        </View>
        
        <TouchableOpacity style={styles.readMoreContainer}>
          <Text style={styles.readMoreText}>Read More</Text>
          <Ionicons name="arrow-forward" size={16} color="#334155" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatItem({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statContent}>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statText}>{text}</Text>
      </View>
    </View>
  );
}

export default function CourseShowcase() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mainTitle}>
          We Provide <Highlight>The Best Course</Highlight> & Online Tutorial For You
        </Text>
        
        <View style={styles.coursesContainer}>
          <HoverCardHard width={300} height={340} style={styles.hoverCard}>
            <CourseCard
              title="How to Create MVC Using the Java Language"
              price={79.0}
              image="/placeholder.svg?height=250&width=400"
              rating={4.5}
              mentor="IT & Cybersecurity"
              tag="Java"
              tagColor="bg-yellow-500"
            />
          </HoverCardHard>
          
          <HoverCardHard width={300} height={340} style={styles.hoverCard}>
            <CourseCard
              title="How to Create MVC Using the Java Language"
              price={79.0}
              image="/placeholder.svg?height=250&width=400"
              rating={4.5}
              mentor="IT & Cybersecurity"
              tag="Java"
              tagColor="bg-yellow-500"
            />
          </HoverCardHard>

          <View style={styles.statsContainer}>
            <StatItem number="25x" text="Cheaper Than Other Platforms" />
            <StatItem number="380+" text="Mentors Join Encode" />
            <StatItem number="100%" text="Lifetime Guarantee" />

            <View style={styles.knowledgeSection}>
              <Text style={styles.knowledgeTitle}>Get In-Depth Knowledge.</Text>
              <Text style={styles.knowledgeSubtitle}>Lorem ipsum dolor sit amet</Text>
              <CustomButton size="md" onPress={() => {}}>
                <Text style={styles.tryButtonText}>Try it now!</Text>
              </CustomButton>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  content: {
    maxWidth: 1200,
    alignSelf: 'center',
  },
  mainTitle: {
    fontWeight: '600',
    letterSpacing: -0.5,
    fontSize: 48,
    color: '#334155',
    marginBottom: 48,
    maxWidth: 768,
  },
  coursesContainer: {
    paddingVertical: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    gap: 32,
  },
  hoverCard: {
    padding: 16,
  },
  courseCard: {
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    height: '100%',
  },
  courseTitle: {
    padding: 8,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  courseContent: {
    padding: 8,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mentorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mentorLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 4,
  },
  mentorText: {
    fontSize: 14,
    color: '#4b5563',
  },
  readMoreContainer: {
    marginTop: 'auto',
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  statsContainer: {
    gap: 32,
    marginLeft: 8,
  },
  statItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingVertical: 12,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
  },
  statText: {
    color: '#6b7280',
    marginLeft: 8,
    fontSize: 16,
  },
  knowledgeSection: {
    marginTop: 20,
  },
  knowledgeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  knowledgeSubtitle: {
    color: '#334155',
    fontSize: 14,
    marginBottom: 16,
  },
  tryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

