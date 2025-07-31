import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image as RNImage,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
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
 * Preview Quote Screen - Image/File Preview Before Creating Project
 *
 * Based on Figma design: https://www.figma.com/design/vedLoKTGfOOHamh7Novw47/Create-Account?node-id=47-404
 *
 * Purpose:
 * - Shows selected image/file in full screen preview
 * - User can continue to AI thinking screen or choose another media
 * - Handles both photo and file previews
 * - Provides clean navigation flow from media selection to AI processing
 *
 * Features:
 * - Full screen image preview with proper aspect ratio
 * - Dual image library support (expo-image + React Native Image fallback)
 * - "Continue" and "Choose Another" action buttons
 * - Top navigation with back button
 * - Bottom sheet integration for choosing another media
 * - Follows exact Figma spacing, typography, and colors
 *
 * Layout (exact from Figma):
 * - Full screen background (#F2F3F7)
 * - 16px horizontal padding (consistent across devices)
 * - 32px gap between elements
 * - Dynamic safe area handling
 * - Image takes most of the space with rounded corners
 * - Buttons at bottom with proper spacing
 */

export default function PreviewQuoteScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // State management
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [useRNImage, setUseRNImage] = useState(false);
  const [showMediaUploadSheet, setShowMediaUploadSheet] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Get media data from navigation params
  const mediaUri = params.mediaUri as string;
  const mediaType = params.mediaType as string; // 'photo' or 'file'
  const mediaId = params.mediaId as string;
  const mediaFilename = params.mediaFilename as string;

  // Get user data from previous screens for project creation
  const userEmail = (params.email as string) || "";
  const verificationCode = (params.code as string) || "";
  const firstName = (params.firstName as string) || "";
  const lastName = (params.lastName as string) || "";
  const role = (params.role as string) || "";
  const useCase = (params.useCase as string) || "";
  const jobDescription = (params.jobDescription as string) || "";

  // Debug the media URI when component mounts
  useEffect(() => {
    console.log("PreviewQuote received media:", {
      uri: mediaUri,
      type: mediaType,
      id: mediaId,
      filename: mediaFilename,
    });

    if (!mediaUri) {
      console.error("No media URI provided, navigating back");
      router.back();
      return;
    }

    setImageLoading(true);
    setImageError(false);
    setUseRNImage(false);
  }, [mediaUri]);

  // Handle image load error with fallback
  const handleImageError = (error: any) => {
    console.log("Expo Image failed to load:", mediaUri);
    console.log("Error details:", error);

    if (!useRNImage) {
      console.log("Trying with React Native Image as fallback...");
      setUseRNImage(true);
      setImageLoading(true);
      return;
    }

    console.log("Both image libraries failed, showing placeholder");
    setImageError(true);
    setImageLoading(false);
  };

  // Handle image load success
  const handleImageLoad = () => {
    console.log(
      "Image loaded successfully:",
      mediaUri,
      useRNImage ? "(RN Image)" : "(Expo Image)"
    );
    setImageError(false);
    setImageLoading(false);
  };

  // Handle RN Image error
  const handleRNImageError = (error: any) => {
    console.log("React Native Image also failed:", error);
    setImageError(true);
    setImageLoading(false);
  };

  // Handle continue button - navigate to AI thinking screen
  const handleContinue = async () => {
    console.log(
      "Continue pressed - navigating to AI thinking screen with media:",
      {
        uri: mediaUri,
        type: mediaType,
        id: mediaId,
        filename: mediaFilename,
      }
    );

    setProcessing(true);

    try {
      // Brief processing indication before navigation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to AI thinking/loading screen with all user data
      const navigationParams = {
        // Media data
        mediaUri,
        mediaType,
        mediaId,
        mediaFilename,
        // User data for project creation
        email: userEmail,
        code: verificationCode,
        firstName,
        lastName,
        role,
        useCase,
        jobDescription,
      };

      console.log(
        "Navigating to AI thinking screen with params:",
        navigationParams
      );

      router.push({
        pathname: "/loading-quote-ai-thinking",
        params: navigationParams,
      });
    } catch (error) {
      console.error("Error navigating to AI thinking screen:", error);
      Alert.alert("Error", "Failed to proceed. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setProcessing(false);
    }
  };

  // Handle choose another button - show media selection again
  const handleChooseAnother = () => {
    console.log("Choose another pressed - showing media picker");
    setShowMediaUploadSheet(true);
  };

  // Handle media selection from bottom sheet
  const handleMediaSelect = (media: SelectedMedia) => {
    console.log("New media selected:", media);
    setShowMediaUploadSheet(false);

    // Navigate to preview with new media
    const newParams = {
      mediaUri: media.data.uri,
      mediaType: media.type,
      mediaId: media.data.id,
      mediaFilename:
        (media.type === "photo"
          ? (media.data as any).filename
          : (media.data as any).name) || "untitled",
      // Pass through user data
      email: userEmail,
      code: verificationCode,
      firstName,
      lastName,
      role,
      useCase,
      jobDescription,
    };

    router.replace({
      pathname: "/preview-quote",
      params: newParams,
    });
  };

  // Handle bottom sheet dismiss
  const handleBottomSheetDismiss = () => {
    setShowMediaUploadSheet(false);
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Calculate dynamic padding based on Figma design
  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.sm, // 16px horizontal padding from Figma
      paddingTop: spacing.lg, // 32px base padding from Figma
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

      {/* KeyboardAvoidingView for consistency */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={spacing.sm}
      >
        {/* Main Content Container */}
        <View style={styles.contentContainer}>
          {/* Top Section - Header */}
          <View style={styles.headerSection}>
            <Typography variant="h3" style={styles.header}>
              Set up your project
            </Typography>
          </View>

          {/* Middle Section - Image Preview */}
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              {/* Loading indicator */}
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <Icon
                    name="clock"
                    size="lg"
                    color="primary"
                    style={styles.loadingIcon}
                  />
                  <Typography variant="bodyMedium" style={styles.loadingText}>
                    Loading {mediaType === "photo" ? "image" : "file"}...
                  </Typography>
                </View>
              )}

              {/* Image display with fallback */}
              {!imageError && !useRNImage ? (
                <Image
                  source={{ uri: mediaUri }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  placeholder={undefined}
                  accessibilityLabel="Selected media preview"
                />
              ) : !imageError && useRNImage ? (
                <RNImage
                  source={{ uri: mediaUri }}
                  style={styles.image}
                  resizeMode="cover"
                  onError={handleRNImageError}
                  onLoad={handleImageLoad}
                  accessibilityLabel="Selected media preview"
                />
              ) : (
                /* Error placeholder */
                <View style={styles.errorPlaceholder}>
                  <Icon
                    name="alert-circle"
                    size="lg"
                    color="error"
                    style={styles.errorIcon}
                  />
                  <Typography variant="bodyMedium" style={styles.errorText}>
                    Failed to load {mediaType === "photo" ? "image" : "file"}
                  </Typography>
                  <Typography variant="bodySmall" style={styles.errorSubtext}>
                    {mediaFilename || "Unknown file"}
                  </Typography>
                </View>
              )}
            </View>
          </View>

          {/* Bottom Section - Action Buttons */}
          <View style={styles.buttonSection}>
            {/* Continue Button - Primary */}
            <Button
              variant="primary"
              title="Continue"
              onPress={handleContinue}
              style={styles.continueButton}
              loading={processing}
              disabled={processing || imageError}
              accessibilityLabel="Continue with selected media"
            />

            {/* Choose Another Button - Text */}
            <Button
              variant="text"
              title="Choose Another"
              onPress={handleChooseAnother}
              style={styles.chooseAnotherButton}
              disabled={processing}
              accessibilityLabel="Choose different media"
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Media Upload Bottom Sheet for choosing another */}
      <MediaUploadBottomSheet
        isVisible={showMediaUploadSheet}
        onMediaSelect={handleMediaSelect}
        onDismiss={handleBottomSheetDismiss}
        initialTab="photos"
        accessibilityLabel="Choose Another Media Picker"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bottomSheetBackground, // #F2F3F7 from Figma
  },

  navigationContainer: {
    alignSelf: "stretch",
  },

  keyboardAvoidingView: {
    flex: 1,
    alignSelf: "stretch",
  },

  contentContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: spacing.xxl, // 48px gap after navigation
  },

  headerSection: {
    alignSelf: "stretch",
  },

  header: {
    color: colors.text, // #001848 from Figma
    textAlign: "center",
  },

  imageSection: {
    flex: 1,
    alignSelf: "stretch",
    marginVertical: spacing.lg, // 32px gap from Figma
  },

  imageContainer: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: colors.backgroundSecondary, // White background
    borderRadius: 16, // 16px border radius from Figma
    overflow: "hidden",
    position: "relative",
    minHeight: 200,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },

  loadingIcon: {
    marginBottom: spacing.sm,
  },

  loadingText: {
    color: colors.textSecondary,
    textAlign: "center",
  },

  errorPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  errorIcon: {
    marginBottom: spacing.sm,
  },

  errorText: {
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  errorSubtext: {
    color: colors.textSecondary,
    textAlign: "center",
  },

  buttonSection: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap between buttons from Figma
  },

  continueButton: {
    alignSelf: "stretch",
  },

  chooseAnotherButton: {
    alignSelf: "stretch",
  },
});
