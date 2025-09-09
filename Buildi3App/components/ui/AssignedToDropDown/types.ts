import { ViewStyle, TextStyle } from "react-native";

/**
 * Contact item for assignment selection
 *
 * TODO: Future engineer - Replace dummy data with real contacts from:
 * - Device contacts API (expo-contacts)
 * - User database table for project team members
 * - Integration with external contact management systems
 */
export interface ContactOption {
  /** Unique identifier for the contact */
  id: string;

  /** Contact's full name */
  name: string;

  /** Contact's phone number */
  phone?: string;

  /** Contact's email address */
  email?: string;

  /** User initials for avatar display */
  initials: string;

  /** Whether this contact is disabled for selection */
  disabled?: boolean;

  /** Optional avatar URL */
  avatarUrl?: string;
}

/**
 * AssignedToDropDown component props
 * Specialized dropdown for task assignment with contact selection
 */
export interface AssignedToDropDownProps {
  /** Currently assigned user ID */
  assignedUserId?: string;

  /** Currently assigned user details for display */
  assignedUser?: ContactOption;

  /** Array of available contacts for assignment */
  contacts: ContactOption[];

  /** Callback when a contact is selected for assignment */
  onAssignUser?: (contact: ContactOption) => void;

  /** Callback when assignment is cleared (unassign) */
  onUnassignUser?: () => void;

  /** Whether the dropdown is disabled */
  disabled?: boolean;

  /** Custom container styles */
  containerStyle?: ViewStyle;

  /** Custom dropdown field styles */
  fieldStyle?: ViewStyle;

  /** Loading state during assignment operations */
  loading?: boolean;

  /** Error message to display */
  errorMessage?: string;

  /** Callback when bottom sheet opens */
  onOpen?: () => void;

  /** Callback when bottom sheet closes */
  onClose?: () => void;

  /** Custom bottom sheet title */
  bottomSheetTitle?: string;
}
