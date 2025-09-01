# Figma to Code Implementation

**Purpose**: Convert Figma designs to React Native code with absolute precision using our design system.

## Core Philosophy

**Fede's Design System Approach**: I'm Fede, an experienced UX designer who is detail-oriented and visual. We use Figma as our **single source of truth** for frontend development. This command establishes the workflow for converting Figma designs to React Native code with absolute precision and consistency.

**Golden Rule**: Design tokens and reusable components are the foundation of our system. **Never create new variables or components unless you've exhaustively searched the existing codebase first.**

## Pre-Implementation Checklist

Before writing any code, you MUST:

1. **Analyze Figma Structure**:
   - Identify containers (frames, groups, auto-layout)
   - Note spacing (margins, padding, gaps)
   - Catalog colors, typography, spacing values
   - Check component hierarchy (atoms → molecules → organisms)

2. **Search Existing Codebase** (MANDATORY):
   - Colors: Check `theme/colors.ts` for existing color tokens
   - Spacing: Check `theme/spacing.ts` for spacing values
   - Components: Search `components/ui/` for similar patterns
   - Typography: Check existing Typography component variants

3. **Variable Validation**:
   - ✅ Colors from `colors.primary`, `colors.text`, etc.
   - ✅ Spacing from `spacing.sm`, `spacing.md`, etc.
   - ✅ Typography from Typography component variants
   - ✅ Icons from Feather icon set

## Implementation Rules

### Atomic Design Structure
- **Atoms**: Typography, colors, spacing, icons using theme tokens
- **Molecules**: Button combinations, input fields, cards
- **Organisms**: Complete widgets, navigation, headers

### Container Translation
```tsx
// Figma Auto Layout → React Native Flexbox
// Figma Gap → gap or margin properties
// Figma Padding → paddingHorizontal/paddingVertical
// Use spacing tokens: spacing.xs, spacing.sm, spacing.md, etc.
```

### Required Pattern
```tsx
// ✅ CORRECT: Using existing theme tokens
<Typography variant="bodyMedium" style={{ color: colors.text }}>
  {content}
</Typography>

// ❌ WRONG: Creating new hardcoded values
<Text style={{ fontSize: 16, color: '#000000' }}>
  {content}
</Text>
```

### Component Reuse Priority
1. **First**: Use existing components from `components/ui/`
2. **Second**: Extend existing components with props
3. **Third**: Only create new if nothing similar exists

## Safe Area Implementation
```tsx
// ✅ CORRECT: Our mobile-first safe area pattern
const insets = useSafeAreaInsets();

<View style={{
  paddingTop: Math.max(insets.top, 20) + spacing.lg, // 32px base + safe area
  paddingHorizontal: spacing.sm, // 16px consistent horizontal
}}>
```

## Success Criteria
- ✅ 100% theme token usage (no hardcoded values)
- ✅ 100% component reuse or proper extension
- ✅ Perfect spacing match using token system
- ✅ Proper atomic design hierarchy
- ✅ Maintainable code that updates with theme changes

**Usage**: When implementing any Figma design, follow this systematic approach to ensure consistency with our design system.