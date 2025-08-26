import { ViewStyle } from "react-native";
import { Project } from "../ProjectList/types";

/**
 * Props for ProjectWidget organism component
 */
export interface ProjectWidgetProps {
  /** Array of project data to display */
  projects?: Project[];

  /** Function called when add project button is pressed */
  onAddProject?: () => void;

  /** Function called when "See more" action is pressed */
  onViewAllProjects?: () => void;

  /** Function called when a project item is pressed */
  onProjectPress?: (project: Project) => void;

  /** Optional style overrides for the widget */
  style?: ViewStyle;
}
