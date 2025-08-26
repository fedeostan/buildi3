import { ViewStyle } from "react-native";

/**
 * Task data structure for next task display
 */
export interface Task {
  /** Name of the project this task belongs to */
  projectName: string;
  /** Title/name of the task */
  taskTitle: string;
  /** Unique identifier for the task */
  id: string;
  /** Optional due date for the task */
  dueDate?: Date;
}

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
  task?: Task;
  /** Custom container styles */
  style?: ViewStyle;
  /** Custom minimum height for the container */
  minHeight?: number;
}
