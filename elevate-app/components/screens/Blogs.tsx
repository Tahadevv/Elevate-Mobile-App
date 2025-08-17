import { Highlight } from "@/components/pages/Highlight";
import { HoverCard } from "@/components/pages/HoverCard";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Article {
  id: number;
  title: string;
  description: string;
}

export default function LatestArticles() {
  const articles: Article[] = [
    {
      id: 1,
      title: "How To Quickly Become Proficient In Programming",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
    {
      id: 2,
      title: "Stop Redesigning & Start Your Tuning Your Site Instead",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
    {
      id: 3,
      title: "Difference Between Front End & Back End Developer",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Latest <Highlight>Articles</Highlight>
        </Text>
      </View>

      <View style={styles.articlesGrid}>
        {articles.map((article) => (
          <HoverCard key={article.id}>
            <View style={styles.articleCard}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDescription}>{article.description}</Text>
              
              <TouchableOpacity style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>Read More</Text>
                <Ionicons name="arrow-forward" size={16} color="#334155" />
              </TouchableOpacity>
            </View>
          </HoverCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 64,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  articlesGrid: {
    gap: 32,
  },
  articleCard: {
    padding: 16,
    flex: 1,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#334155',
  },
  articleDescription: {
    color: '#4b5563',
    marginBottom: 16,
    flex: 1,
    lineHeight: 20,
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
});

