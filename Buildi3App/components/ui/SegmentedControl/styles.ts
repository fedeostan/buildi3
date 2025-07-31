import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * SegmentedControl Styles - Matching Figma Design System
 *
 * Based on Figma design:
 * - Container: White background, 16px border radius, 4px padding, 5px gap between tabs
 * - Selected tab: #C0C7DD background, 16px border radius, 4px vertical + 12px horizontal padding
 * - Unselected tab: Transparent background, same padding
 * - Text: Inter 400, 14px, center aligned
 * - Selected text: #001848, Unselected text: #646466
 */

export const styles = StyleSheet.create({
  // Main container (segmented control background)
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.segmentedControlBackground, // White
    borderRadius: 16, // 16px from Figma
    padding: 4, // 4px padding from Figma
    gap: 5, // 5px gap between tabs from Figma
  },

  // Individual tab container
  tab: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4, // 4px vertical padding from Figma
    paddingHorizontal: 12, // 12px horizontal padding from Figma
    borderRadius: 16, // 16px border radius for tabs from Figma
    minHeight: 32, // Ensures consistent height across tabs
  },

  // Selected tab styling
  selectedTab: {
    backgroundColor: colors.segmentedControlSelectedBackground, // #C0C7DD from Figma
  },

  // Unselected tab styling (transparent background)
  unselectedTab: {
    backgroundColor: "transparent",
  },

  // Tab text styling
  tabText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14, // 14px from Figma
    textAlign: "center",
    lineHeight: 17, // 1.21 ratio from Figma (14px * 1.21 ≈ 17px)
  },

  // Selected tab text color
  selectedTabText: {
    color: colors.segmentedControlSelectedText, // #001848 from Figma
  },

  // Unselected tab text color
  unselectedTabText: {
    color: colors.segmentedControlUnselectedText, // #646466 from Figma
  },
});
