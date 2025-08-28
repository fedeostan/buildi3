import { StyleSheet } from "react-native";
import { colors, componentSpacing } from "../../../theme";

/**
 * NotificationIcon Styles
 *
 * Based on Figma Design System specs:
 * - Container: 48x48px with #F5F5F5 background and #E6E6E6 border
 * - Icon: 24x24px bell icon in #495D92 color
 * - Badge: #F44336 red circle with white text
 * - Badge position: top-right corner overlapping icon
 */

export const styles = StyleSheet.create({
  // Main container - matches Figma specifications
  container: {
    width: 48,
    height: 48,
    backgroundColor: "#F5F5F5", // From Figma
    borderRadius: 16, // Rounded corners
    borderWidth: 1,
    borderColor: "#E6E6E6", // From Figma
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute badge positioning
    overflow: "visible", // Ensure the badge isn't clipped
  },

  // Notification badge - red circle
  badge: {
    backgroundColor: colors.error, // #F44336 red
    borderRadius: 8, // Makes it circular (16px diameter)
    minWidth: 16,
    height: 16,
    position: "absolute",
    top: -2, // Slightly outside container for overlap effect
    right: -2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4, // Padding for wider numbers
  },

  // Badge text styling
  badgeText: {
    color: colors.textInverse, // White text
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Inter", // Matches Figma font
    textAlign: "center",
    lineHeight: 12,
  },
});
