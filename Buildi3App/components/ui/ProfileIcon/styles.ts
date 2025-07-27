import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * ProfileIcon Styles
 *
 * Based on Figma Design System specs:
 * - Large: 58x58px with 24px Montserrat 600 font
 * - Medium: 44x44px with 18px Montserrat 500 font
 * - Colors: #CDD4E3 background, #001848 text
 * - Notification badge: #F44336 red circle
 */

export const styles = StyleSheet.create({
  // Container styles - circular avatar
  container: {
    backgroundColor: colors.buttonSecondary, // #CDD4E3 from Figma
    borderRadius: 1000, // Creates perfect circle
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute positioning of notification badge
  },

  // Large size container (58x58px from Figma)
  containerLarge: {
    width: 58,
    height: 58,
  },

  // Medium size container (44x44px from Figma)
  containerMedium: {
    width: 44,
    height: 44,
  },

  // Initials text base styles
  initials: {
    color: colors.text, // #001848 from Figma
    fontFamily: "Montserrat",
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
  },

  // Large initials text (24px from Figma)
  initialsLarge: {
    fontSize: 24,
    lineHeight: 29, // Calculated from Figma lineHeight
  },

  // Medium initials text (18px from Figma)
  initialsMedium: {
    fontSize: 18,
    fontWeight: "500", // Medium uses 500 weight
    lineHeight: 22, // Calculated from Figma lineHeight
  },

  // Notification badge base styles
  notificationBadge: {
    backgroundColor: colors.error, // #F44336 red
    borderRadius: 8, // 16px diameter = 8px radius
    position: "absolute",
  },

  // Large notification badge (positioned on 58px avatar)
  notificationBadgeLarge: {
    width: 16,
    height: 16,
    top: -2, // Slightly outside the avatar
    right: -2,
  },

  // Medium notification badge (positioned on 44px avatar)
  notificationBadgeMedium: {
    width: 12,
    height: 12,
    top: -1,
    right: -1,
  },
});
