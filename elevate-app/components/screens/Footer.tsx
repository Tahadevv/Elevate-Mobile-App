import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from "@/components/pages/CustomButton";

// Logo Component
function Logo() {
  return (
    <TouchableOpacity style={styles.logoContainer}>
      <Text style={styles.logoText}>Elevate Exams</Text>
    </TouchableOpacity>
  );
}

// Social Icons Component
interface SocialIconProps {
  href: string;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}

function SocialIcon({ href, iconName, label }: SocialIconProps) {
  return (
    <TouchableOpacity style={styles.socialIcon} accessibilityLabel={label}>
      <Ionicons name={iconName} size={20} color="#ffd404" />
    </TouchableOpacity>
  );
}

function SocialIcons() {
  return (
    <View style={styles.socialIconsContainer}>
      <SocialIcon href="https://facebook.com" iconName="logo-facebook" label="Facebook" />
      <SocialIcon href="https://twitter.com" iconName="logo-twitter" label="Twitter" />
      <SocialIcon href="https://instagram.com" iconName="logo-instagram" label="Instagram" />
      <SocialIcon href="https://youtube.com" iconName="logo-youtube" label="YouTube" />
    </View>
  );
}

// Footer Links Component
interface FooterLinksProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <View style={styles.footerLinksContainer}>
      <Text style={styles.footerLinksTitle}>{title}</Text>
      <View style={styles.linksList}>
        {links.map((link) => (
          <TouchableOpacity key={link.label} style={styles.linkItem}>
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Newsletter Form Component
function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // Handle newsletter subscription logic here
    console.log("Subscribing email:", email);
    // Reset form
    setEmail("");
  };

  return (
    <View style={styles.newsletterForm}>
      <TextInput
        style={styles.emailInput}
        value={email}
        onChangeText={setEmail}
        placeholder="Your Email"
        placeholderTextColor="#6b7280"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomButton variant="primary" onPress={handleSubmit}>
        <Text style={styles.subscribeButtonText}>Subscribe</Text>
      </CustomButton>
    </View>
  );
}

// Data for footer links
const languagesLinks = [
  { label: "HTML", href: "/languages/html" },
  { label: "CSS", href: "/languages/css" },
  { label: "Java Script", href: "/languages/javascript" },
  { label: "Java", href: "/languages/java" },
  { label: "Python", href: "/languages/python" },
  { label: "Ruby", href: "/languages/ruby" },
  { label: "PHP", href: "/languages/php" },
  { label: "Swift", href: "/languages/swift" },
  { label: "Kotlin", href: "/languages/kotlin" },
];

const programsLinks = [
  { label: "Data Engineer", href: "/programs/data-engineer" },
  { label: "Data Analyst", href: "/programs/data-analyst" },
  { label: "Deep Learning", href: "/programs/deep-learning" },
  { label: "Artificial Intelligence", href: "/programs/ai" },
  { label: "Digital Marketing", href: "/programs/digital-marketing" },
  { label: "Robotics Software Engineer", href: "/programs/robotics" },
  { label: "Cloud Computing", href: "/programs/cloud-computing" },
  { label: "Cybersecurity", href: "/programs/cybersecurity" },
];

const supportLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Support", href: "/support" },
  { label: "FAQ", href: "/faq" },
];

// Main Footer Component
export default function Footer() {
  return (
    <ScrollView style={styles.footer}>
      {/* Newsletter Section */}
      <View style={styles.newsletterSection}>
        <View style={styles.newsletterContent}>
          <View style={styles.newsletterText}>
            <Text style={styles.newsletterTitle}>Join Our Newsletter</Text>
            <Text style={styles.newsletterSubtitle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore.
            </Text>
          </View>
          <View style={styles.newsletterFormContainer}>
            <NewsletterForm />
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Main Footer Content */}
      <View style={styles.mainFooterContent}>
        {/* Logo and Description */}
        <View style={styles.logoSection}>
          <Logo />
          <Text style={styles.logoDescription}>
            Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore.
          </Text>
          <SocialIcons />
        </View>

        {/* Links Sections */}
        <FooterLinks title="Languages" links={languagesLinks} />
        <FooterLinks title="Featured Programs" links={programsLinks} />
        <FooterLinks title="Support" links={supportLinks} />
      </View>

      <View style={styles.divider} />

      {/* Footer Bottom */}
      <View style={styles.footerBottom}>
        <Text style={styles.footerBottomText}>Elevate Exams</Text>
        <Text style={styles.footerBottomText}>Copyright © 2022. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0e1525',
    paddingHorizontal: 12,
  },
  newsletterSection: {
    paddingVertical: 48,
  },
  newsletterContent: {
    flexDirection: 'column',
    gap: 32,
    alignItems: 'center',
    marginBottom: 48,
  },
  newsletterText: {
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  newsletterSubtitle: {
    color: '#9ca3af',
    maxWidth: 400,
    textAlign: 'center',
    lineHeight: 20,
  },
  newsletterFormContainer: {
    width: '100%',
    alignItems: 'center',
  },
  newsletterForm: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  emailInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    marginVertical: 48,
  },
  mainFooterContent: {
    flexDirection: 'column',
    gap: 48,
  },
  logoSection: {
    gap: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoDescription: {
    color: '#9ca3af',
    lineHeight: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  socialIcon: {
    padding: 8,
  },
  footerLinksContainer: {
    gap: 16,
  },
  footerLinksTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  linksList: {
    gap: 8,
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  footerBottom: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerBottomText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

