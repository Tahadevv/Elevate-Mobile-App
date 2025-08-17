import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HoverCardBorder } from "../pages/HoverCardBorder";

export default function Owner() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textSection}>
          <View style={styles.textContent}>
            <Text style={styles.mainTitle}>
              Encode has been used by more than 2 million people to develop their skills or for their careers, this site
              is entirely for purposes —
            </Text>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Programming Courses</Text>
            </TouchableOpacity>
            
            <Text style={styles.subtitle}>
              So Everyone can focus on what they are learning to be the best.
            </Text>
          </View>
        </View>
        
        <View style={styles.imageSection}>
          <HoverCardBorder>
            <View style={styles.placeholderImage}>
              {/* Placeholder for image */}
            </View>
          </HoverCardBorder>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1280,
    alignSelf: 'center',
    paddingVertical: 12,
    marginVertical: 24,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
    borderRadius: 8,
    overflow: 'hidden',
  },
  textSection: {
    flex: 1,
    padding: 32,
  },
  textContent: {
    maxWidth: 512,
    gap: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 40,
  },
  linkButton: {
    // Button styling
  },
  linkText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#3b82f6',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 40,
    marginTop: 24,
  },
  imageSection: {
    flex: 1,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    width: 300,
    height: 400,
    backgroundColor: '#94a3b8',
    borderRadius: 8,
  },
});

