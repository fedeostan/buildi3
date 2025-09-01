# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context & Philosophy

**Fede's Design System Approach**: I'm Fede, an experienced UX designer who is detail-oriented and visual. We use Figma as our **single source of truth** for frontend development with absolute precision and consistency.

**Core Principle**: Design tokens and reusable components are the foundation of our system. **Never create new variables or components unless you've exhaustively searched the existing codebase first.**

**Frontend First**: Always start with visible UI components for immediate visual feedback. Build the interface first, then add functionality.

## Custom Commands Available

Use these slash commands for specific workflows:

- `/figma-to-code` - Systematic Figma design to React Native code conversion
- `/learning-loop` - Structured development workflow with documentation
- `/react-native-rules` - Mobile-first React Native best practices

## MCP Integration Ready

This project is configured for MCP tool integration to read Figma designs and apply them systematically using our design system patterns.

## Essential Commands

**Development Server:**
```bash
npx expo start          # Start development server
npx expo start --clear  # Start with cache cleared
npx expo start --tunnel # Start with tunnel for remote testing
```

**Platform-Specific:**
```bash
npx expo start --ios     # Run on iOS simulator
npx expo start --android # Run on Android emulator
npx expo start --web     # Run in web browser
```

**Code Quality:**
```bash
npm run lint            # Run ESLint
npm run lint -- --fix   # Auto-fix linting issues
```

**Project Management:**
```bash
npm run reset-project   # Reset to blank project (moves current to app-example/)
```

## Architecture Overview

### Tech Stack
- **React Native 0.79.5** with **React 19.0.0**
- **Expo SDK 53** with **Expo Router 5.1.5** (file-based routing)
- **TypeScript 5.8.3** with strict configuration
- **Bottom Sheets**: @gorhom/bottom-sheet for modal presentations
- **Graphics**: React Native SVG with custom Metro configuration
- **Animation**: React Native Reanimated 3.17.4

### Routing Structure (Expo Router)
The app uses file-based routing with this hierarchy:
```
app/
├── index.tsx                 # Landing/auth check
├── welcome.tsx              # Onboarding entry
├── (authentication flow)    # signup, verify-email, etc.
├── (tabs)/                  # Main app with bottom tabs
│   ├── _layout.tsx         # Tab configuration  
│   ├── home.tsx            # Dashboard
│   └── devres.tsx          # Development resources
├── profile.tsx             # Modal presentation
└── notifications.tsx       # Modal presentation
```

### Component Architecture

**Component Structure Pattern:**
Every UI component follows this structure:
```
ComponentName/
├── ComponentName.tsx    # Implementation (logic + JSX)
├── styles.ts           # StyleSheet objects using theme tokens
├── types.ts           # Props interfaces and TypeScript types
├── index.ts           # Barrel exports
└── README.md          # Component documentation
```

**Import Pattern:**
```typescript
// Always import from barrel exports
import { Button, Typography, Icon } from '@/components/ui';
import { colors, spacing } from '@/theme';
```

### Theme System

**Location**: `theme/` directory with comprehensive design tokens

**Key Files:**
- `colors.ts` - Semantic color system with Figma integration
- `spacing.ts` - 8px grid system with helper functions
- `index.ts` - Main theme exports

**Usage Pattern:**
```typescript
// In styles.ts files
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundPrimary,
    padding: spacing.md, // 16px
    margin: spacing.createMargin({ vertical: 'lg', horizontal: 'md' })
  }
});
```

### SVG Asset Handling

**Configuration**: Custom Metro config enables SVG imports
```typescript
// SVG imports work directly
import ProjectIcon from '@/assets/icons/project_icons/Project=Building, Color=Blue.svg';
```

**Asset Organization:**
- Project icons: `assets/icons/project_icons/Project=Type, Color=Variant.svg`
- Systematic naming convention for easy programmatic access

## Development Patterns

### Component Development
1. **Always use theme tokens** instead of hardcoded values
2. **Follow the component structure pattern** with separate files for styles, types, and documentation
3. **Export through barrel exports** in `index.ts` files
4. **Document components** with README.md including usage examples

### Screen Development (Expo Router)
1. **File-based routing** - create files in `app/` directory
2. **Use `_layout.tsx`** for nested navigation configuration
3. **Modal presentations** - screens in root `app/` directory
4. **Tab screens** - place in `app/(tabs)/` directory

### Styling Guidelines
1. **Theme-first approach** - always use tokens from `theme/`
2. **8px spacing grid** - use spacing tokens (`xs`, `sm`, `md`, `lg`, `xl`, etc.)
3. **Semantic colors** - use meaningful names (`colors.primary`, not `colors.blue500`)
4. **Component-specific styles** - keep styles in separate `styles.ts` files

### TypeScript Patterns
1. **Strict typing** enabled - no `any` types
2. **Props interfaces** in `types.ts` files with clear naming
3. **Theme token typing** - colors and spacing are strongly typed
4. **Expo Router typed routes** enabled for navigation safety

## Project-Specific Features

### Widget System
The home screen uses a modular widget system:
- `Widget.tsx` - Base widget container
- `ProjectWidget.tsx` - Project management widget
- `NextTaskWidget.tsx` - Task tracking widget
- `UpcomingTaskWidget.tsx` - Schedule widget

### Bottom Sheet Integration
Uses `@gorhom/bottom-sheet` for modal presentations:
- `MediaUploadBottomSheet.tsx` - File upload functionality
- `BottomSheetTopBar.tsx` - Consistent top bar for sheets

### Task and Project Management
Core domain entities:
- Projects with categorized icons and color coding
- Task management with priority and status tracking
- Dashboard widgets for overview and quick actions

## Important Notes

### Metro Configuration
Custom configuration supports:
- SVG transformations for direct imports
- TypeScript path mapping (`@/*` for root imports)
- Asset resolution for fonts and images

### Development Workflow
1. **Hot reloading** is enabled - changes reflect immediately
2. **Multiple platform testing** - use platform-specific start commands
3. **Comprehensive linting** - run before commits
4. **Component documentation** - update README.md when modifying components

### Asset Management
- **SVG icons** - imported directly, no need for icon fonts
- **Images** - use Expo Image for optimized loading
- **Fonts** - SpaceMono for monospace needs, system fonts for UI