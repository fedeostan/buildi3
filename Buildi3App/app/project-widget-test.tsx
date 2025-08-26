import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ProjectWidget } from "../components/ui/ProjectWidget";
import { Typography } from "../components/ui/Typography";
import { colors, spacing } from "../theme";

/**
 * Demo screen to showcase all variants of ProjectWidget
 */
const ProjectWidgetTestScreen = () => {
  const insets = useSafeAreaInsets();

  // Sample projects data
  const projectsWithFive = [
    {
      id: "1",
      name: "Office Building Renovation",
      projectIconType: "Building",
      projectIconColor: "Blue Light",
      hasPercentage: true,
      percentage: 75,
    },
    {
      id: "2",
      name: "Shopping Mall Expansion",
      projectIconType: "Building",
      projectIconColor: "Green Pond",
      hasPercentage: true,
      percentage: 45,
    },
    {
      id: "3",
      name: "Residential Complex",
      projectIconType: "House",
      projectIconColor: "Pink",
      hasPercentage: true,
      percentage: 30,
    },
    {
      id: "4",
      name: "Urban Park Development",
      projectIconType: "Outdoors",
      projectIconColor: "Green Light",
      hasPercentage: true,
      percentage: 60,
    },
    {
      id: "5",
      name: "Community Center",
      projectIconType: "General",
      projectIconColor: "Purple",
      hasPercentage: true,
      percentage: 15,
    },
  ];

  const projectsWithFour = projectsWithFive.slice(0, 4);
  const projectsWithThree = projectsWithFive.slice(0, 3);
  const projectsWithTwo = projectsWithFive.slice(0, 2);
  const projectsWithOne = projectsWithFive.slice(0, 1);
  const projectsEmpty = [];

  // Mock handler functions
  const handleAddProject = () => {
    Alert.alert("Add Project", "This would open the add project screen");
  };

  const handleViewAllProjects = () => {
    Alert.alert(
      "View All Projects",
      "This would navigate to all projects screen"
    );
  };

  const handleProjectPress = (project: any) => {
    Alert.alert(
      "Project Selected",
      `You selected the project: ${project.name}`
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <Stack.Screen
        options={{
          title: "Project Widget Demo",
          headerShown: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="headingMedium" style={styles.sectionTitle}>
          ProjectWidget Variants
        </Typography>

        <Typography variant="bodyMedium" style={styles.sectionSubtitle}>
          1. Five Projects (No Button)
        </Typography>
        <ProjectWidget
          projects={projectsWithFive}
          onAddProject={handleAddProject}
          onViewAllProjects={handleViewAllProjects}
          onProjectPress={handleProjectPress}
          style={styles.widget}
        />

        <Typography variant="bodyMedium" style={styles.sectionSubtitle}>
          2. Four Projects (With Button)
        </Typography>
        <ProjectWidget
          projects={projectsWithFour}
          onAddProject={handleAddProject}
          onViewAllProjects={handleViewAllProjects}
          onProjectPress={handleProjectPress}
          style={styles.widget}
        />

        <Typography variant="bodyMedium" style={styles.sectionSubtitle}>
          3. Three Projects (With Button)
        </Typography>
        <ProjectWidget
          projects={projectsWithThree}
          onAddProject={handleAddProject}
          onViewAllProjects={handleViewAllProjects}
          onProjectPress={handleProjectPress}
          style={styles.widget}
        />

        <Typography variant="bodyMedium" style={styles.sectionSubtitle}>
          4. Two Projects (With Button)
        </Typography>
        <ProjectWidget
          projects={projectsWithTwo}
          onAddProject={handleAddProject}
          onViewAllProjects={handleViewAllProjects}
          onProjectPress={handleProjectPress}
          style={styles.widget}
        />

        <Typography variant="bodyMedium" style={styles.sectionSubtitle}>
          5. One Project (With Button)
        </Typography>
        <ProjectWidget
          projects={projectsWithOne}
          onAddProject={handleAddProject}
          onViewAllProjects={handleViewAllProjects}
          onProjectPress={handleProjectPress}
          style={styles.widget}
        />

        <Typography variant="bodyMedium" style={styles.sectionSubtitle}>
          6. Empty State (With Button)
        </Typography>
        <ProjectWidget
          projects={projectsEmpty}
          onAddProject={handleAddProject}
          onViewAllProjects={handleViewAllProjects}
          onProjectPress={handleProjectPress}
          style={styles.widget}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.sm,
    paddingBottom: spacing.xl * 2,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.text,
  },
  sectionSubtitle: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  widget: {
    marginBottom: spacing.md,
  },
});

export default ProjectWidgetTestScreen;
