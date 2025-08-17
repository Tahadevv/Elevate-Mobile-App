import { CustomButton } from "@/components/pages/CustomButton";
import { Highlight } from "@/components/pages/Highlight";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Hero = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.description}>
            Lorem ipsum dolor sit ametis consectetur adipiscing elit sedao eiusmod tempor.
          </Text>

          <CustomButton onPress={() => {}}>
            <Text style={styles.buttonText}>Get Started</Text>
          </CustomButton>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Learn <Highlight>Coding Online</Highlight> With Professional Instructors
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Hero;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'white',
  },
  content: {
    height: '100%',
    paddingTop: 12,
    maxWidth: 1152,
    alignSelf: 'center',
    flexDirection: 'column-reverse',
    gap: 32,
    alignItems: 'center',
  },
  textSection: {
    marginTop: 20,
    gap: 24,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  titleSection: {
    width: '100%',
    marginHorizontal: 0,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 36,
    color: '#374151',
  },
});