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
  TaskDetailTitle,
  AssignedToDropDown,
  DueDateDropdown,
  ProjectDropdown,
} from "../../components/ui";
import type { ContactOption } from "../../components/ui/AssignedToDropDown";
import { DateTag } from "../../components/ui/Tag";
import { useTask, useTasks } from "../../hooks/useTasks";
import { Task, TaskStage } from "../../lib/supabase/types";
import {
  generateDummyContacts,
  updateTaskAssignment,
  profileToContact,
} from "../../services/assignmentService";

// Defensive programming: Validate all component imports at runtime in development
if (__DEV__) {
  const components = {
    Typography,
    Input,
    TextArea,
    Button,
    Icon,
    TaskRow,
    Widget,
    TaskActionsBottomSheet,
    TaskDetailTitle,
    AssignedToDropDown,
  };

  Object.entries(components).forEach(([name, component]) => {
    if (!component) {
      console.error(
        `❌ TaskDetailScreen: ${name} component is undefined. Check export/import patterns.`
      );
    } else {
      console.log(`✅ TaskDetailScreen: ${name} component loaded successfully`);
    }
  });
}

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

  // Assignment state management
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | undefined>();
  const [availableContacts, setAvailableContacts] = useState<ContactOption[]>(
    []
  );
  const [assignedUserContact, setAssignedUserContact] = useState<
    ContactOption | undefined
  >();
  const [pendingAssignedUserId, setPendingAssignedUserId] = useState<
    string | null | undefined
  >(undefined);

  // Safe area aware dynamic styles
  const dynamicStyles = StyleSheet.create({
    header: {
      paddingTop: Math.max(insets.top, 20) + spacing.sm,
    },
    contentContainer: {
      paddingBottom: Math.max(insets.bottom, 20) + spacing.xl,
    },
    pendingFooter: {
      paddingBottom: Math.max(insets.bottom, 20),
    },
  });

  // Pending changes management (accept/decline)
  const [pendingTitle, setPendingTitle] = useState<string | undefined>(
    undefined
  );
  const [pendingStage, setPendingStage] = useState<TaskStage | undefined>(
    undefined
  );
  const [pendingProjectId, setPendingProjectId] = useState<
    string | null | undefined
  >(undefined);
  const [pendingDueDate, setPendingDueDate] = useState<Date | null | undefined>(
    undefined
  );

  // Update form fields when task loads
  React.useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setDescription(task.description || "");
      // Reset pending edits when fresh task arrives
      setPendingTitle(undefined);
      setPendingStage(undefined);
      setPendingProjectId(undefined);
      setPendingDueDate(undefined);
    }
  }, [task]);

  // Load available contacts and initialize assignment state
  React.useEffect(() => {
    const loadContacts = async () => {
      // Load dummy contacts for now
      // TODO: Future engineer - Replace with real contact fetching:
      // 1. Fetch project team members from database
      // 2. Include device contacts if permissions granted
      // 3. Filter by project access and roles
      const dummyContacts = generateDummyContacts();
      setAvailableContacts(dummyContacts);
    };

    loadContacts();
  }, []);

  // Update assigned user contact when task changes
  React.useEffect(() => {
    if (task?.assigned_to) {
      // TODO: Future engineer - Fetch real assigned user details from database:
      // const assignedProfile = await fetchUserProfile(task.assigned_to);
      // const assignedContact = profileToContact(assignedProfile);

      // For now, find in dummy contacts or create basic contact info
      const existingContact = availableContacts.find(
        (contact) => contact.id === task.assigned_to
      );

      if (existingContact) {
        setAssignedUserContact(existingContact);
      } else {
        // Create basic contact info for assigned user not in contact list
        setAssignedUserContact({
          id: task.assigned_to,
          name: "Assigned User", // TODO: Fetch real name from database
          initials: "AU",
          phone: undefined,
          email: undefined,
        });
      }
      // Reset pending assignee when actual task value changes
      setPendingAssignedUserId(undefined);
    } else {
      setAssignedUserContact(undefined);
      setPendingAssignedUserId(undefined);
    }
  }, [task?.assigned_to, availableContacts]);

  // Construction-aware stage transitions
  const allowedTransitions = useMemo(() => {
    if (!displayTask?.stage) return [];

    // Allow free movement between all stages for maximum flexibility
    const allStages: TaskStage[] = [
      "not-started",
      "in-progress",
      "completed",
      "blocked",
    ];

    // Return all stages except the current one
    return allStages.filter((stage) => stage !== displayTask.stage);
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
  const handleStageSelectPending = useCallback(
    (newStage: TaskStage) => {
      if (!allowedTransitions.includes(newStage)) {
        Alert.alert(
          "Invalid Transition",
          `Cannot change from ${displayTask?.stage} to ${newStage}`
        );
        return;
      }
      setPendingStage(newStage);
    },
    [allowedTransitions, displayTask?.stage]
  );

  const handleBack = () => {
    router.back();
  };

  // Title commit should set pending change, not immediately persist
  const handleTitleCommitPending = useCallback(() => {
    if (task && taskTitle !== task.title) {
      setPendingTitle(taskTitle);
    }
  }, [task, taskTitle]);

  // Keep for description immediate save; title handled via pending
  const handleTitleSave = useCallback(() => {
    /* no-op; title saved via accept changes */
  }, []);

  const handleDescriptionSave = useCallback(() => {
    if (description !== task?.description) {
      handleUpdateTask({ description });
    }
  }, [description, task?.description, handleUpdateTask]);

  // Accept/Discard pending changes
  const hasPendingChanges = useMemo(() => {
    return (
      (pendingTitle !== undefined && pendingTitle !== task?.title) ||
      (pendingStage !== undefined && pendingStage !== displayTask?.stage) ||
      (pendingAssignedUserId !== undefined &&
        pendingAssignedUserId !== (task?.assigned_to ?? null)) ||
      (pendingProjectId !== undefined &&
        pendingProjectId !== ((task as any)?.project_id ?? null)) ||
      (pendingDueDate !== undefined &&
        (task?.dueDate
          ? new Date(task.dueDate as any).toDateString()
          : null) !== (pendingDueDate ? pendingDueDate.toDateString() : null))
    );
  }, [
    pendingTitle,
    pendingStage,
    pendingAssignedUserId,
    pendingProjectId,
    pendingDueDate,
    task?.title,
    task?.assigned_to,
    (task as any)?.project_id,
    displayTask?.stage,
  ]);

  const handleAcceptChanges = useCallback(async () => {
    if (!task) return;
    const updates: Partial<Task> = {};
    if (pendingTitle !== undefined && pendingTitle !== task.title) {
      updates.title = pendingTitle;
    }
    if (pendingStage !== undefined && pendingStage !== displayTask?.stage) {
      updates.stage = pendingStage;
    }
    if (pendingDueDate !== undefined) {
      // Save due date (null clears). Convert to ISO string for DB
      (updates as any).dueDate = pendingDueDate
        ? new Date(pendingDueDate)
        : null;
    }
    if (
      pendingAssignedUserId !== undefined &&
      pendingAssignedUserId !== (task.assigned_to ?? null)
    ) {
      // @ts-ignore allow null for clearing assignment
      updates.assigned_to = pendingAssignedUserId as any;
    }
    if (
      pendingProjectId !== undefined &&
      pendingProjectId !== ((task as any).project_id ?? null)
    ) {
      // @ts-ignore align with DB
      (updates as any).projectId = pendingProjectId as any;
      // also set nested shape so UI shows name once backend refreshes
    }
    if (Object.keys(updates).length === 0) return;
    try {
      setAssignmentLoading(true);
      await handleUpdateTask(updates);
    } finally {
      setAssignmentLoading(false);
    }
    setPendingTitle(undefined);
    setPendingStage(undefined);
    setPendingAssignedUserId(undefined);
    setPendingProjectId(undefined);
    setPendingDueDate(undefined);
  }, [task, pendingTitle, pendingStage, displayTask?.stage, handleUpdateTask]);

  const handleDiscardChanges = useCallback(() => {
    if (task) {
      setTaskTitle(task.title);
    }
    setPendingTitle(undefined);
    setPendingStage(undefined);
    // Revert pending assignee and UI to current task value
    setPendingAssignedUserId(undefined);
    setPendingProjectId(undefined);
    setPendingDueDate(undefined);
    if (task?.assigned_to) {
      const existing = availableContacts.find((c) => c.id === task.assigned_to);
      setAssignedUserContact(existing);
    } else {
      setAssignedUserContact(undefined);
    }
  }, [task]);

  // Assignment handlers with real database integration
  const handleAssignUser = useCallback(
    (contact: ContactOption) => {
      if (!task) return;
      // Only set pending state and update UI immediately; DB update happens on Save changes
      setPendingAssignedUserId(contact.id);
      setAssignedUserContact(contact);
      setAssignmentError(undefined);
    },
    [task]
  );

  const handleUnassignUser = useCallback(() => {
    if (!task) return;
    // Only set pending state and update UI; DB update happens on Save changes
    setPendingAssignedUserId(null);
    setAssignedUserContact(undefined);
    setAssignmentError(undefined);
  }, [task]);

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
      <View style={[styles.header, dynamicStyles.header]}>
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
        contentContainerStyle={[
          styles.contentContainer,
          dynamicStyles.contentContainer,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Title Section */}
        <View style={styles.section}>
          <TaskDetailTitle
            title={taskTitle}
            stage={(pendingStage || displayTask.stage) as TaskStage}
            onTitleChange={setTaskTitle}
            onTitleCommit={handleTitleCommitPending}
            onStageSelect={handleStageSelectPending}
            allowedStages={allowedTransitions}
            containerStyle={styles.titleInput}
          />
        </View>

        {/* Meta Information Section */}
        <View style={styles.section}>
          <View style={styles.metaRow}>
            {/* Assignment Section - Using new AssignedToDropDown component */}
            <View style={styles.metaItem}>
              <AssignedToDropDown
                assignedUserId={displayTask.assigned_to || undefined}
                assignedUser={assignedUserContact}
                contacts={availableContacts}
                onAssignUser={handleAssignUser}
                onUnassignUser={handleUnassignUser}
                loading={assignmentLoading}
                disabled={loading} // Disable during task loading
                errorMessage={assignmentError}
                bottomSheetTitle="Assign Task"
                fieldStyle={{ flex: 1 }}
              />
            </View>
            <View style={styles.metaItem}>
              <DueDateDropdown
                label="Due date"
                value={
                  pendingDueDate !== undefined
                    ? pendingDueDate
                    : displayTask.dueDate
                    ? new Date(displayTask.dueDate as any)
                    : null
                }
                onSelect={(date: Date | null) => {
                  setPendingDueDate(date);
                  // immediate UI reflection
                  setOptimisticUpdates((prev) => ({
                    ...prev,
                    dueDate: date || null,
                  }));
                }}
                bottomSheetTitle="Choose due date"
                fieldStyle={{ flex: 1 }}
              />
            </View>
          </View>
        </View>

        {/* Project Section - uses ProjectDropdown with pending-change behavior */}
        <View style={styles.section}>
          <Typography variant="bodyMedium" style={styles.sectionTitle}>
            Project
          </Typography>
          <ProjectDropdown
            label={
              (displayTask as any)?.project?.name ? "Project" : "Select project"
            }
            value={
              (displayTask as any)?.project?.id || displayTask.projectId || null
            }
            onSelect={(project) => {
              // pending only; apply on Save
              const newProjectId = project ? project.id : null;
              setPendingProjectId(newProjectId);
              // reflect immediately in UI for user feedback
              setOptimisticUpdates((prev) => ({
                ...prev,
                projectId: newProjectId as any,
              }));
            }}
            bottomSheetTitle="Choose a project"
          />
        </View>

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
                onPress={() => {
                  // Navigate to subtask detail (if it exists in database)
                  // For demo subtasks, just log for now
                  console.log("Subtask pressed:", subtask.id);
                  // TODO: Implement subtask navigation when subtasks are stored in database
                }}
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

      {/* Pending changes footer */}
      {hasPendingChanges && (
        <View style={[styles.pendingFooter, dynamicStyles.pendingFooter]}>
          <View style={styles.pendingFooterContent}>
            <Button
              title="Discard"
              variant="secondary"
              onPress={handleDiscardChanges}
              style={styles.pendingSecondary}
            />
            <Button
              title="Save changes"
              onPress={handleAcceptChanges}
              style={styles.pendingPrimary}
            />
          </View>
        </View>
      )}

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
  pendingFooter: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  pendingFooterContent: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  pendingSecondary: {
    minWidth: 120,
  },
  pendingPrimary: {
    minWidth: 140,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
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
});
