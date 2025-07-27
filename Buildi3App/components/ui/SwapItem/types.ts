import { ReactNode } from "react";
import { ViewStyle, TextStyle } from "react-native";

/**
 * Props for SwapItem molecule component
 * A flexible content area that can hold different components
 */
export interface SwapItemProps {
  /** Child components to render inside the swap area */
  children?: ReactNode;

  /** Placeholder text when no children are provided */
  placeholderText?: string;

  /** Custom container styles */
  style?: ViewStyle;

  /** Custom placeholder text styles */
  placeholderStyle?: TextStyle;

  /** Minimum height for the content area */
  minHeight?: number;

  /** Whether the content area is empty/placeholder state */
  isEmpty?: boolean;
}
