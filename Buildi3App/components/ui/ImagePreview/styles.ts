import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * ImagePreview Styles - Matching Figma Design System
 *
 * Based on Figma design data:
 * - Container: Column layout, #F2F3F7 background, 32px gap
 * - Padding: 32px top/bottom, 16px left/right
 * - Image container: Full width/height, white background, 16px border radius
 * - Button container: Column layout, 16px gap between buttons
 * - Continue button: Primary variant (#495D92 background, white text)
 * - Choose another button: Text variant (#001848 text)
 */

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: colors.bottomSheetBackground, // #F2F3F7 from Figma
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 32, // 32px gap from Figma
    paddingTop: 32, // 32px top padding from Figma
    paddingBottom: 32, // 32px bottom padding from Figma
    paddingHorizontal: spacing.sm, // 16px horizontal padding from Figma
  },

  // Content container (image + buttons)
  contentContainer: {
    flex: 1,
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap from Figma
  },

  // Image container
  imageContainer: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: colors.backgroundSecondary, // White background from Figma
    borderRadius: 16, // 16px border radius from Figma
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  // Image styling
  image: {
    width: "100%",
    height: "100%",
  },

  // Image placeholder (when image fails to load)
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
  },

  // Image placeholder icon container
  placeholderIconContainer: {
    width: 24, // 24px width from Figma
    height: 24, // 24px height from Figma
    justifyContent: "center",
    alignItems: "center",
  },

  // Buttons container
  buttonsContainer: {
    alignSelf: "stretch",
    gap: spacing.sm, // 16px gap from Figma
  },

  // Continue button (using existing Button component styles)
  continueButton: {
    alignSelf: "stretch",
    // Button component handles the styling:
    // - 16px vertical padding, 24px horizontal padding from Figma
    // - #495D92 background color from Figma
    // - Center alignment, 10px gap from Figma
  },

  // Choose another button (using existing Button component styles)
  chooseAnotherButton: {
    alignSelf: "stretch",
    // Button component handles the styling:
    // - Same padding as continue button
    // - Transparent background (text variant)
    // - #001848 text color from Figma
  },

  // Loading overlay for image loading state
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
  },

  // Loading text
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter",
  },

  // Error text
  errorText: {
    marginTop: spacing.sm,
    color: colors.error,
    fontSize: 14,
    fontFamily: "Inter",
    textAlign: "center",
  },
});
