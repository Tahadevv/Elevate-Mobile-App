import { CustomButton } from "@/components/pages/CustomButton";
import { Highlight } from "@/components/pages/Highlight";
import { HoverCard } from "@/components/pages/HoverCard";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Qouatation() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.grid}>
        {/* Left Column - Quote Section */}
        <View style={styles.quoteSection}>
          <Text style={styles.quoteMark}>&quot;</Text>
          <View style={styles.quoteContent}>
            <Text style={styles.quoteText}>
              Programmers are mostly &quot; learn by doing &quot; types. No amount of academic study or watching other people code
              can compare to breaking open an editor and start making mistakes.
            </Text>
          </View>
          <View style={styles.quoteAuthor}>
            <Text style={styles.authorName}>Dennis Ritchie</Text>
            <Text style={styles.authorTitle}>Encode Learner</Text>
          </View>
        </View>

        {/* Right Column - Testimonials */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>
            <Highlight>Best Feedback</Highlight> From Our Clients
          </Text>

          <View style={styles.testimonialsGrid}>
            {/* Testimonial Card 1 */}
            <HoverCard style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inci dunt ut labore et
                dolore magna eiusmod.
              </Text>

              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={20} color="#ffd404" />
                ))}
              </View>

              <View style={styles.testimonialAuthor}>
                <View>
                  <Text style={styles.testimonialAuthorName}>John Doe</Text>
                  <Text style={styles.testimonialAuthorTitle}>Client</Text>
                </View>
              </View>
            </HoverCard>

            {/* Testimonial Card 2 */}
            <HoverCard style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inci dunt ut labore et
                dolore magna eiusmod.
              </Text>

              <View style={styles.starsContainer}>
                {[1, 2, 3, 4].map((star) => (
                  <Ionicons key={star} name="star" size={20} color="#ffd404" />
                ))}
                <Ionicons name="star-outline" size={20} color="#ffd404" />
              </View>

              <View style={styles.testimonialAuthor}>
                <View>
                  <Text style={styles.testimonialAuthorName}>Andrira Hens</Text>
                  <Text style={styles.testimonialAuthorTitle}>Client</Text>
                </View>
              </View>
            </HoverCard>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton>try It!</CustomButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 64,
    paddingHorizontal: 16,
  },
  grid: {
    gap: 32,
  },
  quoteSection: {
    backgroundColor: '#111827',
    padding: 48,
    borderRadius: 8,
    position: 'relative',
  },
  quoteMark: {
    fontSize: 56,
    fontFamily: 'serif',
    position: 'absolute',
    top: 32,
    left: 32,
    color: 'white',
  },
  quoteContent: {
    marginTop: 32,
    marginBottom: 64,
    zIndex: 10,
  },
  quoteText: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 36,
    color: 'white',
  },
  quoteAuthor: {
    marginTop: 32,
  },
  authorName: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
  },
  authorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  testimonialsSection: {
    gap: 32,
  },
  sectionTitle: {
    fontSize: 48,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 40,
  },
  testimonialsGrid: {
    gap: 24,
  },
  testimonialCard: {
    padding: 24,
  },
  testimonialText: {
    color: '#4b5563',
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 4,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testimonialAuthorName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#111827',
  },
  testimonialAuthorTitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  buttonContainer: {
    marginTop: 32,
  },
});

