import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * MediaUploadBottomSheet Styles - Following Design System
 *
 * Container styles for the media upload bottom sheet that coordinates
 * the top bar, content area, and different view states.
 */

export const styles = StyleSheet.create({
  // Bottom sheet container
  container: {
    flex: 1,
    backgroundColor: colors.bottomSheetBackground, // #F2F3F7 from Figma
  },

  // Content area (below top bar)
  contentContainer: {
    flex: 1,
    backgroundColor: colors.bottomSheetBackground,
  },

  // Top bar container
  topBarContainer: {
    backgroundColor: colors.bottomSheetBackground,
    paddingBottom: spacing.xs, // 8px padding below top bar
  },

  // Tab content container
  tabContentContainer: {
    flex: 1,
  },

  // Loading container for overall loading states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl, // 40px vertical padding
  },

  // Loading text
  loadingText: {
    marginTop: spacing.sm, // 16px top margin
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter",
  },

  // Error container
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },

  // Error text
  errorText: {
    color: colors.error,
    fontSize: 16,
    fontFamily: "Inter",
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
