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
 * Role Selection Screen - User Role Dropdown Selection
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=13-144
 *
 * Purpose:
 * - Fourth step of account creation process
 * - User selects their professional role from dropdown
 * - Continue button only enabled when role is selected
 * - Follows exact Figma spacing, typography, and colors
 *
 * Features:
 * - Top navigation with back button
 * - Header with title and descriptive subtitle
 * - Dropdown with bottom sheet selection: Manager, Architect, Technician, Employee
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

// Role options as specified in requirements
const roleOptions: DropdownOption[] = [
  { id: "manager", label: "Manager" },
  { id: "architect", label: "Architect" },
  { id: "technician", label: "Technician" },
  { id: "employee", label: "Employee" },
];

export default function RoleSelectionScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get user data from previous screens if available
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";
  const firstName = (params.firstName as string) || "";
  const lastName = (params.lastName as string) || "";

  // Form state management
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Form validation - role must be selected
  const isFormValid = selectedRole.length > 0;

  // Handle role selection from dropdown
  const handleRoleSelect = (option: DropdownOption) => {
    setSelectedRole(option.value || option.id);
    console.log("Role selected:", option.label);
  };

  // Handle continue button press
  const handleContinue = () => {
    if (isFormValid) {
      console.log("Continue with role selection");
      console.log("Complete user data:", {
        email: userEmail,
        verificationCode,
        firstName,
        lastName,
        role: selectedRole,
      });
      // Navigate to next step - use case selection
      router.push({
        pathname: "/use-case-selection",
        params: {
          email: userEmail,
          code: verificationCode,
          firstName,
          lastName,
          role: selectedRole,
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
                What's your role?
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                Tell us what you do so we can set things up right for you.
              </Typography>
            </View>

            {/* Dropdown Section */}
            <View style={styles.dropdownSection}>
              <Dropdown
                label="Role"
                options={roleOptions}
                value={selectedRole}
                onSelect={handleRoleSelect}
                placeholder="Select a role"
                bottomSheetTitle="Choose your role"
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
