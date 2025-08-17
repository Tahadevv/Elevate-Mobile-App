import { CustomButton } from "@/components/pages/CustomButton";
import { Highlight } from "@/components/pages/Highlight";
import { HoverCard } from "@/components/pages/HoverCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Contact() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Leave A Message</Text>
          <Text style={styles.formDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eius tempor incididunt ut labore etdolore.
          </Text>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <Input placeholder="Your Name" style={styles.nameInput} />
              <Input placeholder="Your Email" style={styles.emailInput} />
            </View>

            <Input placeholder="Subject" style={styles.subjectInput} />

            <Textarea placeholder="Message" style={styles.messageInput} />

            <CustomButton style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send Message</Text>
            </CustomButton>
          </View>
        </View>

        {/* Right Section - Contact Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            Get In <Highlight>Touch</Highlight>
          </Text>
          <Text style={styles.infoDescription}>
            Lorem ipsum dolor sit amet consectetuer adipiscing elit. Aenean amet commodo ligula eget dolor sit amet
            consectetuer ipsum.
          </Text>

          <View style={styles.contactItems}>
            <View style={styles.contactItem}>
              <HoverCard>
                <View style={styles.iconContainer}>
                  <MapPin size={16} color="#374151" />
                </View>
              </HoverCard>
              
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>Tukad Yeh Aya No.19, Bali</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <HoverCard>
                <View style={styles.iconContainer}>
                  <Phone size={16} color="#374151" />
                </View>
              </HoverCard>
             
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>(+61) 8896-2220</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <HoverCard>
                <View style={styles.iconContainer}>
                  <Mail size={16} color="#374151" />
                </View>
              </HoverCard>
              
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>encode@support.com</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <HoverCard>
                <View style={styles.iconContainer}>
                  <Clock size={16} color="#374151" />
                </View>
              </HoverCard>
              
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Opening Hours</Text>
                <Text style={styles.contactValue}>Everyday 09 AM - 07 PM</Text>
              </View>
            </View>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.socialLabel}>Social Media :</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon}>
                <Facebook size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconOutline}>
                <Twitter size={20} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconOutline}>
                <Instagram size={20} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconOutline}>
                <Youtube size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 48,
    marginTop: 32,
  },
  content: {
    maxWidth: 1152,
    alignSelf: 'center',
    flexDirection: 'column-reverse',
    gap: 32,
  },
  formSection: {
    flex: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 12,
  },
  formDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  nameRow: {
    flexDirection: 'column',
    gap: 16,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 14,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 14,
  },
  subjectInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 14,
  },
  messageInput: {
    width: '100%',
    minHeight: 160,
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 14,
  },
  sendButton: {
    width: '100%',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
  },
  contactItems: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  contactValue: {
    fontSize: 14,
    color: '#64748b',
  },
  socialSection: {
    marginTop: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialLabel: {
    color: '#1e293b',
    fontWeight: '500',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  socialIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: '#1e293b',
    borderRadius: 4,
  },
  socialIconOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
  },
});

