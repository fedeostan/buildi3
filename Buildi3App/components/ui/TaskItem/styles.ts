import { StyleSheet } from "react-native";
import { colors } from "../../../theme";
import { spacing } from "../../../theme";

/**
 * Styles for the TaskItem component
 * Based on Figma Design System
 */
export const styles = StyleSheet.create({
  // Main container
  container: {
    width: "100%",
    backgroundColor: colors.widgetContentArea,
    borderRadius: 16,
    paddingVertical: spacing.sm, // Increased from spacing.xs to spacing.sm (16px) to match Figma
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  // Left content container (title, etc)
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },

  // Task title style
  title: {
    color: colors.text,
    marginBottom: spacing.xs / 2, // Increased from 2px to 4px (half of spacing.xs) for better visual hierarchy
  },

  // Due date style
  dueDate: {
    color: colors.textTertiary,
  },

  // Right side content (icon)
  iconContainer: {
    paddingLeft: spacing.sm,
  },

  // For highlighting the last item
  lastItem: {
    marginBottom: 0,
  },

  // For different status styles
  completed: {
    opacity: 0.6,
  },

  // For active state styling when pressed
  pressed: {
    backgroundColor: colors.hover,
  },
});
