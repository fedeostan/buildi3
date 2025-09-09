import { ViewStyle, TextStyle } from "react-native";

export type TagVariant = "red" | "yellow" | "green" | "neutral";

export interface TagProps {
  /** Tag variant determines color scheme */
  variant: TagVariant;
  /** Tag text content */
  text: string;
  /** Custom container style override */
  style?: ViewStyle;
  /** Custom text style override */
  textStyle?: TextStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export interface DateTagProps {
  /** Due date for the tag */
  dueDate: Date;
  /** Current date (defaults to now) */
  currentDate?: Date;
  /** Custom container style override */
  style?: ViewStyle;
  /** Custom text style override */
  textStyle?: TextStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
}
