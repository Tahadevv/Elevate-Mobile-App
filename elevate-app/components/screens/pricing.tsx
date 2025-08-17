import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomButton } from "@/components/pages/CustomButton";
import { Highlight } from "@/components/pages/Highlight";
import { HoverCard } from "../pages/HoverCard";

export default function PricingPlans() {
  const plans = [
    {
      name: "Basic",
      price: "$23",
      features: [
        "Animated Learning Videos",
        "Practice Questions",
        "Infographic Summary",
        "Lifetime Access",
        "Study With A Live Tutor",
      ],
      highlighted: false,
    },
    {
      name: "Expert",
      price: "$42",
      features: [
        "Animated Learning Videos",
        "Practice Questions",
        "Infographic Summary",
        "Lifetime Access",
        "Study With A Live Tutor",
      ],
      highlighted: true,
    },
    {
      name: "Advance",
      price: "$63",
      features: [
        "Animated Learning Videos",
        "Practice Questions",
        "Infographic Summary",
        "Lifetime Access",
        "Study With A Live Tutor",
      ],
      highlighted: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Choose Your <Highlight>Best Plan</Highlight>
      </Text>

      <View style={styles.plansGrid}>
        {plans.map((plan, index) => (
          <HoverCard key={index}>
            <View style={styles.planContainer}>
                             <Card style={plan.highlighted ? styles.highlightedCardStyle : styles.card}>
                <CardHeader style={styles.cardHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{plan.price}</Text>
                    <Text style={styles.priceSuffix}>/Course</Text>
                  </View>
                </CardHeader>
                <CardContent style={styles.cardContent}>
                  <View style={styles.featuresList}>
                    {plan.features.map((feature, i) => (
                      <View key={i} style={styles.featureItem}>
                        <Check size={16} color="#000" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </CardContent>
                <CardFooter style={styles.cardFooter}>
                  <CustomButton style={styles.purchaseButton}>
                    <Text style={styles.purchaseButtonText}>Purchase Now</Text>
                  </CustomButton>
                  <Text style={styles.disclaimer}>* Tax & other services included.</Text>
                </CardFooter>
              </Card>
            </View>
          </HoverCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  title: {
    fontSize: 36,
    marginBottom: 36,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    maxWidth: 1152,
    alignSelf: 'center',
  },
  planContainer: {
    position: 'relative',
  },
  card: {
    height: '100%',
    flexDirection: 'column',
  },
  highlightedCard: {
    zIndex: 10,
  },
  highlightedCardStyle: {
    height: '100%',
    flexDirection: 'column',
    zIndex: 10,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  planName: {
    fontSize: 18,
    fontWeight: '500',
  },
  priceContainer: {
    marginTop: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  priceSuffix: {
    fontSize: 14,
    color: '#2563eb',
  },
  cardContent: {
    paddingTop: 24,
    flexGrow: 1,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flexShrink: 0,
  },
  cardFooter: {
    flexDirection: 'column',
    paddingTop: 0,
  },
  purchaseButton: {
    width: '100%',
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
});

