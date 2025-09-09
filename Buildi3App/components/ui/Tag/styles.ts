import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    borderRadius: 8, // Figma: 8px corner radius
    paddingHorizontal: spacing.xs, // 8px horizontal padding
    paddingVertical: 4, // 4px vertical padding for compact appearance
    borderWidth: 0, // Figma: no border
    alignSelf: "flex-start", // Don't stretch to full width
    minHeight: 24, // Minimum height for proper touch target
  },
  text: {
    fontSize: 12,
    fontWeight: "400", // Figma Body/Small 400
    lineHeight: 16,
    letterSpacing: 0.1,
    textAlign: "center",
  },
  // Red variant (overdue tasks)
  redContainer: {
    backgroundColor: colors.tagRedBackground,
  },
  redText: {
    color: colors.tagRedText,
  },
  // Yellow variant (today/tomorrow)
  yellowContainer: {
    backgroundColor: colors.tagYellowBackground,
  },
  yellowText: {
    color: colors.tagYellowText,
  },
  // Green variant (future tasks)
  greenContainer: {
    backgroundColor: colors.tagGreenBackground,
  },
  greenText: {
    color: colors.tagGreenText,
  },
  // Neutral variant (not started)
  neutralContainer: {
    backgroundColor: colors.tagNeutralBackground,
  },
  neutralText: {
    color: colors.tagNeutralText,
  },
});
