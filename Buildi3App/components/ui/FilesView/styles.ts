import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme";

/**
 * FilesView Styles - Following WhatsApp Design Patterns
 *
 * Based on WhatsApp file sharing interface:
 * - List layout with file items
 * - File icon, name, and size information
 * - Clean separation between items
 * - Touch-friendly sizing
 */

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary, // White background
  },

  // File list container
  listContainer: {
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    paddingVertical: spacing.xs, // 8px vertical padding
  },

  // Individual file item
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm, // 16px vertical padding
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12, // Subtle rounded corners
    marginBottom: spacing.xs, // 8px bottom margin
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android shadow
  },

  // File icon container
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary + "15", // Light blue background with opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm, // 16px right margin
  },

  // File info container (name and size)
  fileInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },

  // File name text
  fileName: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
    color: colors.text,
    marginBottom: 2,
    lineHeight: 20,
  },

  // File size text
  fileSize: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Browse files button
  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg, // 32px vertical padding
    paddingHorizontal: spacing.md, // 24px horizontal padding
    backgroundColor: colors.primary + "10", // Very light blue background
    borderRadius: 12,
    marginHorizontal: spacing.sm, // 16px horizontal margin
    marginVertical: spacing.md, // 24px vertical margin
    borderWidth: 1,
    borderColor: colors.primary + "30", // Light blue border
    borderStyle: "dashed",
  },

  // Browse button text
  browseButtonText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
    color: colors.primary,
    marginLeft: spacing.xs, // 8px left margin (after icon)
  },

  // Loading container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl, // 40px vertical padding
  },

  // Loading text
  loadingText: {
    marginTop: spacing.sm, // 16px top margin
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter",
  },

  // Empty state container
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },

  // Empty state text
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter",
    textAlign: "center",
    marginTop: spacing.sm,
  },

  // File type badge
  fileTypeBadge: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 2,
  },

  // File type badge text
  fileTypeBadgeText: {
    fontSize: 10,
    fontFamily: "Inter",
    fontWeight: "600",
    color: colors.backgroundSecondary,
    textTransform: "uppercase",
  },
});
