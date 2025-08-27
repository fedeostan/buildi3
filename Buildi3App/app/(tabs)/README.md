### (tabs) — Bottom Navigation

**Purpose**: Main app surface controlled by `Tabs` in `_layout.tsx`. Styles and labels use the design system.

### Current tabs

- `home` — Home surface
- `devres` — Developer resources

### Adding a new tab

1. Create a screen `app/(tabs)/<name>.tsx`.
2. In `app/(tabs)/_layout.tsx`, add a `<Tabs.Screen name="<name>" />` entry.
3. Use `Icon` for `tabBarIcon` and `Typography` for `tabBarLabel`.
4. Keep `tabBarStyle` consistent with `colors.background` and `colors.backgroundSecondary`.

### Styling guidance

- Use `colors` from `theme` for `tabBarStyle`, active/inactive tints.
- Keep height and paddings token‑aligned; avoid magic numbers.
