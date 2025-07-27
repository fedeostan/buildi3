import { StyleSheet } from "react-native";
import { colors } from "../../../theme";

/**
 * Styles for Widget organism component
 * Based on Figma Design System specifications
 */
export const styles = StyleSheet.create({
  // Main container - matches Figma Widget specifications
  container: {
    backgroundColor: colors.widgetBackground, // White background from Figma
    borderRadius: 16, // 16px border radius from Figma
    borderWidth: 1,
    borderColor: colors.border, // #EDEEF2 from Figma
    padding: 16, // 16px padding from Figma
    gap: 16, // 16px gap between elements from Figma
    width: "100%", // Full width
    // Add subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Button group container
  buttonGroup: {
    width: "100%",
    gap: 16, // Gap between buttons if multiple
  },

  // Individual button styling
  button: {
    // Button styles will be handled by the Button component
    // This is here for potential overrides
  },
});
