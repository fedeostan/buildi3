import { ViewStyle } from "react-native";
import { FeatherIconName } from "../Icon/types";
import { ProjectIconType, ProjectIconColor } from "../ProjectItem/types";
import type { Project } from "../../../lib/supabase/types";

// Re-export unified Project type for backward compatibility
export type { Project };

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
