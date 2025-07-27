import { TextInputProps, ViewStyle, TextStyle } from "react-native";

/**
 * Input component props
 * Following React Native TextInput patterns with design system integration
 */
export interface InputProps extends Omit<TextInputProps, "style"> {
  /** Input label text */
  label: string;

  /** Input state for styling */
  state?: "default" | "focus" | "filled" | "success" | "error";

  /** Error message to display (automatically sets state to 'error') */
  errorMessage?: string;

  /** Success message to display (automatically sets state to 'success') */
  successMessage?: string;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Custom container styles */
  containerStyle?: ViewStyle;

  /** Custom input styles */
  inputStyle?: TextStyle;

  /** Custom label styles */
  labelStyle?: TextStyle;

  /** Show/hide label when focused and filled (floating label effect) */
  showFloatingLabel?: boolean;

  /** Icon component to show on the right side */
  rightIcon?: React.ReactNode;

  /** Callback when the input container is pressed (useful for custom behaviors) */
  onContainerPress?: () => void;
}
