import React from "react";
import { Pressable, View } from "react-native";
import { TaskItemProps } from "./types";
import { styles } from "./styles";
import { Typography } from "../Typography";
import Icon from "../Icon";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { getTagVariant } from "../Tag";

/**
 * TaskItem Component - 1:1 Figma Design Implementation
 *
 * A clickable component that displays task information with:
 * - Completion status indicator (left border)
 * - Task title (bodyLarge Typography variant)
 * - Due date (bodyMedium Typography variant with smart formatting)
 * - Navigation chevron (right icon)
 * - Pressable feedback with scale animation
 *
 * Following atomic design principles:
 * - Uses Typography atoms for text content (no hardcoded font styles)
 * - Uses Icon atom for the chevron
 * - Creates a molecule for task representation
 *
 * Enhanced Figma Design System compliance:
 * - Status indicator: 4px width colored border (gray/green for incomplete/complete)
 * - White background (backgroundSecondary token)
 * - 12px border radius
 * - 16px horizontal and vertical padding
 * - Typography variants instead of hardcoded font properties
 * - Consistent color tokens throughout
 *
 * @param task - Task object with id, title, dueDate, isCompleted properties
 * @param onTaskPress - Function called when task is pressed for navigation
 * @param onToggleComplete - Function called when completion status should toggle
 * @param onTaskLongPress - Function called on long press for drag operations
 * @param isDragging - Whether this item is currently being dragged
 * @param showDragHandle - Whether to show drag handle
 * @param style - Custom container styles
 * @param accessibilityLabel - Custom accessibility label
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
    console.error(
      "TaskItem: task prop is undefined. Component will not render."
    );
    return null;
  }

  // Defensive programming: Handle missing required task properties
  if (!task.id || !task.title) {
    console.error(
      "TaskItem: task missing required properties (id, title):",
      task
    );
    return null;
  }
  // Format the due date appropriately
  const formatDueDate = (date: Date | string | null) => {
    if (!date) return "No date";
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
      accessibilityLabel={
        accessibilityLabel ||
        `Task: ${task.title}, due ${formatDueDate(task.dueDate)}`
      }
      accessibilityHint="Double tap to view task details"
    >
      {/* Completion status indicator with Tag variant alpha background */}
      <View
        style={[
          styles.statusIndicator,
          (() => {
            // Only show variant-based color when dueDate exists and task is not completed
            const hasDueDate =
              !!task.dueDate && typeof task.dueDate !== "string";
            if (!task.isCompleted && hasDueDate) {
              const date = task.dueDate as Date;
              const variant = getTagVariant(date);
              if (variant === "yellow") return styles.statusIndicatorYellow;
              if (variant === "red") return styles.statusIndicatorRed;
              return styles.statusIndicatorCompleted; // green alpha
            }
            // Fallback: border color
            return undefined;
          })(),
        ]}
      />

      {/* Task content (title and due date) */}
      <View style={styles.contentContainer}>
        <Typography
          variant="bodyLarge"
          style={[
            styles.taskTitle,
            task.isCompleted && styles.taskTitleCompleted,
          ]}
        >
          {task.title}
        </Typography>
        <View style={styles.dueRow}>
          <Typography variant="bodyMedium" style={styles.dueLabel}>
            Due:
          </Typography>
          <Typography
            variant="bodyMedium"
            style={[
              styles.dueValue,
              task.isCompleted && styles.taskDescriptionCompleted,
            ]}
          >
            {formatDueDate(task.dueDate)}
          </Typography>
        </View>
      </View>

      {/* Chevron icon */}
      <View style={styles.iconContainer}>
        <Icon name="chevron-right" size="lg" color="textSubtitle" />
      </View>
    </Pressable>
  );
};

export default TaskItem;
