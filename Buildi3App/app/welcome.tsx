import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Typography, Button } from "../components/ui";
import { colors, spacing } from "../theme";

/**
 * Create Account / Log In Screen - First screen users see after app launch
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=1-295
 *
 * Purpose:
 * - Users choose to create account or log in
 * - Entry point after splash screen
 * - Authentication decision screen
 *
 * Features:
 * - Buildi logo and company name
 * - Welcome header (Montserrat SemiBold) and subtitle (Montserrat Medium)
 * - Primary "Sign up" and secondary "Log in" buttons
 * - Proper safe area handling for all devices
 * - Follows design system spacing and colors
 *
 * Layout:
 * - 16px horizontal padding (consistent across devices)
 * - Dynamic top/bottom padding based on safe area + 32px base
 * - 48px gap between main sections (from Figma)
 * - Vertically centered content with space distribution
 */
export default function CreateAccountLogInScreen() {
  const insets = useSafeAreaInsets();

  // Calculate dynamic padding based on safe area + design system
  const dynamicStyles = StyleSheet.create({
    container: {
      // 16px base horizontal padding from design system
      paddingHorizontal: spacing.sm, // 16px
      // Dynamic top/bottom: safe area + 32px base padding from Figma
      paddingTop: Math.max(insets.top, 20) + spacing.lg, // 32px base + safe area
      paddingBottom: Math.max(insets.bottom, 20) + spacing.lg, // 32px base + safe area
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Logo and Company Name Section - Left Aligned */}
      <View style={styles.logoSection}>
        {/* Logo and Buildi text in horizontal layout */}
        <View style={styles.logoRow}>
          <Image
            source={require("../assets/images/buildi-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Typography variant="h2" style={styles.companyName}>
            Buildi
          </Typography>
        </View>
      </View>

      {/* Main Content Container - Space between for proper distribution */}
      <View style={styles.contentContainer}>
        {/* Header and Subtitle Section */}
        <View style={styles.textSection}>
          <Typography variant="h1" style={styles.header}>
            Construction,{"\n"}Made Simple.
          </Typography>

          <Typography variant="h4" style={styles.subtitle}>
            Portugal's number 1 construction manager app
          </Typography>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          <Button
            variant="primary"
            title="Sign up"
            style={styles.primaryButton}
            onPress={() => {
              console.log("Sign up pressed - navigating to signup screen");
              router.push("/signup");
            }}
          />

          <Button
            variant="secondary"
            title="Log in"
            style={styles.secondaryButton}
            onPress={() => {
              console.log("Log in pressed");
              // TODO: Navigate to login screen or directly to main app
            }}
          />
        </View>
      </View>

      {/* Temporary: Skip to main app for testing */}
      <TouchableOpacity
        style={styles.skipLink}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Typography variant="labelSmall" style={styles.skipText}>
          Skip to main app →
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #F2F3F7 from Figma
    // Dynamic padding applied via dynamicStyles
  },

  logoSection: {
    alignSelf: "stretch",
    // Left-aligned as per Figma design (removed alignItems: "center")
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm, // 16px gap between logo and text (close to 13.87px from Figma)
    // Left-aligned container as per Figma
  },

  logo: {
    width: 44,
    height: 44,
  },

  companyName: {
    color: colors.text, // #001848 from Figma
    fontSize: 26, // From Figma typography
    fontWeight: "400",
    lineHeight: 39, // 1.5 line height from Figma
  },

  contentContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: spacing.xxl, // 48px gap between logo and content (matches Figma exactly)
  },

  textSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between header and subtitle (matches Figma exactly)
  },

  header: {
    color: colors.text, // #001848 from Figma
    fontSize: 28, // From Figma
    fontWeight: "600", // Montserrat Semi-Bold from Figma
    lineHeight: 34, // 1.22 line height from Figma
    textAlign: "left",
  },

  subtitle: {
    color: "#646466", // From Figma - secondary text color
    // Using h4 variant: Montserrat Medium, 18px, 500 weight - matches Figma exactly
    textAlign: "left",
  },

  buttonsSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between buttons (from Figma)
  },

  primaryButton: {
    // Button component handles primary styling based on design system
  },

  secondaryButton: {
    // Button component handles secondary styling based on design system
  },

  // Temporary skip link for testing
  skipLink: {
    alignSelf: "center",
    marginTop: spacing.sm,
    padding: spacing.xs,
  },

  skipText: {
    color: colors.textTertiary,
    textAlign: "center",
  },
});
