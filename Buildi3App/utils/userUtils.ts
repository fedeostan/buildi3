/**
 * User-related utility functions
 * 
 * Centralized functions for user data processing to ensure consistency
 * across components like DashboardHeader and UserAvatar
 */

/**
 * Extract user initials from name components
 * Follows consistent logic across DashboardHeader and UserAvatar
 * 
 * @param firstName - User's first name
 * @param lastName - User's last name  
 * @param fullName - Full name fallback
 * @returns Two-letter initials or 'U' fallback
 */
export const extractUserInitials = (
  firstName?: string | null,
  lastName?: string | null,
  fullName?: string | null
): string => {
  // Try first name + last name initials first (most reliable)
  if (firstName && lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  
  // Try first name only
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  
  // Try last name only
  if (lastName) {
    return lastName.charAt(0).toUpperCase();
  }
  
  // Fall back to full name if provided
  if (fullName && typeof fullName === 'string') {
    const names = fullName.trim().split(' ').filter(name => name.length > 0);
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
  }
  
  // Default fallback
  return 'U';
};

/**
 * Extract user's first name for greetings
 * Handles null/undefined cases gracefully
 * 
 * @param firstName - User's first name
 * @param fullName - Full name fallback
 * @returns First name or 'User' fallback
 */
export const extractFirstName = (
  firstName?: string | null,
  fullName?: string | null
): string => {
  // Use first name if available
  if (firstName && typeof firstName === 'string') {
    return firstName;
  }
  
  // Extract from full name
  if (fullName && typeof fullName === 'string') {
    const names = fullName.trim().split(' ').filter(name => name.length > 0);
    return names[0] || 'User';
  }
  
  return 'User';
};

/**
 * Get display name from user profile data
 * Prioritizes first+last name, then display_name, then email
 * 
 * @param profile - User profile object
 * @param email - User email fallback
 * @returns Formatted display name
 */
export const getDisplayName = (
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
  } | null,
  email?: string | null
): string => {
  if (profile?.first_name && profile?.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  }
  
  if (profile?.display_name) {
    return profile.display_name;
  }
  
  if (email) {
    return email.split('@')[0];
  }
  
  return 'User';
};