# UI Component Library Workflows

*See `README.md` in this directory for folder patterns and design rules.*

## Claude Workflow for UI Component Creation

### Pre-Creation Component Analysis (MANDATORY)

Before creating any UI component, analyze existing components in this directory:

1. **Inventory Existing Components**:
   - Typography, Button, Icon (atoms)
   - Input, Widget, ProjectItem (molecules) 
   - DashboardHeader, TaskList, ProjectWidget (organisms)

2. **Pattern Recognition**:
   - How do similar components handle props?
   - What theme tokens do they use?
   - How do they compose other components?

3. **Reusability Assessment**:
   - Can I extend an existing component with new props?
   - Can I compose multiple existing components?
   - Do I really need a new component?

### UI Component Creation Process

#### Step 1: Create Directory Structure
```bash
mkdir components/ui/ComponentName
cd components/ui/ComponentName
```

#### Step 2: Implement Core Files

**ComponentName.tsx** - Clean implementation:
```tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography, Icon } from '../'; // Import from barrel
import { ComponentNameProps } from './types';
import { styles } from './styles';

export default function ComponentName({
  title,
  variant = 'default',
  onPress,
  disabled = false,
  children
}: ComponentNameProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, styles[variant]]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Typography variant="labelMedium">{title}</Typography>
      {children}
    </TouchableOpacity>
  );
}
```

**styles.ts** - Token-only styling:
```tsx
import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    ...spacing.createPadding({ all: 'sm' }), // Use helpers
  },
  default: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
  },
});
```

**types.ts** - Comprehensive types:
```tsx
import { ViewStyle } from 'react-native';
import { ReactNode } from 'react';

export type ComponentVariant = 'default' | 'primary' | 'secondary';

export interface ComponentNameProps {
  title: string;
  variant?: ComponentVariant;
  onPress?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  style?: ViewStyle;
}
```

**index.ts** - Barrel export:
```tsx
export { default } from './ComponentName';
export type { ComponentNameProps, ComponentVariant } from './types';
```

#### Step 3: Create Component Documentation

**README.md** - Using template from parent README:
```md
### ComponentName

**Role**: Brief description of what UI problem this solves.

### API

- **Props**: Key props from types.ts
  - `title: string` - Component title text
  - `variant?: 'default' | 'primary'` - Visual variant
  - `onPress?: () => void` - Touch handler
  - `disabled?: boolean` - Disabled state

### Usage

\```tsx
import { ComponentName } from "../../ui";

<ComponentName 
  title="Example Title"
  variant="primary"
  onPress={handlePress}
/>
\```

### Design rules

- Uses `colors.*` and `spacing.*` tokens exclusively
- Composes Typography and Icon components
- Follows mobile accessibility guidelines
```

### Advanced Patterns

#### Variant System Implementation
```tsx
// ✅ Create flexible variant systems
const getContainerStyle = (variant: ComponentVariant) => {
  const baseStyle = styles.container;
  
  switch (variant) {
    case 'primary':
      return [baseStyle, styles.primary];
    case 'secondary':
      return [baseStyle, styles.secondary];
    default:
      return baseStyle;
  }
};
```

#### Composition Patterns
```tsx
// ✅ Compose existing components rather than recreate
export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Widget title={project.name}>
      <ProjectItem {...project} />
      <Button onPress={handleEdit}>Edit Project</Button>
    </Widget>
  );
}
```

#### Mobile Accessibility
```tsx
// ✅ Always include accessibility props
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`${title} button`}
  accessibilityRole="button"
  accessibilityState={{ disabled }}
>
```

### Design Token Integration

#### Color Usage Hierarchy
```tsx
// ✅ PRIORITY ORDER for color selection:
// 1. Semantic colors (colors.primary, colors.text)
// 2. Component-specific colors (colors.buttonPrimary)  
// 3. Raw palette colors (only if semantic doesn't exist)

// Example:
backgroundColor: colors.primary,        // 1st choice
color: colors.buttonText,              // 2nd choice
borderColor: colors.border,            // 3rd choice
```

#### Spacing Consistency
```tsx
// ✅ Use spacing helpers for consistency
padding: spacing.sm,                   // Simple values
...spacing.createPadding({ horizontal: 'md', vertical: 'sm' }), // Complex padding
gap: spacing.xs,                       // Flexbox gaps
```

### Component Testing Patterns

#### Props Testing
```tsx
// ✅ Test your component with different prop combinations
// In development, quickly test:
<ComponentName title="Test" variant="default" />
<ComponentName title="Test" variant="primary" disabled />
<ComponentName title="Test" onPress={() => console.log('pressed')} />
```

### Integration with Barrel Exports

#### Add to `components/ui/index.ts`:
```tsx
// Add your component to the main barrel export
export { default as ComponentName } from './ComponentName';
export type { ComponentNameProps, ComponentVariant } from './ComponentName';
```

#### Usage from screens:
```tsx
// ✅ Always import from barrel
import { ComponentName, Button, Typography } from '@/components/ui';

// ❌ Never import directly
import ComponentName from '@/components/ui/ComponentName/ComponentName';
```

### Quality Checklist

Before considering a UI component complete:

#### Implementation Quality:
- [ ] Uses 4-file structure (tsx, styles.ts, types.ts, index.ts)
- [ ] No hardcoded colors or spacing values
- [ ] Composes existing components where possible
- [ ] Includes comprehensive TypeScript types
- [ ] Handles disabled and loading states appropriately

#### Design System Alignment:
- [ ] Colors from semantic tokens (`colors.primary` vs raw hex)
- [ ] Spacing from token system (`spacing.sm` vs hardcoded 16)
- [ ] Typography uses Typography component variants
- [ ] Icons use Icon component with Feather icon names

#### Mobile Optimization:
- [ ] Touch targets are minimum 44px (iOS) / 48px (Android)
- [ ] Includes accessibility props for screen readers
- [ ] Handles safe area appropriately if needed
- [ ] Performance optimized (no unnecessary re-renders)

#### Documentation and Integration:
- [ ] README.md created with examples
- [ ] Added to barrel exports in `index.ts`
- [ ] Component can be reused in multiple contexts
- [ ] Clear prop interface with sensible defaults

**Philosophy**: Every component in this directory should be production-ready, reusable, and contribute to the design system's consistency. Quality over quantity.