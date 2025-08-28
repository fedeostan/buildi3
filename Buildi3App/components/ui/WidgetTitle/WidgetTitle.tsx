import React from "react";
import { View, TouchableOpacity } from "react-native";
import { WidgetTitleProps } from "./types";
import { styles } from "./styles";
import { Typography } from "../Typography";
import { colors } from "../../../theme";
import Icon from "../Icon";

/**
 * WidgetTitle Molecule Component
 *
 * A reusable title component for widgets that combines:
 * - Title text (Typography atom)
 * - Optional action text/button (Typography atom)
 * - Optional icon for the action (Icon atom)
 *
 * Following atomic design principles:
 * - Uses Typography atoms as building blocks
 * - Uses Icon atoms for visual indicators
 * - Combines multiple atoms into a functional molecule
 * - Reusable across different widgets
 *
 * Based on Figma Design System:
 * - Row layout with space-between alignment
 * - 16px gap between elements
 * - Specific typography styles and colors
 * - Optional icons next to action text
 *
 * @param title - The main title text to display
 * @param actionText - Optional action text on the right
 * @param onActionPress - Callback when action is pressed
 * @param hasAction - Whether to show the action (default: true if actionText exists)
 * @param showActionIcon - Whether to show icon next to action text
 * @param actionIconName - Icon name for the action (Feather icon)
 * @param actionIconSize - Size of the action icon
 * @param actionIconColor - Color of the action icon
 * @param style - Custom container styles
 * @param titleStyle - Custom title text styles
 * @param actionStyle - Custom action text styles
 */
export const WidgetTitle: React.FC<WidgetTitleProps> = ({
  title,
  actionText = "Action",
  onActionPress,
  hasAction = Boolean(actionText || onActionPress),
  showActionIcon = false,
  actionIconName = "chevron-down",
  actionIconSize = "sm",
  actionIconColor = "actionText",
  style,
  titleStyle,
  actionStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Title Text - Using Typography atom */}
      <Typography
        variant="labelLarge"
        style={[
          { color: colors.text }, // #001848 from Figma
          titleStyle,
        ]}
      >
        {title}
      </Typography>

      {/* Action Section - Only show if hasAction is true */}
      {hasAction && (
        <View style={styles.actionContainer}>
          {onActionPress ? (
            // Pressable action text with optional icon
            <TouchableOpacity
              onPress={onActionPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Typography
                variant="labelMedium"
                style={[
                  { color: colors.actionText }, // #5A70A1 from Figma
                  actionStyle,
                ]}
              >
                {actionText}
              </Typography>
              {showActionIcon && (
                <Icon
                  name={actionIconName}
                  size={actionIconSize}
                  color={actionIconColor}
                  style={{ marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>
          ) : (
            // Static action text with optional icon
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Typography
                variant="labelMedium"
                style={[
                  { color: colors.actionText }, // #5A70A1 from Figma
                  actionStyle,
                ]}
              >
                {actionText}
              </Typography>
              {showActionIcon && (
                <Icon
                  name={actionIconName}
                  size={actionIconSize}
                  color={actionIconColor}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default WidgetTitle;
