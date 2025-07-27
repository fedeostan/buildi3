import React, { useState, useRef } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { InputProps } from "./types";
import { styles, getContainerStyle } from "./styles";
import { colors } from "../../../theme";

/**
 * Input Component matching Figma Design System
 *
 * Features:
 * - Matches exact Figma design (colors, typography, spacing)
 * - React Native TextInput best practices
 * - Accessibility support
 * - Multiple states: default, focus, filled, success, error
 * - Floating label animation
 * - Right icon support
 * - Error/success message display
 * - Proper keyboard handling
 *
 * Based on Figma: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=44-1328
 *
 * @param label - Input label text (required)
 * @param state - Visual state override
 * @param errorMessage - Error text (sets state to error)
 * @param successMessage - Success text (sets state to success)
 * @param disabled - Disable input interaction
 * @param showFloatingLabel - Enable floating label animation
 * @param rightIcon - Component to show on right side
 * @param containerStyle - Custom container styles
 * @param inputStyle - Custom input field styles
 * @param labelStyle - Custom label styles
 * @param onContainerPress - Container press handler
 * @param props - All other TextInput props (value, onChangeText, etc.)
 *
 * @example
 * // Basic usage
 * <Input label="Name" value={name} onChangeText={setName} />
 *
 * // With error
 * <Input label="Email" value={email} onChangeText={setEmail} errorMessage="Invalid email" />
 *
 * // With success
 * <Input label="Username" value={username} onChangeText={setUsername} successMessage="Available!" />
 *
 * // With right icon
 * <Input label="Password" secureTextEntry rightIcon={<EyeIcon />} />
 */
export const Input: React.FC<InputProps> = ({
  label,
  state,
  errorMessage,
  successMessage,
  disabled = false,
  showFloatingLabel = true,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  onContainerPress,
  value,
  onFocus,
  onBlur,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Determine current state based on props and internal state
  const getCurrentState = ():
    | "default"
    | "focus"
    | "filled"
    | "success"
    | "error" => {
    // Error state takes priority
    if (errorMessage) return "error";

    // Success state
    if (successMessage) return "success";

    // Override state if provided
    if (state) return state;

    // Auto-detect state based on interaction
    if (isFocused) return "focus";
    if (value && value.length > 0) return "filled";

    return "default";
  };

  const currentState = getCurrentState();
  const hasValue = value && value.length > 0;
  const shouldShowFloatingLabel = showFloatingLabel && (isFocused || hasValue);

  // Show label only when focused or has value (floating label behavior)
  const shouldShowLabel = isFocused || hasValue;

  // Handle focus
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Handle container press (focus input)
  const handleContainerPress = () => {
    if (!disabled) {
      inputRef.current?.focus();
      onContainerPress?.();
    }
  };

  return (
    <View>
      {/* Main Input Container */}
      <Pressable
        style={[getContainerStyle(currentState, disabled), containerStyle]}
        onPress={handleContainerPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label} input field`}
        accessibilityHint={
          disabled ? "Input is disabled" : "Tap to focus input"
        }
      >
        <View
          style={
            shouldShowLabel
              ? styles.contentContainerWithLabel
              : styles.contentContainer
          }
        >
          {/* Label - Only show when focused or has value */}
          {shouldShowLabel && (
            <Text
              style={[
                styles.label,
                shouldShowFloatingLabel && styles.labelFloating,
                disabled && styles.labelDisabled,
                labelStyle,
              ]}
            >
              {label}
            </Text>
          )}

          {/* Input Row */}
          <View style={styles.inputRow}>
            {/* Text Input */}
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                disabled && styles.inputDisabled,
                inputStyle,
              ]}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={isFocused ? "" : placeholder || label}
              placeholderTextColor={colors.textTertiary}
              editable={!disabled}
              selectionColor={colors.inputCursor} // Cursor color from Figma
              cursorColor={colors.inputCursor} // Android cursor color
              accessible={true}
              accessibilityLabel={label}
              accessibilityHint={errorMessage || successMessage || undefined}
              {...props}
            />

            {/* Right Icon */}
            {rightIcon && (
              <View style={styles.rightIconContainer}>{rightIcon}</View>
            )}
          </View>
        </View>
      </Pressable>

      {/* Error Message */}
      {errorMessage && (
        <Text style={styles.errorMessage} accessibilityRole="alert">
          {errorMessage}
        </Text>
      )}

      {/* Success Message */}
      {successMessage && !errorMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}
    </View>
  );
};
