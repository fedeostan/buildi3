import { TextInputProps, ViewStyle, TextStyle } from "react-native";

/**
 * TextArea component props
 * Multiline text input following React Native TextInput patterns
 */
export interface TextAreaProps extends Omit<TextInputProps, "style"> {
  /** TextArea label text */
  label: string;

  /** TextArea state for styling */
  state?: "default" | "focus" | "filled" | "success" | "error";

  /** Error message to display (automatically sets state to 'error') */
  errorMessage?: string;

  /** Success message to display (automatically sets state to 'success') */
  successMessage?: string;

  /** Whether the textarea is disabled */
  disabled?: boolean;

  /** Minimum height for the textarea */
  minHeight?: number;

  /** Maximum height for the textarea (enables scrolling) */
  maxHeight?: number;

  /** Custom container styles */
  containerStyle?: ViewStyle;

  /** Custom input styles */
  inputStyle?: TextStyle;

  /** Custom label styles */
  labelStyle?: TextStyle;

  /** Show/hide label when focused and filled (floating label effect) */
  showFloatingLabel?: boolean;

  /** Callback when the textarea container is pressed */
  onContainerPress?: () => void;

  /** Character count limit */
  maxLength?: number;

  /** Show character counter */
  showCharacterCount?: boolean;
}
