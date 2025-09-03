import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.widgetContentArea,
    borderRadius: 16,
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    paddingVertical: spacing.sm, // 16px vertical padding
    marginBottom: spacing.xs, // 8px margin between items
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72, // Minimum height for proper content spacing
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android shadow
  },
  containerDragging: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.02 }], // Slightly larger when dragging
  },
  checkboxContainer: {
    width: 44,
    height: 44,
    borderRadius: 22, // Circular
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm, // 16px spacing from content
  },
  checkboxContainerCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxIcon: {
    // Icon styling handled by Icon component
  },
  contentContainer: {
    flex: 1,
    paddingRight: spacing.xs, // Small spacing before tag
  },
  taskTitle: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
    opacity: 0.7,
  },
  taskDescription: {
    color: colors.textSecondary,
  },
  taskDescriptionCompleted: {
    opacity: 0.5,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueLabel: {
    color: colors.textSubtitle,
    marginRight: spacing.xs / 2, // ~4px per Figma
  },
  dueValue: {
    color: colors.textSubtitle,
  },
  tagContainer: {
    // Tag styling handled by Tag component
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  // Pressed state styles
  containerPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  // Status indicator styles
  statusIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginRight: spacing.sm, // 16px spacing from content
  },
  statusIndicatorCompleted: {
    backgroundColor: colors.greenAlpha10,
  },
  statusIndicatorYellow: {
    backgroundColor: colors.yellowAlpha10,
  },
  statusIndicatorRed: {
    backgroundColor: colors.redAlpha10,
  },
});
