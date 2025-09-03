import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../../theme";
import {
  Typography,
  Input,
  TextArea,
  Button,
  Icon,
  TaskRow,
  Widget,
  TaskActionsBottomSheet,
} from "../../components/ui";
import { DateTag } from "../../components/ui/Tag";
import { useTask, useTasks } from "../../hooks/useTasks";
import { Task, TaskStage } from "../../lib/supabase/types";

/**
 * Task Detail Screen - Detailed view for editing and managing tasks
 *
 * Replicates Asana's task detail screen UX while following our design system.
 * Features:
 * - Editable task title
 * - Task completion toggle
 * - Assignee and due date information
 * - Project association
 * - Description editing
 * - Subtasks management
 * - Attachments area
 * - Activity/comments history
 */
export default function TaskDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Mobile-optimized navigation (ID-only parameters)
  const params = useLocalSearchParams<{ id: string; projectName?: string }>();
  const taskId = params.id;

  // Fetch fresh data using task ID from database
  const { task, loading, error, refreshTask } = useTask(taskId);
  const { updateTask, updateTaskStage, updateTaskWithAI } = useTasks();

  // Optimistic updates for better mobile UX
  const [optimisticUpdates, setOptimisticUpdates] = useState<Partial<Task>>({});
  const displayTask = { ...task, ...optimisticUpdates };

  // Project name (prefer task.project.name, then param, then fallback)
  const projectName =
    ((displayTask as any)?.project?.name as string) ||
    (params.projectName as string) ||
    "Construction Project";

  // Local state for form fields
  const [taskTitle, setTaskTitle] = useState(displayTask?.title || "");
  const [description, setDescription] = useState(
    displayTask?.description || ""
  );
  const [newSubtask, setNewSubtask] = useState("");
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Update form fields when task loads
  React.useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  // Construction-aware stage transitions
  const allowedTransitions = useMemo(() => {
    if (!displayTask?.stage) return [];

    const transitions: Record<TaskStage, TaskStage[]> = {
      "not-started": ["in-progress", "blocked"],
      "in-progress": ["completed", "blocked"],
      completed: [], // Terminal state
      blocked: ["not-started", "in-progress"], // Can restart
    };

    return transitions[displayTask.stage as TaskStage] || [];
  }, [displayTask?.stage]);

  // Demo subtasks
  const [subtasks, setSubtasks] = useState([
    {
      id: "subtask-1",
      title: "Research user requirements",
      projectName,
      dueDate: new Date(),
      isCompleted: true,
    },
    {
      id: "subtask-2",
      title: "Create wireframes",
      projectName,
      dueDate: new Date(),
      isCompleted: false,
    },
  ]);

  // Demo activity feed
  const activityFeed = [
    {
      id: "activity-1",
      user: "Federico Ostan Bazan",
      action: "created this task",
      timestamp: "1 Aug 2024 at 10:40",
    },
    {
      id: "activity-2",
      user: "Federico Ostan Bazan",
      action: `added to ${projectName}`,
      timestamp: "1 Aug 2024",
    },
    {
      id: "activity-3",
      user: "Federico Ostan Bazan",
      action: "changed the due date to Aug 3, 2024",
      timestamp: "1 Aug 2024",
    },
    {
      id: "activity-4",
      user: "Federico Ostan Bazan",
      action: "assigned to you",
      timestamp: "1 Aug 2024",
    },
  ];

  // Optimistic update with rollback on error
  const handleUpdateTask = useCallback(
    async (updates: Partial<Task>) => {
      if (!task) return;

      // Optimistic update
      setOptimisticUpdates((prev) => ({ ...prev, ...updates }));

      try {
        const { error: updateError } = await updateTaskWithAI(
          task.id,
          updates,
          true
        );
        if (updateError) throw new Error(updateError);

        // Clear optimistic updates on success
        setOptimisticUpdates({});
        refreshTask(); // Refresh to get latest data
      } catch (error: any) {
        // Rollback optimistic updates
        setOptimisticUpdates({});
        Alert.alert("Update Failed", error.message || "Failed to update task");
      }
    },
    [task, updateTaskWithAI, refreshTask]
  );

  // Construction-aware stage change handling
  const handleStageChange = useCallback(
    async (newStage: TaskStage) => {
      if (!allowedTransitions.includes(newStage)) {
        Alert.alert(
          "Invalid Transition",
          `Cannot change from ${displayTask?.stage} to ${newStage}`
        );
        return;
      }

      await handleUpdateTask({ stage: newStage });
    },
    [allowedTransitions, displayTask?.stage, handleUpdateTask]
  );

  const handleBack = () => {
    router.back();
  };

  const handleMarkComplete = useCallback(() => {
    if (!displayTask) return;

    const isCurrentlyCompleted = displayTask.stage === "completed";
    const nextStage: TaskStage = isCurrentlyCompleted
      ? "in-progress"
      : "completed";

    handleStageChange(nextStage);
  }, [displayTask, handleStageChange]);

  const handleTitleSave = useCallback(() => {
    if (taskTitle !== task?.title) {
      handleUpdateTask({ title: taskTitle });
    }
  }, [taskTitle, task?.title, handleUpdateTask]);

  const handleDescriptionSave = useCallback(() => {
    if (description !== task?.description) {
      handleUpdateTask({ description });
    }
  }, [description, task?.description, handleUpdateTask]);

  const handleMoreOptions = () => {
    setShowActionsMenu(true);
  };

  const handleActionSelect = (actionId: string) => {
    console.log("Action selected:", actionId);
    // TODO: Implement specific actions
    switch (actionId) {
      case "manage-projects":
        // Open project management
        break;
      case "add-tags":
        // Open tag selection
        break;
      case "make-subtask":
        // Show parent task selection
        break;
      case "mark-as":
        // Show status selection
        break;
      case "create-followup":
        // Create follow-up task
        break;
      case "make-dependent":
        // Show dependency selection
        break;
      case "share-task":
        // Open sharing options
        break;
      case "leave-task":
        // Confirm leaving task
        break;
      case "delete-task":
        // Confirm deletion
        break;
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtaskItem = {
        id: `subtask-${Date.now()}`,
        title: newSubtask.trim(),
        projectName,
        dueDate: new Date(),
        isCompleted: false,
      };
      setSubtasks([...subtasks, newSubtaskItem]);
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (subtaskId: string, nextValue: boolean) => {
    setSubtasks((prev) =>
      prev.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, isCompleted: nextValue }
          : subtask
      )
    );
  };

  // Handle invalid task ID or navigation errors
  if (!taskId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-triangle" size="lg" color="error" />
          <Typography variant="h6" style={styles.errorTitle}>
            Invalid Task
          </Typography>
          <Typography variant="bodyMedium" style={styles.errorText}>
            This task link is not valid or has expired.
          </Typography>
          <Button
            title="Go to Tasks"
            onPress={() => router.push("/(tabs)/tasks")}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name="chevron-left" size="md" color="text" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Typography variant="h5" style={styles.headerTitle}>
                Task Details
              </Typography>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typography variant="bodyMedium" style={styles.loadingText}>
            Loading task details...
          </Typography>
        </View>
      </View>
    );
  }

  // Handle error state
  if (error || !task) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name="chevron-left" size="md" color="text" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Typography variant="h5" style={styles.headerTitle}>
                Task Details
              </Typography>
            </View>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-triangle" size="lg" color="error" />
          <Typography variant="h6" style={styles.errorTitle}>
            Task Not Found
          </Typography>
          <Typography variant="bodyMedium" style={styles.errorText}>
            {error ||
              "This task could not be found or you don't have permission to view it."}
          </Typography>
          <View style={styles.errorButtons}>
            <Button
              title="Try Again"
              onPress={refreshTask}
              style={styles.errorButton}
              variant="secondary"
            />
            <Button
              title="Go to Tasks"
              onPress={() => router.push("/(tabs)/tasks")}
              style={styles.errorButton}
            />
          </View>
        </View>
      </View>
    );
  }

  const isCompleted = displayTask.stage === "completed";
  const dueDate = displayTask.dueDate
    ? new Date(displayTask.dueDate)
    : new Date();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevron-left" size="md" color="text" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Typography variant="h5" style={styles.headerTitle}>
              Task Details
            </Typography>
          </View>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleMoreOptions}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <Icon name="more-horizontal" size="md" color="text" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Title Section */}
        <View style={styles.section}>
          <View style={styles.titleHeader}>
            <View style={styles.titleInputContainer}>
              <Input
                label="Task Title"
                value={taskTitle}
                onChangeText={setTaskTitle}
                onBlur={handleTitleSave}
                placeholder="Enter task title"
                state={taskTitle ? "filled" : "default"}
                containerStyle={styles.titleInput}
              />
            </View>
            <View style={styles.actionButtons}>
              <Button
                title={isCompleted ? "✓ Complete" : "Mark Complete"}
                onPress={handleMarkComplete}
                style={[
                  styles.completeButton,
                  isCompleted && styles.completeButtonActive,
                ]}
              />
            </View>
          </View>
        </View>

        {/* Meta Information Section */}
        <View style={styles.section}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Typography variant="bodySmall" style={styles.metaLabel}>
                Assigned to
              </Typography>
              <View style={styles.metaContent}>
                <View style={styles.avatar}>
                  <Typography variant="bodyMedium" style={styles.avatarText}>
                    FO
                  </Typography>
                </View>
                <Typography variant="bodyMedium" style={styles.assigneeText}>
                  {displayTask.assigned_to ? "Assigned User" : "Unassigned"}
                </Typography>
              </View>
            </View>
            <View style={styles.metaItem}>
              <Typography variant="bodySmall" style={styles.metaLabel}>
                Due date
              </Typography>
              <View style={styles.dueDateContainer}>
                <Icon name="calendar" size="sm" color="red" />
                <Typography variant="bodyMedium" style={styles.dueDateText}>
                  {dueDate.toLocaleDateString()}
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Project Section */}
        {displayTask.projectId && (
          <View style={styles.section}>
            <Typography variant="bodyMedium" style={styles.sectionTitle}>
              Project
            </Typography>
            <View style={styles.projectRow}>
              <View style={styles.projectIndicator} />
              <Typography variant="bodyMedium">
                {(displayTask as any).project?.name || "Construction Project"}
              </Typography>
            </View>
          </View>
        )}

        {/* Construction-specific details */}
        {(displayTask.weather_dependent ||
          displayTask.trade_required ||
          displayTask.safety_notes) && (
          <View style={styles.section}>
            <Typography variant="bodyMedium" style={styles.sectionTitle}>
              Construction Details
            </Typography>
            {displayTask.weather_dependent && (
              <View style={styles.constructionDetail}>
                <Icon name="cloud-drizzle" size="sm" color="textSecondary" />
                <Typography
                  variant="bodyMedium"
                  style={styles.constructionDetailText}
                >
                  Weather dependent task
                </Typography>
              </View>
            )}
            {displayTask.trade_required && (
              <View style={styles.constructionDetail}>
                <Icon name="tool" size="sm" color="textSecondary" />
                <Typography
                  variant="bodyMedium"
                  style={styles.constructionDetailText}
                >
                  Trade required: {displayTask.trade_required}
                </Typography>
              </View>
            )}
            {displayTask.safety_notes && (
              <View style={styles.constructionDetail}>
                <Icon name="shield" size="sm" color="error" />
                <Typography
                  variant="bodyMedium"
                  style={styles.constructionDetailText}
                >
                  Safety notes: {displayTask.safety_notes}
                </Typography>
              </View>
            )}
          </View>
        )}

        {/* Description Section */}
        <View style={styles.section}>
          <Typography variant="bodyMedium" style={styles.sectionTitle}>
            Description
          </Typography>
          <TextArea
            label="Description"
            value={description}
            onChangeText={setDescription}
            onBlur={handleDescriptionSave}
            placeholder="Add a description..."
            multiline={true}
            numberOfLines={4}
            containerStyle={styles.descriptionInput}
          />
        </View>

        {/* Subtasks Section */}
        <View style={styles.section}>
          <Typography variant="bodyMedium" style={styles.sectionTitle}>
            Subtasks
          </Typography>
          <View style={styles.subtasksContainer}>
            {subtasks.map((subtask, index) => (
              <TaskRow
                key={subtask.id}
                id={subtask.id}
                title={subtask.title}
                projectName={subtask.projectName}
                dueDate={subtask.dueDate}
                isCompleted={subtask.isCompleted}
                isLastItem={index === subtasks.length - 1}
                onToggleComplete={handleToggleSubtask}
                onPress={() => console.log("Subtask pressed:", subtask.id)}
              />
            ))}
          </View>
          <View style={styles.addSubtaskContainer}>
            <Input
              label="New Subtask"
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Add a subtask..."
              rightIcon={
                <Button
                  title="+"
                  onPress={handleAddSubtask}
                  style={styles.addSubtaskButton}
                />
              }
            />
          </View>
        </View>

        {/* Attachments Section */}
        <View style={styles.section}>
          <Typography variant="bodyMedium" style={styles.sectionTitle}>
            Attachments
          </Typography>
          <View style={styles.attachmentArea}>
            <View style={styles.attachmentPlaceholder}>
              <Icon name="plus" size="lg" color="textSecondary" />
              <Typography variant="bodySmall" style={styles.attachmentText}>
                Add attachments
              </Typography>
            </View>
          </View>
        </View>

        {/* Activity Feed Section */}
        <View style={styles.section}>
          <Typography variant="bodyMedium" style={styles.sectionTitle}>
            Activity
          </Typography>
          <View style={styles.activityFeed}>
            {activityFeed.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Typography
                    variant="bodySmall"
                    style={styles.activityAvatarText}
                  >
                    FO
                  </Typography>
                </View>
                <View style={styles.activityContent}>
                  <Typography variant="bodySmall">
                    <Typography variant="bodySmall" style={styles.activityUser}>
                      {activity.user}
                    </Typography>
                    {` ${activity.action}`}
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    style={styles.activityTimestamp}
                  >
                    {activity.timestamp}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Comment Input Section */}
        <View style={styles.section}>
          <TextArea
            label="Add Comment"
            placeholder="Ask a question or post an update..."
            multiline={true}
            numberOfLines={3}
            containerStyle={styles.commentInput}
          />
        </View>
      </ScrollView>

      {/* Task Actions Bottom Sheet */}
      <TaskActionsBottomSheet
        isVisible={showActionsMenu}
        onClose={() => setShowActionsMenu(false)}
        onActionSelect={handleActionSelect}
        taskId={taskId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    zIndex: 1,
    paddingTop: spacing.sm,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    height: 44, // Standard navigation height
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "600",
    color: colors.text,
  },
  moreButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  titleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  titleInputContainer: {
    flex: 1,
  },
  titleInput: {
    marginBottom: 0,
  },
  actionButtons: {
    alignItems: "center",
    paddingTop: spacing.sm,
  },
  completeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    minWidth: 120,
  },
  completeButtonActive: {
    backgroundColor: colors.success,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metaContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.backgroundSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  assigneeText: {
    color: colors.text,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dueDateText: {
    color: colors.error,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  projectIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  descriptionInput: {
    minHeight: 100,
  },
  subtasksContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  addSubtaskContainer: {
    marginTop: spacing.sm,
  },
  addSubtaskButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentArea: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
  },
  attachmentPlaceholder: {
    alignItems: "center",
    gap: spacing.sm,
  },
  attachmentText: {
    color: colors.textSecondary,
  },
  activityFeed: {
    gap: spacing.sm,
  },
  activityItem: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  activityAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  activityAvatarText: {
    color: colors.backgroundSecondary,
    fontSize: 8,
    fontWeight: "600",
  },
  activityContent: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  activityUser: {
    fontWeight: "600",
    color: colors.primary,
  },
  activityTimestamp: {
    color: colors.textSecondary,
  },
  commentInput: {
    minHeight: 80,
  },

  // Error and Loading States
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  errorTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.text,
    textAlign: "center",
  },
  errorText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  errorButton: {
    marginTop: spacing.sm,
    minWidth: 120,
  },
  errorButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Construction-specific details
  constructionDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  constructionDetailText: {
    color: colors.text,
    flex: 1,
  },
});
