import React, { useState, useCallback, useRef, useMemo } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { AssignedToDropDownProps, ContactOption } from "./types";
import { styles, getContainerStyle } from "./styles";
import { colors } from "../../../theme";
import Icon from "../Icon";
import ProfileIcon from "../ProfileIcon";

// Defensive programming: Validate imports at runtime in development
if (__DEV__) {
  if (!Icon) {
    console.error(
      "❌ AssignedToDropDown: Icon component is undefined. Check export/import patterns."
    );
  }
  if (!ProfileIcon) {
    console.error(
      "❌ AssignedToDropDown: ProfileIcon component is undefined. Check export/import patterns."
    );
  }
}

/**
 * AssignedToDropDown Component - Specialized dropdown for task assignment
 *
 * Features:
 * - Two visual states: Unassigned (simple text) and Assigned (profile + details)
 * - Bottom sheet with contact selection and search
 * - Database integration for task assignment updates
 * - Follows Figma Design System specifications exactly
 * - Reuses existing ProfileIcon and design tokens
 *
 * Based on Figma:
 * - Unassigned: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=192-576
 * - Assigned: https://www.figma.com/design/HgV69RizRV5dzy7p8gmuIL/Design-System?node-id=192-577
 *
 * TODO: Future engineer - Contact data sources to implement:
 * 1. Device contacts integration using expo-contacts
 * 2. Project team members from users/project_members tables
 * 3. Organization directory integration
 * 4. Contact sync with external CRM systems
 * 5. Recent contacts and assignment history
 *
 * @param assignedUserId - Currently assigned user ID
 * @param assignedUser - Currently assigned user details for display
 * @param contacts - Array of available contacts (currently dummy data)
 * @param onAssignUser - Callback when a contact is selected
 * @param onUnassignUser - Callback when assignment is cleared
 * @param disabled - Whether dropdown is disabled
 * @param loading - Loading state during operations
 * @param errorMessage - Error message to display
 * @param onOpen - Callback when bottom sheet opens
 * @param onClose - Callback when bottom sheet closes
 * @param bottomSheetTitle - Custom title for contact selection sheet
 * @param containerStyle - Custom container styling
 * @param fieldStyle - Custom field styling
 */
