import React from "react";
import { Pressable, View } from "react-native";
import { TaskItemProps } from "./types";
import { styles } from "./styles";
import { Typography } from "../Typography";
import Icon from "../Icon";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

/**
 * TaskItem Component
 *
 * A clickable component that displays task information with:
 * - Task title
 * - Due date (formatted appropriately)
 * - Visual indicator (chevron-right icon)
 * - Pressable feedback
 *
 * Following atomic design principles:
 * - Uses Typography atoms for text content
 * - Uses Icon atom for the chevron
 * - Creates a molecule for task representation
 *
 * Based on Figma Design System:
 * - Light gray background (#F2F3F7)
 * - 12px border radius
 * - 8px vertical padding
 * - 16px horizontal padding
 * - Consistent typography
 *
 * @param id - Unique identifier for the task
 * @param title - Title/description of the task
 * @param dueDate - Due date of the task
 * @param status - Status of the task (completed, pending, etc.)
 * @param onPress - Function called when pressed
 * @param isLastItem - Whether this is the last item in a list
 * @param style - Custom container styles
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onTaskPress,
  onTaskLongPress,
  isDragging,
  style,
  showDragHandle,
  accessibilityLabel,
}) => {
  // Defensive programming: Handle undefined task
  if (!task) {
    console.error('TaskItem: task prop is undefined. Component will not render.');
    return null;
  }

  // Defensive programming: Handle missing required task properties
  if (!task.id || !task.title) {
    console.error('TaskItem: task missing required properties (id, title):', task);
    return null;
  }
  // Format the due date appropriately
  const formatDueDate = (date: Date | string | null) => {
    if (!date) return 'No date';
    if (typeof date === "string") {
      return date;
    }

    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  // Render the task item
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
        style,
      ]}
      onPress={() => onTaskPress?.(task)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `Task: ${task.title}, due ${formatDueDate(task.dueDate)}`}
      accessibilityHint="Double tap to view task details"
    >
      {/* Task content (title and due date) */}
      <View style={styles.contentContainer}>
        <Typography variant="bodyMedium" style={[styles.taskTitle, task.isCompleted && styles.taskTitleCompleted]}>
          {task.title}
        </Typography>
        <Typography variant="labelSmall" style={styles.taskDescription}>
          {formatDueDate(task.dueDate)}
        </Typography>
      </View>

      {/* Chevron icon */}
      <View style={styles.iconContainer}>
        <Icon name="chevron-right" size="sm" color="actionText" />
      </View>
    </Pressable>
  );
};

export default TaskItem;
