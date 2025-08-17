import { CustomButton } from "@/components/pages/CustomButton";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function LeaveReply() {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log({ comment, name, email, website });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leave a Reply</Text>
      <Text style={styles.description}>
        Your email address will not be published. Required fields are marked{" "}
        <Text style={styles.required}>*</Text>
      </Text>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Comment <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textarea}
            value={comment}
            onChangeText={setComment}
            placeholder="Enter your comment..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            required
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            required
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={website}
            onChangeText={setWebsite}
            placeholder="Enter your website (optional)"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <CustomButton onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>Send Message</Text>
        </CustomButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 64,
    maxWidth: screenWidth,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 20,
  },
  required: {
    color: "#ef4444",
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
