import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * AssignedToDropDown component styles following Figma Design System
 * Based on Figma specs: 16px border radius, white background, proper spacing
 * Reuses existing design tokens for consistency
 */

export const styles = StyleSheet.create({
  // Main container - matches Figma specification exactly
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.xs, // 8px gap between left and right sections
    paddingVertical: 12, // 12px vertical padding from Figma
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    backgroundColor: colors.inputBackground, // Gray 1 (white)
    borderRadius: 16, // 16px border radius from Figma
    minHeight: 56, // Minimum height for consistent touch targets
    borderWidth: 1,
    borderColor: "transparent",
  },
  // Taller container for empty state to match two-line variants elsewhere
  containerTall: {
    minHeight: 64,
  },

  containerDisabled: {
    opacity: 0.6,
    backgroundColor: colors.disabled,
  },

  containerError: {
    borderColor: colors.error,
  },

  containerLoading: {
    opacity: 0.7,
  },

  // Left container - contains profile icon and text content
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs, // 8px gap between profile icon and text content
  },
  leftContainerCentered: {
    justifyContent: "flex-start",
  },

  // Text content container for assigned state
  textContentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    gap: 4, // 4px gap between label and name from Figma
  },

  // Right container - chevron icon
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 20, // Fixed 20px width for chevron
    height: 20, // Fixed 20px height for chevron
  },

  // Text styles following Figma specifications

  // "Unassigned" text for empty state
  unassignedText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.textSecondary, // #707173 from Figma
    lineHeight: Math.round(14 * 1.21), // 1.21 line height ratio from Figma
    letterSpacing: 0.007, // 0.71% letter spacing from Figma
  },

  // "Assigned to" label text for assigned state
  labelText: {
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.textSecondary, // #707173 from Figma
    lineHeight: Math.round(12 * 1.21), // 1.21 line height ratio from Figma
    letterSpacing: 0.008, // 0.83% letter spacing from Figma
  },

  // User name text for assigned state
  nameText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.text, // #001848 from Figma
    lineHeight: Math.round(14 * 1.21), // 1.21 line height ratio from Figma
    letterSpacing: 0.007, // 0.71% letter spacing from Figma
  },

  // Disabled text styles
  textDisabled: {
    color: colors.disabledText,
  },

  // Error message styles (same pattern as other components)
  errorMessage: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.error,
    lineHeight: Math.round(12 * 1.21),
    letterSpacing: 0.008,
  },

  // Bottom sheet styles for contact selection
  bottomSheetHeader: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bottomSheetBackground,
  },

  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  bottomSheetContent: {
    flex: 1,
  },

  // Contact list container to match global bottom sheet pattern
  contactListContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: "hidden",
  },

  // Contact item styles for bottom sheet selection
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm, // 16px padding
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.backgroundSecondary,
    gap: spacing.sm, // 16px gap between profile icon and contact info
  },

  contactItemPressed: {
    backgroundColor: colors.bottomSheetBackground,
  },

  contactItemDisabled: {
    opacity: 0.5,
  },

  // Contact information container
  contactInfo: {
    flex: 1,
    flexDirection: "column",
    gap: 2, // Small gap between name and phone
  },

  contactName: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500", // Slightly bolder for contact names
    color: colors.text,
    lineHeight: Math.round(16 * 1.21),
  },

  contactPhone: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: Math.round(14 * 1.21),
  },

  contactItemDisabledText: {
    color: colors.disabledText,
  },

  // Unassign action item (at top of contact list)
  unassignItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderBottomWidth: 2, // Slightly thicker border to separate from contacts
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    gap: spacing.sm,
  },

  unassignText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
    color: colors.error, // Red color to indicate removal action
  },

  // Selected contact indicator (optional - for current selection highlighting)
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
  disabled: boolean = false,
  loading: boolean = false,
  hasError: boolean = false
) => {
  const baseStyle = [styles.container];

  if (disabled) baseStyle.push(styles.containerDisabled);
  if (loading) baseStyle.push(styles.containerLoading);
  if (hasError) baseStyle.push(styles.containerError);

  return baseStyle;
};
