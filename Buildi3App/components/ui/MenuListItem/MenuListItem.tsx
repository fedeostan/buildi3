import React from "react";
import { View, TouchableOpacity } from "react-native";
import Typography from "../Typography";
import Icon from "../Icon";
import { styles } from "./styles";
import { MenuListItemProps } from "./types";
import { colors } from "../../../theme";

/**
 * MenuListItem Atom Component
 *
 * Following Atomic Design principles - this is an ATOM (reusable UI element)
 *
 * Features:
 * - Reusable menu row with icon, title, and optional chevron
 * - Touch feedback with hover states
 * - Support for destructive variant (red text for dangerous actions)
 * - Uses existing Icon and Typography components
 * - Follows semantic design tokens
 * - Full accessibility support
 *
 * @param title - Menu item text to display
 * @param iconName - Feather icon name for left side
 * @param onPress - Touch handler callback
 * @param variant - Visual variant (default | destructive)
 * @param showChevron - Whether to show chevron-right icon
 * @param style - Custom style overrides
 * @param accessibilityLabel - Screen reader label
 * @param testID - Test identifier
 */
const MenuListItem: React.FC<MenuListItemProps> = ({
  title,
  iconName,
  onPress,
  variant = "default",
  showChevron = true,
  style,
  accessibilityLabel,
  testID,
}) => {
  // Determine colors based on variant
  const titleColor = variant === "destructive" ? colors.error : colors.text;
  const iconColor =
    variant === "destructive" ? colors.error : colors.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      testID={testID}
    >
      <View style={styles.content}>
        {/* Left Section - Icon */}
        <View style={styles.leftSection}>
          <Icon name={iconName} size="md" color={iconColor} />
        </View>

        {/* Middle Section - Title */}
        <View style={styles.middleSection}>
          <Typography
            variant="bodyLarge"
            style={[
              styles.title,
              variant === "destructive"
                ? styles.titleDestructive
                : styles.titleDefault,
              { color: titleColor },
            ]}
          >
            {title}
          </Typography>
        </View>

        {/* Right Section - Chevron */}
        {showChevron && (
          <View style={styles.rightSection}>
            <Icon name="chevron-right" size="md" color={colors.textTertiary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MenuListItem;
