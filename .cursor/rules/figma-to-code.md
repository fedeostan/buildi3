# Figma to Code Workflow Rules

## Context & Philosophy

**Fede's Design System Approach**: I'm Fede, an experienced UX designer who is detail-oriented and visual. We use Figma as our **single source of truth** for frontend development. This document establishes the workflow for converting Figma designs to React Native code with absolute precision and consistency.

**Core Principle**: Design tokens and reusable components are the foundation of our system. **Never create new variables or components unless you've exhaustively searched the existing codebase first.**

---

## Pre-Conversion Workflow (CRITICAL STEPS)

### 1. **Structural Analysis Phase**

Before writing any code, analyze the Figma design structure:

- **Identify Containers**: Look for frames, groups, and auto-layout containers
- **Examine Spacing**: Note margins, padding, and gaps between elements
- **Catalog Elements**: List all colors, typography, spacing values, and components used
- **Check Hierarchy**: Understand the atomic design structure (atoms → molecules → organisms)

### 2. **Mandatory Component & Variable Search**

**🚨 NEVER SKIP THIS STEP 🚨**

**For every design element, search existing codebase for:**

```bash
# Search for existing colors
grep -r "primary" theme/colors.ts
grep -r "#[0-9A-Fa-f]" theme/colors.ts

# Search for existing spacing
grep -r "spacing\." theme/spacing.ts

# Search for existing components
find components/ui -name "*.tsx" | grep -i "button\|input\|card"

# Search for similar component patterns
grep -r "TouchableOpacity\|Pressable" components/ui/
```

**Golden Rule**: If it exists in our design system, USE IT. If similar exists, EXTEND IT. Only if nothing exists, CREATE IT.

### 3. **Variable Validation Checklist**

Before using any value, verify it exists in our theme system:

- ✅ **Colors**: Check `theme/colors.ts` for exact matches
- ✅ **Spacing**: Check `theme/spacing.ts` for spacing values
- ✅ **Typography**: Check existing Typography component variants
- ✅ **Components**: Check `components/ui/` for similar patterns

---

## Atomic Design Implementation Rules

### **Atoms (Smallest Reusable Units)**

- **Typography**: Text elements using our Typography component
- **Colors**: Background colors, borders using our color tokens
- **Spacing**: Margins, padding using our spacing tokens
- **Icons**: Using our Icon component with Feather icons

**Example Atom Usage:**

```tsx
// ✅ CORRECT: Using existing theme tokens
<Typography variant="bodyMedium" style={{ color: colors.text }}>
  {content}
</Typography>

// ❌ WRONG: Creating new values
<Text style={{ fontSize: 16, color: '#000000' }}>
  {content}
</Text>
```

### **Molecules (Component Combinations)**

- **Buttons**: Combine Typography + colors + spacing
- **Input Fields**: Combine Typography + colors + spacing + interaction states
- **Cards**: Combine background + spacing + border radius

**Example Molecule Pattern:**

```tsx
// ✅ CORRECT: Reusing existing SwapItem molecule
<SwapItem placeholderText="Add content here">
  {children}
</SwapItem>

// ❌ WRONG: Creating custom container without checking existing
<View style={{ backgroundColor: '#F2F3F7', padding: 16 }}>
  {children}
</View>
```

### **Organisms (Complete UI Sections)**

- **Widgets**: Complete functional units using our Widget organism
- **Navigation**: Complete navigation sections
- **Headers**: Complete header sections with multiple elements

---

## Spacing & Container Rules

### **Container Structure (Following Figma Auto Layout)**

1. **Identify Container Type in Figma:**

   - **Frame with Auto Layout** → Use `View` with Flexbox
   - **Frame without Auto Layout** → Use `View` with absolute positioning if needed
   - **Group** → Analyze if grouping is necessary or just visual

2. **Spacing Translation:**

   ```tsx
   // Figma Auto Layout Gap → React Native gap or margin
   // Figma Padding → paddingHorizontal/paddingVertical
   // Figma Margin → marginHorizontal/marginVertical
   ```

3. **Safe Area Implementation:**

   ```tsx
   // ✅ CORRECT: Using our safe area pattern
   const insets = useSafeAreaInsets();

   <View style={{
     paddingTop: Math.max(insets.top, 20) + spacing.lg, // 32px base + safe area
     paddingHorizontal: spacing.sm, // 16px consistent horizontal
   }}>
   ```

### **Spacing Value Mapping**

