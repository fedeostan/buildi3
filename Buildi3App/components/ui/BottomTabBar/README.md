### BottomTabBar

**Role**: Reusable bottom navigation tab bar component that matches the Figma NavBar design exactly.

### API

**Props**:
- `items: TabBarItem[]` - Array of tab configuration objects
  - `name: string` - Screen name for navigation
  - `title: string` - Display title in tab bar
  - `icon: FeatherIconName` - Feather icon name for the tab
- `activeTab?: string` - Currently active tab name
- `onTabPress?: (tabName: string) => void` - Callback when tab is pressed

### Usage

```tsx
import { BottomTabBar } from "../../components/ui";

const tabItems = [
  { name: "home", title: "Home", icon: "home" },
  { name: "tasks", title: "Tasks", icon: "check-square" },
  { name: "add-task", title: "Add", icon: "plus" },
  { name: "chat", title: "Chat", icon: "message-square" },
  { name: "assistant", title: "IA", icon: "activity" },
];

<BottomTabBar 
  items={tabItems}
  activeTab="home"
  onTabPress={(tab) => router.push(`/(tabs)/${tab}`)}
/>
```

### Design rules

- Uses `colors.tabBar*` and `componentSpacing.tabBar.*` tokens exclusively
- Matches Figma NavBar component spacing and colors exactly
- Follows atomic design: TabBarButton (molecule) + BottomTabBar (organism)
- Icons are 24px consistent with Figma design
- Typography matches Figma: Inter Medium, 15px, 0.1 letter-spacing

### Atomic Design Classification

- **Organism**: Complete navigation system
- **Contains**: TabBarButton molecules, Icon atoms, Text elements
- **Reusable**: Can be used in any tab navigation context

### Accessibility

- Proper `accessibilityRole="tab"` for screen readers
- `accessibilityState` indicates selected state
- Descriptive `accessibilityLabel` for each tab