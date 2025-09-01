import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import MenuButton from "../MenuButton";
import MenuBottomSheet from "../MenuBottomSheet";
import { GeneralHeaderProps } from "./types";
import { MenuOption } from "../MenuBottomSheet/types";
import { styles } from "./styles";

/**
 * GeneralHeader Organism Component
 *
 * Following Atomic Design principles - this is an ORGANISM (complex component)
 *
 * Features:
 * - Matches exact Figma General Header design
 * - Integrates MenuButton atom for menu functionality
 * - Context-specific menu options via MenuBottomSheet
 * - Reusable across different screens with different menu contexts
 * - Proper typography and spacing from design system
 * - Follows existing component patterns in the app
 *
 * Based on Figma: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=154-517
 *
 * @param title - Header title text
 * @param showMenuButton - Whether to show the menu button (default: true)
 * @param menuSections - Menu sections for the context-specific menu
 * @param onMenuOptionSelect - Callback when a menu option is selected
 * @param menuTitle - Menu bottom sheet title
 * @param style - Custom style override
 * @param accessibilityLabel - Label for screen readers
 */
const GeneralHeader: React.FC<GeneralHeaderProps> = ({
  title,
  showMenuButton = true,
  menuSections = [],
  onMenuOptionSelect,
  menuTitle = "Options",
  style,
  accessibilityLabel,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Handle menu button press
  const handleMenuButtonPress = useCallback(() => {
    setIsMenuVisible(true);
  }, []);

  // Handle menu option selection
  const handleMenuOptionSelect = useCallback((option: MenuOption) => {
    setIsMenuVisible(false);
    onMenuOptionSelect?.(option.id);
  }, [onMenuOptionSelect]);

  // Handle menu dismiss
  const handleMenuDismiss = useCallback(() => {
    setIsMenuVisible(false);
  }, []);

  return (
    <>
      <View 
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel || `${title} header`}
        accessibilityRole="header"
      >
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text 
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
              accessible={true}
              accessibilityRole="text"
            >
              {title}
            </Text>
          </View>

          {/* Menu Button */}
          {showMenuButton && (
            <View style={styles.menuButtonContainer}>
              <MenuButton
                onPress={handleMenuButtonPress}
                accessibilityLabel={`${title} menu options`}
              />
            </View>
          )}
        </View>
      </View>

      {/* Context-specific Menu Bottom Sheet */}
      {showMenuButton && menuSections.length > 0 && (
        <MenuBottomSheet
          isVisible={isMenuVisible}
          sections={menuSections}
          onOptionSelect={handleMenuOptionSelect}
          onDismiss={handleMenuDismiss}
          title={menuTitle}
          accessibilityLabel={`${title} menu options`}
        />
      )}
    </>
  );
};

export default GeneralHeader;