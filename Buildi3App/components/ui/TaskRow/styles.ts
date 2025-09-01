import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    // No background per Figma list style
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: spacing.xs, // 8px gap to content per Figma
    paddingLeft: 0, // align icon flush to left inside 44x44 touch area
  },
  content: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  title: {
    color: colors.text,
  },
  project: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.sm + 44 + spacing.xs, // left padding + check button + 8px gap
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
