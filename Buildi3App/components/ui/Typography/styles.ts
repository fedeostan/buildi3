import { TypographyVariant, TypographyStyle } from "./types";

/**
 * Typography styles extracted directly from your Figma Design System
 * Source: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=50-72
 *
 * Font families:
 * - Headers: Montserrat (bold, prominent)
 * - Body & Labels: Inter (clean, readable)
 */
export const typographyStyles: Record<TypographyVariant, TypographyStyle> = {
  // HEADERS - Montserrat font family for impact and hierarchy
  h1: {
    fontFamily: "Montserrat_600SemiBold", // Will fallback to system if custom font not loaded
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 28 * 1.219, // 34.132px
    letterSpacing: 28 * 0.00357, // 0.1px
  },
  h2: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 24 * 1.219, // 29.256px
    letterSpacing: 24 * 0.00417, // 0.1px
  },
  h3: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 20 * 1.219, // 24.38px
    letterSpacing: 20 * 0.005, // 0.1px
  },
  h4: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 18 * 1.219, // 21.942px
    letterSpacing: 18 * 0.00556, // 0.1px
  },
  h5: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 16 * 1.219, // 19.504px
    letterSpacing: 16 * 0.00625, // 0.1px
  },
  h6: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 14 * 1.219, // 17.066px
    letterSpacing: 14 * 0.00714, // 0.1px
  },

  // BODY TEXT - Inter font family for readability
  bodyLarge: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16 * 1.21, // 19.36px
    letterSpacing: 16 * 0.00625, // 0.1px
  },
  bodyMedium: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 14 * 1.21, // 16.94px
    letterSpacing: 14 * 0.00714, // 0.1px
  },
  bodySmall: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 12 * 1.21, // 14.52px
    letterSpacing: 12 * 0.00833, // 0.1px
  },

  // LABELS - Inter font family with medium weight for UI elements
  labelLarge: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 15 * 1.21, // 18.15px
    letterSpacing: 15 * 0.00667, // 0.1px
  },
  labelMedium: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 13 * 1.21, // 15.73px
    letterSpacing: 13 * 0.00769, // 0.1px
  },
  labelSmall: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 11 * 1.21, // 13.31px
    letterSpacing: 11 * 0.00909, // 0.1px
  },

  // CODE - Monospace font family for code snippets and technical content
  code: {
    fontFamily: "Courier New", // System monospace fallback
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 12 * 1.4, // 16.8px for better code readability
    letterSpacing: 0,
  },
};

// Default variant for fallback
export const DEFAULT_VARIANT: TypographyVariant = "bodyMedium";
