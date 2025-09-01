/**
 * Spacing System for Buildi3 App
 *
 * Based on 8px baseline grid system following atomic design principles
 * Provides consistent spacing throughout the app
 */

// =============================================================================
// BASE SPACING SCALE (8px grid system)
// =============================================================================

const BASE_UNIT = 8;

const SPACING_SCALE = {
  0: 0,
  1: BASE_UNIT * 1, // 8px
  2: BASE_UNIT * 2, // 16px
  3: BASE_UNIT * 3, // 24px
  4: BASE_UNIT * 4, // 32px
  5: BASE_UNIT * 5, // 40px
  6: BASE_UNIT * 6, // 48px
  8: BASE_UNIT * 8, // 64px
  10: BASE_UNIT * 10, // 80px
  12: BASE_UNIT * 12, // 96px
  16: BASE_UNIT * 16, // 128px
  20: BASE_UNIT * 20, // 160px
} as const;

// =============================================================================
// SEMANTIC SPACING TOKENS
// =============================================================================

export const spacing = {
  // Atoms - smallest spacing units
  none: SPACING_SCALE[0],
  xs: SPACING_SCALE[1], // 8px - minimal spacing
  sm: SPACING_SCALE[2], // 16px - small spacing

  // Molecules - medium spacing for components
  md: SPACING_SCALE[3], // 24px - standard component spacing
  lg: SPACING_SCALE[4], // 32px - large component spacing
  xl: SPACING_SCALE[5], // 40px - extra large spacing

  // Organisms - larger spacing for sections
  xxl: SPACING_SCALE[6], // 48px - section spacing
  xxxl: SPACING_SCALE[8], // 64px - major section spacing

  // Layout spacing
  layout: SPACING_SCALE[10], // 80px - layout-level spacing
} as const;

// Component-specific spacing based on Figma design system
export const componentSpacing = {
  // Dashboard Header spacing (from Figma)
  dashboardHeader: {
    padding: spacing.sm, // 16px horizontal padding
    gap: spacing.sm, // 16px gap between elements (adjusted from 12px in Figma)
    verticalPadding: spacing.sm, // 16px vertical padding
  },

  // Profile Icon spacing
  profileIcon: {
    gap: spacing.xs, // 8px gap for notification badge
  },

  // Notification Icon spacing
  notificationIcon: {
    padding: spacing.sm, // 12px internal padding (close to Figma)
    badgeOffset: spacing.xs, // 8px offset for badge positioning
  },

  // Widget spacing (existing)
  widget: {
    padding: spacing.sm, // 16px internal padding
    gap: spacing.sm, // 16px between elements
    marginBottom: spacing.md, // 24px bottom margin
  },

  // Tab Bar spacing (from Figma NavBar design)
  tabBar: {
    paddingTop: spacing.xs + 4, // 12px from Figma (Spacing/ssm)
    paddingBottom: spacing.lg, // 32px from Figma (Spacing/xl)
    height: 90, // Total height to accommodate content and padding
    iconSize: 24, // Consistent 24px icons from Figma
    gap: spacing.xs / 4, // 2px gap between icon and label
  },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get spacing value by key
 * @param key - Spacing key
 * @returns number value for React Native styles
 */
export const getSpacing = (key: keyof typeof spacing): number => {
  return spacing[key];
};

/**
 * Create padding object for React Native styles
 */
export const createPadding = {
  all: (value: keyof typeof spacing) => ({
    padding: spacing[value],
  }),
  horizontal: (value: keyof typeof spacing) => ({
    paddingHorizontal: spacing[value],
  }),
  vertical: (value: keyof typeof spacing) => ({
    paddingVertical: spacing[value],
  }),
  top: (value: keyof typeof spacing) => ({
    paddingTop: spacing[value],
  }),
  bottom: (value: keyof typeof spacing) => ({
    paddingBottom: spacing[value],
  }),
  left: (value: keyof typeof spacing) => ({
    paddingLeft: spacing[value],
  }),
  right: (value: keyof typeof spacing) => ({
    paddingRight: spacing[value],
  }),
};

/**
 * Create margin object for React Native styles
 */
export const createMargin = {
  all: (value: keyof typeof spacing) => ({
    margin: spacing[value],
  }),
  horizontal: (value: keyof typeof spacing) => ({
    marginHorizontal: spacing[value],
  }),
  vertical: (value: keyof typeof spacing) => ({
    marginVertical: spacing[value],
  }),
  top: (value: keyof typeof spacing) => ({
    marginTop: spacing[value],
  }),
  bottom: (value: keyof typeof spacing) => ({
    marginBottom: spacing[value],
  }),
  left: (value: keyof typeof spacing) => ({
    marginLeft: spacing[value],
  }),
  right: (value: keyof typeof spacing) => ({
    marginRight: spacing[value],
  }),
};

// Export types for TypeScript
export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];
