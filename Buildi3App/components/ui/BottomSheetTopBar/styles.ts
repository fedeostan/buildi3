import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * BottomSheetTopBar Styles - Matching Figma Design System
 *
 * Based on Figma design data:
 * - Container: space-between layout with 38px gap
 * - Cancel text: #495D92 color, Inter 400, 14px
 * - Camera icon: 24x24 size, #495D92 color
 * - Segmented control: centered in the middle
 */

export const styles = StyleSheet.create({
  // Main container
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 38, // 38px gap from Figma
    paddingHorizontal: spacing.sm, // 16px horizontal padding for consistency
    paddingVertical: spacing.sm, // 16px vertical padding
  },

  // Cancel button
  cancelButton: {
    // No additional styling needed - using Pressable for touch feedback
  },

  // Cancel text styling
  cancelText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14, // 14px from Figma
    lineHeight: 17, // 1.21 ratio from Figma
    letterSpacing: 0.1, // ~0.7% letter spacing from Figma
    textAlign: "center",
    color: colors.buttonPrimary, // #495D92 from Figma
  },

  // Segmented control container (centered)
  segmentedControlContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Camera button container
  cameraButton: {
    width: 24, // 24px width from Figma
    height: 24, // 24px height from Figma
    alignItems: "center",
    justifyContent: "center",
  },
});
