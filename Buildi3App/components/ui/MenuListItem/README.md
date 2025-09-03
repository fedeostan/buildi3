# MenuListItem Component

An atom component for reusable menu rows with icon, title, and optional chevron navigation.

## Features

- Reusable menu row with consistent styling
- Supports icons from Feather icon set
- Touch feedback with proper accessibility
- Destructive variant for dangerous actions (red styling)
- Optional chevron-right icon
- Uses semantic design tokens exclusively
- Full accessibility support

## Usage

```tsx
import { MenuListItem } from '../components/ui';

// Basic menu item
<MenuListItem
  title="Personal Details"
  iconName="user"
  onPress={() => router.push('/personal-details')}
/>

// Settings menu item
<MenuListItem
  title="Settings"
  iconName="settings"
  onPress={() => router.push('/settings')}
/>

// Destructive action (Sign Out)
<MenuListItem
  title="Sign Out"
  iconName="log-out"
  variant="destructive"
  onPress={handleSignOut}
/>

// Without chevron
<MenuListItem
  title="Info"
  iconName="info"
  showChevron={false}
  onPress={showInfo}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Menu item text |
| `iconName` | `FeatherIconName` | - | Left icon name |
| `onPress` | `() => void` | - | Touch handler |
| `variant` | `'default' \| 'destructive'` | `'default'` | Visual variant |
| `showChevron` | `boolean` | `true` | Show right chevron |
| `style` | `ViewStyle` | - | Custom styles |
| `accessibilityLabel` | `string` | - | Screen reader label |
| `testID` | `string` | - | Test identifier |

## Variants

### Default
- Uses `colors.text` for title
- Uses `colors.textSecondary` for icon
- Standard menu item appearance

### Destructive
- Uses `colors.error` for title and icon
- For dangerous actions like "Sign Out" or "Delete"

## Design System Integration

- Uses `colors.backgroundSecondary` (white) for background
- Uses `spacing.sm` (16px) for padding
- Uses `spacing.xs` for margins between items
- Consistent 12px border radius
- Minimum 56px height for touch accessibility

## Accessibility

- Proper button role and labels
- Touch-friendly minimum size (56px height)
- Clear visual feedback on press
- Supports screen readers

## Files Structure

```
MenuListItem/
├── MenuListItem.tsx  # Main component
├── styles.ts         # StyleSheet definitions
├── types.ts          # TypeScript interfaces  
├── index.ts          # Barrel exports
└── README.md         # Component documentation
```