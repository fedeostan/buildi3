import { ViewStyle, TextStyle } from "react-native";

/**
 * Option item for dropdown selection
 */
export interface DropdownOption {
  /** Unique identifier for the option */
  id: string;

  /** Display label for the option */
  label: string;

  /** Optional value (defaults to id if not provided) */
  value?: string;

  /** Whether this option is disabled */
  disabled?: boolean;

  /** Optional icon component for the option */
  icon?: React.ReactNode;
}

/**
 * Dropdown component props
 * Similar to Input but optimized for selection with bottom sheet
 */
export interface DropdownProps {
  /** Dropdown label text */
  label: string;

  /** Array of selectable options */
  options: DropdownOption[];

  /** Currently selected option value */
  value?: string;

  /** Callback when option is selected */
  onSelect?: (option: DropdownOption) => void;

  /** Placeholder text when no option is selected */
  placeholder?: string;

  /** Dropdown state for styling */
  state?: "default" | "filled" | "success" | "error";

  /** Error message to display (automatically sets state to 'error') */
  errorMessage?: string;

  /** Success message to display (automatically sets state to 'success') */
  successMessage?: string;

  /** Whether the dropdown is disabled */
  disabled?: boolean;

  /** Custom container styles */
  containerStyle?: ViewStyle;

  /** Custom dropdown field styles */
  fieldStyle?: ViewStyle;

  /** Custom label styles */
  labelStyle?: TextStyle;

  /** Custom selected text styles */
  selectedTextStyle?: TextStyle;

  /** Show/hide label when focused and filled (floating label effect) */
  showFloatingLabel?: boolean;

  /** Bottom sheet title */
  bottomSheetTitle?: string;

  /** Custom bottom sheet height (defaults to dynamic) */
  bottomSheetHeight?: number;

  /** Whether to show search in bottom sheet */
  enableSearch?: boolean;

  /** Search placeholder text */
  searchPlaceholder?: string;

  /** Callback when bottom sheet opens */
  onOpen?: () => void;

  /** Callback when bottom sheet closes */
  onClose?: () => void;

  /** Maximum height for bottom sheet content */
  maxBottomSheetHeight?: number;
}
