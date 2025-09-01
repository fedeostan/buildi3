### General Header with Context-Specific Menu System

Creating reusable General Header component with MenuButton and MenuBottomSheet for context-specific menu options.

### Summary

- Created `GeneralHeader` organism component matching exact Figma design (`/Buildi3App/components/ui/GeneralHeader/`)
- Built `MenuButton` atom component with three-dots icon and proper styling (`/Buildi3App/components/ui/MenuButton/`)
- Developed `MenuBottomSheet` organism with sections, icons, destructive actions, disabled states (`/Buildi3App/components/ui/MenuBottomSheet/`)
- Followed existing bottom sheet patterns from `MediaUploadBottomSheet` and `Dropdown` components
- Added proper design tokens and accessibility support throughout

### Reusable patterns

- **Atomic Design Structure**: MenuButton (atom) → MenuBottomSheet (organism) → GeneralHeader (organism)
- **Component Composition**: GeneralHeader composes MenuButton and MenuBottomSheet for complete functionality
- **Context-Specific Menu**: Each screen can provide different `menuSections` arrays for their specific needs
- **Bottom Sheet Integration**: Used `@gorhom/bottom-sheet` with consistent patterns from existing components
- **Design Token Usage**: All styling uses theme tokens (`colors.*`, `spacing.*`) - no hardcoded values
- **4-File Structure**: Each component follows (`.tsx`, `styles.ts`, `types.ts`, `index.ts`) + `README.md`

### Pitfalls and fixes

- **Accessibility Role Error**: Initially used `accessibilityRole="heading"` which is invalid in React Native
- **Fix**: Changed to `accessibilityRole="text"` with `accessible={true}` for proper screen reader support
- **Menu State Management**: Needed to properly handle bottom sheet visibility state within GeneralHeader
- **Fix**: Used local state with proper callbacks to control MenuBottomSheet presentation/dismissal
- **Dynamic Height Calculation**: Bottom sheet needed smart height calculation based on menu content
- **Fix**: Implemented dynamic snap points calculation considering sections, options, and safe areas

### Next time improvements

- **Create MenuBottomSheet wrapper**: Could create a higher-level wrapper that handles common bottom sheet setup
- **Add animation transitions**: Consider adding micro-animations for menu button press states
- **Menu option icons validation**: Add TypeScript validation to ensure icon names are valid Feather icons

### Tags

`#frontend` `#react-native` `#design-system` `#atomic-design` `#figma` `#menu-system` `#bottom-sheet` `#component-composition`