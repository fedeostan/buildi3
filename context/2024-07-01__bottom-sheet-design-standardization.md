### Bottom Sheet Design Standardization

Updating bottom sheets to match design system with consistent styling and behavior

### Summary

- Updated UpcomingTaskWidget's filter bottom sheet to match design system standards
- Replaced custom header with centered title and removed side buttons (Close/Camera)
- Changed selected item styling to use circular indicator with checkmark instead of icon
- Aligned all text sizes, colors and spacing with design system standards
- Made title and option text larger with proper font styling
- Added proper bottom spacing with safe area inset consideration

### Reusable patterns

- Use centered title with Text component styled at 18px, 600 weight
- Show circular indicator with checkmark (\u2713) for selected options
- No background highlight for selected items - only circular checkmark indicator
- Consistent spacing with borders between options
- Use proper font sizes: 18px for title, 16px for options
- Use colors.text for text and colors.primary for selection indicator
- Consistent bottom sheet background and handle indicator
- Add proper bottom padding: Math.max(insets.bottom + 40, 70) for adequate spacing from screen edge

### Pitfalls and fixes

- Previous implementation used background highlighting for selected items
- Needed to add flexDirection: "row" and justifyContent: "space-between" for options
- Removed unnecessary "Filter by period" text and renamed title to "Period of Time"
- Made sure to use design system colors and spacing variables throughout

### Next time improvements

- Create a reusable BottomSheetOption component for consistent option styling
- Add animation for selection change
- Create a standard BottomSheet component that encapsulates common styling
- Implement a design system token specifically for bottom sheet header styling

### Tags

`#frontend` `#react-native` `#design-system` `#ui-patterns` `#bottom-sheet` `#component-enhancement`
