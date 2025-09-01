import { FeatherIconName } from "../Icon/types";

export interface TabBarItem {
  /** Screen name for navigation */
  name: string;
  /** Display title in tab bar */
  title: string;
  /** Feather icon name for the tab */
  icon: FeatherIconName;
}

export interface BottomTabBarProps {
  /** Array of tab configuration objects */
  items: TabBarItem[];
  /** Currently active tab name */
  activeTab?: string;
  /** Callback when tab is pressed */
  onTabPress?: (tabName: string) => void;
}

export interface TabBarButtonProps {
  /** Tab configuration */
  item: TabBarItem;
  /** Whether this tab is currently active */
  isActive: boolean;
  /** Callback when tab is pressed */
  onPress: () => void;
}