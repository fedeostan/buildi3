import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

/**
 * UserAvatar Component Styles
 *
 * Following design tokens and ProfileIcon patterns from existing codebase
 * Supports medium (44px) and large (58px) sizes matching ProfileIcon
 */

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Size variants matching ProfileIcon component
  containerMedium: {
    // No additional container styles needed for medium
  },

  containerLarge: {
    // No additional container styles needed for large
  },

  // Avatar circle (reusing ProfileIcon patterns)
  avatar: {
    borderRadius: 50, // Large enough to ensure circle
    backgroundColor: colors.primary, // Main brand color for avatar background
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar size variants (matching ProfileIcon exactly)
  avatarMedium: {
    width: 44,
    height: 44,
  },

  avatarLarge: {
    width: 58, 
    height: 58,
  },

  // Initials text styles (matching ProfileIcon patterns)
  initials: {
    color: colors.textInverse, // White text on colored background
    fontWeight: '600',
    textAlign: 'center',
  },

  // Initials size variants (matching ProfileIcon typography)
  initialsMedium: {
    fontSize: 16,
    lineHeight: 20,
  },

  initialsLarge: {
    fontSize: 20,
    lineHeight: 24,
  },

  // Full name text below avatar
  fullName: {
    color: colors.text, // Primary text color
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: spacing.xs, // 8px spacing between avatar and name
  },
});