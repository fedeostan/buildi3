# Metro Configuration for SVG Support

This Metro configuration allows using SVG files as React components in the app.

## Implementation Details

The configuration in `metro.config.js` does the following:

1. Uses `react-native-svg-transformer` as the babel transformer for SVG files
2. Removes `.svg` from assetExts (where they would be treated as static assets)
3. Adds `.svg` to sourceExts (where they're processed by the transformer)

## Usage Guidelines

### 1. Import SVGs Directly as React Components

```jsx
// Import and use SVG as a React component
import MyIcon from "./path/to/icon.svg";

// Use in JSX with SVG props
<MyIcon width={24} height={24} fill="blue" />;
```

### 2. TypeScript Support

Types for SVG files are declared in `declarations.d.ts`:

```ts
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
```

### 3. Static vs. Dynamic Imports

- **DO**: Import SVGs statically at the top of files
- **DON'T**: Use dynamic imports with template literals for SVG paths (not supported by Metro)

### 4. Best Practices

- Use static imports with a mapping object for icons that need to be selected at runtime
- Keep SVG files simple and optimized (consider using tools like SVGO)
- Explicitly control SVG sizing through props instead of relying on container dimensions

## Helpful Resources

- [react-native-svg documentation](https://github.com/software-mansion/react-native-svg)
- [react-native-svg-transformer documentation](https://github.com/kristerkari/react-native-svg-transformer)
