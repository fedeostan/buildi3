import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * Styles for the UpcomingTaskWidget component
 * Based on Figma Design System
 *
 * Updated to use @gorhom/bottom-sheet for consistent bottom sheet UX
 * across the application, following the MediaUploadBottomSheet pattern.
 */
export const styles = StyleSheet.create({
  // Main container
  container: {
    width: "100%",
  },

  // Filter button container
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Filter text
  filterText: {
    color: colors.actionText,
    marginRight: 4,
  },

  // Bottom sheet header
  bottomSheetHeader: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },

  // Bottom sheet title
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },

  // Bottom sheet container
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: colors.bottomSheetBackground,
  },

  // Bottom sheet background
  bottomSheetBackground: {
    backgroundColor: colors.bottomSheetBackground,
  },

  // Bottom sheet indicator
  bottomSheetIndicator: {
    backgroundColor: colors.textSecondary,
    width: 40,
  },

  // Filter title
  filterTitle: {
    marginBottom: spacing.sm,
  },

  // Filter option container
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },

  // Last filter option (no border)
  lastFilterOption: {
    borderBottomWidth: 0,
  },

  // Option text style
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.text,
    lineHeight: Math.round(16 * 1.21),
  },

  // Selected option indicator
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Selected checkmark
  selectedCheckmark: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },

  // Bottom sheet content container
  bottomSheetContent: {
    backgroundColor: colors.background,
  },
});
