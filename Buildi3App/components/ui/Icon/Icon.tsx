import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, ColorName } from "../../../theme";
import { IconProps } from "./types";
import { iconSizes, defaultIconSize } from "./styles";

/**
 * Icon component using Feather icons
 *
 * Features:
 * - Integrates with theme system for colors
 * - Predefined sizes for consistency
 * - Optional press handling
 * - Accessibility support
 *
 * Examples:
 * <Icon name="home" />
 * <Icon name="settings" size="lg" color="primary" />
 * <Icon name="heart" color="#FF0000" onPress={() => console.log("Liked!")} />
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = defaultIconSize,
  color = "text-primary",
  customSize,
  onPress,
  style,
  accessibilityLabel,
}) => {
  // Determine the final icon size
  const iconSize = customSize || iconSizes[size];

  // Resolve color from theme or use custom color
  const resolvedColor = colors[color as ColorName] || color;

  // Create the icon element
  const iconElement = (
    <Feather
      name={name}
      size={iconSize}
      color={resolvedColor}
      style={style}
      accessibilityLabel={accessibilityLabel || `${name} icon`}
    />
  );

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${name} button`}
      >
        {iconElement}
      </TouchableOpacity>
    );
  }

  return iconElement;
};

export default Icon;
