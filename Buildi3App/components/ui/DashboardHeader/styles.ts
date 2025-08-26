import { StyleSheet } from "react-native";
import { colors, componentSpacing } from "../../../theme";

/**
 * DashboardHeader Styles
 *
 * Based on Figma Design System specs:
 * - Container: Flexbox row with space-between alignment
 * - No horizontal padding (parent screen handles this)
 * - Vertical padding: 16px for proper spacing
 * - Gap: 16px gap between elements (adjusted from 12px in Figma)
 * - Typography: Date in gray, greeting in primary blue
 */

export const styles = StyleSheet.create({
  // Main container - horizontal layout with space between elements
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // No horizontal padding - parent screen handles this
    paddingVertical: componentSpacing.dashboardHeader.verticalPadding, // 16px
    backgroundColor: colors.background, // Background matches screen
  },

  // Greeting text container - center content with proper spacing
  greetingContainer: {
    flex: 1, // Takes remaining space between profile and notification
    paddingHorizontal: componentSpacing.dashboardHeader.gap, // 16px space from icons
    justifyContent: "center",
    alignItems: "flex-start", // Left align text
  },

  // Date text styling
  dateText: {
    color: "#585E71", // From Figma - secondary text color
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    lineHeight: 20, // 1.4285714285714286em from Figma
    letterSpacing: 0.25, // 1.7857142857142856% from Figma
    marginBottom: 4, // Small gap between date and greeting
  },

  // Greeting text styling
  greetingText: {
    color: colors.buttonPrimary, // #495D92 from Figma
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "500",
    lineHeight: 22, // 1.2189999686347113em from Figma
    letterSpacing: 0.1, // 0.5555555638339784% from Figma
  },
});
