### GeneralHeader

**Role**: Reusable header component with optional context-specific menu functionality.

### API

**Props**:
- `title: string` - Header title text (required)
- `showMenuButton?: boolean` - Whether to show the menu button (default: true)
- `menuSections?: MenuSection[]` - Menu sections for the context-specific menu
- `onMenuOptionSelect?: (optionId: string) => void` - Callback when a menu option is selected
- `menuTitle?: string` - Menu bottom sheet title (default: "Options")
- `style?: ViewStyle` - Custom style override
- `accessibilityLabel?: string` - Label for screen readers

### Usage

```tsx
import { GeneralHeader } from "../../components/ui";

// Basic usage with title only
<GeneralHeader title="Tasks" />

// With context-specific menu
const taskMenuSections = [
  {
    title: "Task Actions",
    options: [
      { id: "add", label: "Add Task", icon: "plus" },
      { id: "filter", label: "Filter Tasks", icon: "filter" },
    ]
  },
  {
    options: [
      { id: "settings", label: "Task Settings", icon: "settings" },
    ]
  }
];

<GeneralHeader
  title="My Tasks"
  menuSections={taskMenuSections}
  onMenuOptionSelect={(optionId) => handleTaskAction(optionId)}
  menuTitle="Task Options"
/>

// Without menu button
<GeneralHeader 
  title="Profile" 
  showMenuButton={false} 
/>
```

### Design rules

- Uses exact Figma spacing and typography: 28px Montserrat SemiBold
- White background with bottom border (#EDEEF2)
- 48px top padding, 16px horizontal padding, 12px bottom padding
- Title uses `colors.text` (#001848 from Figma)
- Menu button positioned on the right with proper spacing
- Follows atomic design: MenuButton (atom) + MenuBottomSheet (organism)

### Atomic Design Classification

- **Organism**: Complex header interface
- **Contains**: MenuButton atoms, MenuBottomSheet organism, Text elements
- **Reusable**: Can be used across different screens with different contexts
- **Composable**: Menu sections are configurable per screen usage

### Context-Specific Usage

Each screen can define its own menu sections:

```tsx
// Tasks Screen
const tasksMenuSections = [
  { title: "Actions", options: [
    { id: "add", label: "Add Task", icon: "plus" },
    { id: "filter", label: "Filter", icon: "filter" }
  ]}
];

// Projects Screen  
const projectsMenuSections = [
  { title: "Project Actions", options: [
    { id: "create", label: "Create Project", icon: "folder-plus" },
    { id: "archive", label: "Archive Old", icon: "archive" }
  ]}
];
```

### Accessibility

- Proper `accessibilityRole="header"` and `accessibilityLevel={1}` for title
- MenuButton and MenuBottomSheet have full accessibility support
- Screen reader friendly with descriptive labels
- Proper touch targets and keyboard navigation support