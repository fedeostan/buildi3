import { ViewStyle } from "react-native";

/**
 * Spinner size variants based on our spacing system
 * - small: 24px (spacing.md)
 * - medium: 32px (spacing.lg)
 * - large: 48px (spacing.xxl)
 */
export type SpinnerSize = "small" | "medium" | "large";

/**
 * Spinner component props
 */
export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default "medium"
   */
  size?: SpinnerSize;

  /**
   * Color of the spinner ring
   * @default uses colors.buttonPrimary (#495D92 from Figma)
   */
  color?: string;

  /**
   * Custom style overrides
   */
  style?: ViewStyle;

  /**
   * Accessibility label for screen readers
   * @default "Loading"
   */
  accessibilityLabel?: string;

  /**
   * Whether the spinner is animating
   * @default true
   */
  animating?: boolean;
}

/**
 * Internal animation state for the spinner
 */
export interface SpinnerAnimation {
  rotation: number;
  arcLength: number;
  startAngle: number;
}
