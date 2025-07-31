import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { TopNavigationBarStyleConfig } from "./types";

/**
 * TopNavigationBar styles based on exact Figma Design System specifications
 *
 * Design Reference: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=95-108
 *
 * Specifications from Figma:
 * - Total height: 42px
 * - Section width: 130px each (left, center, right)
 * - Title: Montserrat 500, 16px, #001848
 * - Action text: Inter 400, 16px, #495D92
 * - Icon size: 24px, color #495D92
 * - Background: transparent (inherits from parent)
 */

// Style configuration matching Figma exactly
export const navigationBarStyle: TopNavigationBarStyleConfig = {
  // Container dimensions from Figma
  height: 42,
  paddingHorizontal: 0, // No horizontal padding on main container
  paddingVertical: 0, // No vertical padding on main container
  backgroundColor: "transparent", // Transparent background

  // Section width from Figma layout (130px per section)
  sectionWidth: 130,

  // Action button spacing from Figma layout data
  actionPadding: 9, // Internal padding for action buttons
  actionGap: 5, // Gap between icon and label (left action)

  // Title typography from Figma
  titleFontFamily: "Montserrat", // Figma spec: Montserrat
  titleFontSize: 16, // Figma spec: 16px
  titleFontWeight: "500", // Figma spec: 500 weight
  titleColor: colors.text, // #001848 from theme

  // Action typography from Figma
  actionFontFamily: "Inter", // Figma spec: Inter
  actionFontSize: 16, // Figma spec: 16px
  actionFontWeight: "400", // Figma spec: 400 weight
  actionColor: colors.buttonPrimary, // #495D92 from theme

  // Icon configuration from Figma
  iconSize: 24, // Figma spec: 24x24px
  iconColor: colors.buttonPrimary, // #495D92 from theme
};

/**
 * Container style for the entire navigation bar
 * Creates a horizontal flexbox matching Figma layout
 */
export const containerStyle = {
  height: navigationBarStyle.height,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
  backgroundColor: navigationBarStyle.backgroundColor,
  paddingHorizontal: navigationBarStyle.paddingHorizontal,
  paddingVertical: navigationBarStyle.paddingVertical,
};

/**
 * Style for action sections (left and right)
 * Fixed width sections as per Figma design
 */
export const actionSectionStyle = {
  width: navigationBarStyle.sectionWidth,
  height: navigationBarStyle.height,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  paddingVertical: navigationBarStyle.actionPadding,
};

/**
 * Left action specific styles
 * Icon first, then label (if both present)
 */
export const leftActionStyle = {
  ...actionSectionStyle,
  justifyContent: "flex-start" as const,
  paddingLeft: 0, // From Figma: 0px left padding (not 7px)
  paddingRight: 9, // From Figma: 9px right padding
  gap: navigationBarStyle.actionGap, // 5px gap between elements
};

/**
 * Right action specific styles
 * Label first, then icon (if both present)
 */
export const rightActionStyle = {
  ...actionSectionStyle,
  justifyContent: "flex-end" as const,
  paddingLeft: 0, // From Figma: no left padding
  paddingRight: 7, // From Figma: 7px right padding
  gap: 10, // From Figma: 10px gap between elements
};

/**
 * Center title section styles
 * Fixed width with centered content
 */
export const titleSectionStyle = {
  width: navigationBarStyle.sectionWidth,
  height: navigationBarStyle.height,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  paddingHorizontal: 18, // From Figma: 18px horizontal padding for title
};

/**
 * Typography style for the center title
 * Matches Figma specifications exactly
 */
export const titleTextStyle = {
  fontFamily: navigationBarStyle.titleFontFamily,
  fontSize: navigationBarStyle.titleFontSize,
  fontWeight: navigationBarStyle.titleFontWeight,
  color: navigationBarStyle.titleColor,
  textAlign: "center" as const,
  // From Figma: line height 1.218999981880188em
  lineHeight: Math.round(navigationBarStyle.titleFontSize * 1.219),
  // From Figma: letter spacing 0.6250000093132257%
  letterSpacing: navigationBarStyle.titleFontSize * 0.00625,
};

/**
 * Typography style for action labels
 * Matches Figma specifications exactly
 */
export const actionTextStyle = {
  fontFamily: navigationBarStyle.actionFontFamily,
  fontSize: navigationBarStyle.actionFontSize,
  fontWeight: navigationBarStyle.actionFontWeight,
  color: navigationBarStyle.actionColor,
  // From Figma: line height 1.2102272510528564em
  lineHeight: Math.round(navigationBarStyle.actionFontSize * 1.21),
  // From Figma: letter spacing 0.6250000093132257%
  letterSpacing: navigationBarStyle.actionFontSize * 0.00625,
};

/**
 * Style for action buttons when they're pressable
 * Adds proper touch feedback without overriding parent alignment
 */
export const pressableActionStyle = {
  flexDirection: "row" as const, // Inherit row direction from parent
  alignItems: "center" as const, // Center items vertically (like parent)
  borderRadius: 6, // Subtle border radius for touch feedback
  minHeight: 24, // Minimum touch target height
};

/**
 * Active/pressed state styling
 */
export const pressedActionStyle = {
  opacity: 0.7,
};
