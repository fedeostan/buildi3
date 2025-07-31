import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../Icon";
import { TopNavigationBarProps, NavigationAction } from "./types";
import {
  containerStyle,
  leftActionStyle,
  rightActionStyle,
  titleSectionStyle,
  titleTextStyle,
  actionTextStyle,
  navigationBarStyle,
  pressableActionStyle,
  pressedActionStyle,
} from "./styles";
import { spacing } from "../../../theme/spacing";

/**
 * TopNavigationBar Organism Component
 *
 * A reusable navigation bar component following Atomic Design principles.
 * This organism combines Icon atoms and Typography atoms to create a
 * complete navigation section that can be used across different templates.
 *
 * Features:
 * - Left action with optional icon and/or label
 * - Right action with optional icon and/or label
 * - Optional center title
 * - Proper safe area handling for mobile devices
 * - Touch feedback for pressable actions
 * - Full accessibility support
 * - Matches Figma Design System exactly
 *
 * Design Reference: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=95-108
 *
 * Atomic Design Classification: ORGANISM
 * - Combines multiple atoms (Icon, Text)
 * - Forms a distinct, reusable interface section
 * - Can be used across different templates/pages
 *
 * @param leftAction - Optional left action configuration
 * @param rightAction - Optional right action configuration
 * @param title - Optional center title text
 * @param style - Custom style overrides
 * @param accessibilityLabel - Screen reader label
 *
 * @example
 * // Basic usage with title only
 * <TopNavigationBar title="Settings" />
 *
 * // With left back action
 * <TopNavigationBar
 *   leftAction={{
 *     icon: "chevron-left",
 *     label: "Back",
 *     onPress: () => navigation.goBack()
 *   }}
 *   title="Profile"
 * />
 *
 * // With both actions
 * <TopNavigationBar
 *   leftAction={{ icon: "chevron-left", onPress: () => navigation.goBack() }}
 *   title="Edit Profile"
 *   rightAction={{ label: "Save", onPress: handleSave }}
 * />
 *
 * // Right action with icon and label
 * <TopNavigationBar
 *   title="Messages"
 *   rightAction={{
 *     label: "New",
 *     icon: "chevron-right",
 *     onPress: () => navigation.navigate('NewMessage')
 *   }}
 * />
 */
const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  leftAction,
  rightAction,
  title,
  style,
  accessibilityLabel,
}) => {
  const insets = useSafeAreaInsets();

  /**
   * Renders a navigation action (left or right)
   * Handles the different combinations of icon and label
   */
  const renderAction = (
    action: NavigationAction,
    isLeft: boolean
  ): React.ReactNode => {
    const {
      icon,
      label,
      onPress,
      accessibilityLabel: actionA11yLabel,
    } = action;

    // If no icon or label, don't render anything
    if (!icon && !label) return null;

    // Determine if this action should be pressable
    const isPressable = typeof onPress === "function";

    // Create the action content
    const actionContent = (
      <>
        {/* Left action: icon first, then label */}
        {isLeft && icon && (
          <Icon
            name={icon}
            size="md"
            color={navigationBarStyle.iconColor}
            customSize={navigationBarStyle.iconSize}
          />
        )}

        {/* Render label if present */}
        {label && (
          <Text
            style={[
              actionTextStyle,
              // Right action labels are right-aligned
              !isLeft && { textAlign: "right" },
            ]}
          >
            {label}
          </Text>
        )}

        {/* Right action: label first, then icon */}
        {!isLeft && icon && (
          <Icon
            name={icon}
            size="md"
            color={navigationBarStyle.iconColor}
            customSize={navigationBarStyle.iconSize}
          />
        )}
      </>
    );

    // If pressable, wrap in TouchableOpacity for better UX
    if (isPressable) {
      return (
        <TouchableOpacity
          onPress={onPress}
          style={pressableActionStyle}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={actionA11yLabel || label || `${icon} button`}
        >
          {actionContent}
        </TouchableOpacity>
      );
    }

    // Non-pressable action (display only)
    return <View style={pressableActionStyle}>{actionContent}</View>;
  };

  return (
    <View
      style={[
        containerStyle,
        {
          // Apply safe area padding for consistent mobile experience
          // Use dynamic padding: safe area + base padding
          paddingTop: Math.max(insets.top, 20) + spacing.sm, // 16px base + safe area
          // No horizontal padding - action areas handle their own spacing per Figma
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="toolbar"
      accessibilityLabel={accessibilityLabel || "Navigation bar"}
    >
      {/* Left Action Section */}
      <View style={leftActionStyle}>
        {leftAction && renderAction(leftAction, true)}
      </View>

      {/* Center Title Section */}
      <View style={titleSectionStyle}>
        {title && (
          <Text
            style={titleTextStyle}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel={`Title: ${title}`}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Right Action Section */}
      <View style={rightActionStyle}>
        {rightAction && renderAction(rightAction, false)}
      </View>
    </View>
  );
};

export default TopNavigationBar;
