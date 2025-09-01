import { ViewStyle } from "react-native";

export interface Task {
  /** Unique task identifier */
  id: string;
  /** Task title */
  title: string;
  /** Task description or subtitle */
  description?: string;
  /** Task due date */
  dueDate: Date;
  /** Whether task is completed */
  isCompleted: boolean;
  /** Task priority level */
  priority?: "low" | "medium" | "high";
  /** Project or category ID */
  projectId?: string;
  /** Tags or labels */
  tags?: string[];
}

export interface TaskItemProps {
  /** Task data */
  task: Task;
  /** Callback when task completion status is toggled */
  onToggleComplete?: (taskId: string) => void;
  /** Callback when task is pressed (for navigation) */
  onTaskPress?: (task: Task) => void;
  /** Callback when task is long pressed (for drag & drop) */
  onTaskLongPress?: (task: Task) => void;
  /** Whether the task item is currently being dragged */
  isDragging?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Whether to show the drag handle */
  showDragHandle?: boolean;
  /** Accessibility label override */
  accessibilityLabel?: string;
}
