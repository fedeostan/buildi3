import { ViewStyle } from "react-native";
import { FeatherIconName } from "../Icon/types";

/**
 * Available project icon types from assets/icons/project_icons/
 */
export type ProjectIconType =
  | "Building"
  | "General"
  | "House"
  | "Outdoors"
  | "Project5"
  | "Project6"
  | "Project8";

/**
 * Available project icon color variants
 */
export type ProjectIconColor =
  | "Blue Darker"
  | "Blue Light"
  | "Green Light"
  | "Green Pastel"
  | "Green Pond"
  | "Lime"
  | "Pink Light"
  | "Pink"
  | "Purple";

/**
 * Props for ProjectItem molecule component
 */
export interface ProjectItemProps {
  /** The name of the project to display */
  projectName: string;

  /**
   * The Feather icon name to display
   * @deprecated Use projectIconType and projectIconColor instead for SVG icons
   */
  iconName?: FeatherIconName;

  /** Background color of the icon */
  iconColor?:
    | "primaryLight"
    | "secondaryLight"
    | "success"
    | "warning"
    | "error"
    | string;

  /** Color of the icon itself */
  iconTextColor?: string;

  /** Project icon type from assets/icons/project_icons/ */
  projectIconType?: ProjectIconType;

  /** Project icon color variant */
  projectIconColor?: ProjectIconColor;

  /** Whether to show a percentage indicator */
  hasPercentage?: boolean;

  /** The percentage value to display (0-100) */
  percentage?: number;

  /** Optional style overrides */
  style?: ViewStyle;

  /** Function called when the project item is pressed */
  onPress?: () => void;
}
