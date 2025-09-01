import { ViewStyle } from "react-native";
import { MenuSection } from "../MenuBottomSheet/types";

export interface GeneralHeaderProps {
  /** Header title text */
  title: string;
  /** Whether to show the menu button */
  showMenuButton?: boolean;
  /** Menu sections for the context-specific menu */
  menuSections?: MenuSection[];
  /** Callback when a menu option is selected */
  onMenuOptionSelect?: (optionId: string) => void;
  /** Menu bottom sheet title */
  menuTitle?: string;
  /** Custom style override */
  style?: ViewStyle;
  /** Accessibility label for the header */
  accessibilityLabel?: string;
}