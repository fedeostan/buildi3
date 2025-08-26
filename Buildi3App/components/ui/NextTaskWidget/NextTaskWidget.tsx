import React from "react";
import { NextTaskWidgetProps } from "./types";
import Widget from "../Widget";
import NextTaskContainer from "../NextTaskContainer";

/**
 * NextTaskWidget Organism Component
 *
 * A complete next task widget that combines multiple molecules into a cohesive unit.
 * This organism uses the existing Widget structure for consistency.
 *
 * Following atomic design principles:
 * - Uses Widget organism as base structure
 * - Combines WidgetTitle molecule (title + optional action)
 * - Uses NextTaskContainer molecule as swappable content
 * - Uses Button atom for "View task" action (only when hasTask=true)
 *
 * Based on Figma Design System:
 * - Title: "Next task" (Montserrat 500, 16px)
 * - Button: "View task" (only shown when hasTask=true, primary variant)
 * - Content: NextTaskContainer with task data or "no tasks" message
 * - Structure: Follows existing Widget organism pattern
 *
 * @param hasTask - Whether there is a task to display
 * @param task - Task data (required when hasTask=true)
 * @param onViewTask - Callback when "View task" button is pressed
 * @param style - Custom widget container styles
 * @param title - Widget title text (defaults to "Next task")
 * @param hasAction - Whether to show title action button
 * @param actionText - Title action text
 * @param onActionPress - Callback for title action button
 */
export const NextTaskWidget: React.FC<NextTaskWidgetProps> = ({
  hasTask,
  task,
  onViewTask,
  style,
  title = "Next task",
  hasAction = false,
  actionText = "Action",
  onActionPress,
}) => {
  return (
    <Widget
      title={title}
      hasAction={hasAction}
      actionText={actionText}
      onActionPress={onActionPress}
      showButton={hasTask} // Only show "View task" button when there's a task
      buttonText="View task"
      buttonVariant="primary" // Primary blue button as shown in Figma
      onButtonPress={onViewTask}
      style={style}
    >
      {/* NextTaskContainer as swappable content */}
      <NextTaskContainer hasTask={hasTask} task={task} />
    </Widget>
  );
};

export default NextTaskWidget;
