import React from "react";
import { View, Pressable, Text } from "react-native";
import Icon from "../Icon";
import SegmentedControl from "../SegmentedControl";
import { BottomSheetTopBarProps } from "./types";
import { styles } from "./styles";
import { colors } from "../../../theme";

/**
 * BottomSheetTopBar Component - Matching Figma Design System
 *
 * The top bar for bottom sheet interfaces, featuring:
 * - Cancel button on the left
 * - Segmented control in the center (Photos/Files)
 * - Camera icon on the right
 *
 * Features:
 * - Exact Figma spacing and typography
 * - Proper touch targets for mobile interaction
 * - Accessible design with screen reader support
 * - Follows WhatsApp-like media picker design patterns
 * - Integrates with existing design system components
 *
 * Based on Figma: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=100-1425
 *
 * @param segmentedOptions - Array of tab options (Photos/Files)
 * @param selectedTabId - Currently selected tab ID
 * @param onTabSelect - Callback when tab is selected
 * @param onCancel - Callback when cancel is pressed
 * @param onCameraPress - Callback when camera icon is pressed
 * @param style - Custom container styles
 * @param cancelText - Custom cancel button text
 * @param accessibilityLabel - Label for screen readers
 *
 * @example
 * <BottomSheetTopBar
 *   segmentedOptions={[
 *     { id: 'photos', label: 'Photos' },
 *     { id: 'files', label: 'Files' }
 *   ]}
 *   selectedTabId="photos"
 *   onTabSelect={(option) => setActiveTab(option.id)}
 *   onCancel={() => bottomSheetRef.current?.dismiss()}
 *   onCameraPress={() => openCamera()}
 * />
 */
const BottomSheetTopBar: React.FC<BottomSheetTopBarProps> = ({
  segmentedOptions,
  selectedTabId,
  onTabSelect,
  onCancel,
  onCameraPress,
  style,
  cancelText = "Cancel",
  accessibilityLabel = "Bottom Sheet Top Bar",
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel}
    >
      {/* Cancel Button - Left Side */}
      <Pressable
        style={styles.cancelButton}
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel={`${cancelText} button`}
        android_ripple={{
          color: "rgba(0, 0, 0, 0.1)",
          borderless: true,
        }}
      >
        <Text style={styles.cancelText}>{cancelText}</Text>
      </Pressable>

      {/* Segmented Control - Center */}
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl
          options={segmentedOptions}
          selectedId={selectedTabId}
          onSelect={onTabSelect}
          accessibilityLabel="Media type selector"
        />
      </View>

      {/* Camera Button - Right Side */}
      <Pressable
        style={styles.cameraButton}
        onPress={onCameraPress}
        accessibilityRole="button"
        accessibilityLabel="Open camera"
        android_ripple={{
          color: "rgba(0, 0, 0, 0.1)",
          borderless: true,
        }}
      >
        <Icon
          name="camera"
          size="md"
          color="buttonPrimary"
          accessibilityLabel="Camera icon"
        />
      </Pressable>
    </View>
  );
};

export default BottomSheetTopBar;
