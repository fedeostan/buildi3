/**
 * Centralized Color System for Buildi3 App
 *
 * Based on Figma Design System: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=4-71
 *
 * Philosophy:
 * - Semantic naming over value-based naming
 * - Add colors as needed, don't create all upfront
 * - Single source of truth for all colors
 * - Easy theme switching (light/dark mode)
 */

// =============================================================================
// BASE COLOR PALETTE (Raw Values from Figma)
// =============================================================================

// Primary Blue Scale (from Figma - add more shades as needed)
const PRIMARY_BLUE = {
  50: "#E8EBF2", // Primary Blue 1
  100: "#D5DAE8", // Primary Blue 2
  200: "#C0C7DD", // Primary Blue 3
  300: "#A6B2CF", // Primary Blue 4
  400: "#8C9CC0", // Primary Blue 5
  500: "#7287B1", // Primary Blue 6 - Main brand color
  600: "#5972A2", // Primary Blue 7
  700: "#405C93", // Primary Blue 8
  800: "#274782", // Primary Blue 9
  900: "#001848", // Primary Blue 10 - Darkest
} as const;

// Secondary Blue Scale (add as needed)
const SECONDARY_BLUE = {
  100: "#F2F3F7", // Secondary Blue 1 - Widget content area
  200: "#E2E5EF", // Secondary Blue 2
  300: "#CDD4E3", // Secondary Blue 3 - Used in buttons
  400: "#B9C4D8", // Secondary Blue 4
  500: "#A6B4CD", // Secondary Blue 5
  600: "#495D92", // Secondary Blue 10 - Used in buttons
} as const;

// Action Colors (from Figma)
const ACTION = {
  text: "#5A70A1", // Action text color from Figma
} as const;

// Gray Scale (essential for UI)
const GRAY = {
  0: "#FFFFFF", // White
  50: "#F5F6FA", // Gray 2
  100: "#EDEEF2", // Gray 3
  200: "#E1E2E5", // Gray 4
  300: "#D9DADE", // Gray 5
  400: "#C8C9CC", // Gray 7
  500: "#969799", // Gray 11
  600: "#707173", // Gray 14
  700: "#4B4B4D", // Gray 16
  900: "#000000", // Black (for text)
} as const;

// Status Colors (essential for feedback)
const STATUS = {
  success: "#4CAF50", // Success green
  warning: "#FFC107", // Warning yellow
  error: "#F44336", // Error red
} as const;

// Design System Reds (from Figma)
const RED = {
  10: "#f44336",
  14: "#731E17",
} as const;
const RED_ALPHA = {
  10: "#f443361a", // 10% alpha of #F44336
} as const;

// Design System Yellows (from Figma)
const YELLOW = {
  10: "#ffc107",
  14: "#543F02",
} as const;
const YELLOW_ALPHA = {
  10: "#ffc1071a", // 10% alpha of #FFC107
} as const;

// Design System Greens (from Figma)
const GREEN = {
  10: "#4caf50",
  14: "#204E22",
} as const;
const GREEN_ALPHA = {
  10: "#4caf501a", // 10% alpha of #4CAF50
} as const;

// Input Colors (from Figma Input Field design)
const INPUT = {
  focusBackground: "#E8EBF2", // Input focus background from Figma
  cursor: "#FF8B7B", // Input cursor color from Figma
} as const;

// =============================================================================
// SEMANTIC COLOR TOKENS (This is what you use in components)
// =============================================================================

