import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { SpinnerSize } from "./types";

/**
 * Spinner size configurations using our spacing tokens
 * Based on Figma design - 70px base size scaled down for mobile
 */
export const SPINNER_SIZES = {
  small: spacing.md, // 24px
  medium: spacing.lg, // 32px
  large: spacing.xxl, // 48px
} as const;

/**
 * Animation timing constants for smooth spinner animation
 * Inspired by One UI and Material M3 motion principles
 */
export const ANIMATION_CONFIG = {
  // Rotation animation - continuous smooth spin
  rotation: {
    duration: 1200, // Slightly slower than default for elegance
    useNativeDriver: true,
  },

  // Arc length animation - smooth pulsing effect
  arcLength: {
    duration: 1500, // Optimized timing for smooth transitions
    useNativeDriver: false, // SVG animations need JS driver
  },
} as const;

/**
 * Spinner visual constants matching Figma design
 */
export const SPINNER_CONSTANTS = {
  // Ring styling to match Figma design
  strokeWidth: 3, // Proportional to Figma 70px design
  minArcLength: 0.15, // Never fully disappear (15% minimum for smoother transition)
  maxArcLength: 0.75, // Never complete circle (75% maximum for smoother transition)

  // Default color from Figma design system
  defaultColor: colors.buttonPrimary, // #495D92
} as const;

/**
 * Get spinner size configuration
 */
export const getSpinnerSize = (size: SpinnerSize) => {
  const dimension = SPINNER_SIZES[size];
  const strokeWidth = Math.max(2, dimension * 0.08); // Proportional stroke width
  const radius = (dimension - strokeWidth) / 2;

  return {
    width: dimension,
    height: dimension,
    radius,
    strokeWidth,
  };
};

/**
 * Base styles for the spinner component
 */
export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    // Base spinner positioning
  },

  // Size-specific containers (using our spacing tokens)
  smallContainer: {
    width: SPINNER_SIZES.small,
    height: SPINNER_SIZES.small,
  },

  mediumContainer: {
    width: SPINNER_SIZES.medium,
    height: SPINNER_SIZES.medium,
  },

  largeContainer: {
    width: SPINNER_SIZES.large,
    height: SPINNER_SIZES.large,
  },
});

/**
 * Get container style for specific size
 */
export const getContainerStyle = (size: SpinnerSize) => {
  switch (size) {
    case "small":
      return styles.smallContainer;
    case "medium":
      return styles.mediumContainer;
    case "large":
      return styles.largeContainer;
    default:
      return styles.mediumContainer;
  }
};
