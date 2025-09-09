import React from "react";
import { View } from "react-native";
import Icon from "../Icon";
import { styles } from "./styles";
import type { TagVariant } from "./types";

type IconTagProps = {
  variant: TagVariant;
  iconName?: string; // Feather icon name
  size?: "sm" | "md" | "lg"; // Reuse Icon sizing semantics
  style?: any;
  accessibilityLabel?: string;
};

/**
 * IconTag - tag pill that contains only an icon (no text)
 * Uses Tag styles and color variants; respects design tokens
 */
export const IconTag: React.FC<IconTagProps> = ({
  variant,
  iconName = "calendar",
  size = "sm",
  style,
  accessibilityLabel,
}) => {
  const getVariantContainerStyle = () => {
    switch (variant) {
      case "red":
        return styles.redContainer;
      case "yellow":
        return styles.yellowContainer;
      case "green":
        return styles.greenContainer;
      case "neutral":
      default:
        return styles.neutralContainer;
    }
  };

  return (
    <View
      style={[styles.container, getVariantContainerStyle(), style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || `${variant} tag`}
    >
      <Icon name={iconName as any} size={size} color={"text" as any} />
    </View>
  );
};

export default IconTag;
