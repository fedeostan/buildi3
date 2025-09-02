import React from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, spacing } from "../../theme";
import DashboardHeader from "../../components/ui/DashboardHeader/DashboardHeader";
import { NextTaskWidget } from "../../components/ui/NextTaskWidget/NextTaskWidget";
import ProjectWidget from "../../components/ui/ProjectWidget/ProjectWidget";
import UpcomingTaskWidget from "../../components/ui/UpcomingTaskWidget";
import { Typography } from "../../components/ui";
import type { NextTask } from "../../components/ui/NextTaskContainer/types";
import type { TaskFilterPeriod } from "../../components/ui/UpcomingTaskWidget/types";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import type { Project, Task } from "../../lib/supabase/types";

/**
 * Home Screen - Main app dashboard
 *
 * This is where users land after completing onboarding
 * Features the DashboardHeader with time-based greeting and user initials
 * Provides navigation to profile and notifications screens
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [filterPeriod, setFilterPeriod] =
    React.useState<TaskFilterPeriod>("Today");

  // Load real project data
  const {
    projects: dbProjects,
    loading: projectsLoading,
    error: projectsError,
    createProject,
  } = useProjects({
    includeCompleted: false,
    orderBy: 'updated_at',
    orderDirection: 'desc'
  });

  // Transform database projects to UI format
  const uiProjects: Project[] = dbProjects.map(dbProject => ({
    id: dbProject.id,
    name: dbProject.name,
    created_by: dbProject.created_by, // Required field
    projectIconType: dbProject.icon_type as any, // e.g., 'Building', 'House'
    projectIconColor: dbProject.icon_color as any, // e.g., 'Blue Light'
    hasPercentage: true,
    percentage: dbProject.progress_percentage || 0,
    // Include all other required fields with defaults
    description: dbProject.description,
    status: dbProject.status,
    progress_percentage: dbProject.progress_percentage,
    start_date: dbProject.start_date,
    end_date: dbProject.end_date,
    estimated_completion_date: dbProject.estimated_completion_date,
    actual_completion_date: dbProject.actual_completion_date,
    budget: dbProject.budget,
    location: dbProject.location,
    icon_type: dbProject.icon_type,
    icon_color: dbProject.icon_color,
    created_at: dbProject.created_at,
    updated_at: dbProject.updated_at,
    trade_categories: dbProject.trade_categories,
    weather_dependent: dbProject.weather_dependent,
    safety_requirements: dbProject.safety_requirements,
    inspection_schedule: dbProject.inspection_schedule,
  }));

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.sm, // 16px consistent horizontal padding
      paddingTop: Math.max(insets.top, 20) + spacing.sm, // Safe area + 32px base
      // Remove paddingBottom to allow content to scroll behind the tab bar
    },
  });

  // Navigation handlers for DashboardHeader
  const handleProfilePress = () => {
    router.push("/profile");
  };

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  // Project widget handlers
  const handleAddProject = async () => {
    try {
      const result = await createProject({
        name: `New Project ${uiProjects.length + 1}`,
        description: 'A new construction project',
        icon_type: 'General',
        icon_color: 'Blue Light',
      });
      
      if (result.error) {
        console.error('Failed to create project:', result.error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleViewAllProjects = () => {
    console.log("View all projects pressed");
    // TODO: Navigate to dedicated projects screen
  };

  const handleProjectPress = (project: Project) => {
    console.log("Project pressed:", project.name);
    // TODO: Navigate to project detail screen
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Main Content Area - Scrollable, including header */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Header with dynamic greeting and navigation */}
        <DashboardHeader
          userName="Federico Ostan" // This will come from user context/auth later
          hasNotifications={true}
          notificationCount={3}
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          style={{ marginBottom: spacing.sm }} // Add spacing below header
        />
        {/* Next Task Widget - Single widget that changes content based on hasTask */}
        <NextTaskWidget
          hasTask={true} // Change this to false to see "No upcoming tasks!" state
          task={{
            id: "task-1",
            title: "Review architectural plans and blueprints",
            projectName: "Office Building Renovation",
            taskTitle: "Review architectural plans and blueprints",
            dueDate: new Date(),
          } as NextTask}
          onViewTask={() => console.log("View task pressed")}
          style={{ marginBottom: spacing.md }}
        />

        {/* Projects Widget - Shows real projects from database */}
        {projectsLoading ? (
          <View style={styles.loadingWidget}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Typography variant="bodyMedium" style={styles.loadingText}>
              Loading projects...
            </Typography>
          </View>
        ) : projectsError ? (
          <View style={styles.errorWidget}>
            <Typography variant="bodyMedium" style={styles.errorText}>
              Unable to load projects: {projectsError}
            </Typography>
          </View>
        ) : (
          <ProjectWidget
            projects={uiProjects}
            onAddProject={handleAddProject}
            onViewAllProjects={handleViewAllProjects}
            onProjectPress={handleProjectPress}
            style={{ marginBottom: spacing.md }}
          />
        )}

        {/* Upcoming Tasks Widget */}
        <UpcomingTaskWidget
          tasks={[
            {
              id: "task-1",
              title: "Review architectural plans and blueprints",
              dueDate: new Date(),
              stage: "not-started",
              isCompleted: false,
            } as Task,
            {
              id: "task-2",
              title: "Coordinate with electrical contractor",
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
              stage: "not-started",
              isCompleted: false,
            } as Task,
            {
              id: "task-3",
              title: "Finalize material selections",
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
              stage: "not-started",
              isCompleted: false,
            } as Task,
          ]}
          selectedPeriod={filterPeriod}
          onFilterChange={(period) => setFilterPeriod(period)}
          onTaskPress={(taskId) => console.log(`Task pressed: ${taskId}`)}
          onViewAllPress={() => console.log("View all tasks pressed")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "visible",
  },

  content: {
    flex: 1,
    overflow: "visible",
  },

  contentContainer: {
    paddingBottom: spacing.layout + spacing.md, // 80px + 24px = 104px padding to ensure content is visible above the tab bar
    overflow: "visible",
  },

  loadingWidget: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },

  loadingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  errorWidget: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },

  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
