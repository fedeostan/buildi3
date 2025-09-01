import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "../Icon";
import { colors } from "../../../theme";
import { MenuButtonProps } from "./types";
import { styles } from "./styles";

/**
 * MenuButton Atom Component
 *
 * Following Atomic Design principles - this is an ATOM (smallest building block)
 *
 * Features:
 * - Three dots (more-horizontal) icon using Feather icons
 * - Matches Figma design with proper styling and spacing
 * - Touchable for interaction with press states
 * - Proper accessibility support
 * - Based on Figma Side Button design
 *
 * @param onPress - Callback when menu button is pressed
 * @param disabled - Whether the button is disabled
 * @param style - Custom style override
 * @param accessibilityLabel - Label for screen readers
 */
const MenuButton: React.FC<MenuButtonProps> = ({
  onPress,
  disabled = false,
  style,
  accessibilityLabel = "Menu options",
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.containerDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint="Opens menu with additional options"
    >
      <Icon
        name="more-horizontal"
        customSize={24} // 24px from Figma
        color={colors.buttonPrimary} // #495D92 from Figma (Schemes/Primary)
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default MenuButton;