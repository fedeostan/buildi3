# Design Token System Workflows

*See `README.md` in this directory for token structure and principles.*

## Claude Workflow for Design Token Usage

### Token Validation Process (CRITICAL)

**🚨 Before using ANY styling values, you MUST:**

1. **Search Existing Colors**:
   ```typescript
   // Check colors.ts for semantic matches first
   grep -r "primary\|text\|background" theme/colors.ts
   ```

2. **Search Existing Spacing**:
   ```typescript
   // Check spacing.ts for size matches  
   grep -r "xs\|sm\|md\|lg\|xl" theme/spacing.ts
   ```

3. **Validate Against Figma**:
   - Does this color exist in Figma variables?
   - Does this spacing match Figma's 8px grid system?
   - Should I create a new token or use existing?

### Theme Token Usage Patterns

#### Color Usage Hierarchy (MANDATORY)

```tsx
// ✅ PRIORITY 1: Semantic colors (preferred)
backgroundColor: colors.backgroundPrimary,
color: colors.text,
borderColor: colors.border,

// ✅ PRIORITY 2: Component-specific colors
backgroundColor: colors.buttonPrimary,
color: colors.buttonText,

// ✅ PRIORITY 3: Contextual colors
backgroundColor: colors.widgetBackground,
color: colors.actionText,

// ❌ NEVER: Hardcoded hex values
backgroundColor: '#FFFFFF', // WRONG
color: '#000000',          // WRONG
```

#### Spacing Usage Patterns

```tsx
// ✅ CORRECT: Use spacing tokens
padding: spacing.sm,        // 16px
margin: spacing.md,         // 24px  
gap: spacing.xs,           // 8px

// ✅ CORRECT: Use spacing helpers
...spacing.createPadding({ all: 'sm' }),
...spacing.createMargin({ horizontal: 'md', vertical: 'sm' }),

// ❌ WRONG: Hardcoded pixel values
padding: 16,               // WRONG
margin: 24,                // WRONG
```

### Design Token Creation Workflow

#### When to Add New Tokens

**Add Color Token When:**
- Color appears 3+ times across components
- Color has semantic meaning (error, success, warning)
- Color comes from Figma design system variables
- No existing semantic color matches the use case

**Add Spacing Token When:**
- Size is used repeatedly across components
- Size fits into 8px grid system
- Size has semantic meaning (component padding, screen margins)

#### Color Token Creation Process

1. **Add to Raw Palette** (if needed):
```typescript
// In colors.ts - add to palette first
const palette = {
  blue600: '#1E40AF',  // New raw color
  // ...existing colors
};
```

2. **Create Semantic Token**:
```typescript
// Create semantic meaning
export const colors = {
  // ...existing tokens
  accentPrimary: palette.blue600,        // Semantic name
  buttonAccent: palette.blue600,         // Component-specific
  // ...
};
```

3. **Add Helper if Needed**:
```typescript
// If transparency variations needed
accentPrimaryLight: withOpacity(palette.blue600, 0.1),
accentPrimaryDark: withOpacity(palette.blue600, 0.8),
```

#### Spacing Token Creation Process

1. **Validate 8px Grid**:
```typescript
// Ensure new spacing fits 8px grid system
// 8, 16, 24, 32, 40, 48, 56, 64, etc.
```

2. **Add to Scale**:
```typescript
// In spacing.ts
const scale = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,  // New size if needed
};
```

3. **Create Semantic Token**:
```typescript
// Add semantic meaning
export const spacing = {
  ...scale,
  // Component-specific spacing
  componentPadding: scale.md,
  screenMargin: scale.sm,
};
```

### Token Usage Validation

#### Pre-Implementation Checklist

Before writing any component styles:
- [ ] Checked `colors.ts` for existing color matches
- [ ] Checked `spacing.ts` for existing spacing matches
- [ ] Verified tokens match Figma design variables
- [ ] Confirmed semantic naming over raw values
- [ ] No hardcoded hex colors or pixel values planned

