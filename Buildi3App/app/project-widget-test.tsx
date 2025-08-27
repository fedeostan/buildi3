import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Typography,
  UpcomingTaskWidget,
  TopNavigationBar,
} from "../components/ui";
import { spacing, colors } from "../theme";
import { Task } from "../components/ui/TaskList/types";
import { TaskFilterPeriod } from "../components/ui/UpcomingTaskWidget/types";
import { addDays, format } from "date-fns";

/**
 * Example screen for testing the UpcomingTaskWidget component
 * This shows the widget with different numbers of tasks
 */
export default function WidgetTestScreen() {
  // State for filter period
  const [filterPeriod, setFilterPeriod] = useState<TaskFilterPeriod>("Today");

  // Sample task data
  const allTasks: Task[] = [
    {
      id: "task-1",
      title: "Complete project proposal",
      dueDate: new Date(),
      status: "pending",
    },
    {
      id: "task-2",
      title: "Review design mockups",
      dueDate: addDays(new Date(), 1),
      status: "pending",
    },
    {
      id: "task-3",
      title: "Team meeting with clients",
      dueDate: addDays(new Date(), 2),
      status: "pending",
    },
    {
      id: "task-4",
      title: "Finalize budget spreadsheet",
      dueDate: addDays(new Date(), 3),
      status: "pending",
    },
    {
      id: "task-5",
      title: "Prepare presentation slides",
      dueDate: addDays(new Date(), 4),
      status: "pending",
    },
    {
      id: "task-6",
      title: "Weekly status update",
      dueDate: addDays(new Date(), 7),
      status: "pending",
    },
    {
      id: "task-7",
      title: "Contract review with legal",
      dueDate: addDays(new Date(), 14),
      status: "pending",
    },
  ];

  // Filter tasks based on selected period
  const getFilteredTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    switch (filterPeriod) {
      case "Today":
        return allTasks.filter((task) => {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });

      case "This week":
        return allTasks.filter((task) => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate < nextWeek;
        });

      case "This month":
        return allTasks.filter((task) => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate < nextMonth;
        });

      case "All":
      default:
        return allTasks;
    }
  };

  // Handle filter change
  const handleFilterChange = (period: TaskFilterPeriod) => {
    setFilterPeriod(period);
  };

  // Handle task press
  const handleTaskPress = (taskId: string) => {
    console.log(`Task pressed: ${taskId}`);
    // In a real app, navigate to task details screen
  };

  // Get filtered tasks
  const filteredTasks = getFilteredTasks();

  // Tasks subset for different examples
  const tasks1 = filteredTasks.slice(0, 1);
  const tasks2 = filteredTasks.slice(0, 2);
  const tasks3 = filteredTasks.slice(0, 3);
  const tasks4 = filteredTasks.slice(0, 4);
  const tasks5 = filteredTasks.slice(0, 5);
  const tasksEmpty: Task[] = [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <TopNavigationBar
        title="Widget Test"
        showBack={true}
        showNotification={false}
        showProfile={false}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Upcoming Task Widget
        </Typography>

        <Typography variant="bodyMedium" style={styles.description}>
          This widget shows upcoming tasks with filtering by time period. It can
          display up to 5 tasks maximum.
        </Typography>

        <View style={styles.widgetContainer}>
          <Typography variant="labelLarge" style={styles.widgetTitle}>
            5 Tasks Example
          </Typography>
          <UpcomingTaskWidget
            tasks={tasks5}
            selectedPeriod={filterPeriod}
            onFilterChange={handleFilterChange}
            onTaskPress={handleTaskPress}
            onViewAllPress={() => console.log("View all pressed")}
          />
        </View>

        <View style={styles.widgetContainer}>
          <Typography variant="labelLarge" style={styles.widgetTitle}>
            4 Tasks Example
          </Typography>
          <UpcomingTaskWidget
            tasks={tasks4}
            selectedPeriod={filterPeriod}
            onFilterChange={handleFilterChange}
            onTaskPress={handleTaskPress}
            onViewAllPress={() => console.log("View all pressed")}
          />
        </View>

        <View style={styles.widgetContainer}>
          <Typography variant="labelLarge" style={styles.widgetTitle}>
            3 Tasks Example
          </Typography>
          <UpcomingTaskWidget
            tasks={tasks3}
            selectedPeriod={filterPeriod}
            onFilterChange={handleFilterChange}
            onTaskPress={handleTaskPress}
            onViewAllPress={() => console.log("View all pressed")}
          />
        </View>

        <View style={styles.widgetContainer}>
          <Typography variant="labelLarge" style={styles.widgetTitle}>
            2 Tasks Example
          </Typography>
          <UpcomingTaskWidget
            tasks={tasks2}
            selectedPeriod={filterPeriod}
            onFilterChange={handleFilterChange}
            onTaskPress={handleTaskPress}
            onViewAllPress={() => console.log("View all pressed")}
          />
        </View>

        <View style={styles.widgetContainer}>
          <Typography variant="labelLarge" style={styles.widgetTitle}>
            1 Task Example
          </Typography>
          <UpcomingTaskWidget
            tasks={tasks1}
            selectedPeriod={filterPeriod}
            onFilterChange={handleFilterChange}
            onTaskPress={handleTaskPress}
            onViewAllPress={() => console.log("View all pressed")}
          />
        </View>

        <View style={styles.widgetContainer}>
          <Typography variant="labelLarge" style={styles.widgetTitle}>
            Empty State Example
          </Typography>
          <UpcomingTaskWidget
            tasks={tasksEmpty}
            selectedPeriod={filterPeriod}
            onFilterChange={handleFilterChange}
            onTaskPress={handleTaskPress}
            onViewAllPress={() => console.log("View all pressed")}
          />
        </View>

        <View style={styles.widgetContainer}>
          <Typography variant="labelLarge" style={styles.widgetTitle}>
            Without Filter Example
          </Typography>
          <UpcomingTaskWidget
            tasks={tasks3}
            showFilter={false}
            title="Simple Task List"
            onTaskPress={handleTaskPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    color: colors.text,
  },
  description: {
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  widgetContainer: {
    marginBottom: spacing.md,
  },
  widgetTitle: {
    marginBottom: spacing.xs,
    color: colors.text,
  },
});
