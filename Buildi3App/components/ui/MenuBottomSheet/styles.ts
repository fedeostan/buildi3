import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bottomSheetBackground,
    flex: 1,
  },
  content: {
    padding: spacing.sm, // 16px padding
    paddingTop: 0, // Top bar handles its own padding
  },
  title: {
    textAlign: "center",
    color: colors.text,
    fontWeight: "600",
    fontSize: 18,
    marginBottom: spacing.lg, // 32px spacing
  },
  section: {
    marginBottom: spacing.md, // 24px between sections
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontWeight: "500",
    fontSize: 14,
    marginBottom: spacing.xs, // 8px spacing
    paddingHorizontal: spacing.sm, // 16px horizontal padding
  },
  optionContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.sm, // 16px padding
    minHeight: 48, // Proper touch target
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    marginRight: spacing.sm, // 16px spacing
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
  },
  optionTextDestructive: {
    color: colors.error,
  },
  optionTextDisabled: {
    color: colors.disabledText,
  },
  optionDisabled: {
    opacity: 0.6,
  },
});