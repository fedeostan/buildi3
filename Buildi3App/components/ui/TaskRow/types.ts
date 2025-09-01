import { ViewStyle } from "react-native";

/** Task stages matching Figma design */
export type TaskStage = "not-started" | "in-progress" | "completed" | "blocked";

export interface TaskRowProps {
  /** Unique task identifier */
  id: string;
  /** Task title */
  title: string;
  /** Project name */
  projectName?: string;
  /** Task due date */
  dueDate: Date;
  /** Task stage/status */
  stage?: TaskStage;
  /** Completion state (derived from stage but kept for backward compatibility) */
  isCompleted?: boolean;
  /** On press handler */
  onPress?: () => void;
  /** Toggle completion handler */
  onToggleComplete?: (id: string, nextValue: boolean) => void;
  /** Stage change handler */
  onStageChange?: (id: string, stage: TaskStage) => void;
  /** Optional accessibility label */
  accessibilityLabel?: string;
  /** Optional container style */
  style?: ViewStyle;
  /** Whether this is the last item (hides divider) */
  isLastItem?: boolean;
}
