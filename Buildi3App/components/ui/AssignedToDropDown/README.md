# AssignedToDropDown Component

Specialized dropdown component for task assignment functionality following Figma Design System specifications.

## Features

- **Two Visual States**: Unassigned (simple text) and Assigned (profile + details)
- **Contact Selection**: Bottom sheet with contact list and search
- **Database Integration**: Automatic task assignment updates
- **Accessibility**: Full screen reader and keyboard navigation support
- **Mobile Optimized**: Safe area handling and touch-friendly interactions

## Design System Compliance

- ✅ **Figma Accurate**: Matches exact specifications from design system
- ✅ **Theme Tokens**: Uses `colors` and `spacing` tokens exclusively
- ✅ **Component Reuse**: Leverages existing `ProfileIcon` and `Icon` components
- ✅ **Atomic Design**: Molecule-level component using atomic building blocks

## Props

```typescript
interface AssignedToDropDownProps {
  assignedUserId?: string; // Currently assigned user ID
  assignedUser?: ContactOption; // User details for display
  contacts: ContactOption[]; // Available contacts for assignment
  onAssignUser?: (contact: ContactOption) => void;
  onUnassignUser?: () => void;
  disabled?: boolean;
  loading?: boolean;
  errorMessage?: string;
  onOpen?: () => void;
  onClose?: () => void;
  bottomSheetTitle?: string;
  containerStyle?: ViewStyle;
  fieldStyle?: ViewStyle;
}
```

## Usage Examples

### Basic Usage

```tsx
<AssignedToDropDown
  assignedUser={currentAssignee}
  contacts={projectTeamMembers}
  onAssignUser={(contact) => handleAssignTask(contact)}
  onUnassignUser={() => handleUnassignTask()}
/>
```

### With Loading State

```tsx
<AssignedToDropDown
  assignedUser={currentAssignee}
  contacts={contacts}
  loading={isUpdating}
  onAssignUser={handleAssign}
  onUnassignUser={handleUnassign}
/>
```

### With Error Handling

```tsx
<AssignedToDropDown
  assignedUser={currentAssignee}
  contacts={contacts}
  errorMessage={assignmentError}
  onAssignUser={handleAssign}
  onUnassignUser={handleUnassign}
/>
```

## Visual States

### Unassigned State

- Simple "Unassigned" text in gray
- Chevron down icon for interaction hint
- White background with rounded corners
- Based on Figma: `192-576`

### Assigned State

- Profile icon (44px circular) with user initials
- "Assigned to" label in small gray text
- User name in larger dark text
- Chevron down icon
- Based on Figma: `192-577`

## Contact Selection

Opens a native bottom sheet with:

- **Unassign Option**: Remove current assignment (if assigned)
- **Contact List**: Scrollable list with profile icons and contact details
- **Current Selection**: Visual indicator for currently assigned user
- **Safe Area**: Proper handling for all device types

## Database Integration

Integrates with Supabase for task assignment:

- Updates `tasks.assigned_to` field
- Handles optimistic updates for better UX
- Comprehensive error handling and rollback
- Loading states during operations

## Future Enhancements

The component includes TODOs for future development:

1. **Device Contacts**: Integration with `expo-contacts`
2. **Team Directory**: Pull from `users`/`project_members` tables
3. **Contact Search**: Real-time filtering and search
4. **Recent Assignments**: Show frequently assigned contacts first
5. **External CRM**: Integration with contact management systems

## Accessibility

- **Screen Reader**: Full VoiceOver/TalkBack support
- **Keyboard Navigation**: Accessible via external keyboards
- **High Contrast**: Respects system accessibility settings
- **Touch Targets**: Minimum 44px touch areas

## Performance

- **Virtualized Lists**: Efficient rendering for large contact lists
- **Bottom Sheet**: Native performance with `@gorhom/bottom-sheet`
- **Optimistic Updates**: Immediate UI feedback
- **Memory Efficient**: Proper cleanup and state management

## Dependencies

- `@gorhom/bottom-sheet`: Native bottom sheet functionality
- `react-native-safe-area-context`: Safe area handling
- Existing UI components: `ProfileIcon`, `Icon`
- Theme system: `colors`, `spacing` tokens
