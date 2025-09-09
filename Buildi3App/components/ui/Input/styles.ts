import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * Input component styles matching Figma Design System
 * Based on: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=44-1328
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
    minHeight: 60, // Minimum height for single-line input (from Figma)
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
    gap: 4, // 4px gap between label and input from Figma
    flex: 1,
    justifyContent: "center", // Center content when no label
  },

  // Content container when label is showing (floating label mode)
  contentContainerWithLabel: {
    gap: 4,
    flex: 1,
    justifyContent: "flex-start", // Top align when label is showing
  },

  // Row for input and right icon
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs, // 8px gap for icon
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

  // Input field styles
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.inputText, // #001848
    lineHeight: Math.round(14 * 1.21), // 1.21 line height from Figma
    letterSpacing: 0.007, // 0.71% from Figma
    padding: 0, // Remove default padding
    textAlignVertical: "center",
  },

  inputDisabled: {
    color: colors.disabledText,
  },

  inputPlaceholder: {
    color: colors.textTertiary,
  },

  // Right icon container
  rightIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: spacing.xs,
    flexShrink: 0,
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
});

/**
 * Helper function to get container style based on state
 */
export const getContainerStyle = (
  state: "default" | "focus" | "filled" | "success" | "error",
  disabled: boolean = false
) => {
  if (disabled) return [styles.container, styles.containerDisabled];

  switch (state) {
    case "focus":
      return [styles.container, styles.containerFocus];
    case "filled":
      return [styles.container, styles.containerFilled];
    case "success":
      return [styles.container, styles.containerSuccess];
    case "error":
      return [styles.container, styles.containerError];
    default:
      return [styles.container, styles.containerDefault];
  }
};
