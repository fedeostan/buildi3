import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  Typography,
  Button,
  Input,
  TopNavigationBar,
  Icon,
} from "../components/ui";
import { colors, spacing } from "../theme";
import { authService } from "../lib/supabase/auth";

/**
 * Create Password Screen - Password Setup Form
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=41-73
 *
 * Purpose:
 * - Third step of account creation process (between verify-email and complete-profile)
 * - User creates their account password with confirmation
 * - Comprehensive password validation and matching verification
 * - Password visibility toggle for better UX
 * - Follows exact Figma spacing, typography, and colors
 *
 * Features:
 * - Top navigation with back button
 * - Header with title and descriptive subtitle
 * - Two password input fields with visibility toggles
 * - Real-time password validation
 * - Password matching verification
 * - Form validation and button state management
 * - Proper safe area handling
 * - Follows design system colors and spacing
 * - Comprehensive error handling
 *
 * Layout (exact from Figma):
 * - 16px horizontal padding (consistent across devices)
 * - 48px gap between main sections
 * - 32px gap in content area
 * - 16px gap between form elements
 * - Dynamic safe area + 32px base padding
 *
 * Password Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - Passwords must match
 */
export default function CreatePasswordScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get user data from previous screens
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";

  // Form state management
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus state tracking
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Validation state
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Password validation function
  const validatePassword = (pwd: string) => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("One uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("One lowercase letter");
    }
    if (!/\d/.test(pwd)) {
      errors.push("One number");
    }

    return errors;
  };

  // Get password validation errors
  const passwordErrors = validatePassword(password);
  const isPasswordValid = passwordErrors.length === 0;

  // Check if passwords match
  const doPasswordsMatch = password === confirmPassword;
  const isConfirmPasswordValid = confirmPassword.length > 0 && doPasswordsMatch;

  // Overall form validation
  const isFormValid =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    isPasswordValid &&
    doPasswordsMatch;

  // Get error messages for display
  const getPasswordErrorMessage = () => {
    if (!passwordTouched || password.length === 0) return "";
    if (passwordErrors.length > 0) {
      return `Password must have: ${passwordErrors.join(", ")}`;
    }
    return "";
  };

  const getConfirmPasswordErrorMessage = () => {
    // Only show error after user has left the field (touched) AND not currently focused
    if (
      !confirmPasswordTouched ||
      confirmPassword.length === 0 ||
      confirmPasswordFocused
    )
      return "";
    if (!doPasswordsMatch) {
      return "Passwords do not match";
    }
    return "";
  };

  // Handle continue button press
  const handleContinue = async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setPasswordError("");
    setConfirmError("");

    try {
      // Update user password with Supabase
      const { error } = await authService.updatePassword(password);

      if (error) {
        setPasswordError(authService.getErrorMessage(error));
        return;
      }

      // Password updated successfully, proceed to profile completion
      router.push({
        pathname: "/complete-profile",
        params: {
          email: userEmail,
          code: verificationCode,
          passwordSet: "true",
        },
      });
    } catch (error: any) {
      setPasswordError('Failed to set password. Please try again.');
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Password visibility toggle handlers
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Create password visibility icon - only show when focused or filled
  const renderPasswordIcon = (
    isVisible: boolean,
    onToggle: () => void,
    isFocused: boolean,
    hasValue: boolean
  ) => {
    // Only show icon when input is focused or has value (not in default state)
    if (!isFocused && !hasValue) return null;

    return (
      <Pressable
        onPress={onToggle}
        style={styles.eyeIconContainer}
        accessibilityRole="button"
        accessibilityLabel={isVisible ? "Hide password" : "Show password"}
      >
        <Icon
          name={isVisible ? "eye-off" : "eye"}
          customSize={20}
          color={colors.textTertiary}
        />
      </Pressable>
    );
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
                Secure your account
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                Choose a password to protect your account.
              </Typography>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => {
                  setPasswordTouched(true);
                  setPasswordFocused(false);
                }}
                errorMessage={getPasswordErrorMessage()}
                rightIcon={renderPasswordIcon(
                  showPassword,
                  togglePasswordVisibility,
                  passwordFocused,
                  password.length > 0
                )}
                // Add accessibility for screen readers
                accessibilityLabel="Password"
                accessibilityHint="Enter your account password"
              />

              <Input
                label="Repeat password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat password"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => {
                  setConfirmPasswordTouched(true);
                  setConfirmPasswordFocused(false);
                }}
                onSubmitEditing={isFormValid ? handleContinue : undefined}
                errorMessage={getConfirmPasswordErrorMessage()}
                rightIcon={renderPasswordIcon(
                  showConfirmPassword,
                  toggleConfirmPasswordVisibility,
                  confirmPasswordFocused,
                  confirmPassword.length > 0
                )}
                // Add accessibility for screen readers
                accessibilityLabel="Confirm password"
                accessibilityHint="Re-enter your password to confirm"
              />
            </View>
          </View>

          {/* Continue Button - Inside KeyboardAvoidingView */}
          <View style={styles.buttonSection}>
            <Button
              variant="primary"
              title={isLoading ? "Setting Password..." : "Continue"}
              onPress={handleContinue}
              disabled={!isFormValid || isLoading}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Typography variant="bodyMedium" style={styles.loadingText}>
                  Securing your account...
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

  eyeIconContainer: {
    padding: spacing.xs, // 8px padding for better touch target
    justifyContent: "center",
    alignItems: "center",
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
