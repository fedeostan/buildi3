import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { TaskActionsBottomSheetProps, TaskAction } from "./types";
import { Typography, Icon } from "../";
import { colors, spacing } from "../../../theme";

/**
 * TaskActionsBottomSheet Component
 * 
 * Replicates Asana's task action menu that appears when tapping the three dots
 * on a task detail screen. Can be layered on top of the existing task detail modal.
 * 
 * Features:
 * - Follows Asana's menu structure exactly
 * - Proper destructive action styling (red delete)
 * - Uses design system tokens exclusively
 * - Supports nested bottom sheet presentation
 */
const TaskActionsBottomSheet: React.FC<TaskActionsBottomSheetProps> = ({
  isVisible,
  onClose,
  onActionSelect,
  taskId,
}) => {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["50%", "80%"], []);

  // Asana-style actions matching the reference image
  const actions: TaskAction[] = [
    {
      id: "manage-projects",
      label: "Manage projects",
      icon: "folder",
    },
    {
      id: "add-tags", 
      label: "Add tags",
      icon: "tag",
    },
    {
      id: "make-subtask",
      label: "Make a subtask of",
      icon: "git-branch",
    },
    {
      id: "mark-as",
      label: "Mark as...",
      icon: "check-circle",
    },
    {
      id: "create-followup",
      label: "Create follow-up task", 
      icon: "arrow-right",
    },
    {
      id: "make-dependent",
      label: "Make dependent",
      icon: "link",
    },
    {
      id: "share-task",
      label: "Share task",
      icon: "share-2",
    },
    {
      id: "leave-task",
      label: "Leave task", 
      icon: "user-minus",
    },
    {
      id: "delete-task",
      label: "Delete task",
      icon: "trash-2",
      destructive: true,
    },
  ];

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleActionPress = (actionId: string) => {
    onActionSelect(actionId);
    onClose();
  };

  const renderActionItem = (action: TaskAction) => (
    <TouchableOpacity
      key={action.id}
      style={[
        styles.actionItem,
        action.destructive && styles.destructiveAction,
        action.disabled && styles.disabledAction,
      ]}
      onPress={() => handleActionPress(action.id)}
      disabled={action.disabled}
      accessibilityRole="button"
      accessibilityLabel={action.label}
    >
      <Icon
        name={action.icon as any} // TODO: Add proper icon types
        size="md"
        color={action.destructive ? "error" : "text"}
        style={styles.actionIcon}
      />
      <Typography
        variant="bodyLarge"
        style={[
          styles.actionLabel,
          action.destructive && styles.destructiveText,
          action.disabled && styles.disabledText,
        ]}
      >
        {action.label}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <Typography variant="h6" style={styles.headerTitle}>
            Task Actions
          </Typography>
        </View>
        
        <View style={styles.actionsContainer}>
          {actions.map(renderActionItem)}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.backgroundSecondary,
  },
  handleIndicator: {
    backgroundColor: colors.border,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  header: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  actionsContainer: {
    flex: 1,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    marginRight: spacing.md,
  },
  actionLabel: {
    flex: 1,
    color: colors.text,
  },
  destructiveAction: {
    // No background change, just text color
  },
  destructiveText: {
    color: colors.error,
  },
  disabledAction: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});

export default TaskActionsBottomSheet;