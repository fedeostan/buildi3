import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Typography, Button, Input, TopNavigationBar } from "../components/ui";
import { colors, spacing } from "../theme";
import { authService } from "../lib/supabase/auth";

/**
 * Sign Up Screen - Email Input Step
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=1-526
 *
 * Purpose:
 * - First step of account creation process
 * - User inputs their email address
 * - Validates email format with good UX practices
 * - Enables continue button only when valid email is entered
 *
 * Features:
 * - Top navigation with back button
 * - Email input with proper validation
 * - No error shown while typing (good UX)
 * - Error only shown when field loses focus with invalid email
 * - Continue button disabled until valid email is entered
 * - Follows design system spacing and colors
 * - Proper safe area handling
 *
 * Layout:
 * - 16px horizontal padding (consistent across devices)
 * - Dynamic top/bottom padding based on safe area + 32px base
 * - 32px gap between sections (from Figma)
 * - Space between layout for proper distribution
 */
export default function SignUpScreen() {
  const insets = useSafeAreaInsets();

  // State management
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hasEmailBeenTouched, setHasEmailBeenTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex (simple but effective)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email is valid
  const isEmailValid = emailRegex.test(email.trim());

  // Show error only if field was touched and email is invalid
  const shouldShowError =
    hasEmailBeenTouched && email.length > 0 && !isEmailValid;

  // Handle email input change
  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear error if user is typing and email becomes valid
    if (emailError && emailRegex.test(text.trim())) {
      setEmailError("");
    }
  };

  // Handle email field blur (when user leaves the field)
  const handleEmailBlur = () => {
    setHasEmailBeenTouched(true);

    // Only show error if email is not empty and invalid
    if (email.length > 0 && !isEmailValid) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Handle continue button press
  const handleContinue = async () => {
    console.log('handleContinue called with email:', email);
    console.log('isEmailValid:', isEmailValid, 'isLoading:', isLoading);
    
    if (!isEmailValid || isLoading) return;

    setIsLoading(true);
    setEmailError(""); // Clear any previous errors

    try {
      console.log('Calling authService.signUpWithEmail...');
      // Sign up user with Supabase and send verification email
      const { user, error, needsVerification } = await authService.signUpWithEmail(email.trim());
      
      console.log('Signup result:', { user: !!user, error: !!error, needsVerification });
      if (error) console.log('Signup error details:', error);

      if (error) {
        setEmailError(authService.getErrorMessage(error));
        return;
      }

      if (needsVerification) {
        console.log('Navigating to verify-email...');
        // Navigate to email verification screen
        router.push({
          pathname: "/verify-email",
          params: { email: email.trim() },
        });
      }
    } catch (error: any) {
      console.error('Signup error (catch):', error);
      setEmailError('Something went wrong. Please try again.');
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Calculate dynamic padding based on Figma design (32px 16px)
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
        keyboardVerticalOffset={spacing.sm} // 16px gap from keyboard on both platforms
      >
        {/* Main Content Container - Space between for proper distribution */}
        <View style={styles.contentContainer}>
          {/* Top Section - Header + Input together */}
          <View style={styles.topSection}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Typography variant="h1" style={styles.header}>
                Create Account
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                Please provide your best email.
              </Typography>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <Input
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                errorMessage={shouldShowError ? emailError : undefined}
              />
            </View>
          </View>

          {/* Continue Button - Now inside KeyboardAvoidingView */}
          <View style={styles.buttonSection}>
            <Button
              variant="primary"
              title={isLoading ? "Sending..." : "Continue"}
              onPress={() => {
                console.log('Button pressed! Email:', email, 'Valid:', isEmailValid);
                handleContinue();
              }}
              disabled={!isEmailValid || isLoading}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Typography variant="bodyMedium" style={styles.loadingText}>
                  Creating your account...
                </Typography>
              </View>
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
    marginTop: spacing.lg, // 32px gap after navigation (from Figma container gap)
  },

  topSection: {
    alignSelf: "stretch",
    gap: spacing.lg, // 32px gap between header and input (from Figma)
  },

  headerSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between header and subtitle (matches Figma exactly)
  },

  header: {
    color: colors.text, // Using design system variable
    // Typography variant handles font styles
  },

  subtitle: {
    color: colors.textSecondary, // Using design system variable instead of hardcoded
    // Typography variant handles font styles
  },

  inputSection: {
    alignSelf: "stretch",
    // Input component handles its own spacing
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
});