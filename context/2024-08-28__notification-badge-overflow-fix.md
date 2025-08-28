# Notification Badge Overflow Fix

## Problem

After moving the DashboardHeader inside the ScrollView, the red notification badge was being cut off because it's positioned with negative values (top: -2, right: -2) to overlap the container edges.

## Solution

Added `overflow: 'visible'` to all parent containers to ensure the notification badge is fully displayed:

1. Added overflow visible to the main container:

```tsx
container: {
  flex: 1,
  backgroundColor: colors.background,
  overflow: 'visible',
},
```

2. Added overflow visible to the ScrollView content and content container:

```tsx
content: {
  flex: 1,
  overflow: 'visible',
},

contentContainer: {
  paddingBottom: spacing.layout + spacing.md,
  overflow: 'visible',
},
```

3. Added overflow visible to the DashboardHeader container:

```tsx
container: {
  // existing styles...
  overflow: 'visible', // Ensure notification badge is visible
},
```

4. Added overflow visible to the NotificationIcon container:

```tsx
container: {
  // existing styles...
  overflow: 'visible', // Ensure the badge isn't clipped
},
```

## Key Lessons

1. When using elements with absolute positioning that extend beyond their parent container bounds, set `overflow: 'visible'` on all parent containers.
2. This is especially important when:
   - Using negative position values to create overlapping effects
   - Working with notification badges or similar UI elements that need to appear partially outside their containers
   - Placing components inside a ScrollView (which by default clips its content)
3. The `overflow` property needs to be set on all parent elements in the component tree, not just the immediate parent.
4. For ScrollViews, set `overflow: 'visible'` on both the style and contentContainerStyle.

## File Changes

- `/Buildi3App/app/(tabs)/home.tsx` - Added overflow visible to container, content and contentContainer styles
- `/Buildi3App/components/ui/DashboardHeader/styles.ts` - Added overflow visible to container style
- `/Buildi3App/components/ui/NotificationIcon/styles.ts` - Added overflow visible to container style