#### Implementation Validation

During component development:
```typescript
// ✅ CORRECT: Semantic token usage
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,  // Semantic
    padding: spacing.sm,                         // Token
    borderRadius: 8,                            // OK if not repeated
    borderColor: colors.border,                 // Semantic
    borderWidth: 1,                            // OK for standard values
  },
});

// ❌ WRONG: Hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F3F7',                 // WRONG - hardcoded
    padding: 16,                               // WRONG - use spacing.sm
    borderColor: '#E5E7EB',                    // WRONG - use colors.border
  },
});
```

#### Component-Specific Token Patterns

**Button Components**:
```typescript
backgroundColor: colors.buttonPrimary,
color: colors.buttonText,
padding: spacing.buttonPadding || spacing.sm,
```

**Widget Components**:
```typescript
backgroundColor: colors.widgetBackground,
padding: spacing.widgetPadding || spacing.md,
borderColor: colors.widgetBorder,
```

**Text Components**:
```typescript
color: colors.text,                    // Primary text
color: colors.textSecondary,           // Secondary text
fontSize: typography.bodySize,         // Use Typography component instead
```

### Mobile-Specific Token Usage

#### Safe Area Integration
```typescript
// ✅ Combine tokens with safe area
const insets = useSafeAreaInsets();

paddingTop: Math.max(insets.top, 20) + spacing.lg,    // Safe area + token
paddingHorizontal: spacing.sm,                        // Consistent horizontal
paddingBottom: Math.max(insets.bottom, 20),           // Safe area handling
```

#### Touch Target Sizing
```typescript
// ✅ Minimum touch targets using tokens
minHeight: 44,                         // iOS minimum
minWidth: 44,                          // iOS minimum
// Or use spacing tokens that meet minimums:
minHeight: spacing.touchTarget || 44,
```

### Figma Integration Workflow

#### Extracting Tokens from Figma

1. **Color Extraction**:
   - Check Figma variables/styles panel
   - Copy exact hex values
   - Create semantic names based on usage
   - Add to palette with descriptive names

2. **Spacing Extraction**:
   - Measure spacing in Figma (should be 8px multiples)
   - Identify patterns (component padding, margins, gaps)
   - Create semantic tokens for repeated values

3. **Typography Integration**:
   - Use existing Typography component
   - Don't create new font size tokens
   - Work with Typography component variants

### Error Prevention Commands

#### Debug Hardcoded Values
```bash
# Find hardcoded colors in your code
grep -r "#[0-9A-Fa-f]" app/ components/ --exclude-dir=node_modules

# Find hardcoded spacing values  
grep -r "padding:\s*[0-9]" app/ components/ --exclude-dir=node_modules
grep -r "margin:\s*[0-9]" app/ components/ --exclude-dir=node_modules

# Find non-token background colors
grep -r "backgroundColor.*#" app/ components/ --exclude-dir=node_modules
```

### Success Metrics

A perfect token integration achieves:
- ✅ **100% Token Usage**: No hardcoded colors or spacing values
- ✅ **Semantic Naming**: Meaningful names over raw values
- ✅ **Figma Alignment**: Matches design system exactly
- ✅ **Maintainability**: Changes to tokens update entire UI
- ✅ **Mobile Optimization**: Proper safe area and touch target handling

### Token Maintenance

#### Regular Audits
- Review components for hardcoded values monthly
- Consolidate similar colors into semantic tokens
- Remove unused tokens to keep system clean
- Update documentation when adding new tokens

#### Token Evolution
- Add tokens when patterns emerge (3+ usage rule)
- Refactor hardcoded values to tokens during updates
- Keep semantic names meaningful and descriptive
- Consider dark mode and theming when adding tokens

**Remember**: The theme system is the foundation of design consistency. Every hardcoded value is a missed opportunity for maintainable, scalable design.