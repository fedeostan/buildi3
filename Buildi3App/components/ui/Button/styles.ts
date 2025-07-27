import { ButtonVariant, ButtonSize, ButtonStyleConfig } from "./types";
import { colors } from "../../../theme";

/**
 * Button styles using centralized color system
 *
 * Primary Button: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=24-323
 * Secondary Button: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=79-73
 * Text Button: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=79-92
 */

// Size configurations
const SIZE_CONFIGS: Record<
  ButtonSize,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    paddingHorizontalWithIcon: number;
    fontSize: number;
    iconSize: number;
    gap: number;
    gapWithIcon: number;
  }
> = {
  small: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingHorizontalWithIcon: 16,
    fontSize: 14,
    iconSize: 16,
    gap: 8,
    gapWithIcon: 6,
  },
  medium: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingHorizontalWithIcon: 24,
    fontSize: 15, // Exact from Figma
    iconSize: 18,
    gap: 10, // Exact from Figma
    gapWithIcon: 8, // Exact from Figma
  },
  large: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    paddingHorizontalWithIcon: 28,
    fontSize: 16,
    iconSize: 20,
    gap: 12,
    gapWithIcon: 10,
  },
};

/**
 * Get button style configuration for a specific variant and size
 */
export const getButtonStyle = (
  variant: ButtonVariant,
  size: ButtonSize,
  hasIcon: boolean = false
): ButtonStyleConfig => {
  const sizeConfig = SIZE_CONFIGS[size];

  const baseStyle = {
    borderRadius: 16, // Exact from Figma
    paddingVertical: sizeConfig.paddingVertical,
    paddingHorizontal: hasIcon
      ? sizeConfig.paddingHorizontalWithIcon
      : sizeConfig.paddingHorizontal,
    fontSize: sizeConfig.fontSize,
    fontWeight: "500" as const, // Exact from Figma
    iconSize: sizeConfig.iconSize,
    gap: hasIcon ? sizeConfig.gapWithIcon : sizeConfig.gap,
  };

  switch (variant) {
    case "primary":
      return {
        ...baseStyle,
        backgroundColor: colors.buttonPrimary,
        textColor: colors.buttonPrimaryText,
      };

    case "secondary":
      return {
        ...baseStyle,
        backgroundColor: colors.buttonSecondary,
        textColor: colors.buttonSecondaryText,
      };

    case "text":
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        textColor: colors.buttonText,
      };

    default:
      return {
        ...baseStyle,
        backgroundColor: colors.buttonPrimary,
        textColor: colors.buttonPrimaryText,
      };
  }
};

/**
 * Get press state colors for interactive feedback
 */
export const getPressStateColors = (variant: ButtonVariant) => {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: colors.primaryDark, // Using semantic color
        textColor: colors.buttonPrimaryText,
      };

    case "secondary":
      return {
        backgroundColor: colors.primaryLight, // Using semantic color
        textColor: colors.buttonSecondaryText,
      };

    case "text":
      return {
        backgroundColor: colors.hover, // Using semantic color
        textColor: colors.buttonText,
      };
  }
};

/**
 * Get disabled state colors
 */
export const getDisabledColors = () => ({
  backgroundColor: colors.disabled,
  textColor: colors.disabledText,
});

// Default values
export const DEFAULT_VARIANT: ButtonVariant = "primary";
export const DEFAULT_SIZE: ButtonSize = "medium";
