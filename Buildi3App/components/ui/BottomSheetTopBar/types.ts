import { SegmentedControlOption } from "../SegmentedControl/types";

export interface BottomSheetTopBarProps {
  /**
   * Options for the segmented control (Photos/Files)
   */
  segmentedOptions: SegmentedControlOption[];

  /**
   * Currently selected tab ID
   */
  selectedTabId: string;

  /**
   * Callback when tab is selected
   */
  onTabSelect: (option: SegmentedControlOption) => void;

  /**
   * Callback when cancel button is pressed
   */
  onCancel: () => void;

  /**
   * Callback when camera button is pressed
   */
  onCameraPress: () => void;

  /**
   * Custom style for the container
   */
  style?: any;

  /**
   * Cancel button text (default: "Cancel")
   */
  cancelText?: string;

  /**
   * Accessibility label for the top bar
   */
  accessibilityLabel?: string;
}
