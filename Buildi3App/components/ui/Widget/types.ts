import { ReactNode } from "react";
import { ViewStyle } from "react-native";
import { WidgetTitleProps } from "../WidgetTitle/types";
import { SwapItemProps } from "../SwapItem/types";

/**
 * Props for Widget organism component
 * Main container that combines multiple molecules into a cohesive widget
 */
export interface WidgetProps {
  /** Widget title text */
  title: string;

  /** Optional action text for the title */
  actionText?: string;

  /** Callback when title action is pressed */
  onActionPress?: () => void;

  /** Whether to show the title action */
  hasAction?: boolean;

  /** Content to display in the swap area */
  children?: ReactNode;

  /** Placeholder text for empty swap area */
  placeholderText?: string;

  /** Button text at the bottom */
  buttonText?: string;

  /** Callback when button is pressed */
  onButtonPress?: () => void;

  /** Whether to show the button */
  showButton?: boolean;

  /** Button variant (matches existing Button component) */
  buttonVariant?: "primary" | "secondary" | "text";

  /** Custom container styles */
  style?: ViewStyle;

  /** Custom title props override */
  titleProps?: Partial<WidgetTitleProps>;

  /** Custom swap item props override */
  swapItemProps?: Partial<SwapItemProps>;

  /** Minimum height for the swap area */
  swapItemMinHeight?: number;
}
