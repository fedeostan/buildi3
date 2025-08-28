import { StyleSheet } from "react-native";
import { colors } from "../../../theme";

/**
 * Styles for WidgetTitle molecule component
 * Based on Figma Design System specifications
 */
export const styles = StyleSheet.create({
  // Main container - matches Figma layout (row, space-between, center aligned)
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16, // 16px gap from Figma
    width: "100%",
    height: 20, // Fixed height from Figma
  },

  // Title text styling - matches Figma typography
  title: {
    // Typography handled by Typography component
    // Color and font will be set via Typography props
  },

  // Action container
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Action content container - holds text and icon
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // Gap between text and icon
  },

  // Action text styling
  actionText: {
    // Typography handled by Typography component
    // Color will be set to actionText from theme
  },

  // Action icon styling
  actionIcon: {
    marginLeft: 4, // Space between text and icon
  },
});
