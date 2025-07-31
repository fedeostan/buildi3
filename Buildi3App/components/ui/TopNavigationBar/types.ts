import { FeatherIconName } from "../Icon/types";

/**
 * Action configuration for left and right navigation actions
 * Based on Figma component properties: has Icon, has Label
 */
export interface NavigationAction {
  /** Optional icon to display (uses Feather icons) */
  icon?: FeatherIconName;
  /** Optional label text to display */
  label?: string;
  /** Handler function when action is pressed */
  onPress?: () => void;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

/**
 * Props for the TopNavigationBar organism component
 *
 * This organism combines multiple atoms (Icon, Typography) into a reusable
 * navigation section following Atomic Design principles.
 *
 * Based on Figma Design System properties:
 * - Left Action with optional icon and label
 * - Right Action with optional icon and label
 * - Center Title (optional)
 */
export interface TopNavigationBarProps {
  /** Optional left action configuration */
  leftAction?: NavigationAction;

  /** Optional right action configuration */
  rightAction?: NavigationAction;

  /** Optional center title text */
  title?: string;

  /** Custom style overrides */
  style?: any;

  /** Accessibility label for the entire navigation bar */
  accessibilityLabel?: string;
}

/**
 * Internal styling configuration interface
 * Matches Figma design specifications exactly
 */
export interface TopNavigationBarStyleConfig {
  // Container styles
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  backgroundColor: string;

  // Section widths (from Figma: 130px each)
  sectionWidth: number;

  // Action button styles
  actionPadding: number;
  actionGap: number;

  // Typography styles
  titleFontFamily: string;
  titleFontSize: number;
  titleFontWeight: "400" | "500" | "600";
  titleColor: string;

  actionFontFamily: string;
  actionFontSize: number;
  actionFontWeight: "400" | "500" | "600";
  actionColor: string;

  // Icon styles
  iconSize: number;
  iconColor: string;
}
