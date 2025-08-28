### Bottom Sheet Standardization

Standardizing bottom sheets across the application using @gorhom/bottom-sheet

### Summary

- Refactored UpcomingTaskWidget filter modal to use BottomSheetModal from @gorhom/bottom-sheet
- Aligned implementation with existing patterns from MediaUploadBottomSheet
- Added consistent styling, backdrop behavior, and handle indicators
- Improved user experience with proper animations and native bottom sheet behavior

### Reusable patterns

- Use BottomSheetModal component from @gorhom/bottom-sheet for all modal bottom sheets
- Always include a BottomSheetTopBar at the top with proper cancel button
- Use consistent styling: colors.bottomSheetBackground, consistent handle indicator
- Implement backdrop component with 0.5 opacity that disappears on index -1 and appears on index 0
- Store bottomSheetModalRef as a useRef and use present()/dismiss() methods for showing/hiding
- Track open state with onChange callback setting a local state variable

### Pitfalls and fixes

- Initially used native Modal component which created inconsistency across the app
- Bottom sheet state tracking required separate boolean state and onChange handler
- Had to restructure content rendering for bottom sheet to match the pattern used in MediaUploadBottomSheet
- Adjusted accessibility props to ensure bottom sheet elements are properly labeled

### Next time improvements

- Create a reusable BottomSheet wrapper component that abstracts the common setup code
- Add consistent animation configurations across all bottom sheets
- Consider adding support for dynamic height based on content
- Add automated tests to verify consistent bottom sheet behavior across components

### Tags

`#frontend` `#react-native` `#design-system` `#component-standardization` `#bottom-sheet` `#ui-patterns`
