import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
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
import { authService } from "../lib/supabase/auth";

/**
 * Use Case Selection Screen - Project Type Selection
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=13-144
 *
 * Purpose:
 * - Fifth step of account creation process (after role selection)
 * - User selects what they want to use Buildi for from dropdown
 * - Continue button only enabled when use case is selected
 * - Follows exact Figma spacing, typography, and colors
 *
 * Features:
 * - Top navigation with back button
 * - Header with title and descriptive subtitle
 * - Dropdown with bottom sheet selection for project types
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

// Use case options as specified in requirements
const useCaseOptions: DropdownOption[] = [
  { id: "construction-general", label: "Construction projects in general" },
  { id: "renovations", label: "Renovations projects only" },
  { id: "demolition-rebuild", label: "Demolition and rebuild projects" },
  { id: "small-jobs", label: "Small Jobs" },
  { id: "budget-quotations", label: "Budget and Quotations" },
];

export default function UseCaseSelectionScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get user data from previous screens if available
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";
  const firstName = (params.firstName as string) || "";
  const lastName = (params.lastName as string) || "";
  const role = (params.role as string) || "";

  // Form state management
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form validation - use case must be selected
  const isFormValid = selectedUseCase.length > 0;

  // Handle use case selection from dropdown
  const handleUseCaseSelect = (option: DropdownOption) => {
    setSelectedUseCase(option.value || option.id);
    console.log("Use case selected:", option.label);
  };

  // Handle continue button press
  const handleContinue = async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      // Update user profile with selected use case in Supabase
      const { profile, error: useCaseError } = await authService.updateProfile({
        use_case: selectedUseCase,
      });

      if (useCaseError) {
        setError(authService.getErrorMessage(useCaseError));
        return;
      }

      // Use case saved successfully, navigate to job description selection
      router.push({
        pathname: "/job-description-selection",
        params: {
          email: userEmail,
          code: verificationCode,
          firstName,
          lastName,
          role,
          useCase: selectedUseCase,
        },
      });
    } catch (error: any) {
      setError('Failed to save use case selection. Please try again.');
      console.error('Use case assignment error:', error);
    } finally {
      setIsLoading(false);
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
                What do you want to use Buildi for?
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                Pick the type of work you usually do. We'll tailor the app to
                match.
              </Typography>
            </View>

            {/* Dropdown Section */}
            <View style={styles.dropdownSection}>
              <Dropdown
                label="Project Type"
                options={useCaseOptions}
                value={selectedUseCase}
                onSelect={handleUseCaseSelect}
                placeholder="Select project type"
                bottomSheetTitle="Choose your project type"
                // Add accessibility for screen readers
                // The dropdown component handles accessibility internally
              />
            </View>
          </View>

          {/* Continue Button - Inside KeyboardAvoidingView */}
          <View style={styles.buttonSection}>
            <Button
              variant="primary"
              title={isLoading ? "Saving Selection..." : "Continue"}
              onPress={handleContinue}
              disabled={!isFormValid || isLoading}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Typography variant="bodyMedium" style={styles.loadingText}>
                  Saving your preferences...
                </Typography>
              </View>
            )}
            {error && (
              <Typography variant="bodyMedium" style={styles.errorText}>
                {error}
              </Typography>
            )}
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

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm, // 16px gap above loading indicator
    gap: spacing.xs, // 8px gap between spinner and text
  },

  loadingText: {
    color: colors.textSecondary,
    textAlign: "center",
  },

  errorText: {
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.sm, // 16px gap above error message
  },
});