export const AssignedToDropDown: React.FC<AssignedToDropDownProps> = ({
  assignedUserId,
  assignedUser,
  contacts = [],
  onAssignUser,
  onUnassignUser,
  disabled = false,
  loading = false,
  errorMessage,
  onOpen,
  onClose,
  bottomSheetTitle = "Assign Task",
  containerStyle,
  fieldStyle,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Determine if user is assigned (show assigned if either we have local user details or an ID)
  const isAssigned = !!assignedUser || !!assignedUserId;

  // Safe area and screen dimensions for bottom sheet
  const { height: screenHeight } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  // Dynamic bottom sheet sizing based on contact list length
  const snapPoints = useMemo(() => {
    const baseHeight = 120; // Header + padding
    const itemHeight = 72; // Each contact item height (includes profile icon)
    const unassignHeight = isAssigned ? 56 : 0; // Unassign option height
    const contentHeight =
      baseHeight + unassignHeight + contacts.length * itemHeight;

    const safeBottomSpace = insets.bottom || 34;
    const extraBottomSpace = 16;
    const totalBottomSpace = safeBottomSpace + extraBottomSpace;
    const totalRequiredHeight = contentHeight + totalBottomSpace;

    const maxHeight = Math.min(screenHeight * 0.85, 600); // Max 85% of screen
    const finalHeight = Math.min(totalRequiredHeight, maxHeight);
    const percentage = ((finalHeight + 20) / screenHeight) * 100;

    return [`${Math.max(percentage, 40)}%`]; // Minimum 40% for better visibility
  }, [contacts.length, isAssigned, screenHeight, insets.bottom]);

  // Determine if scrolling is needed
  const needsScrolling = useMemo(() => {
    const baseHeight = 120;
    const itemHeight = 72;
    const unassignHeight = isAssigned ? 56 : 0;
    const contentHeight =
      baseHeight + unassignHeight + contacts.length * itemHeight;

    const safeBottomSpace = insets.bottom || 34;
    const extraBottomSpace = 32;
    const totalBottomSpace = safeBottomSpace + extraBottomSpace;
    const totalRequiredHeight = contentHeight + totalBottomSpace;

    const maxHeight = Math.min(screenHeight * 0.85, 600);
    return totalRequiredHeight > maxHeight;
  }, [contacts.length, isAssigned, screenHeight, insets.bottom]);

  // Render backdrop with darker background for focus
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    []
  );

  // Handle dropdown press to open contact selection
  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      setIsBottomSheetOpen(true);
      bottomSheetRef.current?.present();
      onOpen?.();
    }
  }, [disabled, loading, onOpen]);

  // Handle contact selection
  const handleContactSelect = useCallback(
    (contact: ContactOption) => {
      if (!contact.disabled) {
        onAssignUser?.(contact);
        bottomSheetRef.current?.dismiss();
      }
    },
    [onAssignUser]
  );

  // Handle unassign action
  const handleUnassign = useCallback(() => {
    onUnassignUser?.();
    bottomSheetRef.current?.dismiss();
  }, [onUnassignUser]);

  // Handle bottom sheet dismiss
  const handleBottomSheetDismiss = useCallback(() => {
    setIsBottomSheetOpen(false);
    onClose?.();
  }, [onClose]);

  // Render contact item in bottom sheet
  const renderContactItem = useCallback(
    (contact: ContactOption) => {
      const selectedId = assignedUserId || assignedUser?.id;
      const isCurrentlyAssigned = contact.id === selectedId;

      return (
        <Pressable
          key={contact.id}
          style={({ pressed }) => [
            styles.contactItem,
            pressed && styles.contactItemPressed,
            contact.disabled && styles.contactItemDisabled,
          ]}
          onPress={() => handleContactSelect(contact)}
          disabled={contact.disabled}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Assign task to ${contact.name}`}
          accessibilityState={{
            selected: isCurrentlyAssigned,
            disabled: contact.disabled,
          }}
        >
          {/* Profile Icon - reuse existing component */}
          <ProfileIcon
            size="Medium" // 44px size from Figma
            initials={contact.initials}
            hasNotification={false}
          />

          {/* Contact Information */}
          <View style={styles.contactInfo}>
            <Text
              style={[
                styles.contactName,
                contact.disabled && styles.contactItemDisabledText,
              ]}
              numberOfLines={1}
            >
              {contact.name}
            </Text>
            {contact.phone && (
              <Text
                style={[
                  styles.contactPhone,
                  contact.disabled && styles.contactItemDisabledText,
                ]}
                numberOfLines={1}
              >
                {contact.phone}
              </Text>
            )}
          </View>

          {/* Current assignment indicator */}
          {isCurrentlyAssigned && <View style={styles.selectedIndicator} />}
        </Pressable>
      );
    },
    [assignedUserId, handleContactSelect]
  );

  return (
    <View>
      {/* Main Dropdown Button */}
      <Pressable
        style={[
          getContainerStyle(disabled, loading, !!errorMessage),
          !isAssigned && styles.containerTall,
          containerStyle,
          fieldStyle,
        ]}
        onPress={handlePress}
        disabled={disabled || loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={
          isAssigned ? `Assigned to ${assignedUser?.name}` : "Unassigned task"
        }
        accessibilityHint={
          disabled ? "Assignment is disabled" : "Tap to change assignment"
        }
        accessibilityState={{
          expanded: isBottomSheetOpen,
          disabled: disabled || loading,
        }}
      >
        {/* Left Container - Content based on assignment state */}
        <View
          style={[
            styles.leftContainer,
            !isAssigned && styles.leftContainerCentered,
          ]}
        >
          {isAssigned ? (
            // Assigned State - Profile Icon + Text Content
            <>
              <ProfileIcon
                size="Medium" // 44px from Figma
                initials={assignedUser!.initials}
                hasNotification={false}
              />
              <View style={styles.textContentContainer}>
                <Text
                  style={[styles.labelText, disabled && styles.textDisabled]}
                >
                  Assigned to
                </Text>
                <Text
                  style={[styles.nameText, disabled && styles.textDisabled]}
                  numberOfLines={1}
                >
                  {assignedUser!.name}
                </Text>
              </View>
            </>
          ) : (
            // Unassigned State - Single line, vertically centered
            <Text
              style={[styles.unassignedText, disabled && styles.textDisabled]}
              numberOfLines={1}
            >
              Unassigned
            </Text>
          )}
        </View>

        {/* Right Container - Chevron Icon */}
        <View style={styles.rightContainer}>
          <Icon
            name="chevron-down"
            size="sm" // 20px from Figma
            color={disabled ? "disabledText" : "text"}
          />
        </View>
      </Pressable>

      {/* Error Message */}
      {errorMessage && (
        <Text style={styles.errorMessage} accessibilityRole="alert">
          {errorMessage}
        </Text>
      )}

      {/* Contact Selection Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={true}
        onDismiss={handleBottomSheetDismiss}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.textTertiary }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            maxHeight: Math.min(screenHeight * 0.85, 600),
            paddingBottom: 20,
          }}
        >
          {/* Header */}
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>{bottomSheetTitle}</Text>
          </View>

          {/* Contact List - Conditional scrolling */}
          {needsScrolling ? (
            <BottomSheetScrollView
              contentContainerStyle={[
                styles.bottomSheetContent,
                { paddingBottom: Math.max(insets.bottom + 40, 70) },
              ]}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {/* Unassign Option (only show if currently assigned) */}
              {isAssigned && (
                <Pressable
                  style={({ pressed }) => [
                    styles.unassignItem,
                    pressed && styles.contactItemPressed,
                  ]}
                  onPress={handleUnassign}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Unassign task"
                >
                  <Icon name="x-circle" size="md" color="error" />
                  <Text style={styles.unassignText}>Unassign Task</Text>
                </Pressable>
              )}

              {/* Contact List (wrapped to match global pattern) */}
              <View style={styles.contactListContainer}>
                {contacts.map((contact) => renderContactItem(contact))}
              </View>

              {/* Empty state message if no contacts */}
              {contacts.length === 0 && (
                <View
                  style={[styles.contactItem, { justifyContent: "center" }]}
                >
                  <Text style={styles.contactPhone}>
                    No contacts available for assignment
                  </Text>
                </View>
              )}
            </BottomSheetScrollView>
          ) : (
            <View
              style={[
                styles.bottomSheetContent,
                { paddingBottom: Math.max(insets.bottom + 40, 70) },
              ]}
            >
              {/* Unassign Option */}
              {isAssigned && (
                <Pressable
                  style={({ pressed }) => [
                    styles.unassignItem,
                    pressed && styles.contactItemPressed,
                  ]}
                  onPress={handleUnassign}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Unassign task"
                >
                  <Icon name="x-circle" size="md" color="error" />
                  <Text style={styles.unassignText}>Unassign Task</Text>
                </Pressable>
              )}

              {/* Contact List (wrapped to match global pattern) */}
              <View style={styles.contactListContainer}>
                {contacts.map((contact) => renderContactItem(contact))}
              </View>

              {/* Empty state */}
              {contacts.length === 0 && (
                <View
                  style={[styles.contactItem, { justifyContent: "center" }]}
                >
                  <Text style={styles.contactPhone}>
                    No contacts available for assignment
                  </Text>
                </View>
              )}
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default AssignedToDropDown;
