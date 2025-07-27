import { PressableProps } from "react-native";

// Button variants exactly matching your Figma design system
export type ButtonVariant = "primary" | "secondary" | "text";

// Button sizes for different use cases
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  /**
   * The visual style variant of the button
   * - primary: Blue background with white text (main actions)
   * - secondary: Light gray background with dark text (secondary actions)
   * - text: No background, just text (tertiary actions)
   */
  variant?: ButtonVariant;

  /**
   * The size of the button
   * - small: Compact padding for tight spaces
   * - medium: Standard size for most use cases (default)
   * - large: Prominent size for primary actions
   */
  size?: ButtonSize;

  /**
   * The text content to display in the button
   */
  title?: string;

  /**
   * Optional icon name to display alongside text
   * When provided, icon appears to the right of text
   */
  iconName?: string;

  /**
   * Whether the button is in a loading state
   * Shows a loading spinner and disables interaction
   */
  loading?: boolean;

  /**
   * Content to render inside the button
   * Use this for complex button content or when you need full control
   */
  children?: React.ReactNode;

  /**
   * Accessibility label for screen readers
   * Defaults to title if not provided
   */
  accessibilityLabel?: string;
}

// Style definition interface for button styling
export interface ButtonStyleConfig {
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: "400" | "500" | "600" | "700";
  iconSize: number;
  gap: number;
}
