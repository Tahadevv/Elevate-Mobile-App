import { Lock } from "lucide-react-native";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme-provider';

const Access = () => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Lock size={20} color="#185abd" />
        <Text style={[styles.text, { color: colors.foreground }]}>
          Unlock access to all the material and the AI Chatbot
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
});

export default Access;
