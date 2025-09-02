import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Typography, Button, Input, Icon, TopNavigationBar } from "../components/ui";
import { colors, spacing } from "../theme";
import { authService } from "../lib/supabase/auth";

/**
 * Log In Screen - User authentication screen
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=68-289
 *
 * Purpose:
 * - User authentication with email and password
 * - Form validation and state management
 * - Navigation back to welcome or forward to main app
 *
 * Features:
 * - Email and password input fields with validation
 * - Show/hide password functionality with eye icon
 * - Dynamic button enable/disable based on input validation
 * - Back navigation with chevron left icon
 * - Proper safe area handling for all devices
 * - Follows design system spacing and colors
 *
 * Layout:
 * - 16px horizontal padding (consistent across devices)
 * - Dynamic top/bottom padding based on safe area + 32px base
 * - Proper spacing between sections matching Figma
 * - Log In button at bottom enabled only when both fields have content
 */
export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Validation logic - enable button only when both fields have content
  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle login submission
  const handleLogin = async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      // Authenticate user with Supabase
      const { user, error: loginError } = await authService.signInWithPassword(
        email.trim(),
        password
      );

      if (loginError) {
        setError(authService.getErrorMessage(loginError));
        return;
      }

      if (user) {
        // Get user profile to check onboarding status
        const { profile } = await authService.getCurrentProfile();
        
        // Check if user has completed onboarding
        if (profile && profile.first_name && profile.last_name && profile.role && profile.is_active) {
          // User is fully onboarded, go to main app
          router.replace("/(tabs)/home");
        } else {
          // User needs to complete onboarding, redirect appropriately
          if (!profile?.first_name || !profile?.last_name) {
            router.replace("/complete-profile");
          } else if (!profile?.role) {
            router.replace("/role-selection");
          } else {
            router.replace("/job-description-selection");
          }
        }
      }
    } catch (error: any) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

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

      {/* Main Content Container */}
      <View style={styles.contentContainer}>
        {/* Top Section - Header + Input together */}
        <View style={styles.topSection}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Typography variant="h1" style={styles.header}>
              Log In
            </Typography>
            <Typography variant="bodyLarge" style={styles.subtitle}>
              Provide your email and password
            </Typography>
          </View>

          {/* Input Fields Section */}
          <View style={styles.inputSection}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!showPassword}
              textContentType="password"
              rightIcon={
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size="md"
                    color="textSecondary"
                  />
                </TouchableOpacity>
              }
            />
          </View>
        </View>

        {/* Login Button */}
        <View style={styles.buttonSection}>
          <Button
            variant="primary"
            title={isLoading ? "Signing In..." : "Log In"}
            disabled={!isFormValid || isLoading}
            onPress={handleLogin}
          />
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Typography variant="bodyMedium" style={styles.loadingText}>
                Authenticating...
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
    gap: spacing.sm, // 16px gap between input fields (from Figma)
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