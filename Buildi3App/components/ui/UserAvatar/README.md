# UserAvatar Component

A molecule component that displays user avatar with initials and optional full name below.

## Features

- Extracts and displays user initials from first/last name
- Supports medium (44px) and large (58px) sizes
- Optional full name display below avatar
- Touch handling for navigation
- Follows existing ProfileIcon patterns
- Uses semantic design tokens exclusively
- Full accessibility support

## Usage

```tsx
import { UserAvatar } from '../components/ui';

// Basic usage with profile data
<UserAvatar 
  firstName={profile?.first_name}
  lastName={profile?.last_name}
  showName={true}
/>

// With navigation
<UserAvatar 
  firstName={profile?.first_name}
  lastName={profile?.last_name}
  onPress={() => router.push('/personal-details')}
/>

// Different sizes
<UserAvatar 
  firstName="John"
  lastName="Doe"
  size="medium"
  showName={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `firstName` | `string \| null` | - | User's first name |
| `lastName` | `string \| null` | - | User's last name |
| `fullName` | `string` | - | Fallback full name |
| `size` | `'medium' \| 'large'` | `'large'` | Avatar size |
| `showName` | `boolean` | `true` | Show name below avatar |
| `onPress` | `() => void` | - | Touch handler |
| `style` | `ViewStyle` | - | Custom styles |
| `accessibilityLabel` | `string` | - | Screen reader label |

## Design System Integration

- Uses `colors.primary` for avatar background
- Uses `colors.textInverse` for initials text
- Uses `colors.text` for full name
- Uses `spacing.xs` for avatar-to-name spacing
- Matches ProfileIcon size variants exactly

## Accessibility

- Provides meaningful labels for screen readers
- Supports both button and static roles
- Follows WCAG guidelines for touch targets

## Files Structure

```
UserAvatar/
├── UserAvatar.tsx    # Main component
├── styles.ts         # StyleSheet definitions
├── types.ts          # TypeScript interfaces  
├── index.ts          # Barrel exports
└── README.md         # Component documentation
```