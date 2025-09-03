import { ColorName } from "../../../theme";
import type { ComponentProps } from "react";
import { Feather } from "@expo/vector-icons";

// Available icon sizes - following design system principles
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// Feather icon names (most commonly used ones)
// You can extend this list as needed
export type FeatherIconName = ComponentProps<typeof Feather>["name"];

export interface IconProps {
  /** The Feather icon name to display */
  name: FeatherIconName;
  /** Size of the icon - uses design system sizes */
  size?: IconSize;
  /** Color from theme system or custom hex */
  color?: ColorName | string;
  /** Optional custom size in pixels (overrides size prop) */
  customSize?: number;
  /** Optional onPress handler to make icon pressable */
  onPress?: () => void;
  /** Optional style override */
  style?: any;
  /** Accessibility label */
  accessibilityLabel?: string;
}
