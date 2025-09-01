import { ViewStyle } from "react-native";

export interface TaskRowProps {
  /** Unique task identifier */
  id: string;
  /** Task title */
  title: string;
  /** Project name */
  projectName?: string;
  /** Task due date */
  dueDate: Date;
  /** Completion state */
  isCompleted?: boolean;
  /** On press handler */
  onPress?: () => void;
  /** Toggle completion handler */
  onToggleComplete?: (id: string, nextValue: boolean) => void;
  /** Optional accessibility label */
  accessibilityLabel?: string;
  /** Optional container style */
  style?: ViewStyle;
  /** Whether this is the last item (hides divider) */
  isLastItem?: boolean;
}
