import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { TaskSectionProps } from "./types";
import { Typography, TaskRow, Icon } from "../";
import { colors, spacing } from "../../../theme";

/**
 * TaskSection Component
 * 
 * Collapsible section for organizing tasks by stage
 * Matches Figma design exactly with proper styling and interactions
 * 
 * Features:
 * - Collapsible/expandable with chevron icon
 * - Stage-based task organization
 * - Uses design system tokens exclusively
 * - Supports task interactions
 */
const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  stage,
  tasks,
  isExpanded,
  onToggleExpanded,
  onTaskPress,
  onTaskStageChange,
  onTaskToggleComplete,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Section Header - Collapsible */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => onToggleExpanded(stage)}
        accessibilityRole="button"
        accessibilityLabel={`${title} section, ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        <Typography variant="h5" style={styles.title}>
          {title}
        </Typography>
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size="md"
          color="text"
        />
      </TouchableOpacity>

      {/* Task List - Conditionally Rendered */}
      {isExpanded && (
        <View style={styles.taskList}>
          {tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              {...task}
              isLastItem={index === tasks.length - 1}
              onPress={() => onTaskPress(task)}
              onStageChange={onTaskStageChange}
              onToggleComplete={onTaskToggleComplete ? (id, completed) => 
                onTaskToggleComplete(id, completed) : undefined
              }
            />
          ))}
          {tasks.length === 0 && (
            <View style={styles.emptyState}>
              <Typography variant="bodyMedium" style={styles.emptyText}>
                No tasks in this stage
              </Typography>
            </View>
          )}
        </View>
      )}
      
      {/* Thick border at bottom of entire stage group */}
      <View style={styles.stageBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md, // Increased padding for better text spacing
    backgroundColor: colors.background,
    minHeight: 48, // Ensure minimum height for text
  },
  title: {
    fontWeight: "600",
    color: colors.text,
    // Remove fontSize - let Typography component handle it with proper lineHeight
  },
  taskList: {
    // No background or padding - TaskRows handle their own styling
  },
  stageBorder: {
    height: 4,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  emptyState: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: "italic",
  },
});

export default TaskSection;