import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * Styles for the TaskList component
 * Based on Figma Design System
 */
export const styles = StyleSheet.create({
  // Main container
  container: {
    width: "100%",
  },

  // Empty state container
  emptyContainer: {
    width: "100%",
    backgroundColor: colors.widgetContentArea,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },

  // Empty state text
  emptyText: {
    color: colors.textTertiary,
    textAlign: "center",
  },
});
