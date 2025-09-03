import React from "react";
import { View } from "react-native";
import { TaskListProps } from "./types";
import { styles } from "./styles";
import TaskItem from "../TaskItem";
import { Typography } from "../Typography";

/**
 * TaskList Component
 *
 * A component that displays a list of task items with:
 * - Variable number of task items (1-5)
 * - Empty state handling
 * - Maximum task limit
 *
 * Following atomic design principles:
 * - Uses TaskItem molecules as building blocks
 * - Creates an organism for task collection display
 *
 * Based on Figma Design System:
 * - Consistent spacing between items
 * - Empty state message when no tasks
 * - Proper hierarchy and composition
 *
 * @param tasks - Array of tasks to display
 * @param onTaskPress - Function called when a task is pressed
 * @param maxTasks - Maximum number of tasks to display
 * @param style - Custom container styles
 * @param showEmptyState - Whether to show empty state when no tasks
 * @param emptyStateMessage - Custom empty state message
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  maxTasks = 5,
  style,
  showEmptyState = true,
  emptyStateMessage = "No upcoming tasks",
}) => {
  // Limit tasks to maxTasks
  const limitedTasks = tasks.slice(0, maxTasks);

  // Handle empty state
  if (limitedTasks.length === 0 && showEmptyState) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.emptyContainer}>
          <Typography variant="bodyMedium" style={styles.emptyText}>
            {emptyStateMessage}
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {limitedTasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskPress={onTaskPress ? () => onTaskPress(task.id) : undefined}
          style={index === limitedTasks.length - 1 ? styles.lastItem : undefined}
        />
      ))}
    </View>
  );
};

export default TaskList;
