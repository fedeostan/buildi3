import { ViewStyle } from "react-native";
import { Task } from "../TaskList/types";
import { WidgetProps } from "../Widget/types";

/**
 * Filter periods for the upcoming tasks
 */
export type TaskFilterPeriod = "Today" | "This week" | "This month" | "All";

/**
 * Props for the UpcomingTaskWidget component
 * A widget that displays upcoming tasks with filtering capability
 */
export interface UpcomingTaskWidgetProps {
  /** Array of tasks to display */
  tasks: Task[];

  /** Currently selected filter period */
  selectedPeriod?: TaskFilterPeriod;

  /** Function called when a task item is pressed */
  onTaskPress?: (taskId: string) => void;

  /** Function called when filter period is changed */
  onFilterChange?: (period: TaskFilterPeriod) => void;

  /** Function called when "View All" action is pressed */
  onViewAllPress?: () => void;

  /** Whether to show the filter button */
  showFilter?: boolean;

  /** Custom widget title */
  title?: string;

  /** Additional widget props to override defaults */
  widgetProps?: Partial<WidgetProps>;

  /** Custom styles to apply to the container */
  style?: ViewStyle;
}
