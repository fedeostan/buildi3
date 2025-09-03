import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

/**
 * MenuListItem Component Styles
 *
 * Following design tokens for consistent menu row appearance
 * Supports default and destructive variants
 */

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary, // White background
    borderRadius: 12, // Consistent with widget styling
    marginVertical: spacing.xs / 2, // 4px vertical margin between items
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm, // 16px horizontal padding
    paddingVertical: spacing.sm, // 16px vertical padding
    minHeight: 56, // Touch-friendly minimum height
  },

  leftSection: {
    marginRight: spacing.sm, // 16px space between icon and title
  },

  middleSection: {
    flex: 1, // Take remaining space
    justifyContent: 'center',
  },

  rightSection: {
    marginLeft: spacing.xs, // 8px space between title and chevron
    justifyContent: 'center',
  },

  // Title text styles
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  titleDefault: {
    color: colors.text, // Primary text color
  },

  titleDestructive: {
    color: colors.error, // Red color for destructive actions
  },

  // Icon styles
  icon: {
    // Icon styles handled by Icon component
  },

  // Chevron styles
  chevron: {
    // Chevron styles handled by Icon component
  },
});