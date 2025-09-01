import { ViewStyle } from "react-native";
import { FeatherIconName } from "../Icon/types";

export interface MenuOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Optional icon name from Feather icons */
  icon?: FeatherIconName;
  /** Whether this option is destructive (red text) */
  destructive?: boolean;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface MenuSection {
  /** Optional section title */
  title?: string;
  /** Array of menu options in this section */
  options: MenuOption[];
}

export interface MenuBottomSheetProps {
  /** Whether the bottom sheet is visible */
  isVisible: boolean;
  /** Array of menu sections to display */
  sections: MenuSection[];
  /** Callback when an option is selected */
  onOptionSelect: (option: MenuOption) => void;
  /** Callback when bottom sheet is dismissed */
  onDismiss: () => void;
  /** Bottom sheet title */
  title?: string;
  /** Custom style for the bottom sheet */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}