export const colors = {
  // Brand Colors
  primary: PRIMARY_BLUE[500], // Main brand color
  primaryLight: PRIMARY_BLUE[300], // Hover states, backgrounds
  primaryDark: PRIMARY_BLUE[700], // Active states, emphasis

  // Background Colors
  background: SECONDARY_BLUE[100], // Main app background - #F2F3F7 from Figma
  backgroundSecondary: GRAY[0], // Card backgrounds, secondary areas (now white)
  backgroundTertiary: GRAY[50], // Subtle background areas

  // Text Colors
  text: PRIMARY_BLUE[900], // Primary text color
  textSecondary: GRAY[600], // Secondary text, descriptions (#707173)
  textSubtitle: "#646466", // Subtitle text from Figma (specific gray)
  textTertiary: GRAY[500], // Placeholder, helper text
  textInverse: GRAY[0], // Text on dark backgrounds
  // Additional semantic text color for “Gray 16” request
  textGray16: GRAY[700],

  // Button Colors (matching your Figma buttons)
  buttonPrimary: PRIMARY_BLUE[600], // #495D92 from Figma
  buttonPrimaryText: GRAY[50], // #F5F6FA from Figma
  buttonSecondary: SECONDARY_BLUE[300], // #CDD4E3 from Figma
  buttonSecondaryText: PRIMARY_BLUE[900], // #001848 from Figma
  buttonText: PRIMARY_BLUE[900], // Text buttons

  // Border Colors
  border: GRAY[200], // Default borders - #EDEEF2 matches Figma
  borderLight: GRAY[100], // Subtle borders
  borderDark: GRAY[400], // Prominent borders

  // Widget Colors (from Figma)
  widgetBackground: GRAY[0], // Widget main background - white
  widgetContentArea: SECONDARY_BLUE[100], // Widget content area - #F2F3F7
  actionText: ACTION.text, // Action button text - #5A70A1

  // Bottom Sheet & Segmented Control Colors (from Figma)
  segmentedControlBackground: GRAY[0], // White background for segmented control
  segmentedControlSelectedBackground: "#C0C7DD", // Selected tab background from Figma
  segmentedControlSelectedText: PRIMARY_BLUE[900], // Selected tab text (#001848)
  segmentedControlUnselectedText: "#646466", // Unselected tab text from Figma
  bottomSheetBackground: SECONDARY_BLUE[100], // Bottom sheet background (#F2F3F7)

  // Tab Navigation Colors (from Figma NavBar design)
  tabBarBackground: GRAY[0], // Widget/Background from Figma - white
  tabBarBorder: GRAY[100], // Widget/Border from Figma - #EDEEF2
  tabBarActiveText: PRIMARY_BLUE[900], // Icon/Default from Figma - #001848
  tabBarInactiveText: "#646466", // Icon/Dimmed from Figma - specific gray

  // Tag Colors (aligned with Figma variables)
  // Backgrounds use 10% alpha of base colors; text uses deep shade tokens
  tagRedBackground: RED_ALPHA[10], // Colors/Red/Alpha/10/10
  tagRedText: RED[14], // Colors/Red/14
  tagYellowBackground: YELLOW_ALPHA[10], // Colors/Yellow/Alpha/10/10
  tagYellowText: YELLOW[14], // Colors/Yellow/14
  tagGreenBackground: GREEN_ALPHA[10], // Colors/Green/Alpha/10/10
  tagGreenText: GREEN[14], // Colors/Green/14
  // Neutral tag (Not started) — use DS gray tokens
  tagNeutralBackground: GRAY[50],
  tagNeutralText: GRAY[600],

  // Expose base DS colors for reuse
  red10: STATUS.error, // #F44336
  red14: RED[14],
  redAlpha10: RED_ALPHA[10],
  yellow10: STATUS.warning, // #FFC107
  yellow14: YELLOW[14],
  yellowAlpha10: YELLOW_ALPHA[10],
  green10: STATUS.success, // #4CAF50
  green14: GREEN[14],
  greenAlpha10: GREEN_ALPHA[10],

  // Status Colors
  success: STATUS.success,
  warning: STATUS.warning,
  error: STATUS.error,

  // Input Colors (from Figma design)
  inputBackground: GRAY[0], // Default input background (white)
  inputFocusBackground: INPUT.focusBackground, // Focus background (#E8EBF2)
  inputCursor: INPUT.cursor, // Cursor color (#FF8B7B)
  inputLabel: GRAY[600], // Label text color (#707173)
  inputText: PRIMARY_BLUE[900], // Input text color (#001848)

  // Interactive States
  hover: "rgba(114, 135, 177, 0.1)", // Light primary overlay
  pressed: "rgba(114, 135, 177, 0.2)", // Darker primary overlay
  disabled: GRAY[300],
  disabledText: GRAY[500],
} as const;

// =============================================================================
// DARK MODE COLORS (Add when you need dark mode)
// =============================================================================

export const darkColors = {
  // Will add these when implementing dark mode
  // For now, we'll use the same colors
  ...colors,

  // Override specific colors for dark mode
  background: "#121212",
  backgroundSecondary: "#1E1E1E",
  text: GRAY[0],
  textSecondary: GRAY[300],
  // ... add more as needed
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Add opacity to any color
 * @param color - Hex color string
 * @param opacity - Opacity value between 0 and 1
 */
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace("#", "");
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${hex}${alpha}`;
};

/**
 * Get color with transparency for overlays
 */
export const overlayColors = {
  light: withOpacity(colors.background, 0.8),
  dark: withOpacity("#000000", 0.5),
  primary: withOpacity(colors.primary, 0.9),
} as const;

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// ✅ GOOD: Use semantic names
<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Welcome!</Text>
  <Button backgroundColor={colors.buttonPrimary} />
</View>

// ❌ BAD: Don't use raw values
<View style={{ backgroundColor: '#FFFFFF' }}>
  <Text style={{ color: '#001848' }}>Welcome!</Text>
</View>

// ✅ GOOD: Add new colors as you need them
// When you need a new shade, add it to the appropriate scale:
// const TERTIARY = {
//   300: '#FFDDD9', // New color from Figma
// } as const;
// 
// Then add semantic reference:
// export const colors = {
//   ...colors,
//   accent: TERTIARY[300], // Now you can use colors.accent
// }
*/

// Export types for TypeScript
export type ColorName = keyof typeof colors;
export type Color = (typeof colors)[ColorName];
