import React, { useRef, useCallback, useMemo, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Icon from "../Icon";
import { colors } from "../../../theme";
import { MenuBottomSheetProps, MenuOption } from "./types";
import { styles } from "./styles";

/**
 * MenuBottomSheet Organism Component
 *
 * Following Atomic Design principles - this is an ORGANISM (complex component)
 *
 * Features:
 * - Context-specific menu options organized in sections
 * - Uses @gorhom/bottom-sheet for native performance
 * - Follows existing bottom sheet patterns from the app
 * - Proper accessibility support and safe area handling
 * - Consistent styling with design system
 * - Support for icons, destructive actions, and disabled states
 *
 * Based on existing bottom sheet patterns in MediaUploadBottomSheet and Dropdown
 *
 * @param isVisible - Whether the bottom sheet is visible
 * @param sections - Array of menu sections to display
 * @param onOptionSelect - Callback when an option is selected
 * @param onDismiss - Callback when bottom sheet is dismissed
 * @param title - Bottom sheet title
 * @param style - Custom style for the bottom sheet
 * @param accessibilityLabel - Label for screen readers
 */
const MenuBottomSheet: React.FC<MenuBottomSheetProps> = ({
  isVisible,
  sections,
  onOptionSelect,
  onDismiss,
  title = "Options",
  style,
  accessibilityLabel = "Menu options bottom sheet",
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  // Calculate dynamic snap points based on content
  const snapPoints = useMemo(() => {
    const totalOptions = sections.reduce((acc, section) => acc + section.options.length, 0);
    const sectionsWithTitles = sections.filter(section => section.title).length;
    
    // Base height calculation
    const titleHeight = 60; // Title + spacing
    const optionHeight = 48; // Each option height
    const sectionTitleHeight = 32; // Section title + spacing
    const padding = 32; // Top and bottom padding
    const safeAreaBottom = Math.max(insets.bottom + 20, 40); // Safe area + buffer
    
    const estimatedHeight = titleHeight + 
      (totalOptions * optionHeight) + 
      (sectionsWithTitles * sectionTitleHeight) + 
      padding + 
      safeAreaBottom;
    
    // Convert to percentage of screen height (max 80%)
    const maxHeight = 0.8;
    const minHeight = 0.3;
    const dynamicHeight = Math.min(Math.max(estimatedHeight / 800, minHeight), maxHeight); // Assuming ~800px screen
    
    return [`${Math.round(dynamicHeight * 100)}%`];
  }, [sections, insets.bottom]);

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  // Backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Handle option selection
  const handleOptionSelect = useCallback((option: MenuOption) => {
    if (!option.disabled) {
      onOptionSelect(option);
      bottomSheetModalRef.current?.dismiss();
    }
  }, [onOptionSelect]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: colors.border,
        width: 40,
        height: 4,
      }}
      backgroundStyle={{
        backgroundColor: colors.bottomSheetBackground,
      }}
      accessibilityLabel={accessibilityLabel}
    >
      <BottomSheetView style={[styles.container, style]}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Menu Sections */}
          {sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              {/* Section Title (if provided) */}
              {section.title && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              )}

              {/* Section Options */}
              <View style={styles.optionContainer}>
                {section.options.map((option, optionIndex) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.option,
                      optionIndex === section.options.length - 1 && styles.lastOption,
                      option.disabled && styles.optionDisabled,
                    ]}
                    onPress={() => handleOptionSelect(option)}
                    disabled={option.disabled}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    accessibilityState={{ disabled: option.disabled }}
                    android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <View style={styles.optionLeft}>
                      {/* Option Icon */}
                      {option.icon && (
                        <Icon
                          name={option.icon}
                          size="md"
                          color={option.destructive ? colors.error : colors.text}
                          style={styles.optionIcon}
                        />
                      )}

                      {/* Option Text */}
                      <Text
                        style={[
                          styles.optionText,
                          option.destructive && styles.optionTextDestructive,
                          option.disabled && styles.optionTextDisabled,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default MenuBottomSheet;