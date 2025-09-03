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
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/useAuth";
import type { Project, Task } from "../../lib/supabase/types";
import { getDisplayName } from "../../utils/userUtils";
import { 
  useConstructionNetworkStatus, 
  useConstructionAppLifecycle,
  ConstructionOfflineStorage,
  ConstructionLoadingMessages 
} from "../../utils/constructionSiteSupport";

/**
 * Home Screen - Main app dashboard
 *
 * This is where users land after completing onboarding
 * Features the DashboardHeader with time-based greeting and user initials
 * Provides navigation to profile and notifications screens
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const [filterPeriod, setFilterPeriod] =
    React.useState<TaskFilterPeriod>("Today");

  // Construction site support - offline resilience and app lifecycle management
  const {
    isAppActive,
    networkInfo,
    offlineStorage,
    shouldPauseRealTimeUpdates,
    shouldUseReducedBandwidth,
  } = useConstructionAppLifecycle();

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

  // Load real task data with construction AI optimization
  const {
    tasks: allTasks,
    loading: tasksLoading,
    error: tasksError,
    upcomingTasks, // AI-enhanced upcoming tasks (max 5 for construction)
    getNextTaskForWorker,
    getWorkerContext,
  } = useTasks({
    includeCompleted: false,
    orderBy: 'due_date',
    orderDirection: 'asc',
    // Construction site optimization
    weatherConditions: 'good', // TODO: Get from weather API
    crewAvailability: true,
    materialStatus: 'available',
    // Mobile optimization
    staleTime: 5 * 60 * 1000, // 5 min cache for construction sites
    cacheTime: 30 * 60 * 1000, // 30 min offline support
    enableOfflineQueue: true,
  });

  // AI-enhanced next task state
  const [nextTask, setNextTask] = React.useState<Task | null>(null);
  const [nextTaskLoading, setNextTaskLoading] = React.useState(false);

  // Get AI-recommended next task
  React.useEffect(() => {
    if (!allTasks?.length || tasksLoading) return;

    const getNextTask = async () => {
      setNextTaskLoading(true);
      try {
        const workerContext = getWorkerContext();
        const aiNextTask = await getNextTaskForWorker(workerContext);
        setNextTask(aiNextTask);
      } catch (error) {
        console.warn('Failed to get AI next task, using first available:', error);
        // Fallback to first non-completed task
        const fallbackTask = allTasks.find(task => 
          task.stage !== 'completed' && task.stage !== 'blocked'
        );
        setNextTask(fallbackTask || null);
      }
      setNextTaskLoading(false);
    };

    getNextTask();
  }, [allTasks, tasksLoading, getNextTaskForWorker, getWorkerContext]);

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

  // Task navigation handlers - ID-based for mobile optimization
  const navigateToTask = React.useCallback((taskId: string) => {
    router.push({
      pathname: '/task-detail/[id]',
      params: { id: taskId }
    });
  }, [router]);

  const handleViewTask = () => {
    if (nextTask?.id) {
      navigateToTask(nextTask.id);
    }
  };

  const handleTaskPress = (taskId: string) => {
    navigateToTask(taskId);
  };

  const handleViewAllTasks = () => {
    router.push('/(tabs)/tasks');
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
          userName={getDisplayName(profile, user?.email)}
          hasNotifications={true}
          notificationCount={3}
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          style={{ marginBottom: spacing.sm }} // Add spacing below header
        />
        {/* Next Task Widget - AI-prioritized construction-optimized task */}
        {tasksLoading || nextTaskLoading ? (
          <View style={[styles.loadingWidget, { marginBottom: spacing.md }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Typography variant="bodyMedium" style={styles.loadingText}>
              Finding your next task...
            </Typography>
          </View>
        ) : tasksError ? (
          <View style={[styles.errorWidget, { marginBottom: spacing.md }]}>
            <Typography variant="bodyMedium" style={styles.errorText}>
              Unable to load tasks: {tasksError}
            </Typography>
          </View>
        ) : (
          <NextTaskWidget
            hasTask={!!nextTask}
            task={nextTask ? {
              id: nextTask.id,
              title: nextTask.title,
              projectName: "Construction Project", // TODO: Get from project join
              taskTitle: nextTask.title,
              dueDate: nextTask.dueDate ? new Date(nextTask.dueDate) : new Date(),
            } as NextTask : undefined}
            onViewTask={handleViewTask}
            style={{ marginBottom: spacing.md }}
            // AI context indicators (new optional props)
            showWeatherContext={nextTask?.weather_dependent}
            showMaterialStatus={!!nextTask?.materials_needed}
            aiPriorityReason={nextTask ? "AI optimized for construction workflow" : undefined}
            // Construction site indicators
            offlineMode={networkInfo.isOffline}
            showConnectivityStatus={true}
          />
        )}

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

        {/* Upcoming Tasks Widget - Construction-optimized with AI filtering (max 5 tasks) */}
        <UpcomingTaskWidget
          tasks={upcomingTasks || []}
          selectedPeriod={filterPeriod}
          onFilterChange={(period) => setFilterPeriod(period)}
          onTaskPress={handleTaskPress}
          onViewAllPress={handleViewAllTasks}
          loading={tasksLoading}
          error={tasksError}
          // Construction site indicators
          showOfflineIndicator={networkInfo.isOffline}
          networkStatus={networkInfo}
          pendingSyncCount={offlineStorage.getPendingCount()}
          emptyStateMessage={
            tasksLoading 
              ? ConstructionLoadingMessages.loading
              : networkInfo.isOffline
              ? "Working offline with cached tasks. Changes will sync when connection returns."
              : "No upcoming tasks found. Great job staying on top of your work!"
          }
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
