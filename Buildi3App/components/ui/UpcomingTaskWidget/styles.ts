import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * Styles for the UpcomingTaskWidget component
 * Based on Figma Design System
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

  // Bottom sheet content container
  bottomSheetContent: {
    padding: spacing.sm,
  },

  // Filter option container
  filterOption: {
    paddingVertical: spacing.sm,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Last filter option (no border)
  lastFilterOption: {
    borderBottomWidth: 0,
  },

  // Selected filter option
  selectedFilterOption: {
    backgroundColor: colors.hover,
  },
});
