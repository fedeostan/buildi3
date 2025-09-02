import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { TaskSectionProps } from "./types";
import { Typography, DraggableTaskRow, Icon, useDragContext } from "../";
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
 * - Drag and drop support with gesture-handler
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
  onDragStart,
  onDragEnd,
  onTaskDrop,
  style,
}) => {
  const { dragState, onTaskDrop: contextOnTaskDrop } = useDragContext();
  const sectionRef = React.useRef<View>(null); // This will now ref the entire section container
  const [sectionLayout, setSectionLayout] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = React.useState(false);

  // Measure section layout when expanded state changes
  React.useEffect(() => {
    if (isExpanded && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.measureInWindow((x, y, width, height) => {
          setSectionLayout({ x, y, width, height });
        });
      }, 100); // Small delay to ensure layout is complete
    }
  }, [isExpanded, tasks.length]);

  // Check if drag position is over this section (with generous padding for easier targeting)
  React.useEffect(() => {
    if (dragState.isDragging && dragState.dragPosition && sectionLayout && isExpanded) {
      const { x: dragX, y: dragY } = dragState.dragPosition;
      const { x: sectionX, y: sectionY, width, height } = sectionLayout;
      
      // Add generous padding to make drop zones easier to hit
      const padding = 20;
      const isOverSection = 
        dragX >= sectionX - padding && 
        dragX <= sectionX + width + padding &&
        dragY >= sectionY - padding && 
        dragY <= sectionY + height + padding;
      
      setIsDropZoneActive(isOverSection);
    } else {
      setIsDropZoneActive(false);
    }
  }, [dragState.dragPosition, sectionLayout, dragState.isDragging, isExpanded]);

  // Store reference to last active drop zone
  const wasDropZoneActive = React.useRef(false);
  
  // Track when this section becomes the active drop zone
  React.useEffect(() => {
    wasDropZoneActive.current = isDropZoneActive;
  }, [isDropZoneActive]);

  // Handle drop when drag ends and this was the active drop zone
  React.useEffect(() => {
    if (!dragState.isDragging && wasDropZoneActive.current && dragState.draggedTask) {
      const draggedTask = dragState.draggedTask;
      
      if (draggedTask.stage !== stage) {
        console.log(`✅ Moving "${draggedTask.title}" to ${title}`);
        contextOnTaskDrop?.(draggedTask, stage);
        onTaskDrop?.(draggedTask, stage);
      }
      wasDropZoneActive.current = false;
      setIsDropZoneActive(false);
    }
  }, [dragState.isDragging, dragState.draggedTask, stage, title, contextOnTaskDrop, onTaskDrop]);
  return (
    <View 
      ref={sectionRef}
      style={[
        styles.container, 
        style,
        isDropZoneActive && styles.activeDropZone,
      ]}
    >
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
            <DraggableTaskRow
              key={task.id}
              {...task}
              isLastItem={index === tasks.length - 1}
              onPress={() => onTaskPress(task)}
              onStageChange={onTaskStageChange}
              onToggleComplete={onTaskToggleComplete ? (id, completed) => 
                onTaskToggleComplete(id, completed) : undefined
              }
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
          {tasks.length === 0 && (
            <View style={styles.emptyState}>
              <Typography variant="bodyMedium" style={styles.emptyText}>
                {isDropZoneActive ? "Drop task here" : "No tasks in this stage"}
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
    minHeight: 60, // Minimum height for drop zone when empty
  },
  activeDropZone: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: "dashed",
    // Remove padding from here since it's now applied to entire container
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