| Figma Value | Use This Token | Never Use |
| ----------- | -------------- | --------- |
| 8px         | `spacing.xs`   | `8`       |
| 16px        | `spacing.sm`   | `16`      |
| 24px        | `spacing.md`   | `24`      |
| 32px        | `spacing.lg`   | `32`      |
| 40px        | `spacing.xl`   | `40`      |

---

## Component Integration Workflow

### **Step 1: Component Discovery**

```bash
# Before creating ANY component, run these searches:
grep -r "Button" components/ui/ --include="*.tsx"
grep -r "Input" components/ui/ --include="*.tsx"
grep -r "Widget" components/ui/ --include="*.tsx"
```

### **Step 2: Component Reuse Pattern**

```tsx
// ✅ PREFERRED: Use existing Widget organism
<Widget
  title="Dynamic Content"
  onActionPress={handleAction}
  buttonText="Add Item"
  onButtonPress={handleAdd}
>
  <SwapItem>
    {dynamicContent}
  </SwapItem>
</Widget>

// ✅ ACCEPTABLE: Extend existing component
<Widget
  title="Custom Widget"
  titleProps={{ style: { color: colors.primary } }}
  swapItemMinHeight={200}
>
  {customContent}
</Widget>
```

### **Step 3: Variable Usage Validation**

```tsx
// ✅ CORRECT: Using theme variables
backgroundColor: colors.widgetBackground,
color: colors.text,
padding: spacing.sm,
gap: spacing.md,

// ❌ WRONG: Hardcoded values
backgroundColor: '#FFFFFF',
color: '#001848',
padding: 16,
gap: 24,
```

---

## Color & Typography Rules

### **Color Usage Hierarchy**

1. **First**: Search semantic colors (`colors.primary`, `colors.text`)
2. **Second**: Search component-specific colors (`colors.buttonPrimary`)
3. **Third**: Search raw color tokens (only if semantic doesn't exist)
4. **Never**: Create new hex values without checking Figma variables

### **Typography Implementation**

```tsx
// ✅ CORRECT: Using Typography component
<Typography
  variant="labelLarge"
  style={{ color: colors.actionText }}
>
  {text}
</Typography>

// ❌ WRONG: Custom text styling
<Text style={{
  fontSize: 16,
  fontWeight: '600',
  color: '#5A70A1'
}}>
  {text}
</Text>
```

---

## Error Prevention Checklist

### Before Writing Any Code:

- [ ] I have identified all Figma frames and their spacing values
- [ ] I have searched for existing components that match this pattern
- [ ] I have verified all colors exist in `theme/colors.ts`
- [ ] I have verified all spacing values exist in `theme/spacing.ts`
- [ ] I have checked if existing Typography variants match the design
- [ ] I have confirmed the component follows our atomic design structure

### During Implementation:

- [ ] I am using semantic variable names, not hardcoded values
- [ ] I am reusing existing components before creating new ones
- [ ] I am following our safe area patterns for mobile layout
- [ ] I am maintaining proper container hierarchy from Figma
- [ ] I am using proper gap/margin/padding as specified in Figma

### After Implementation:

- [ ] All spacing matches Figma exactly using our token system
- [ ] All colors are from our design system, no hardcoded hex values
- [ ] Component can be reused in other contexts
- [ ] Code follows our existing component patterns and structure

---

## Emergency Debug Commands

When AI forgets to use variables, run these checks:

```bash
# Find hardcoded colors in your code
grep -r "#[0-9A-Fa-f]" app/ --exclude-dir=node_modules

# Find hardcoded spacing values
grep -r "padding:\s*[0-9]" app/ --exclude-dir=node_modules

# Find non-token background colors
grep -r "backgroundColor.*#" app/ --exclude-dir=node_modules

# Verify component exists before creating
find components/ui -name "*Button*" -o -name "*Input*" -o -name "*Card*"
```

---

## Success Metrics

A perfect Figma-to-code conversion achieves:

1. **100% Variable Usage**: No hardcoded colors, spacing, or typography values
2. **100% Component Reuse**: Uses existing components or properly extends them
3. **Perfect Spacing**: Matches Figma layout exactly using our token system
4. **Proper Hierarchy**: Follows atomic design principles (atoms → molecules → organisms)
5. **Maintainable Code**: Changes to design tokens automatically update the implementation

**Remember**: We build a design system, not individual components. Every piece of code should contribute to the system's consistency and reusability.
