import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography';
import { styles } from './styles';
import { UserAvatarProps } from './types';
import { extractUserInitials } from '../../../utils/userUtils';

/**
 * UserAvatar Molecule Component
 *
 * Following Atomic Design principles - this is a MOLECULE (composed of atoms)
 *
 * Features:
 * - Displays user initials extracted from first/last name
 * - Supports medium (44px) and large (58px) sizes matching ProfileIcon
 * - Shows full name below avatar when showName is true
 * - Optional touch handling for navigation
 * - Follows existing ProfileIcon patterns for consistency
 * - Uses semantic design tokens exclusively
 *
 * @param firstName - User's first name from profile
 * @param lastName - User's last name from profile  
 * @param fullName - Computed full name (fallback if first/last not available)
 * @param size - Avatar size variant (medium | large)
 * @param showName - Whether to display full name below avatar
 * @param onPress - Optional navigation handler
 * @param style - Custom style overrides
 * @param accessibilityLabel - Screen reader label
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  lastName,
  fullName,
  size = 'large',
  showName = true,
  onPress,
  style,
  accessibilityLabel,
}) => {
  // Extract initials using consistent utility function
  const getInitials = (): string => {
    return extractUserInitials(firstName, lastName, fullName);
  };

  // Compute display name for below avatar
  const getDisplayName = (): string => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (fullName) {
      return fullName;
    }
    if (firstName) {
      return firstName;
    }
    if (lastName) {
      return lastName;
    }
    return 'User';
  };

  const initials = getInitials();
  const displayName = getDisplayName();

  // Create avatar content
  const avatarContent = (
    <View style={styles.wrapper}>
      {/* Avatar Circle with Initials */}
      <View
        style={[
          styles.avatar,
          size === 'large' ? styles.avatarLarge : styles.avatarMedium,
        ]}
      >
        <Typography
          variant={size === 'large' ? 'bodyLarge' : 'bodyMedium'}
          style={[
            styles.initials,
            size === 'large' ? styles.initialsLarge : styles.initialsMedium,
          ]}
        >
          {initials}
        </Typography>
      </View>
      
      {/* Full Name Below Avatar */}
      {showName && (
        <Typography variant="bodyMedium" style={styles.fullName}>
          {displayName}
        </Typography>
      )}
    </View>
  );

  // Wrap in TouchableOpacity if onPress provided
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.container,
          size === 'large' ? styles.containerLarge : styles.containerMedium,
          style,
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${displayName} profile`}
      >
        {avatarContent}
      </TouchableOpacity>
    );
  }

  // Return non-touchable version
  return (
    <View
      style={[
        styles.container,
        size === 'large' ? styles.containerLarge : styles.containerMedium,
        style,
      ]}
      accessible={true}
      accessibilityLabel={accessibilityLabel || displayName}
    >
      {avatarContent}
    </View>
  );
};

export default UserAvatar;