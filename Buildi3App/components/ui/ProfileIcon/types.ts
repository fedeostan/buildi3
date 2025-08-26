/**
 * ProfileIcon Types
 *
 * Atomic Design - Atom component types
 */

export interface ProfileIconProps {
  /**
   * Size variant matching Figma design system
   * Large: 58x58px (dashboard header)
   * Medium: 44x44px (other contexts)
   */
  size?: "Large" | "Medium";

  /**
   * User initials to display
   * Will be derived from user.name
   * Default: "FO" (Federico Ostan)
   */
  initials?: string;

  /**
   * Whether to show notification badge
   * Small red dot indicator on top-right
   */
  hasNotification?: boolean;

  /**
   * Callback when profile icon is pressed
   * For navigation to profile screen
   */
  onPress?: () => void;
}
