import { ViewStyle } from "react-native";

/**
 * Props for the TaskItem component
 * A clickable component that displays task information
 */
export interface TaskItemProps {
  /** Unique identifier for the task */
  id: string;

  /** Title/description of the task */
  title: string;

  /** Due date of the task (can be displayed as relative time) */
  dueDate: Date | string;

  /** Status of task (completed, pending, etc.) */
  status?: "completed" | "pending" | "in-progress";

  /** Function called when the task item is pressed */
  onPress?: () => void;

  /** Whether the task item is the last in the list (for styling purposes) */
  isLastItem?: boolean;

  /** Custom styles to apply to the container */
  style?: ViewStyle;
}
