import { ViewStyle } from "react-native";
import type { Task } from "../../../lib/supabase/types";

/**
 * Task data structure for next task display
 * Extends the unified Task interface with display-specific properties
 */
export interface NextTask extends Pick<Task, 'id' | 'title' | 'dueDate'> {
  /** Name of the project this task belongs to */
  projectName: string;
  /** Task title (inherited from Task.title) */
  taskTitle?: string;
}

// Re-export Task for backward compatibility
export type { Task };

/**
 * Props for NextTaskContainer molecule component
 *
 * This component displays either:
 * - hasTask=true: Shows the next task with project name and task title
 * - hasTask=false: Shows "No upcoming tasks! 🥳" message
 */
export interface NextTaskContainerProps {
  /** Whether there is a task to display */
  hasTask: boolean;
  /** Task data to display (required when hasTask=true) */
  task?: NextTask;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom minimum height for the container */
  minHeight?: number;
}
