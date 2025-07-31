import React from "react";
import { View, Pressable, Text } from "react-native";
import { SegmentedControlProps } from "./types";
import { styles } from "./styles";

/**
 * SegmentedControl Component - Matching Figma Design System
 *
 * A segmented control component that follows the exact Figma design specifications.
 * Used for switching between different views/modes (e.g., Photos/Files tabs).
 *
 * Features:
 * - Exact Figma styling (colors, spacing, typography)
 * - Smooth selection animations
 * - Accessible touch targets
 * - Follows design system color tokens
 * - Reusable for any tab-like interface
 *
 * Based on Figma: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=100-1411
 *
 * @param options - Array of tab options to display
 * @param selectedId - ID of currently selected option
 * @param onSelect - Callback when tab is selected
 * @param style - Custom container styles
 * @param accessibilityLabel - Label for screen readers
 *
 * @example
 * <SegmentedControl
 *   options={[
 *     { id: 'photos', label: 'Photos' },
 *     { id: 'files', label: 'Files' }
 *   ]}
 *   selectedId={activeTab}
 *   onSelect={(option) => setActiveTab(option.id)}
 * />
 */
const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedId,
  onSelect,
  style,
  accessibilityLabel = "Segmented Control",
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;

        return (
          <Pressable
            key={option.id}
            style={[
              styles.tab,
              isSelected ? styles.selectedTab : styles.unselectedTab,
            ]}
            onPress={() => onSelect(option)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.label} tab`}
            // Add press feedback
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: true,
            }}
          >
            <Text
              style={[
                styles.tabText,
                isSelected ? styles.selectedTabText : styles.unselectedTabText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
