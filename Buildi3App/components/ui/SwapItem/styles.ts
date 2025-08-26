import { StyleSheet } from "react-native";
import { colors } from "../../../theme";

/**
 * Styles for SwapItem molecule component
 * Based on Figma Design System specifications
 */
export const styles = StyleSheet.create({
  // Main container - matches Figma SwapItem specifications
  container: {
    backgroundColor: colors.widgetContentArea, // #F2F3F7 from Figma
    borderRadius: 16, // 16px border radius from Figma
    width: "100%",
    minHeight: 60, // Reduced minimum height to allow better content fitting
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  // Placeholder text styling - matches Figma specifications
  placeholderText: {
    // Typography will be handled by Typography component
    // Color and font will be set via props
  },

  // Content wrapper when children are provided
  contentWrapper: {
    width: "100%",
    alignItems: "stretch", // Allow content to determine height
  },
});
