import { ViewStyle } from "react-native";
import type { Task, TaskPriority } from "../../../lib/supabase/types";

// Re-export unified Task type for backward compatibility
export type { Task, TaskPriority };

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
