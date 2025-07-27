/**
 * NotificationIcon Types
 *
 * Atomic Design - Atom component types
 */

export interface NotificationIconProps {
  /**
   * Whether the user has notifications
   * Controls badge visibility
   */
  hasNotification?: boolean;

  /**
   * Number of notifications to display in badge
   * Will show "99+" for counts over 99
   */
  notificationCount?: number;

  /**
   * Callback when notification icon is pressed
   * For navigation to notifications screen
   */
  onPress?: () => void;
}
