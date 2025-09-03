import { ViewStyle } from "react-native";
import { Task } from "../NextTaskContainer/types";

/**
 * Props for NextTaskWidget organism component
 *
 * This organism combines:
 * - WidgetTitle molecule (title with optional action)
 * - NextTaskContainer molecule (task content area)
 * - Button atom (view task action - only shown when hasTask=true)
 *
 * Based on Figma Design System Widget structure
 */
export interface NextTaskWidgetProps {
  /** Whether there is a task to display */
  hasTask: boolean;
  /** Task data to display (required when hasTask=true) */
  task?: Task;
  /** Callback when "View task" button is pressed (only shown when hasTask=true) */
  onViewTask?: () => void;
  /** Custom widget container styles */
  style?: ViewStyle;
  /** Widget title text (defaults to "Next task") */
  title?: string;
  /** Whether to show title action button (defaults to false) */
  hasAction?: boolean;
  /** Title action text (only used if hasAction=true) */
  actionText?: string;
  /** Callback for title action button */
  onActionPress?: () => void;
  /** Whether the widget is loading (shows loading state inside widget) */
  isLoading?: boolean;
  /** Whether to show weather context indicators */
  showWeatherContext?: boolean;
  /** Whether to show material status indicators */
  showMaterialStatus?: boolean;
  /** AI priority reason text */
  aiPriorityReason?: string;
  /** Whether offline mode is active */
  offlineMode?: boolean;
  /** Whether to show connectivity status */
  showConnectivityStatus?: boolean;
}
