import React from "react";
import { View, TouchableOpacity } from "react-native";
import { WidgetTitleProps } from "./types";
import { styles } from "./styles";
import { Typography } from "../Typography";
import { colors } from "../../../theme";

/**
 * WidgetTitle Molecule Component
 *
 * A reusable title component for widgets that combines:
 * - Title text (Typography atom)
 * - Optional action text/button (Typography atom)
 *
 * Following atomic design principles:
 * - Uses Typography atoms as building blocks
 * - Combines multiple atoms into a functional molecule
 * - Reusable across different widgets
 *
 * Based on Figma Design System:
 * - Row layout with space-between alignment
 * - 16px gap between elements
 * - Specific typography styles and colors
 *
 * @param title - The main title text to display
 * @param actionText - Optional action text on the right
 * @param onActionPress - Callback when action is pressed
 * @param hasAction - Whether to show the action (default: true if actionText exists)
 * @param style - Custom container styles
 * @param titleStyle - Custom title text styles
 * @param actionStyle - Custom action text styles
 */
export const WidgetTitle: React.FC<WidgetTitleProps> = ({
  title,
  actionText = "Action",
  onActionPress,
  hasAction = Boolean(actionText || onActionPress),
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
            // Pressable action text
            <TouchableOpacity onPress={onActionPress}>
              <Typography
                variant="labelMedium"
                style={[
                  { color: colors.actionText }, // #5A70A1 from Figma
                  actionStyle,
                ]}
              >
                {actionText}
              </Typography>
            </TouchableOpacity>
          ) : (
            // Static action text
            <Typography
              variant="labelMedium"
              style={[
                { color: colors.actionText }, // #5A70A1 from Figma
                actionStyle,
              ]}
            >
              {actionText}
            </Typography>
          )}
        </View>
      )}
    </View>
  );
};

export default WidgetTitle;
