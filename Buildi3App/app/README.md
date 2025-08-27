### App (Expo Router)

**Purpose**: Screens and navigation powered by Expo Router. `_layout.tsx` defines the root stack; `(tabs)/` contains the bottom tabs for the main app.

### Structure

- `/_layout.tsx` — Root stack (onboarding screens, main tabs, modals)
- `/welcome.tsx`, `/signup.tsx`, ... — Onboarding screens (no tabs)
- `/(tabs)/` — Bottom tabs area for primary app surfaces
- Other screens (e.g., `profile.tsx`, `notifications.tsx`) as stack modals

### Adding a screen

1. Create `app/<route>.tsx` and export a React component.
2. If it belongs in the tab bar, put it under `app/(tabs)/<name>.tsx`.
3. Use UI primitives from `components/ui` and tokens from `theme`.
4. Keep screens lean: composition over styling; styles live in components.

### Navigation notes

- Tab layout styles and icons are defined in `app/(tabs)/_layout.tsx` using `Typography`, `Icon`, and `colors`.
- `headerShown` is disabled in many places; prefer in‑screen headers like `DashboardHeader`.
