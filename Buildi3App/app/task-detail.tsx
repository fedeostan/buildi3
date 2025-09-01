import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";
import {
  Typography,
  Input,
  TextArea,
  Button,
  Icon,
  TaskRow,
  Widget,
  TaskActionsBottomSheet,
} from "../components/ui";
import { DateTag } from "../components/ui/Tag";

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
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    projectName?: string;
    dueDate: string;
    isCompleted?: string;
  }>();

  // Parse route parameters
  const taskId = params.id;
  const [taskTitle, setTaskTitle] = useState(params.title || "");
  const [isCompleted, setIsCompleted] = useState(params.isCompleted === "true");
  const [description, setDescription] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const dueDate = params.dueDate ? new Date(params.dueDate) : new Date();

  // Demo subtasks
  const [subtasks, setSubtasks] = useState([
    {
      id: "subtask-1",
      title: "Research user requirements",
      projectName: params.projectName,
      dueDate: new Date(),
      isCompleted: true,
    },
    {
      id: "subtask-2",
      title: "Create wireframes",
      projectName: params.projectName,
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
      action: `added to ${params.projectName}`,
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

  const handleBack = () => {
    router.back();
  };

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted);
  };

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
        projectName: params.projectName,
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
                  Federico Ostan...
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
        {params.projectName && (
          <View style={styles.section}>
            <Typography variant="bodyMedium" style={styles.sectionTitle}>
              My Tasks
            </Typography>
            <View style={styles.projectRow}>
              <View style={styles.projectIndicator} />
              <Typography variant="bodyMedium">{params.projectName}</Typography>
            </View>
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
});
