import React, { useState, useCallback, useRef, useMemo } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
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
 * - Smooth bottom sheet interactions with darker backdrop
 * - Screen-aware percentage-based snap points for proper sizing
 * - Dynamic content sizing with conditional scrolling
 * - Respects device screen height (90% max) and custom maxHeight
 * - Robust safe area handling - content never hidden behind home indicator
 * - Extra 32px breathing room + 20px buffer for perfect mobile UX
 * - Minimum 30% screen height for better visibility on all devices
 * - Intelligent scroll behavior: static view for few items, scroll for many
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

  // Proper v5 Dynamic Sizing with screen-aware snapPoints + safe area
  const { height: screenHeight } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => {
    const baseHeight = 120; // Header + padding
    const itemHeight = 56; // Each option item height
    const contentHeight = baseHeight + options.length * itemHeight;

    // Calculate required bottom space more explicitly
    const safeBottomSpace = insets.bottom || 34; // Default home indicator height
    const extraBottomSpace = 16; // Your requested extra space
    const totalBottomSpace = safeBottomSpace + extraBottomSpace; // Total space needed

    // Total height including all bottom spacing
    const totalRequiredHeight = contentHeight + totalBottomSpace;

    const maxHeight = Math.min(screenHeight * 0.9, maxBottomSheetHeight || 600);
    const finalHeight = Math.min(totalRequiredHeight, maxHeight);

    // Convert to percentage with a small buffer
    const percentage = ((finalHeight + 20) / screenHeight) * 100; // +20px extra buffer

    return [`${Math.max(percentage, 30)}%`]; // Minimum 30% to ensure visibility
  }, [options.length, maxBottomSheetHeight, screenHeight, insets.bottom]);

  // Determine if we need scrolling - updated to match snap points logic
  const needsScrolling = useMemo(() => {
    const baseHeight = 120;
    const itemHeight = 56;
    const contentHeight = baseHeight + options.length * itemHeight;

    const safeBottomSpace = insets.bottom || 34;
    const extraBottomSpace = 32;
    const totalBottomSpace = safeBottomSpace + extraBottomSpace;
    const totalRequiredHeight = contentHeight + totalBottomSpace;

    const maxHeight = Math.min(screenHeight * 0.9, maxBottomSheetHeight || 600);
    return totalRequiredHeight > maxHeight;
  }, [options.length, maxBottomSheetHeight, screenHeight, insets.bottom]);

  // Render backdrop with darker background for better focus
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6} // Slightly darker than default (0.5) for better contrast
        pressBehavior="close" // Close when user taps outside
      />
    ),
    []
  );

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

      {/* Bottom Sheet Modal - Proper v5 Implementation */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints} // Percentage-based snap points
        enableDynamicSizing={true} // Auto-size within snap point constraints
        onDismiss={handleBottomSheetDismiss}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.textTertiary }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            maxHeight: Math.min(
              screenHeight * 0.9,
              maxBottomSheetHeight || 600
            ),
            paddingBottom: 20, // Add base padding to the container
          }}
        >
          {/* Header */}
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              {bottomSheetTitle || `Select ${label}`}
            </Text>
          </View>

          {/* Content - Conditional scrolling based on content size */}
          {needsScrolling ? (
            <BottomSheetScrollView
              contentContainerStyle={[
                styles.bottomSheetContent,
                { paddingBottom: Math.max(insets.bottom + 40, 70) }, // Increased values for better spacing
              ]}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {options.map((item) => renderOptionItem(item))}
            </BottomSheetScrollView>
          ) : (
            <View
              style={[
                styles.bottomSheetContent,
                { paddingBottom: Math.max(insets.bottom + 40, 70) }, // Increased values for better spacing
              ]}
            >
              {options.map((item) => renderOptionItem(item))}
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
