import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../../theme";
import { Typography, GeneralHeader, MenuSection } from "../../components/ui";

/**
 * Add Task Screen - Create new tasks and projects
 *
 * This screen provides forms and interfaces for users
 * to create new tasks and add them to projects
 */
export default function AddTaskScreen() {
  const insets = useSafeAreaInsets();

  // Context-specific menu options for Add Task screen
  const addTaskMenuSections: MenuSection[] = [
    {
      title: "Quick Add",
      options: [
        { id: "quick-task", label: "Quick Task", icon: "plus" },
        { id: "from-template", label: "From Template", icon: "copy" },
        { id: "recurring-task", label: "Recurring Task", icon: "clock" },
      ],
    },
    {
      title: "Project Tasks",
      options: [
        { id: "add-to-project", label: "Add to Project", icon: "folder" },
        { id: "new-project", label: "Create New Project", icon: "folder-plus" },
      ],
    },
    {
      options: [
        { id: "task-templates", label: "Manage Templates", icon: "settings" },
      ],
    },
  ];

  // Handle menu option selection
  const handleMenuOptionSelect = (optionId: string) => {
    console.log("Add Task menu option selected:", optionId);
    // TODO: Implement specific actions for each menu option
    switch (optionId) {
      case "quick-task":
        // Show quick task creation form
        break;
      case "from-template":
        // Show template selection
        break;
      case "recurring-task":
        // Show recurring task setup
        break;
      case "add-to-project":
        // Show project selection
        break;
      case "new-project":
        // Show new project creation
        break;
      case "task-templates":
        // Navigate to template management
        break;
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: Math.max(insets.top, 20),
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* General Header with Add Task-specific menu */}
      <GeneralHeader
        title="Add Task"
        menuSections={addTaskMenuSections}
        onMenuOptionSelect={handleMenuOptionSelect}
        menuTitle="Add Task Options"
      />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeholderContainer}>
          <Typography variant="h4" style={styles.placeholderTitle}>
            Add Task
          </Typography>
          <Typography variant="bodyMedium" style={styles.placeholderText}>
            Task creation functionality will be implemented here.
          </Typography>
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
    paddingHorizontal: spacing.sm,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  placeholderTitle: {
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  placeholderText: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});