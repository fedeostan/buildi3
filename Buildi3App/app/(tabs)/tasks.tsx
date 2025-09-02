import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing } from "../../theme";
import {
  GeneralHeader,
  MenuSection,
  TaskSection,
  TaskDragPayload,
  DragProvider,
} from "../../components/ui";
import type { TaskStage } from "../../components/ui/TaskRow/types";

/**
 * Tasks Screen - Task management and tracking
 *
 * This screen allows users to manage their tasks,
 * view task lists, and track progress
 */
export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Task data with stages matching Figma design
  const [tasks, setTasks] = React.useState([
    {
      id: "1",
      title: "Design onboarding flow",
      projectName: "New App",
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      stage: "not-started" as TaskStage,
      isCompleted: false,
    },
    {
      id: "2",
      title: "Fix login bug", 
      projectName: "Auth",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      stage: "not-started" as TaskStage,
      isCompleted: false,
    },
    {
      id: "3",
      title: "Create wireframes",
      projectName: "New App", 
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 11 Sep (future)
      stage: "not-started" as TaskStage,
      isCompleted: false,
    },
    {
      id: "4",
      title: "Update dependencies",
      projectName: "Mobile",
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday  
      stage: "in-progress" as TaskStage,
      isCompleted: false,
    },
    {
      id: "5",
      title: "Call client to confirm scope",
      projectName: "Acme Co",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      stage: "in-progress" as TaskStage,
      isCompleted: false,
    },
    {
      id: "6",
      title: "Review final designs",
      projectName: "Mobile",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 11 Sep
      stage: "in-progress" as TaskStage,
      isCompleted: false,
    },
    {
      id: "7",
      title: "Prepare sprint report",
      projectName: "Ops", 
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      stage: "completed" as TaskStage,
      isCompleted: true,
    },
  ]);

  // Section expansion state
  const [expandedSections, setExpandedSections] = React.useState<Record<TaskStage, boolean>>({
    "not-started": true,
    "in-progress": true, 
    "completed": false,
    "blocked": false,
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
    setExpandedSections(prev => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  };

  // Handle task stage change
  const handleTaskStageChange = (taskId: string, newStage: TaskStage) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, stage: newStage, isCompleted: newStage === "completed" }
          : task
      )
    );
  };

  // Handle task completion toggle (legacy support)
  const handleTaskToggleComplete = (taskId: string, completed: boolean) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { 
              ...task, 
              isCompleted: completed, 
              stage: completed ? "completed" : "not-started" as TaskStage 
            }
          : task
      )
    );
  };

  // Handle task press - navigate to task detail screen
  const handleTaskPress = (task: any) => {
    router.push({
      pathname: "/task-detail",
      params: {
        id: task.id,
        title: task.title,
        projectName: task.projectName,
        dueDate: task.dueDate.toISOString(),
        isCompleted: task.isCompleted.toString(),
        stage: task.stage,
      },
    });
  };

  // Handle drag start
  const handleDragStart = (payload: TaskDragPayload) => {
    console.log(`Started dragging task: ${payload.title}`);
  };

  // Handle drag end  
  const handleDragEnd = (payload: TaskDragPayload) => {
    console.log(`Ended dragging task: ${payload.title}`);
  };

  // Handle task drop - move task to new stage
  const handleTaskDrop = (draggedTask: TaskDragPayload, targetStage: TaskStage) => {
    console.log(`Moving task "${draggedTask.title}" from ${draggedTask.stage} to ${targetStage}`);
    
    // Update the task's stage using existing handler
    handleTaskStageChange(draggedTask.id, targetStage);
  };

  // Organize tasks by stage and sort by due date (closest first)
  const tasksByStage = React.useMemo(() => {
    const stages: Record<TaskStage, typeof tasks> = {
      "not-started": [],
      "in-progress": [],
      "completed": [],
      "blocked": [],
    };

    tasks.forEach(task => {
      stages[task.stage].push(task);
    });

    // Sort each stage by due date (closest first)
    Object.keys(stages).forEach(stageKey => {
      const stage = stageKey as TaskStage;
      stages[stage].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    });

    return stages;
  }, [tasks]);

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
                tasks={tasksByStage[config.stage]}
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
});
