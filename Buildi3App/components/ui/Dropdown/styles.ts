import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * Dropdown component styles matching Figma Design System
 * Based on Input field but with chevron icon for dropdown indication
 */

export const styles = StyleSheet.create({
  // Container styles for different states (same as Input)
  container: {
    borderRadius: 16,
    paddingHorizontal: spacing.sm, // 16px from Figma
    paddingVertical: 12, // 12px from Figma
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 60, // Same as Input field
  },

  containerDefault: {
    backgroundColor: colors.inputBackground, // #FFFFFF
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

  // Main container - Always uses flexDirection row
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs, // 8px gap between left and right containers
  },

  // Left container - Text content (label + selected text)
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 4, // 4px gap between label and text
  },

  // Right container - Always centers the chevron
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },

  // Label styles (same as Input)
  label: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.inputLabel, // #707173
    lineHeight: Math.round(12 * 1.21), // 1.21 line height from Figma
    letterSpacing: 0.01, // 0.83% from Figma
    marginBottom: 4,
  },

  labelDisabled: {
    color: colors.disabledText,
  },

  // Selected text styles
  selectedText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.inputText, // #001848
    lineHeight: Math.round(14 * 1.21), // 1.21 line height from Figma
    letterSpacing: 0.007, // 0.71% from Figma
  },

  // Placeholder text styles
  placeholderText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.textTertiary, // Placeholder color
    lineHeight: Math.round(14 * 1.21),
    letterSpacing: 0.007,
  },

  placeholderTextDisabled: {
    color: colors.disabledText,
  },

  // Note: Chevron is now handled by Feather icon component
  // No need for chevron-specific styles as Feather handles sizing/color

  // Error message styles (same as Input)
  errorMessage: {
    marginTop: 4, // 4px gap from Figma
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.error, // #F44336
    lineHeight: Math.round(12 * 1.21), // 1.21 line height from Figma
    letterSpacing: 0.008, // 0.83% from Figma
  },

  // Success message styles (same as Input)
  successMessage: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.success, // #4CAF50
    lineHeight: Math.round(12 * 1.21),
    letterSpacing: 0.008,
  },

  // Bottom sheet styles
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  bottomSheetHeader: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },

  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },

  bottomSheetContent: {
    flex: 1,
  },

  // Option item styles
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },

  optionItemPressed: {
    backgroundColor: colors.backgroundSecondary,
  },

  optionItemDisabled: {
    opacity: 0.5,
  },

  optionIcon: {
    marginRight: spacing.xs,
    width: 20,
    height: 20,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.text,
    lineHeight: Math.round(16 * 1.21),
  },

  optionTextDisabled: {
    color: colors.disabledText,
  },

  // Selected option indicator
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedCheckmark: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },
});

/**
 * Helper function to get container style based on state
 */
export const getContainerStyle = (
  state: "default" | "filled" | "success" | "error",
  disabled: boolean = false
) => {
  if (disabled) return [styles.container, styles.containerDisabled];

  switch (state) {
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
