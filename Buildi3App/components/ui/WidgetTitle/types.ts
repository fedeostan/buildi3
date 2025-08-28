import { TextStyle, ViewStyle } from "react-native";
import { FeatherIconName, IconSize } from "../Icon/types";
import { ColorName } from "../../../theme";

/**
 * Props for WidgetTitle molecule component
 * Combines title text with optional action text/button
 */
export interface WidgetTitleProps {
  /** The main title text */
  title: string;

  /** Optional action text displayed on the right */
  actionText?: string;

  /** Callback when action is pressed */
  onActionPress?: () => void;

  /** Whether to show the action (matches Figma hasAction prop) */
  hasAction?: boolean;

  /** Whether to show icon next to action text */
  showActionIcon?: boolean;

  /** Icon name for the action (Feather icon) */
  actionIconName?: FeatherIconName;

  /** Size of the action icon */
  actionIconSize?: IconSize;

  /** Color of the action icon */
  actionIconColor?: ColorName | string;

  /** Custom styles for the container */
  style?: ViewStyle;

  /** Custom styles for the title text */
  titleStyle?: TextStyle;

  /** Custom styles for the action text */
  actionStyle?: TextStyle;
}
