### MenuBottomSheet

**Role**: Context-specific menu bottom sheet that displays organized menu options with sections.

### API

**Props**:
- `isVisible: boolean` - Whether the bottom sheet is visible
- `sections: MenuSection[]` - Array of menu sections to display
  - `title?: string` - Optional section title
  - `options: MenuOption[]` - Array of menu options in this section
    - `id: string` - Unique identifier for the option
    - `label: string` - Display label for the option
    - `icon?: FeatherIconName` - Optional icon name from Feather icons
    - `destructive?: boolean` - Whether this option is destructive (red text)
    - `disabled?: boolean` - Whether this option is disabled
- `onOptionSelect: (option: MenuOption) => void` - Callback when an option is selected
- `onDismiss: () => void` - Callback when bottom sheet is dismissed
- `title?: string` - Bottom sheet title (default: "Options")
- `style?: ViewStyle` - Custom style for the bottom sheet
- `accessibilityLabel?: string` - Label for screen readers

### Usage

```tsx
import { MenuBottomSheet } from "../../components/ui";

const menuSections = [
  {
    title: "Actions",
    options: [
      { id: "edit", label: "Edit Task", icon: "edit" },
      { id: "share", label: "Share Task", icon: "share" },
    ]
  },
  {
    options: [
      { id: "delete", label: "Delete Task", icon: "trash", destructive: true },
    ]
  }
];

<MenuBottomSheet
  isVisible={showMenu}
  sections={menuSections}
  onOptionSelect={(option) => handleMenuAction(option.id)}
  onDismiss={() => setShowMenu(false)}
  title="Task Options"
/>
```

### Design rules

- Uses `colors.bottomSheetBackground` and design system tokens exclusively
- Follows existing bottom sheet patterns from MediaUploadBottomSheet
- Dynamic height calculation based on content
- Proper safe area handling with bottom padding
- Consistent option styling with 48px touch targets
- Support for section titles, icons, destructive actions, and disabled states

### Atomic Design Classification

- **Organism**: Complex menu interface
- **Uses**: @gorhom/bottom-sheet for native performance
- **Contains**: Icon atoms, Text elements, Pressable interactions
- **Reusable**: Can be used across different screens with different menu contexts

### Accessibility

- Proper `accessibilityRole="button"` for each option
- `accessibilityState` indicates disabled state
- Descriptive `accessibilityLabel` for the bottom sheet
- Support for screen readers and assistive technologies