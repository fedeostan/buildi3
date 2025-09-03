/**
 * MenuListItem Component Types
 *
 * Defines TypeScript interfaces for the MenuListItem atom component
 * used for menu rows with icon, title, and chevron navigation
 */

import { FeatherIconName } from '../Icon/types';

export interface MenuListItemProps {
  /** Title text to display */
  title: string;
  /** Feather icon name to display on the left */
  iconName: FeatherIconName;
  /** Callback when the menu item is pressed */
  onPress: () => void;
  /** Visual variant for different menu item types */
  variant?: 'default' | 'destructive';
  /** Whether to show the chevron-right icon */
  showChevron?: boolean;
  /** Custom style overrides */
  style?: any;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

export interface MenuListItemStyleProps {
  /** Container styles */
  container: any;
  
  /** Content wrapper styles */
  content: any;
  
  /** Left section with icon styles */
  leftSection: any;
  
  /** Middle section with title styles */
  middleSection: any;
  
  /** Right section with chevron styles */
  rightSection: any;
  
  /** Title text styles */
  title: any;
  titleDefault: any;
  titleDestructive: any;
  
  /** Icon styles */
  icon: any;
  
  /** Chevron styles */
  chevron: any;
}