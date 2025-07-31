import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  Typography,
  Button,
  TopNavigationBar,
  Icon,
  MediaUploadBottomSheet,
} from "../components/ui";
import { SelectedMedia } from "../components/ui/MediaUploadBottomSheet/types";
import { colors, spacing } from "../theme";

/**
 * Project Setup Screen - First Project Setup
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=43-2506
 *
 * Purpose:
 * - Seventh step after job description selection
 * - User sets up their first project
 * - Two options: Upload quote or Create manually
 * - Follows exact Figma spacing, typography, and colors
 *
 * Features:
 * - Top navigation with back button
 * - Header with title and descriptive subtitle
 * - Two action buttons: Primary (Upload quote) and Text (Create manually)
 * - Upload icon integration with primary button
 * - Proper safe area handling
 * - Follows design system colors and spacing
 *
 * Layout (exact from Figma):
 * - 16px horizontal padding (consistent across devices)
 * - 48px gap between main sections
 * - 32px gap between header and subtitle
 * - 16px gap between buttons
 * - Dynamic safe area + 32px base padding
 */

export default function ProjectSetupScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Bottom sheet state
  const [showMediaUploadSheet, setShowMediaUploadSheet] = useState(false);

  // Get user data from previous screens if available
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";
  const firstName = (params.firstName as string) || "";
  const lastName = (params.lastName as string) || "";
  const role = (params.role as string) || "";
  const useCase = (params.useCase as string) || "";
  const jobDescription = (params.jobDescription as string) || "";

  // Handle upload quote button press
  const handleUploadQuote = () => {
    console.log("Upload quote selected");
    console.log("User data:", {
      email: userEmail,
      verificationCode,
      firstName,
      lastName,
      role,
      useCase,
      jobDescription,
      setupMethod: "upload",
    });
    // Show the media upload bottom sheet
    setShowMediaUploadSheet(true);
  };

  // Handle media selection from bottom sheet - navigate to preview screen
  const handleMediaSelect = (media: SelectedMedia) => {
    console.log("Media selected:", media);

    // Navigate to preview screen with selected media and user data
    const previewParams = {
      mediaUri: media.data.uri,
      mediaType: media.type,
      mediaId: media.data.id,
      mediaFilename:
        media.type === "photo"
          ? (media.data as any).filename
          : (media.data as any).name || "untitled",
      // Pass through user data for project creation
      email: userEmail,
      code: verificationCode,
      firstName,
      lastName,
      role,
      useCase,
      jobDescription,
    };

    router.push({
      pathname: "/preview-quote",
      params: previewParams,
    });
  };

  // Handle bottom sheet dismiss
  const handleBottomSheetDismiss = () => {
    setShowMediaUploadSheet(false);
  };

  // Handle create manually button press
  const handleCreateManually = () => {
    console.log("Create manually selected");
    console.log("User data:", {
      email: userEmail,
      verificationCode,
      firstName,
      lastName,
      role,
      useCase,
      jobDescription,
      setupMethod: "manual",
    });
    // TODO: Navigate to manual project creation screen
    // TODO: Implement manual project setup flow
    // For now, navigate to home as placeholder
    router.push("/home");
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

      {/* KeyboardAvoidingView for consistency with other screens */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={spacing.sm} // 16px gap from keyboard
      >
        {/* Main Content Container - Space between for proper distribution */}
        <View style={styles.contentContainer}>
          {/* Top Section - Header */}
          <View style={styles.headerSection}>
            <Typography variant="h3" style={styles.header}>
              Set up your project
            </Typography>

            <Typography variant="bodyLarge" style={styles.subtitle}>
              Start by uploading a photo of your quote, Buildi AI will read it,
              create the tasks for you, and help track progress.
            </Typography>
          </View>

          {/* Bottom Section - Buttons */}
          <View style={styles.buttonSection}>
            {/* Primary Button - Upload quote with icon */}
            <Button
              variant="primary"
              title="Upload quote"
              onPress={handleUploadQuote}
              style={styles.primaryButton}
            >
              <View style={styles.buttonContent}>
                <Icon
                  name="upload"
                  size="sm"
                  color={colors.buttonPrimaryText}
                  style={styles.buttonIcon}
                />
                <Typography
                  variant="labelMedium"
                  style={styles.primaryButtonText}
                >
                  Upload quote
                </Typography>
              </View>
            </Button>

            {/* Text Button - Create manually */}
            <Button
              variant="text"
              title="Create manually"
              onPress={handleCreateManually}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Media Upload Bottom Sheet */}
      <MediaUploadBottomSheet
        isVisible={showMediaUploadSheet}
        onMediaSelect={handleMediaSelect}
        onDismiss={handleBottomSheetDismiss}
        initialTab="photos"
        accessibilityLabel="Upload Quote Media Picker"
      />
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

  headerSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between title and subtitle (matches Figma exactly)
  },

  header: {
    color: colors.text, // #001848 from Figma
    // Typography h3 variant handles font styles (20px, Montserrat 600)
  },

  subtitle: {
    color: colors.textSubtitle, // #646466 from Figma (newly added color)
    // Typography bodyLarge variant handles font styles (16px, Inter 400)
  },

  buttonSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between buttons (from Figma)
  },

  primaryButton: {
    // Custom styling for primary button to override default content
    paddingHorizontal: spacing.md, // 24px left padding from Figma
    paddingVertical: spacing.sm, // 16px vertical padding from Figma
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs, // 8px gap between icon and text (from Figma)
  },

  buttonIcon: {
    // Icon styling handled by Icon component
  },

  primaryButtonText: {
    color: colors.buttonPrimaryText, // #F5F6FA from Figma
    // Typography labelMedium variant handles font styles
  },
});
