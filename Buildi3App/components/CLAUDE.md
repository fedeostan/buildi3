# Component Development Philosophy

*See `README.md` in this directory for detailed structure and conventions.*

## Claude Workflow for Component Development

### Mandatory Pre-Development Search (CRITICAL)

**🚨 NEVER skip this step before creating any component:**

1. **Search Existing Components**:
   ```bash
   # Search for similar functionality
   find components/ui -name "*.tsx" | grep -i "button\|input\|card"
   grep -r "TouchableOpacity\|Pressable" components/ui/
   ```

2. **Check Atomic Design Hierarchy**:
   - **Atoms**: Typography, Icon, colors, spacing (likely exists)
   - **Molecules**: Button, Input, Card combinations (check first)
   - **Organisms**: Widget, Header, List combinations (extend existing)

3. **Validate Design Tokens**:
   - Colors: Check `theme/colors.ts` for semantic matches
   - Spacing: Check `theme/spacing.ts` for spacing values
   - Typography: Check Typography component variants

### Component Creation Decision Tree

```
Is this functionality similar to existing components?
├─ YES → Extend existing component with new props
├─ PARTIALLY → Compose multiple existing components
└─ NO → Create new component following 4-file structure
```

### Component Development Pattern

#### 1. Create 4-File Structure (REQUIRED)
```
ComponentName/
├── ComponentName.tsx    # Logic + JSX only (no styles)
├── styles.ts           # StyleSheet objects using theme tokens  
├── types.ts           # Public props and TypeScript types
├── index.ts           # Barrel exports (default + types)
└── README.md          # Component documentation (use template)
```

#### 2. Implementation Rules

**ComponentName.tsx** - Logic + JSX only:
```tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ComponentNameProps } from './types';
import { styles } from './styles';
import { Typography } from '../Typography';

export default function ComponentName({ title, onPress }: ComponentNameProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Typography variant="labelMedium">{title}</Typography>
    </TouchableOpacity>
  );
}
```

**styles.ts** - Theme tokens only:
```tsx
import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.sm, // Never hardcode: padding: 16
    borderRadius: 8,
  },
});
```

**types.ts** - Public interface:
```tsx
export interface ComponentNameProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}
```

**index.ts** - Barrel exports:
```tsx
export { default } from './ComponentName';
export type { ComponentNameProps } from './types';
```

### Component Composition Rules

#### Reuse Hierarchy (MANDATORY)
1. **First Priority**: Use existing atoms (Typography, Icon)
2. **Second Priority**: Compose existing molecules (Button, Input)
3. **Third Priority**: Extend existing organisms (Widget, Header)
4. **Last Resort**: Create new component

#### Theme Integration (REQUIRED)
```tsx
// ✅ CORRECT: Always use semantic tokens
backgroundColor: colors.primary,
color: colors.text,
padding: spacing.md,
margin: spacing.createMargin({ vertical: 'sm', horizontal: 'lg' }),

// ❌ WRONG: Never hardcode values
backgroundColor: '#007AFF',
color: '#000000', 
padding: 16,
margin: 8,
```

### Atomic Design Implementation

#### Atoms (Basic Building Blocks)
- **Typography**: Text with consistent variants
- **Icon**: Feather icons with theme colors
- **Spacing**: Using spacing tokens
- **Colors**: Using color tokens

#### Molecules (Component Combinations)
```tsx
// ✅ Example: Composing atoms into molecules
<TouchableOpacity style={styles.button}>
  <Icon name="plus" size={iconSizes.sm} color={colors.buttonText} />
  <Typography variant="labelMedium" style={{ color: colors.buttonText }}>
    Add Item
  </Typography>
</TouchableOpacity>
```

#### Organisms (Complete UI Sections)
```tsx
// ✅ Example: Composing molecules into organisms
<Widget title="Project Progress">
  <ProjectItem title="Mobile App" progress={75} />
  <Button onPress={handleAddProject}>Add Project</Button>
</Widget>
```

### Component Integration Checklist

Before completing any component:
- [ ] Searched existing components for similar functionality
- [ ] Uses 4-file structure with proper separation
- [ ] Imports only theme tokens (no hardcoded values)
- [ ] Composes existing components where possible
- [ ] Added to barrel exports in `components/ui/index.ts`
- [ ] Created README.md using template from `components/ui/README.md`
- [ ] Proper TypeScript interfaces in `types.ts`
- [ ] Follows atomic design principles

### Export Integration

After creating a new component, add to barrel exports:

**`components/ui/index.ts`**:
```tsx
export { default as ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

**`components/index.ts`** (if needed for broader access):
```tsx
export { ComponentName } from './ui';
export type { ComponentNameProps } from './ui';
```

### Error Prevention

#### Before Implementation:
- [ ] Component doesn't already exist in similar form
- [ ] All colors exist in `theme/colors.ts`
- [ ] All spacing values exist in `theme/spacing.ts`
- [ ] Typography variants match existing patterns

#### During Implementation:
- [ ] No hardcoded values (colors, spacing, typography)
- [ ] Proper composition of existing components
- [ ] Clean separation: logic in .tsx, styles in .ts, types in .ts
- [ ] Accessible and mobile-optimized

#### After Implementation:
- [ ] Component is reusable in different contexts
- [ ] Follows existing component patterns
- [ ] Documentation is complete and helpful
- [ ] Barrel exports updated

**Remember**: We build a design system, not individual components. Every component should contribute to system consistency and reusability.