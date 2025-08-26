import React from "react";
import Widget from "../Widget";
import ProjectList from "../ProjectList";
import { ProjectWidgetProps } from "./types";
import { Project } from "../ProjectList/types";

/**
 * ProjectWidget Organism Component
 *
 * A widget that displays a list of projects.
 * Based on Figma design system layout.
 *
 * Following Atomic Design principles - this is an ORGANISM
 * (combines multiple organisms and molecules into a complete UI section)
 *
 * Features:
 * - Reuses existing Widget component with title and action
 * - Shows a list of projects using ProjectList component
 * - Shows empty state when no projects are available
 * - Has an "Add new project" button
 * - Uses design system tokens for colors and spacing
 *
 * @param projects - Array of project data to display
 * @param onAddProject - Function called when add project button is pressed
 * @param onViewAllProjects - Function called when "See more" action is pressed
 * @param style - Optional style overrides for the widget
 */
const ProjectWidget: React.FC<ProjectWidgetProps> = ({
  projects = [],
  onAddProject,
  onViewAllProjects,
  onProjectPress,
  style,
}) => {
  // Based on Figma design:
  // - With 5 projects - no button
  // - With 4 or fewer projects - show button
  // - Empty state - show button
  const showButton = projects.length < 5;

  // Hide percentage indicators by creating a modified projects array
  const projectsWithoutPercentage = projects.map((project: Project) => ({
    ...project,
    hasPercentage: false, // Override to hide percentage indicators
  }));

  return (
    <Widget
      title="Projects"
      actionText="See more"
      onActionPress={onViewAllProjects}
      hasAction={true}
      showButton={showButton}
      buttonText="Add new project"
      buttonVariant="secondary"
      onButtonPress={onAddProject}
      style={style}
    >
      <ProjectList
        projects={projectsWithoutPercentage}
        onProjectPress={onProjectPress}
      />
    </Widget>
  );
};

export default ProjectWidget;
