import { ColorName } from "../../../theme";

// Available icon sizes - following design system principles
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// Feather icon names (most commonly used ones)
// You can extend this list as needed
export type FeatherIconName =
  | "activity"
  | "alert-circle"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down"
  | "bell"
  | "bookmark"
  | "calendar"
  | "camera"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "clock"
  | "copy"
  | "download"
  | "edit"
  | "eye"
  | "eye-off"
  | "heart"
  | "home"
  | "info"
  | "mail"
  | "menu"
  | "more-horizontal"
  | "more-vertical"
  | "phone"
  | "plus"
  | "search"
  | "settings"
  | "share"
  | "shopping-bag"
  | "shopping-cart"
  | "star"
  | "trash"
  | "user"
  | "users"
  | "x"
  | "check-circle"
  | "alert-triangle"
  | "help-circle"
  | "lock"
  | "unlock"
  | "upload";

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
