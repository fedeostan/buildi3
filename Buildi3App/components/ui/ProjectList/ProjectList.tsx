import React from "react";
import { View } from "react-native";
import { Typography } from "../Typography";
import Icon from "../Icon";
import ProjectItem from "../ProjectItem";
import { colors } from "../../../theme";
import { ProjectListProps } from "./types";
import { styles } from "./styles";

/**
 * ProjectList Organism Component
 *
 * A component that displays a list of projects with dividers.
 * Based on Figma design system layout.
 *
 * Following Atomic Design principles - this is an ORGANISM
 * (combines multiple molecules into a complex component)
 *
 * Features:
 * - Displays multiple projects in a list
 * - Adds dividers between projects
 * - Shows an empty state when no projects are available
 * - Uses design system tokens for colors and spacing
 *
 * @param projects - Array of project data to display
 * @param style - Optional style overrides
 */
const ProjectList: React.FC<ProjectListProps> = ({
  projects = [],
  style,
  onProjectPress,
}) => {
  // If no projects, show empty state
  if (!projects || projects.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <View style={styles.emptyIconContainer}>
          <Icon name="plus" size="lg" color={colors.textSubtitle} />
        </View>
        <Typography variant="bodyMedium" style={styles.emptyText}>
          This widget is empty
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {projects.map((project, index) => (
        <React.Fragment key={project.id || index}>
          <ProjectItem
            projectName={project.name}
            iconName={project.iconName}
            iconColor={project.iconColor}
            projectIconType={project.projectIconType}
            projectIconColor={project.projectIconColor}
            hasPercentage={project.hasPercentage}
            percentage={project.percentage}
            onPress={onProjectPress ? () => onProjectPress(project) : undefined}
          />
          {/* Add divider after each project except the last one */}
          {index < projects.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default ProjectList;
