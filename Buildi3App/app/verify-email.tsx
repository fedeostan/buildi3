import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Typography, Button, Input, TopNavigationBar } from "../components/ui";
import { colors, spacing } from "../theme";

/**
 * Email Verification Screen - 6-Digit Code Input
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=11-75
 *
 * Purpose:
 * - Second step of account creation process
 * - User inputs 6-digit verification code sent to their email
 * - Supports pasting code from clipboard
 * - Continue button only enabled when exactly 6 digits are entered
 * - Follows exact Figma spacing and typography
 *
 * Features:
 * - Top navigation with back button
 * - Dynamic email display in subtitle
 * - 6-digit code input with proper validation
 * - Paste functionality for better UX
 * - Button state management
 * - Follows design system colors and spacing
 * - Proper safe area handling
 *
 * Layout (exact from Figma):
 * - 16px horizontal padding (consistent across devices)
 * - 48px gap between main sections
 * - 32px gap in content area
 * - 23px gap between header elements
 * - Dynamic safe area + 32px base padding
 */
export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get email from navigation params (passed from signup screen)
  const userEmail = (params.email as string) || "your email";

  // State management
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Check if code is exactly 6 digits
  const isCodeValid = /^\d{6}$/.test(code);

  // Handle code input change with validation
  const handleCodeChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(numericText);
  };

  // Handle paste functionality
  const handlePaste = async () => {
    try {
      const clipboardText = await Clipboard.getString();
      // Extract 6 digits from clipboard content
      const digits = clipboardText.replace(/[^0-9]/g, "").slice(0, 6);
      if (digits.length > 0) {
        setCode(digits);
      }
    } catch (error) {
      console.log("Error reading clipboard:", error);
    }
  };

  // Handle continue button press
  const handleContinue = () => {
    if (isCodeValid) {
      console.log("Continue with verification code:", code);
      console.log("For email:", userEmail);
      // TODO: Verify code with backend
      // Navigate to create password screen with user data
      router.push({
        pathname: "/create-password",
        params: {
          email: userEmail,
          code: code,
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
          {/* Top Section - Header + Input together */}
          <View style={styles.topSection}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Typography variant="h3" style={styles.header}>
                Verify is you
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                We've sent you an email to {userEmail}, please introduce it
                below to verify your account.
              </Typography>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <Input
                label="Introduce 6 digit code"
                value={code}
                onChangeText={handleCodeChange}
                placeholder="Introduce 6 digit code"
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={6}
                returnKeyType="done"
                onSubmitEditing={isCodeValid ? handleContinue : undefined}
                // Add accessibility for screen readers
                accessibilityLabel="6 digit verification code"
                accessibilityHint="Enter the 6 digit code sent to your email"
              />
            </View>
          </View>

          {/* Continue Button - Inside KeyboardAvoidingView */}
          <View style={styles.buttonSection}>
            <Button
              variant="primary"
              title="Continue"
              onPress={handleContinue}
              disabled={!isCodeValid}
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
    gap: spacing.lg, // 32px gap between header and input (from Figma)
  },

  headerSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between header and subtitle (matches Figma exactly)
  },

  header: {
    color: colors.text, // #001848 from Figma
    // Typography h1 variant handles font styles (28px, Montserrat 600)
  },

  subtitle: {
    color: colors.textSecondary, // #646466 from Figma
    // Typography bodyLarge variant handles font styles (16px, Inter 400)
  },

  inputSection: {
    alignSelf: "stretch",
    gap: spacing.xs, // 8px gap between input and helper text
  },

  helperText: {
    color: colors.textTertiary, // Subtle helper text
    textAlign: "center",
  },

  buttonSection: {
    alignSelf: "stretch",
    // Fixed at bottom for consistent placement
  },
});
