import React, { useState, useCallback, useRef, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import { DropdownProps, DropdownOption } from "./types";
import { styles, getContainerStyle } from "./styles";
import { colors } from "../../../theme";

/**
 * Dropdown Component matching Figma Design System
 *
 * Features:
 * - Matches exact Input field design with chevron icon
 * - Opens native bottom sheet for option selection
 * - All states: default, filled, success, error
 * - Floating label animation (same as Input)
 * - Smooth bottom sheet interactions
 * - Accessible and performant
 *
 * Based on Figma: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=24-173
 * Powered by @gorhom/bottom-sheet for native performance
 *
 * @param label - Dropdown label text (required)
 * @param options - Array of selectable options (required)
 * @param value - Currently selected option value
 * @param onSelect - Callback when option is selected
 * @param placeholder - Placeholder text when no option selected
 * @param state - Visual state override
 * @param errorMessage - Error text (sets state to error)
 * @param successMessage - Success text (sets state to success)
 * @param disabled - Disable dropdown interaction
 * @param showFloatingLabel - Enable floating label animation
 * @param bottomSheetTitle - Title for bottom sheet
 * @param props - Additional styling and configuration props
 *
 * @example
 * // Basic usage
 * <Dropdown
 *   label="Country"
 *   options={[
 *     { id: '1', label: 'United States' },
 *     { id: '2', label: 'Canada' },
 *     { id: '3', label: 'Mexico' }
 *   ]}
 *   value={selectedCountry}
 *   onSelect={(option) => setSelectedCountry(option.value || option.id)}
 * />
 *
 * // With error state
 * <Dropdown
 *   label="Priority"
 *   options={priorityOptions}
 *   value={priority}
 *   onSelect={setPriority}
 *   errorMessage="Please select a priority level"
 * />
 */
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder,
  state,
  errorMessage,
  successMessage,
  disabled = false,
  showFloatingLabel = true,
  bottomSheetTitle,
  containerStyle,
  fieldStyle,
  labelStyle,
  selectedTextStyle,
  onOpen,
  onClose,
  maxBottomSheetHeight = 600,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Find selected option
  const selectedOption = useMemo(() => {
    return options.find((option) => (option.value || option.id) === value);
  }, [options, value]);

  // Determine current state based on props and selection
  const getCurrentState = (): "default" | "filled" | "success" | "error" => {
    // Error state takes priority
    if (errorMessage) return "error";

    // Success state
    if (successMessage) return "success";

    // Override state if provided
    if (state) return state;

    // Auto-detect based on selection
    if (selectedOption) return "filled";

    return "default";
  };

  const currentState = getCurrentState();
  const hasValue = !!selectedOption;
  const shouldShowLabel = showFloatingLabel && hasValue;

  // Bottom sheet snap points - dynamic based on content
  const snapPoints = useMemo(() => {
    const baseHeight = 120; // Header + padding
    const itemHeight = 56; // Each option item height
    const calculatedHeight = Math.min(
      baseHeight + options.length * itemHeight,
      maxBottomSheetHeight
    );
    return [calculatedHeight];
  }, [options.length, maxBottomSheetHeight]);

  // Handle dropdown press
  const handlePress = useCallback(() => {
    if (!disabled && options.length > 0) {
      setIsBottomSheetOpen(true);
      bottomSheetRef.current?.present();
      onOpen?.();
    }
  }, [disabled, options.length, onOpen]);

  // Handle option selection
  const handleOptionSelect = useCallback(
    (option: DropdownOption) => {
      if (!option.disabled) {
        onSelect?.(option);
        bottomSheetRef.current?.dismiss();
      }
    },
    [onSelect]
  );

  // Handle bottom sheet dismiss
  const handleBottomSheetDismiss = useCallback(() => {
    setIsBottomSheetOpen(false);
    onClose?.();
  }, [onClose]);

  // Render option item
  const renderOptionItem = useCallback(
    (item: DropdownOption) => {
      const isSelected = (item.value || item.id) === value;

      return (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            styles.optionItem,
            pressed && styles.optionItemPressed,
            item.disabled && styles.optionItemDisabled,
          ]}
          onPress={() => handleOptionSelect(item)}
          disabled={item.disabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Select ${item.label}`}
          accessibilityState={{ selected: isSelected, disabled: item.disabled }}
        >
          {/* Option Icon */}
          {item.icon && <View style={styles.optionIcon}>{item.icon}</View>}

          {/* Option Text */}
          <Text
            style={[
              styles.optionText,
              item.disabled && styles.optionTextDisabled,
            ]}
          >
            {item.label}
          </Text>

          {/* Selected Indicator */}
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedCheckmark}>✓</Text>
            </View>
          )}
        </Pressable>
      );
    },
    [value, handleOptionSelect]
  );

  return (
    <View>
      {/* Dropdown Field */}
      <Pressable
        style={[
          getContainerStyle(currentState, disabled),
          containerStyle,
          fieldStyle,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label} dropdown`}
        accessibilityHint={
          disabled ? "Dropdown is disabled" : "Tap to open options"
        }
        accessibilityState={{ expanded: isBottomSheetOpen, disabled }}
      >
        <View style={styles.mainContainer}>
          {/* Left Container - Text Content */}
          <View style={styles.leftContainer}>
            {/* Floating Label */}
            {shouldShowLabel && (
              <Text
                style={[
                  styles.label,
                  disabled && styles.labelDisabled,
                  labelStyle,
                ]}
              >
                {label}
              </Text>
            )}

            {/* Selected Text or Placeholder */}
            <Text
              style={[
                selectedOption ? styles.selectedText : styles.placeholderText,
                disabled &&
                  (selectedOption ? {} : styles.placeholderTextDisabled),
                selectedTextStyle,
              ]}
              numberOfLines={1}
            >
              {selectedOption ? selectedOption.label : placeholder || label}
            </Text>
          </View>

          {/* Right Container - Chevron Icon (Always Centered) */}
          <View style={styles.rightContainer}>
            <Feather
              name="chevron-down"
              size={20}
              color={disabled ? colors.disabledText : colors.textSecondary}
            />
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

      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onDismiss={handleBottomSheetDismiss}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.textTertiary }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          {/* Bottom Sheet Header */}
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              {bottomSheetTitle || `Select ${label}`}
            </Text>
          </View>

          {/* Options List */}
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
          >
            {options.map((item) => renderOptionItem(item))}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
