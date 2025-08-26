import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * Styles for ProjectList organism component
 * Based on Figma Design System specifications
 */
export const styles = StyleSheet.create({
  // Main container for the project list
  container: {
    width: "100%",
    paddingTop: 0,
    paddingBottom: 0,
    alignSelf: "stretch", // Ensure it takes full width
    backgroundColor: "transparent", // Transparent background
  },

  // Divider between projects
  divider: {
    height: 1, // 1px height (from Figma)
    backgroundColor: colors.border, // #EDEEF2 from Figma
    width: "100%", // Full width
    marginVertical: 0, // No vertical margin to match Figma design
  },

  // Empty state container
  emptyContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md, // 24px gap between icon and text (from Figma)
    padding: spacing.md, // 24px padding
  },

  // Icon container for empty state
  emptyIconContainer: {
    width: 48, // 48px width (from Figma)
    height: 48, // 48px height (from Figma)
    borderRadius: 16, // 16px border radius (from Figma)
    backgroundColor: colors.background, // Light background
    borderWidth: 1,
    borderColor: colors.border, // #EDEEF2 from Figma
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty state text
  emptyText: {
    color: colors.textSubtitle, // #646466 from Figma
    textAlign: "center",
  },
});
