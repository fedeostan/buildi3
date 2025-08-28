### ProjectItem SVG Icon Implementation

Improved SVG icon handling in ProjectItem component

### Summary

- Enhanced ProjectItem component with proper SVG handling using react-native-svg-transformer
- Fixed bundling issues by switching from dynamic imports to static mappings
- Set proper icon sizing (44x44px) for consistent design
- Eliminated unsafe dynamic path imports for more reliable bundling

### Reusable patterns

- **SVG as React Components**: Set up metro.config.js to handle SVGs as React components
- **Static Import Pattern**: Use static imports with a mapping object for better performance and reliability
- **SVG Size Control**: Control SVG sizing directly with width/height props instead of container sizing
- **Project Icon Type System**: Maintained strong typing for project icon types and colors with TypeScript

### Pitfalls and fixes

- **Metro Bundler Issue**: Dynamic imports with template strings (`` import(`path/${variable}`) ``) don't work with Metro bundler in React Native - switched to static imports and a mapping object
- **SVG Sizing**: Initial implementation set SVG to 24x24px which was too small - adjusted to 40x40px within a 44x44px container for proper display
- **TypeScript Errors**: Fixed type errors with proper typing for SVG components and using `as any` for style properties that TypeScript doesn't recognize

### Next time improvements

- **Component Docs Generator**: Create a script to automatically generate component examples and prop tables in README files
- **SVG Management**: Consider implementing a script to generate the icon mapping object from the SVG files in the assets folder

### Tags

`#frontend` `#react-native` `#svg` `#design-system` `#component` `#optimization`
