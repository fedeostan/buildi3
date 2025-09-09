import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    minHeight: 56,
    borderWidth: 1,
    borderColor: "transparent",
  },
  containerTall: {
    minHeight: 64,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    height: 24,
    // Center the row vertically within the container when there's no top label
    // The container has padding; using marginTop adjusts visual centering
    // We'll keep it minimal to respect both states
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
  topLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  topLabelHiddenReserve: {
    // Reserve vertical space equal to label line height so empty state keeps same height
    opacity: 0,
  },
  mainText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.text,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textGray16,
  },

  // Bottom sheet styles
  bottomSheetHeader: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bottomSheetBackground,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  bottomSheetContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
  calendarHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  weekDayText: {
    width: 36,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 12,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  dayCell: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCellSelected: {
    backgroundColor: colors.primaryLight,
  },
  dayCellDisabled: {
    opacity: 0.4,
  },
  dayCellText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.sm,
    gap: spacing.sm,
  },
});

export const getContainerStyle = (
  disabled: boolean = false,
  hasError: boolean = false
) => {
  const base = [styles.container];
  if (disabled) base.push({ opacity: 0.6 });
  if (hasError) base.push({ borderColor: colors.error });
  return base;
};
