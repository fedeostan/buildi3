import { ViewStyle } from "react-native";
import { TaskItemProps } from "../TaskItem";

/**
 * Type for an individual task
 */
export type Task = Omit<TaskItemProps, "isLastItem" | "style">;

/**
 * Props for the TaskList component
 * A list of task items
 */
export interface TaskListProps {
  /** Array of tasks to display */
  tasks: Task[];

  /** Function called when a task item is pressed */
  onTaskPress?: (taskId: string) => void;

  /** Maximum number of tasks to display */
  maxTasks?: number;

  /** Custom styles to apply to the container */
  style?: ViewStyle;

  /** Show empty state when no tasks available */
  showEmptyState?: boolean;

  /** Custom empty state message */
  emptyStateMessage?: string;
}
