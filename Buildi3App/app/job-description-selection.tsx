import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  Typography,
  Button,
  Dropdown,
  TopNavigationBar,
} from "../components/ui";
import { colors, spacing } from "../theme";
import { DropdownOption } from "../components/ui/Dropdown/types";

/**
 * Job Description Selection Screen - Job Type Selection
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=13-144
 *
 * Purpose:
 * - Sixth step of account creation process (final step)
 * - User selects what describes their job from dropdown
 * - Continue button only enabled when job description is selected
 * - Follows exact Figma spacing, typography, and colors
 *
 * Features:
 * - Top navigation with back button
 * - Header with title and descriptive subtitle
 * - Dropdown with bottom sheet selection for job descriptions
 * - Form validation and button state management
 * - Proper safe area handling
 * - Follows design system colors and spacing
 *
 * Layout (exact from Figma):
 * - 16px horizontal padding (consistent across devices)
 * - 48px gap between main sections
 * - 32px gap in content area
 * - Dynamic safe area + 32px base padding
 */

// Job description options as specified in requirements
const jobDescriptionOptions: DropdownOption[] = [
  { id: "business-owner", label: "Construction Business Owner / Manager" },
  { id: "site-supervisor", label: "Site Supervisor / Foreman" },
  { id: "skilled-worker", label: "Skilled Worker / Technician" },
  { id: "project-admin", label: "Project Administrator / Office Staff" },
];

export default function JobDescriptionSelectionScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get user data from previous screens if available
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";
  const firstName = (params.firstName as string) || "";
  const lastName = (params.lastName as string) || "";
  const role = (params.role as string) || "";
  const useCase = (params.useCase as string) || "";

  // Form state management
  const [selectedJobDescription, setSelectedJobDescription] =
    useState<string>("");

  // Form validation - job description must be selected
  const isFormValid = selectedJobDescription.length > 0;

  // Handle job description selection from dropdown
  const handleJobDescriptionSelect = (option: DropdownOption) => {
    setSelectedJobDescription(option.value || option.id);
    console.log("Job description selected:", option.label);
  };

  // Handle continue button press
  const handleContinue = () => {
    if (isFormValid) {
      console.log("Complete account setup");
      console.log("Final user data:", {
        email: userEmail,
        verificationCode,
        firstName,
        lastName,
        role,
        useCase,
        jobDescription: selectedJobDescription,
      });
      // TODO: Save complete user profile data to backend
      // TODO: Complete registration process
      // Navigate to project setup screen
      router.push({
        pathname: "/project-setup",
        params: {
          email: userEmail,
          code: verificationCode,
          firstName,
          lastName,
          role,
          useCase,
          jobDescription: selectedJobDescription,
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

      {/* KeyboardAvoidingView to keep button above keyboard (consistency with other screens) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={spacing.sm} // 16px gap from keyboard
      >
        {/* Main Content Container - Space between for proper distribution */}
        <View style={styles.contentContainer}>
          {/* Top Section - Header + Dropdown together */}
          <View style={styles.topSection}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Typography variant="h3" style={styles.header}>
                What best describe your job?
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                Choose your role so we can set up Buildi to fit your day-to-day
                work.
              </Typography>
            </View>

            {/* Dropdown Section */}
            <View style={styles.dropdownSection}>
              <Dropdown
                label="Job Description"
                options={jobDescriptionOptions}
                value={selectedJobDescription}
                onSelect={handleJobDescriptionSelect}
                placeholder="Select job description"
                bottomSheetTitle="Choose your job description"
                // Add accessibility for screen readers
                // The dropdown component handles accessibility internally
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
    gap: spacing.lg, // 32px gap between header and dropdown (from Figma)
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

  dropdownSection: {
    alignSelf: "stretch",
    // No gap needed as dropdown is single component
  },

  buttonSection: {
    alignSelf: "stretch",
    // Fixed at bottom for consistent placement
  },
});
