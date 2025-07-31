export interface SegmentedControlOption {
  id: string;
  label: string;
}

export interface SegmentedControlProps {
  /**
   * Array of options to display as tabs
   */
  options: SegmentedControlOption[];

  /**
   * Currently selected option ID
   */
  selectedId: string;

  /**
   * Callback when option is selected
   */
  onSelect: (option: SegmentedControlOption) => void;

  /**
   * Custom style for the container
   */
  style?: any;

  /**
   * Accessibility label for the control
   */
  accessibilityLabel?: string;
}
