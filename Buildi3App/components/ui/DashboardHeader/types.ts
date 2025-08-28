/**
 * DashboardHeader Types
 *
 * Atomic Design - Organism component types
 */

import { StyleProp, ViewStyle } from "react-native";

export interface DashboardHeaderProps {
  /**
   * Additional style for the container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * User name for greeting text
   * Default: "Federico"
   */
  userName?: string;

  /**
   * Date to display above greeting
   * If not provided, will use current date formatted as "Wed, April 9"
   */
  date?: string;

  /**
   * Whether user has notifications
   * Controls notification badge visibility
   */
  hasNotifications?: boolean;

  /**
   * Number of notifications to display
   * Shows in notification badge
   */
  notificationCount?: number;

  /**
   * Callback when profile icon is pressed
   * For navigation to profile screen
   */
  onProfilePress?: () => void;

  /**
   * Callback when notification icon is pressed
   * For navigation to notifications screen
   */
  onNotificationPress?: () => void;
}
