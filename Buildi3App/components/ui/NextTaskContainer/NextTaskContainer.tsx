import React from "react";
import { View } from "react-native";
import { NextTaskContainerProps } from "./types";
import { styles } from "./styles";
import { Typography } from "../Typography";

/**
 * NextTaskContainer Molecule Component
 *
 * A reusable container that displays task information with two states:
 * - hasTask=true: Shows project name and task title in left-aligned layout
 * - hasTask=false: Shows "No upcoming tasks! 🥳" centered message
 *
 * Following atomic design principles:
 * - Uses Typography atoms for text display
 * - Follows Figma design system colors and spacing exactly
 * - Reusable across different contexts (widget content, modals, etc.)
 *
 * Based on Figma Design System:
 * - Background: #F2F3F7 (colors.widgetContentArea)
 * - Project name: Inter 400, 14px, #646466 (bodyMedium + textSubtitle)
 * - Task title: Inter 400, 16px, #001848 (bodyLarge + text)
 * - No tasks: Inter 400, 16px, #001848, centered (bodyLarge + text)
 * - 16px padding, 16px border radius, 8px gap
 *
 * @param hasTask - Whether there is a task to display
 * @param task - Task data (required when hasTask=true)
 * @param style - Custom container styles
 * @param minHeight - Custom minimum height for the container
 */
export const NextTaskContainer: React.FC<NextTaskContainerProps> = ({
  hasTask,
  task,
  style,
  minHeight,
}) => {
  const containerStyle = [
    styles.container,
    minHeight ? { minHeight } : undefined,
    style,
  ];

  if (hasTask && task) {
    // hasTask=true state: Show project name and task title
    return (
      <View style={containerStyle}>
        <View style={styles.taskContent}>
          {/* Project Name - Inter 400, 14px, #646466 */}
          <Typography variant="bodyMedium" style={styles.projectName}>
            {task.projectName}
          </Typography>

          {/* Task Title - Inter 400, 16px, #001848 */}
          <Typography variant="bodyLarge" style={styles.taskTitle}>
            {task.taskTitle}
          </Typography>
        </View>
      </View>
    );
  }

  // hasTask=false state: Show "No upcoming tasks! 🥳" centered
  return (
    <View style={containerStyle}>
      <View style={styles.noTaskContent}>
        {/* No Tasks Message - Inter 400, 16px, #001848, centered */}
        <Typography variant="bodyLarge" style={styles.noTaskMessage}>
          No upcoming tasks! 🥳
        </Typography>
      </View>
    </View>
  );
};

export default NextTaskContainer;
