import React, { memo } from "react";
import { View, ActivityIndicator } from "react-native";
import { NextTaskWidgetProps } from "./types";
import Widget from "../Widget";
import NextTaskContainer from "../NextTaskContainer";
import { Typography } from "../Typography";
import { colors, spacing } from "@/theme";

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
export const NextTaskWidget: React.FC<NextTaskWidgetProps> = memo(({
  hasTask,
  task,
  onViewTask,
  style,
  title = "Next task",
  hasAction = false,
  actionText = "Action",
  onActionPress,
  isLoading = false,
  showWeatherContext,
  showMaterialStatus,
  aiPriorityReason,
  offlineMode,
  showConnectivityStatus,
}) => {
  // Show loading state inside widget instead of hiding the whole widget
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={{
          backgroundColor: colors.widgetContentArea,
          borderRadius: 16,
          padding: spacing.md,
          minHeight: 88,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        }}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Typography variant="bodyMedium" style={{ color: colors.textSubtitle }}>
            Finding your next task...
          </Typography>
        </View>
      );
    }
    
    return <NextTaskContainer hasTask={hasTask} task={task} />;
  };

  return (
    <Widget
      title={title}
      hasAction={hasAction}
      actionText={actionText}
      onActionPress={onActionPress}
      showButton={hasTask && !isLoading} // Hide button when loading
      buttonText="View task"
      buttonVariant="primary" // Primary blue button as shown in Figma
      onButtonPress={onViewTask}
      style={style}
    >
      {renderContent()}
    </Widget>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if critical props change
  return (
    prevProps.hasTask === nextProps.hasTask &&
    prevProps.task?.id === nextProps.task?.id &&
    prevProps.task?.title === nextProps.task?.title &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.title === nextProps.title &&
    prevProps.showWeatherContext === nextProps.showWeatherContext &&
    prevProps.showMaterialStatus === nextProps.showMaterialStatus
  );
});

export default NextTaskWidget;
