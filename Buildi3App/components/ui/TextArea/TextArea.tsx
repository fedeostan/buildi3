import React, { useState, useRef } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { TextAreaProps } from "./types";
import { styles, getContainerStyle } from "./styles";
import { colors } from "../../../theme";

/**
 * TextArea Component matching Figma Design System
 *
 * Features:
 * - Matches exact Figma design (colors, typography, spacing)
 * - React Native TextInput multiline best practices
 * - Accessibility support
 * - Multiple states: default, focus, filled, success, error
 * - Floating label animation
 * - Character counter support
 * - Auto-growing height with max height limit
 * - Error/success message display
 * - Proper keyboard handling
 *
 * Based on Figma: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=44-1329
 *
 * @param label - TextArea label text (required)
 * @param state - Visual state override
 * @param errorMessage - Error text (sets state to error)
 * @param successMessage - Success text (sets state to success)
 * @param disabled - Disable textarea interaction
 * @param minHeight - Minimum height for textarea
 * @param maxHeight - Maximum height for textarea (enables scrolling)
 * @param showFloatingLabel - Enable floating label animation
 * @param showCharacterCount - Show character counter
 * @param maxLength - Maximum character limit
 * @param containerStyle - Custom container styles
 * @param inputStyle - Custom textarea field styles
 * @param labelStyle - Custom label styles
 * @param onContainerPress - Container press handler
 * @param props - All other TextInput props (value, onChangeText, etc.)
 *
 * @example
 * // Basic usage
 * <TextArea label="Description" value={description} onChangeText={setDescription} />
 *
 * // With character limit
 * <TextArea
 *   label="Bio"
 *   value={bio}
 *   onChangeText={setBio}
 *   maxLength={500}
 *   showCharacterCount
 * />
 *
 * // With custom height
 * <TextArea
 *   label="Comments"
 *   value={comments}
 *   onChangeText={setComments}
 *   minHeight={120}
 *   maxHeight={200}
 * />
 */
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  state,
  errorMessage,
  successMessage,
  disabled = false,
  minHeight = 88,
  maxHeight,
  showFloatingLabel = true,
  showCharacterCount = false,
  maxLength,
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
  const characterCount = value ? value.length : 0;
  const isOverLimit = maxLength ? characterCount > maxLength : false;

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

  // Handle container press (focus textarea)
  const handleContainerPress = () => {
    if (!disabled) {
      inputRef.current?.focus();
      onContainerPress?.();
    }
  };

  return (
    <View>
      {/* Main TextArea Container */}
      <Pressable
        style={[
          getContainerStyle(currentState, disabled, minHeight, maxHeight),
          containerStyle,
        ]}
        onPress={handleContainerPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label} text area`}
        accessibilityHint={
          disabled ? "Text area is disabled" : "Tap to focus text area"
        }
      >
        <View style={styles.contentContainer}>
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

          {/* TextArea Input */}
          <TextInput
            ref={inputRef}
            style={[
              styles.textArea,
              disabled && styles.textAreaDisabled,
              inputStyle,
            ]}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? "" : placeholder || label}
            placeholderTextColor={colors.textTertiary}
            editable={!disabled}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            selectionColor={colors.inputCursor} // Cursor color from Figma
            cursorColor={colors.inputCursor} // Android cursor color
            maxLength={maxLength}
            accessible={true}
            accessibilityLabel={label}
            accessibilityHint={errorMessage || successMessage || undefined}
            accessibilityRole="text"
            {...props}
          />
        </View>
      </Pressable>

      {/* Character Counter */}
      {showCharacterCount && (maxLength || characterCount > 0) && (
        <Text
          style={[
            styles.characterCounter,
            isOverLimit && styles.characterCounterError,
          ]}
        >
          {characterCount}
          {maxLength ? `/${maxLength}` : ""}
        </Text>
      )}

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
