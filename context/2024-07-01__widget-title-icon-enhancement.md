### Widget Title Icon Enhancement

Adding icon support to Widget Title action buttons for better UI affordance

### Summary

- Enhanced `WidgetTitle` component to support icons next to action text
- Updated `Widget` component to pass icon props to `WidgetTitle`
- Implemented in `UpcomingTaskWidget` to display chevron-down icon next to filter text
- Fixed typings to ensure proper Feather icon integration with the design system

### Reusable patterns

- Extended existing components (WidgetTitle, Widget) with backwards compatibility
- Followed atomic design principles by reusing Icon atom in WidgetTitle molecule
- Used proper typing with FeatherIconName to ensure type safety with the icon library
- Maintained consistent spacing between text and icon (4px) following design system

### Pitfalls and fixes

- Initially encountered typing issues with icon name not being properly typed as FeatherIconName
- Fixed by importing proper types from Icon component
- Had to refactor styles to avoid using non-existent style properties directly in components

### Next time improvements

- Could create a reusable "TextWithIcon" component for cases where text and icons appear together
- Add automated tests for new component props to ensure backward compatibility

### Tags

`#frontend` `#react-native` `#design-system` `#atomic-design` `#component-enhancement`
