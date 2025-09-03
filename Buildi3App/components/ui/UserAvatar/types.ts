/**
 * UserAvatar Component Types
 *
 * Defines TypeScript interfaces for the UserAvatar molecule component
 * that displays user initials and full name from profile data
 */

export interface UserAvatarProps {
  /** User's first name */
  firstName?: string | null;
  /** User's last name */
  lastName?: string | null;
  /** User's full name (computed from first + last name) */
  fullName?: string;
  /** Avatar size variant */
  size?: 'medium' | 'large';
  /** Custom avatar URL (not implemented yet) */
  avatarUrl?: string | null;
  /** Whether to show the full name below avatar */
  showName?: boolean;
  /** Optional onPress handler for navigation */
  onPress?: () => void;
  /** Custom style overrides */
  style?: any;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

export interface UserAvatarStyleProps {
  /** Container styles for different sizes */
  container: any;
  containerMedium: any;
  containerLarge: any;
  
  /** Avatar circle styles */
  avatar: any;
  avatarMedium: any;
  avatarLarge: any;
  
  /** Initials text styles */
  initials: any;
  initialsMedium: any;
  initialsLarge: any;
  
  /** Full name text styles */
  fullName: any;
  
  /** Wrapper for avatar + name */
  wrapper: any;
}