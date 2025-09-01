import { ViewStyle } from "react-native";

export interface MenuButtonProps {
  /** Callback when menu button is pressed */
  onPress?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Custom style override */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}