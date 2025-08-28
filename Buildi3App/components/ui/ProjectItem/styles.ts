import { StyleSheet } from "react-native";
import { colors } from "../../../theme";

/**
 * Styles for ProjectItem molecule component
 * Based on Figma Design System specifications
 */
export const styles = StyleSheet.create({
  // Main container for the project item
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12, // Adds more vertical padding to match Figma
  },

  // Left side container with icon and text
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Increased gap between icon and text to match Figma
  },

  // Icon container styling
  iconContainer: {
    width: 44, // Adjusted to 44px to match specs
    height: 44, // Adjusted to 44px to match specs
    borderRadius: 12, // 12px border radius (from Figma)
    justifyContent: "center",
    alignItems: "center",
    padding: 0, // Removed padding as SVGs are sized directly
    overflow: "hidden", // Ensure content stays within bounds
  },

  // Project name text styling
  projectName: {
    color: colors.text, // #001848 from Figma (dark blue)
  },

  // Progress container (right side)
  progressContainer: {
    width: 44, // Exact 44px width from Figma
    height: 44, // Exact 44px height from Figma
    justifyContent: "center",
    alignItems: "center",
  },

  // Progress text (percentage)
  progressText: {
    fontSize: 16, // Larger font size to match Figma
    fontWeight: "600", // Bolder text to match Figma
    color: "#4B4B4D", // Dark gray from Figma
    zIndex: 1, // Ensure it's above the progress circle
    textAlign: "center",
  },

  // Icon color mapping - using as any to avoid TypeScript issues
  iconColors: {
    primaryLight: colors.primaryLight, // Light blue from theme
    secondaryLight: colors.background, // Light secondary blue
    success: colors.success, // Green
    warning: colors.warning, // Yellow
    error: colors.error, // Red
  } as any,
});
