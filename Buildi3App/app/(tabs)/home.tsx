import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, spacing } from "../../theme";
import DashboardHeader from "../../components/ui/DashboardHeader/DashboardHeader";
import { NextTaskWidget } from "../../components/ui/NextTaskWidget/NextTaskWidget";
import ProjectWidget from "../../components/ui/ProjectWidget/ProjectWidget";
import UpcomingTaskWidget from "../../components/ui/UpcomingTaskWidget";
import type { Task } from "../../components/ui/NextTaskContainer/types";
import type { TaskFilterPeriod } from "../../components/ui/UpcomingTaskWidget/types";

/**
 * Home Screen - Main app dashboard
 *
 * This is where users land after completing onboarding
 * Features the DashboardHeader with time-based greeting and user initials
 * Provides navigation to profile and notifications screens
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [filterPeriod, setFilterPeriod] =
    React.useState<TaskFilterPeriod>("Today");

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.sm, // 16px consistent horizontal padding
      paddingTop: Math.max(insets.top, 20) + spacing.lg, // Safe area + 32px base
      paddingBottom: Math.max(insets.bottom, 20) + spacing.sm, // Safe area + 16px base
    },
  });

  // Navigation handlers for DashboardHeader
  const handleProfilePress = () => {
    router.push("/profile");
  };

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Dashboard Header with dynamic greeting and navigation */}
      <DashboardHeader
        userName="Federico Ostan" // This will come from user context/auth later
        hasNotifications={true}
        notificationCount={3}
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
      />

      {/* Main Content Area - Scrollable */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Next Task Widget - Single widget that changes content based on hasTask */}
        <NextTaskWidget
          hasTask={true} // Change this to false to see "No upcoming tasks!" state
          task={{
            id: "task-1",
            projectName: "Office Building Renovation",
            taskTitle: "Review architectural plans and blueprints",
          }}
          onViewTask={() => console.log("View task pressed")}
          style={{ marginBottom: spacing.md }}
        />

        {/* Projects Widget - Shows list of projects */}
        <ProjectWidget
          projects={[
            {
              id: "project-1",
              name: "Office Building Renovation",
              iconName: "home",
              iconColor: "primaryLight",
              hasPercentage: true,
              percentage: 75,
            },
            {
              id: "project-2",
              name: "Shopping Mall Expansion",
              iconName: "shopping-bag",
              iconColor: "primaryLight",
            },
            {
              id: "project-3",
              name: "Residential Complex",
              iconName: "users",
              iconColor: "primaryLight",
            },
          ]}
          onAddProject={() => console.log("Add project pressed")}
          onViewAllProjects={() => console.log("View all projects pressed")}
          style={{ marginBottom: spacing.md }}
        />

        {/* Upcoming Tasks Widget */}
        <UpcomingTaskWidget
          tasks={[
            {
              id: "task-1",
              title: "Review architectural plans and blueprints",
              dueDate: new Date(),
              status: "pending",
            },
            {
              id: "task-2",
              title: "Coordinate with electrical contractor",
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
              status: "pending",
            },
            {
              id: "task-3",
              title: "Finalize material selections",
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
              status: "pending",
            },
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
  },

  content: {
    flex: 1,
    marginTop: spacing.lg, // Space between header and content
  },

  contentContainer: {
    paddingBottom: spacing.xl, // Extra padding at the bottom for scrolling
  },
});
