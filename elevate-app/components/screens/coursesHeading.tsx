import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Highlight } from '@/components/pages/Highlight';

const CoursesHeading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>
          We Provide the Best Courses of<Highlight> Multiple Domains</Highlight>
        </Text>
      </View>
    </View>
  );
};

export default CoursesHeading;

const styles = StyleSheet.create({
  container: {
    // Container styling
  },
  content: {
    maxWidth: 1280,
    paddingHorizontal: 32,
  },
  heading: {
    alignSelf: 'center',
    fontWeight: '600',
    lineHeight: 32,
    fontSize: 30,
    color: '#374151',
    marginBottom: 8,
    maxWidth: 768,
  },
});