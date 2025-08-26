import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";

/**
 * NextTaskContainer Styles
 *
 * Based on Figma Design System:
 * - Background: #F2F3F7 (colors.widgetContentArea)
 * - 16px padding (spacing.sm)
 * - 16px border radius
 * - 8px gap between elements (spacing.xs)
 */
export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.widgetContentArea, // #F2F3F7 from Figma
    borderRadius: 16,
    padding: spacing.sm, // 16px padding
    gap: spacing.xs, // 8px gap (matches Figma main container)
  },

  // hasTask=true state: Body container (matches Figma structure exactly)
  taskContent: {
    gap: spacing.xs, // 8px gap between project name and task title
    alignItems: "flex-start", // Left align content
    justifyContent: "center", // Center justify (matches Figma)
    alignSelf: "stretch", // Stretch to fill width (matches Figma)
  },

  // hasTask=false state: Centered layout
  noTaskContent: {
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
  },

  // Text styles using theme colors (Typography component handles font styles)
  projectName: {
    color: colors.textSubtitle, // #646466 from Figma
  },

  taskTitle: {
    color: colors.text, // #001848 from Figma
  },

  noTaskMessage: {
    color: colors.text, // #001848 from Figma
    textAlign: "center",
  },
});
