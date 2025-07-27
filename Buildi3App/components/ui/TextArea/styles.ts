import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * TextArea component styles matching Figma Design System
 * Based on: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=44-1329
 */

export const styles = StyleSheet.create({
  // Container styles for different states
  container: {
    borderRadius: 16,
    paddingHorizontal: spacing.sm, // 16px from Figma
    paddingVertical: 12, // 12px from Figma
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 88, // Minimum height for multiline input (from Figma)
  },

  containerDefault: {
    backgroundColor: colors.inputBackground, // #FFFFFF
  },

  containerFocus: {
    backgroundColor: colors.inputFocusBackground, // #E8EBF2
  },

  containerFilled: {
    backgroundColor: colors.inputBackground, // #FFFFFF
  },

  containerSuccess: {
    backgroundColor: colors.inputBackground, // #FFFFFF
    borderColor: colors.success, // #4CAF50
  },

  containerError: {
    backgroundColor: colors.inputBackground, // #FFFFFF
    borderColor: colors.error, // #F44336
  },

  containerDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },

  // Content layout
  contentContainer: {
    flex: 1,
    gap: 4, // 4px gap between label and input from Figma
  },

  // Label styles
  label: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.inputLabel, // #707173
    lineHeight: Math.round(12 * 1.21), // 1.21 line height from Figma
    letterSpacing: 0.01, // 0.83% from Figma
  },

  labelFloating: {
    fontSize: 12,
  },

  labelDisabled: {
    color: colors.disabledText,
  },

  // TextArea field styles
  textArea: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.inputText, // #001848
    lineHeight: Math.round(14 * 1.21), // 1.21 line height from Figma
    letterSpacing: 0.007, // 0.71% from Figma
    padding: 0, // Remove default padding
    textAlignVertical: "top", // Start text at top for multiline
    minHeight: 40, // Minimum height for text content
  },

  textAreaDisabled: {
    color: colors.disabledText,
  },

  // Error message styles
  errorMessage: {
    marginTop: 4, // 4px gap from Figma
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.error, // #F44336
    lineHeight: Math.round(12 * 1.21), // 1.21 line height from Figma
    letterSpacing: 0.008, // 0.83% from Figma
  },

  // Success message styles
  successMessage: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.success, // #4CAF50
    lineHeight: Math.round(12 * 1.21),
    letterSpacing: 0.008,
  },

  // Character counter styles
  characterCounter: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.textTertiary,
    textAlign: "right",
    lineHeight: Math.round(12 * 1.21),
  },

  characterCounterError: {
    color: colors.error,
  },
});

/**
 * Helper function to get container style based on state
 */
export const getContainerStyle = (
  state: "default" | "focus" | "filled" | "success" | "error",
  disabled: boolean = false,
  minHeight?: number,
  maxHeight?: number
) => {
  const baseStyle = disabled
    ? [styles.container, styles.containerDisabled]
    : [styles.container];

  let stateStyle;
  switch (state) {
    case "focus":
      stateStyle = styles.containerFocus;
      break;
    case "filled":
      stateStyle = styles.containerFilled;
      break;
    case "success":
      stateStyle = styles.containerSuccess;
      break;
    case "error":
      stateStyle = styles.containerError;
      break;
    default:
      stateStyle = styles.containerDefault;
  }

  const heightStyle: any = {};
  if (minHeight) heightStyle.minHeight = minHeight;
  if (maxHeight) heightStyle.maxHeight = maxHeight;

  return [...baseStyle, stateStyle, heightStyle];
};
