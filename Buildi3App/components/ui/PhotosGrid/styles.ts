import { StyleSheet, Dimensions } from "react-native";
import { colors, spacing } from "../../../theme";

const { width: screenWidth } = Dimensions.get("window");

/**
 * PhotosGrid Styles - Matching Figma Design System
 *
 * Based on Figma design:
 * - 3 columns grid layout
 * - 2px spacing between items
 * - Square aspect ratio for photos
 * - White background for photo placeholders
 * - Responsive to screen width
 */

// Calculate item width based on screen width and spacing
const ITEM_SPACING = 2; // 2px spacing from Figma
const CONTAINER_PADDING = 16; // Standard padding
const NUM_COLUMNS = 3;

// Calculate the available width for photos
const availableWidth = screenWidth - CONTAINER_PADDING * 2;
const totalSpacing = ITEM_SPACING * (NUM_COLUMNS - 1);
const itemWidth = (availableWidth - totalSpacing) / NUM_COLUMNS;

export const styles = StyleSheet.create({
  // Grid container
  container: {
    flex: 1,
    paddingHorizontal: CONTAINER_PADDING,
  },

  // FlatList content container
  contentContainer: {
    paddingVertical: spacing.sm, // 16px vertical padding
  },

  // Photo grid row container
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ITEM_SPACING, // 2px bottom margin
  },

  // Individual photo item
  photoItem: {
    width: itemWidth,
    height: itemWidth * 0.8, // Slightly rectangular like Figma (~75px height vs ~93px width)
    marginRight: ITEM_SPACING, // 2px right margin
    backgroundColor: colors.backgroundSecondary, // White background
    borderRadius: 8, // Subtle border radius for better visual
    overflow: "hidden",
  },

  // Remove margin from last item in row
  lastPhotoInRow: {
    marginRight: 0,
  },

  // Photo image styling
  photoImage: {
    width: "100%",
    height: "100%",
  },

  // Placeholder for empty photos
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
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
  },

  // Empty state text
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter",
    textAlign: "center",
  },
});

// Export calculated values for use in component
export const gridConstants = {
  itemWidth,
  itemSpacing: ITEM_SPACING,
  numColumns: NUM_COLUMNS,
};
