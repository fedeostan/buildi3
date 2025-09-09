import React from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing } from "../../theme";
import {
  GeneralHeader,
  MenuSection,
  TaskSection,
  TaskDragPayload,
  DragProvider,
  Typography,
} from "../../components/ui";
import type { TaskStage } from "../../lib/supabase/types";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/useAuth";

/**
 * Tasks Screen - Task management and tracking
 *
 * This screen allows users to manage their tasks,
 * view task lists, and track progress
 */
export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  // Use real tasks data from the backend
  const {
    tasks,
    loading,
    error,
    updateTaskStage,
    getTasksByStage,
    refreshTasks,
    refreshTasksSoft,
  } = useTasks({
    includeCompleted: true,
    orderBy: "due_date",
    orderDirection: "asc",
  });

  // Section expansion state
  const [expandedSections, setExpandedSections] = React.useState<
    Record<TaskStage, boolean>
  >({
    "not-started": true,
    "in-progress": true,
    completed: false,
    blocked: false,
  });

  // Context-specific menu options for Tasks screen
  const tasksMenuSections: MenuSection[] = [
    {
      title: "Task Actions",
      options: [
        { id: "add-task", label: "Add New Task", icon: "plus" },
        { id: "filter-tasks", label: "Filter Tasks", icon: "filter" },
        { id: "sort-tasks", label: "Sort Tasks", icon: "arrow-up" },
      ],
    },
    {
      title: "View Options",
      options: [
        { id: "list-view", label: "List View", icon: "list" },
        { id: "calendar-view", label: "Calendar View", icon: "calendar" },
      ],
    },
    {
      options: [
        { id: "task-settings", label: "Task Settings", icon: "settings" },
      ],
    },
  ];

  // Handle menu option selection
  const handleMenuOptionSelect = (optionId: string) => {
    console.log("Tasks menu option selected:", optionId);
    // TODO: Implement specific actions for each menu option
    switch (optionId) {
      case "add-task":
        // Navigate to add task or show modal
        break;
      case "filter-tasks":
        // Show filter options
        break;
      case "sort-tasks":
        // Show sort options
        break;
      case "list-view":
        // Switch to list view
        break;
      case "calendar-view":
        // Switch to calendar view
        break;
      case "task-settings":
        // Navigate to task settings
        break;
    }
  };

  // Handle section toggle
  const handleToggleSection = (stage: TaskStage) => {
    setExpandedSections((prev) => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  };

  // Refresh tasks whenever this screen gains focus (returning from detail)
  // Avoid spinner thrash by doing a soft refresh on focus
  useFocusEffect(
    React.useCallback(() => {
      refreshTasksSoft();
      return undefined;
    }, [refreshTasksSoft])
  );

  // Handle task stage change using real backend with immediate UI feedback
  const handleTaskStageChange = async (taskId: string, newStage: TaskStage) => {
    console.log(
      `🎯 handleTaskStageChange called: taskId=${taskId}, newStage=${newStage}`
    );
    try {
      console.log(
        `🎯 About to call updateTaskStage with optimistic updates...`
      );
      const result = await updateTaskStage(taskId, newStage);
      console.log(`🎯 updateTaskStage completed:`, result);
      if (result.error) {
        console.error("❌ Failed to update task stage:", result.error);
        // TODO: Show user-friendly error notification
        // The optimistic update will be rolled back automatically
      } else {
        console.log(
          `✅ Task stage updated successfully with immediate UI feedback!`
        );
      }
    } catch (error) {
      console.error("❌ Error updating task stage:", error);
      // TODO: Show user-friendly error notification
    }
  };

  // Handle task completion toggle (legacy support)
  const handleTaskToggleComplete = async (
    taskId: string,
    completed: boolean
  ) => {
    const newStage: TaskStage = completed ? "completed" : "not-started";
    await handleTaskStageChange(taskId, newStage);
  };

  // Handle task press - navigate to task detail screen (ID-only pattern)
  const handleTaskPress = (task: any) => {
    if (!task?.id) {
      console.error(
        "TasksScreen: Cannot navigate to task detail - missing task ID:",
        task
      );
      return;
    }

    router.push({
      pathname: "/task-detail/[id]",
      params: { id: task.id },
    });
  };

  // Handle drag start
  const handleDragStart = (payload: TaskDragPayload) => {
    console.log(
      `🎯 Started dragging task: "${payload.title}" from ${payload.stage}`
    );
  };

  // Handle drag end
  const handleDragEnd = (payload: TaskDragPayload) => {
    console.log(`🎯 Ended dragging task: "${payload.title}"`);
  };

  // Handle task drop - move task to new stage with immediate UI feedback
  const handleTaskDrop = (
    draggedTask: TaskDragPayload,
    targetStage: TaskStage
  ) => {
    console.log(
      `🚀 handleTaskDrop called: Moving task "${draggedTask.title}" from ${draggedTask.stage} to ${targetStage}`
    );

    // Skip if dropping on same stage
    if (draggedTask.stage === targetStage) {
      console.log(`🚀 Skipping drop - task already in ${targetStage} stage`);
      return;
    }

    console.log(`🚀 Drag payload:`, draggedTask);
    console.log(
      `🚀 About to call handleTaskStageChange with optimistic updates:`,
      { taskId: draggedTask.id, targetStage }
    );

    // This will now provide immediate UI feedback via optimistic updates
    handleTaskStageChange(draggedTask.id, targetStage);
  };

  // Use tasks organized by stage from the hook
  const tasksByStage = getTasksByStage();

  // Stage configuration matching Figma
  const stageConfig = [
    { stage: "not-started" as TaskStage, title: "Not started" },
    { stage: "in-progress" as TaskStage, title: "In progress" },
    { stage: "completed" as TaskStage, title: "Completed" },
    { stage: "blocked" as TaskStage, title: "Blocked" },
  ];

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: Math.max(insets.top, 20),
    },
  });

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <GeneralHeader
          title="My Tasks"
          menuSections={tasksMenuSections}
          onMenuOptionSelect={handleMenuOptionSelect}
          menuTitle="Task Options"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="bodyMedium" style={styles.loadingText}>
            Loading your tasks...
          </Typography>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <GeneralHeader
          title="My Tasks"
          menuSections={tasksMenuSections}
          onMenuOptionSelect={handleMenuOptionSelect}
          menuTitle="Task Options"
        />
        <View style={styles.errorContainer}>
          <Typography variant="bodyLarge" style={styles.errorTitle}>
            Unable to load tasks
          </Typography>
          <Typography variant="bodyMedium" style={styles.errorMessage}>
            {error}
          </Typography>
          <Typography
            variant="labelLarge"
            style={styles.retryButton}
            onPress={refreshTasks}
          >
            Tap to retry
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <DragProvider onTaskDrop={handleTaskDrop}>
      <View style={[styles.container, dynamicStyles.container]}>
        {/* General Header with Tasks-specific menu */}
        <GeneralHeader
          title="My Tasks"
          menuSections={tasksMenuSections}
          onMenuOptionSelect={handleMenuOptionSelect}
          menuTitle="Task Options"
        />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Task Organization by Stage */}
          <View style={styles.taskOrganization}>
            {stageConfig.map((config) => (
              <TaskSection
                key={config.stage}
                title={config.title}
                stage={config.stage}
                tasks={(tasksByStage[config.stage] || []).map((task) => ({
                  ...task,
                  stage: task.stage || config.stage,
                }))}
                isExpanded={expandedSections[config.stage]}
                onToggleExpanded={handleToggleSection}
                onTaskPress={handleTaskPress}
                onTaskStageChange={handleTaskStageChange}
                onTaskToggleComplete={handleTaskToggleComplete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTaskDrop={handleTaskDrop}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </DragProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.sm, // Add horizontal padding for content
  },
  taskOrganization: {
    marginTop: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    textAlign: "center",
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  errorTitle: {
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  errorMessage: {
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    color: colors.primary,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
