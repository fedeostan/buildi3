import { ViewStyle } from "react-native";
import { FeatherIconName } from "../Icon/types";
import { ProjectIconType, ProjectIconColor } from "../ProjectItem/types";

/**
 * Project data interface
 */
export interface Project {
  /** Unique identifier for the project */
  id?: string;

  /** The name of the project */
  name: string;

  /**
   * Icon name to display (from Feather icons)
   * @deprecated Use projectIconType and projectIconColor instead for SVG icons
   */
  iconName?: FeatherIconName;

  /** Background color of the icon */
  iconColor?: string;

  /** Project icon type from assets/icons/project_icons/ */
  projectIconType?: ProjectIconType;

  /** Project icon color variant */
  projectIconColor?: ProjectIconColor;

  /** Whether to show progress percentage */
  hasPercentage?: boolean;

  /** Progress percentage (0-100) */
  percentage?: number;
}

/**
 * Props for ProjectList organism component
 */
export interface ProjectListProps {
  /** Array of project data to display */
  projects?: Project[];

  /** Optional style overrides */
  style?: ViewStyle;

  /** Function called when a project item is pressed */
  onProjectPress?: (project: Project) => void;
}
