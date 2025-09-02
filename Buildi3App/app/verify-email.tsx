import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Typography, Button, Input, TopNavigationBar } from "../components/ui";
import { colors, spacing } from "../theme";
import { authService } from "../lib/supabase/auth";

/**
 * Email Verification Screen - 6-Digit Code Input with Supabase Integration
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=11-75
 *
 * Purpose:
 * - Second step of account creation process
 * - User inputs 6-digit verification code sent to their email via Supabase Auth
 * - Supports pasting code from clipboard
 * - Includes resend functionality with cooldown timer
 * - Comprehensive error handling and loading states
 *
 * Features:
 * - Top navigation with back button
 * - Dynamic email display in subtitle
 * - 6-digit code input with proper validation
 * - Supabase OTP verification integration
 * - Resend code functionality with 60-second cooldown
 * - Paste functionality for better UX
 * - Loading states and error handling
 * - Follows design system colors and spacing
 * - Proper safe area handling
 */
export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get email from navigation params (passed from signup screen)
  const userEmail = (params.email as string) || "your email";

  // State management
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRef = useRef<TextInput>(null);

  // Check if code is exactly 6 digits
  const isCodeValid = /^\d{6}$/.test(code);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (resendCountdown > 0) {
        setResendCountdown(0);
        setCanResend(true);
      }
    };
  }, []);

  // Handle code input change with validation
  const handleCodeChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(numericText);
    
    // Clear error when user starts typing
    if (error && numericText.length > 0) {
      setError("");
    }
  };

  // Handle paste functionality
  const handlePaste = async () => {
    try {
      const clipboardText = await Clipboard.getString();
      // Extract 6 digits from clipboard content
      const digits = clipboardText.replace(/[^0-9]/g, "").slice(0, 6);
      if (digits.length > 0) {
        setCode(digits);
        setError(""); // Clear any existing errors
      }
    } catch (error) {
      console.log("Error reading clipboard:", error);
    }
  };

  // Handle resend verification code
  const handleResend = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const { error: resendError } = await authService.resendVerification(userEmail);

      if (resendError) {
        setError(authService.getErrorMessage(resendError));
        return;
      }

      // Start countdown timer
      setCanResend(false);
      setResendCountdown(60);
      
      const countdown = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Clear error to show success state
      setError("");
    } catch (error: any) {
      setError('Failed to resend verification code. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle continue button press
  const handleContinue = async () => {
    if (!isCodeValid || isLoading) return;

    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      // Verify OTP code with Supabase
      const { user, error: verifyError } = await authService.verifyEmailOTP(userEmail, code);

      if (verifyError) {
        setError(authService.getErrorMessage(verifyError));
        return;
      }

      if (user) {
        // Email verified successfully, navigate to password creation
        router.push({
          pathname: "/create-password",
          params: {
            email: userEmail,
            code: code,
          },
        });
      }
    } catch (error: any) {
      setError('Verification failed. Please try again.');
      console.error('Verification error:', error);
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
                Verify it's you
              </Typography>

              <Typography variant="bodyLarge" style={styles.subtitle}>
                We've sent you an email to {userEmail}, please enter the code below to verify your account.
              </Typography>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <Input
                label="Enter 6-digit code"
                value={code}
                onChangeText={handleCodeChange}
                placeholder="000000"
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={6}
                returnKeyType="done"
                onSubmitEditing={isCodeValid ? handleContinue : undefined}
                errorMessage={error}
                // Add accessibility for screen readers
                accessibilityLabel="6 digit verification code"
                accessibilityHint="Enter the 6 digit code sent to your email"
              />
              
              {/* Helper Actions */}
              <View style={styles.helperActions}>
                {/* Paste Button */}
                <TouchableOpacity 
                  onPress={handlePaste} 
                  style={styles.helperButton}
                  disabled={isLoading}
                >
                  <Typography 
                    variant="bodyMedium" 
                    style={[
                      styles.helperButtonText,
                      isLoading && styles.helperButtonTextDisabled
                    ]}
                  >
                    Paste Code
                  </Typography>
                </TouchableOpacity>

                {/* Resend Code Option */}
                <View style={styles.resendContainer}>
                  <Typography variant="bodyMedium" style={styles.resendText}>
                    Didn't receive it?
                  </Typography>
                  <TouchableOpacity 
                    onPress={handleResend} 
                    disabled={!canResend || isLoading}
                    style={styles.resendButton}
                  >
                    <Typography 
                      variant="bodyMedium" 
                      style={[
                        styles.resendButtonText,
                        (!canResend || isLoading) && styles.resendButtonTextDisabled
                      ]}
                    >
                      {canResend ? "Resend Code" : `Resend in ${resendCountdown}s`}
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button - Inside KeyboardAvoidingView */}
          <View style={styles.buttonSection}>
            <Button
              variant="primary"
              title={isLoading ? "Verifying..." : "Continue"}
              onPress={handleContinue}
              disabled={!isCodeValid || isLoading}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Typography variant="bodyMedium" style={styles.loadingText}>
                  {resendCountdown > 0 ? "Sending new code..." : "Verifying your code..."}
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
    gap: spacing.lg, // 32px gap between header and input (from Figma)
  },

  headerSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between header and subtitle (matches Figma exactly)
  },

  header: {
    color: colors.text, // #001848 from Figma
    // Typography h3 variant handles font styles
  },

  subtitle: {
    color: colors.textSecondary, // #646466 from Figma
    // Typography bodyLarge variant handles font styles (16px, Inter 400)
  },

  inputSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between input and helpers
  },

  helperActions: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: spacing.sm, // 16px gap between helper actions
  },

  helperButton: {
    padding: spacing.xs, // 8px padding for touch area
  },

  helperButtonText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },

  helperButtonTextDisabled: {
    color: colors.textTertiary,
  },

  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs, // 8px gap between text and button
  },

  resendText: {
    color: colors.textSecondary,
  },

  resendButton: {
    padding: spacing.xs, // 8px padding for touch area
  },

  resendButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },

  resendButtonTextDisabled: {
    color: colors.textTertiary,
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