import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Typography, TopNavigationBar, Icon } from "../components/ui";
import { colors, spacing } from "../theme";

/**
 * Settings Screen - Placeholder implementation
 *
 * Future settings functionality to be implemented:
 * - App preferences
 * - Notification settings
 * - Privacy controls
 * - Theme selection
 * - Account management
 * 
 * Accessed from Profile screen "Settings" menu item
 * Uses TopNavigationBar pattern for consistent navigation
 */
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: Math.max(insets.top, 20),
      paddingBottom: Math.max(insets.bottom, 20) + spacing.sm,
    },
  });

  // Navigation handler
  const handleBack = () => {
    router.back();
  };

  // Placeholder sections that would be implemented
  const plannedSections = [
    {
      title: "Notifications",
      icon: "bell" as const,
      description: "Manage push notifications and email alerts",
    },
    {
      title: "Privacy",
      icon: "lock" as const,
      description: "Control data sharing and privacy settings",
    },
    {
      title: "Appearance",
      icon: "eye" as const,
      description: "Choose theme and display preferences",
    },
    {
      title: "Account",
      icon: "user" as const,
      description: "Manage account settings and preferences",
    },
    {
      title: "Help & Support",
      icon: "help-circle" as const,
      description: "Get help and contact support",
    },
  ];

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TopNavigationBar
          leftAction={{
            icon: "chevron-left",
            label: "Back",
            onPress: handleBack,
          }}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Typography variant="h1" style={styles.title}>
            Settings
          </Typography>
          <Typography variant="bodyMedium" style={styles.subtitle}>
            Settings functionality will be available in a future update
          </Typography>
        </View>

        {/* Placeholder Content */}
        <View style={styles.placeholderCard}>
          <View style={styles.placeholderHeader}>
            <Icon 
              name="settings"
              size="xl"
              color={colors.textTertiary}
              style={styles.placeholderIcon}
            />
            <Typography variant="h3" style={styles.placeholderTitle}>
              Coming Soon
            </Typography>
            <Typography variant="bodyMedium" style={styles.placeholderText}>
              We're working on adding comprehensive settings to help you customize your Buildi3 experience.
            </Typography>
          </View>

          {/* Planned Features */}
          <View style={styles.featuresSection}>
            <Typography variant="h4" style={styles.featuresTitle}>
              Planned Features:
            </Typography>
            
            {plannedSections.map((section, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon 
                  name={section.icon}
                  size="md"
                  color={colors.primary}
                  style={styles.featureIcon}
                />
                <View style={styles.featureContent}>
                  <Typography variant="bodyLarge" style={styles.featureTitle}>
                    {section.title}
                  </Typography>
                  <Typography variant="bodySmall" style={styles.featureDescription}>
                    {section.description}
                  </Typography>
                </View>
              </View>
            ))}
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <Typography variant="bodySmall" style={styles.ctaText}>
              Stay tuned for updates! In the meantime, you can manage your profile from the Personal Details section.
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #F2F3F7
  },

  // Navigation
  navigationContainer: {
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    marginBottom: spacing.md, // 24px space below navigation
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    paddingBottom: spacing.xl, // Extra bottom padding for scroll
  },

  // Header section
  headerSection: {
    marginBottom: spacing.xl, // 40px space between header and content
  },

  title: {
    color: colors.text,
    marginBottom: spacing.xs, // 8px space below title
  },

  subtitle: {
    color: colors.textSecondary,
  },

  // Placeholder card
  placeholderCard: {
    backgroundColor: colors.backgroundSecondary, // White background
    borderRadius: 16,
    padding: spacing.lg, // 32px internal padding
  },

  // Placeholder header
  placeholderHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl, // 40px space below header
  },

  placeholderIcon: {
    marginBottom: spacing.md, // 24px space below icon
  },

  placeholderTitle: {
    color: colors.text,
    marginBottom: spacing.sm, // 16px space below title
    textAlign: 'center',
  },

  placeholderText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Features section
  featuresSection: {
    marginBottom: spacing.xl, // 40px space below features
  },

  featuresTitle: {
    color: colors.text,
    marginBottom: spacing.md, // 24px space below title
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md, // 24px space between items
  },

  featureIcon: {
    marginRight: spacing.sm, // 16px space between icon and content
    marginTop: 2, // Slight vertical alignment adjustment
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    color: colors.text,
    marginBottom: spacing.xs / 2, // 4px space below title
  },

  featureDescription: {
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Call to action section
  ctaSection: {
    paddingTop: spacing.lg, // 32px top padding
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  ctaText: {
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});