import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing } from "../../theme";
import {
  Typography,
  GeneralHeader,
  MenuSection,
  TaskRow,
} from "../../components/ui";

/**
 * Tasks Screen - Task management and tracking
 *
 * This screen allows users to manage their tasks,
 * view task lists, and track progress
 */
export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Demo data with local state to visualize completion toggles
  const [rows, setRows] = React.useState([
    {
      id: "1",
      title: "Design onboarding flow",
      projectName: "New App",
      dueDate: new Date(),
      isCompleted: false,
    },
    {
      id: "2",
      title: "Fix login bug",
      projectName: "Auth",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isCompleted: false,
    },
    {
      id: "3",
      title: "Prepare sprint report",
      projectName: "Ops",
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isCompleted: true,
    },
    {
      id: "4",
      title: "Update dependencies",
      projectName: "Mobile",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    },
    {
      id: "5",
      title: "Call client to confirm scope",
      projectName: "Acme Co",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    },
  ]);

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

  // Handle task row press - navigate to task detail screen
  const handleTaskPress = (task: typeof rows[0]) => {
    router.push({
      pathname: "/task-detail",
      params: {
        id: task.id,
        title: task.title,
        projectName: task.projectName,
        dueDate: task.dueDate.toISOString(),
        isCompleted: task.isCompleted.toString(),
      },
    });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: Math.max(insets.top, 20),
    },
  });

  return (
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
        {/* Preview of TaskRow variants with dummy data */}
        <View style={styles.previewSection}>
          <Typography variant="h5" style={styles.previewTitle}>
            Task Variants (Preview)
          </Typography>
          <View>
            {rows.map((row, index) => (
              <TaskRow
                key={row.id}
                id={row.id}
                title={row.title}
                projectName={row.projectName}
                dueDate={row.dueDate}
                isCompleted={row.isCompleted}
                isLastItem={index === rows.length - 1}
                onToggleComplete={(id, next) =>
                  setRows((prev) =>
                    prev.map((r) =>
                      r.id === id ? { ...r, isCompleted: next } : r
                    )
                  )
                }
                onPress={() => handleTaskPress(row)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
  previewSection: {
    marginTop: spacing.lg,
  },
  previewTitle: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
