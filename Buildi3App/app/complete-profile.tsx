import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Typography, Button, Input, TopNavigationBar } from "../components/ui";
import { colors, spacing } from "../theme";

/**
 * Complete Profile Screen - Name Input Form
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=12-96
 *
 * Purpose:
 * - Third step of account creation process
 * - User inputs their first and last name
 * - Continue button only enabled when both fields have content
 * - Follows exact Figma spacing, typography, and colors
 *
 * Features:
 * - Top navigation with back button
 * - Header with title and descriptive subtitle
 * - Two input fields: Name and Last Name
 * - Form validation and button state management
 * - Proper safe area handling
 * - Follows design system colors and spacing
 *
 * Layout (exact from Figma):
 * - 16px horizontal padding (consistent across devices)
 * - 48px gap between main sections
 * - 32px gap in content area
 * - 16px gap between form elements
 * - Dynamic safe area + 32px base padding
 */
export default function CompleteProfileScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get user data from previous screens if available
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";
  const passwordSet = (params.passwordSet as string) === "true";

  // Form state management
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Form validation - both fields must have content
  const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  // Handle continue button press
  const handleContinue = () => {
    if (isFormValid) {
      console.log("Continue with profile completion");
      console.log("User data:", {
        email: userEmail,
        verificationCode,
        passwordSet,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      // TODO: Save user profile data to backend
      // Navigate to role selection screen with user data
      router.push({
        pathname: "/role-selection",
        params: {
          email: userEmail,
          code: verificationCode,
          passwordSet: passwordSet.toString(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Calculate dynamic padding based on Figma design
  const dynamicStyles = StyleSheet.create({
    container: {
      // 16px horizontal padding from Figma
      paddingHorizontal: spacing.sm, // 16px
      // 32px base padding from Figma (TopNavigationBar handles safe area)
      paddingTop: spacing.lg, // 32px from Figma
      paddingBottom: Math.max(insets.bottom, 20) + spacing.lg, // Keep bottom safe area + 32px
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Top Navigation Bar Container */}
      <View style={styles.navigationContainer}>
        <TopNavigationBar
          leftAction={{
            icon: "chevron-left",
            label: "Back",
            onPress: handleBack,
          }}
        />
      </View>

      {/* KeyboardAvoidingView to keep button above keyboard */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={spacing.sm} // 16px gap from keyboard
      >
        {/* Main Content Container - Space between for proper distribution */}
        <View style={styles.contentContainer}>
          {/* Top Section - Header + Form together */}
          <View style={styles.topSection}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Typography variant="h3" style={styles.header}>
                Complete your profile
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                Use your real name so your team knows it's you.
              </Typography>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Input
                label="Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Name"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                // Add accessibility for screen readers
                accessibilityLabel="First name"
                accessibilityHint="Enter your first name"
              />

              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={isFormValid ? handleContinue : undefined}
                // Add accessibility for screen readers
                accessibilityLabel="Last name"
                accessibilityHint="Enter your last name"
              />
            </View>
          </View>

          {/* Continue Button - Inside KeyboardAvoidingView */}
          <View style={styles.buttonSection}>
            <Button
              variant="primary"
              title="Continue"
              onPress={handleContinue}
              disabled={!isFormValid}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #F2F3F7 from Figma
    // Dynamic padding applied via dynamicStyles
  },

  navigationContainer: {
    alignSelf: "stretch",
    // Navigation bar has its own height handling
  },

  keyboardAvoidingView: {
    flex: 1,
    alignSelf: "stretch",
  },

  contentContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: spacing.xxl, // 48px gap after navigation (from Figma main container gap)
  },

  topSection: {
    alignSelf: "stretch",
    gap: spacing.lg, // 32px gap between header and form (from Figma)
  },

  headerSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between title and subtitle (matches Figma exactly)
  },

  header: {
    color: colors.text, // #001848 from Figma
    // Typography h3 variant handles font styles (20px, Montserrat 600)
  },

  subtitle: {
    color: colors.textSecondary, // #646466 from Figma
    // Typography bodyLarge variant handles font styles (16px, Inter 400)
  },

  formSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between form inputs (from Figma)
  },

  buttonSection: {
    alignSelf: "stretch",
    // Fixed at bottom for consistent placement
  },
});
