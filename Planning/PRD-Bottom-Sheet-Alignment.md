# Bottom Sheet Alignment

> Product Requirements Document (PRD)

## Vision

Create a consistent, high-performance, and reusable bottom sheet system that aligns with the design system and scales across all current and future use cases (lists, actions, media pickers, calendars, forms). Unify the UX and visual styling while preserving flexibility through well-defined variants and composition.

## Goals

- Standardize look-and-feel for all bottom sheets (background, backdrop, handle, headers, spacing, elevation, and motion).
- Provide a single reusable foundation (`BaseBottomSheet`) and specialized, composable primitives for common patterns.
- Reduce duplication and drift across `Dropdown`, `AssignedToDropDown`, `TaskActionsBottomSheet`, and future sheets (media, calendar, forms).
- Ensure accessibility, responsiveness, and excellent perceived performance on mobile.

## Non-Goals

- No new business features; focus is purely on UX and technical alignment of bottom sheets.
- No changes to non-bottom-sheet screens unless required to integrate standardized components.

---

## Design Principles

- Reuse design tokens (colors, spacing, typography) from the theme. No hardcoded values.
- Predictable interaction model: consistent gestures, backdrop behavior, and dismissal.
- Low cognitive load: uniform headers, list row density, separators, and empty states.
- Mobile performance first: dynamic snap points, content virtualization where needed.
- Accessibility: screen reader labels, roles, focus management, and sufficient contrast.

---

## Architecture Overview

- Foundation: `@gorhom/bottom-sheet` v5.
- Base component: `BaseBottomSheet` (single source of truth for visuals and behavior).
- Composable primitives (atoms/molecules): headers, lists, action rows, form sections, media grids, calendar views.
- Variants configured via props; domain components compose primitives without forking base logic.

---

## Epics

### Epic 1 — Create BaseBottomSheet Foundation

- Objective: Introduce a single wrapper to centralize visual/behavioral defaults.
- Deliverables:
  - `BaseBottomSheet` with standardized:
    - background: `colors.bottomSheetBackground`
    - backdrop: opacity 0.6, tap-to-close
    - handle: width 40, height 4, color `colors.border`
    - snap points: dynamic single-point (`40–85%` by content/viewport) with escape to `maxHeight` prop
    - safe area padding and keyboard handling
    - accessibility labels and roles
  - Base header: `BottomSheetHeader` (title, optional subtitle, right/left actions)
  - Base content containers: `BottomSheetContent`, `BottomSheetScrollContent`
- Acceptance Criteria:
  - All visuals derive from theme tokens; no hardcoded colors/spacings.
  - Backdrop and handle appear consistent across all consumers.
  - Dynamic snap calculation respects safe area and content size.
  - Works on iOS and Android; supports pan down to close.

### Epic 2 — Standard List & Action Patterns

- Objective: Provide shared list primitives and action row styles for option/action sheets.
- Deliverables:
  - `BottomSheetList` with separators, density, padding, empty state.
  - `BottomSheetListItem` with states: default, selected, disabled, destructive, with optional left icon/right accessory.
  - `BottomSheetSection` with optional section headers.
  - Refactor `Dropdown` and `AssignedToDropDown` to use these list primitives.
  - Refactor `TaskActionsBottomSheet` to adopt `BaseBottomSheet` and action rows.
- Acceptance Criteria:
  - Visual parity across Dropdown selections, assignee picker, and task actions.
  - Identical backdrop, background, handle, header treatment.
  - Selection and pressed states match design tokens.
  - No behavior regressions (close-on-select, keyboard, scroll).

### Epic 3 — Media Picker Pattern (Photos/Files)

- Objective: Standardize media picker bottom sheets (grid/list, preview, segmented control).
- Deliverables:
  - `BottomSheetTopBar` alignment with base header spacing and tokens.
  - `BottomSheetMediaGrid` (virtualized) with selection states and lazy loading.
  - `BottomSheetFileList` for files/documents.
  - Hooks for dynamic snap based on media count and device height.
- Acceptance Criteria:
  - Consistent header height, handle, backdrop, and background as Base.
  - Smooth scroll and image loading; no jank on mid-tier devices.
  - a11y: items labeled, selected state announced.

### Epic 4 — Calendar/Date Picker Pattern

- Objective: Provide a standardized calendar picker bottom sheet.
- Deliverables:
  - `BottomSheetCalendar` with month navigation, min/max dates, and range/single select.
  - Footer actions (Cancel/Apply) aligned with Base.
  - Keyboard-aware dismissal for input-driven flows.
- Acceptance Criteria:
  - Uniform visuals with Base (background, backdrop, handle, header).
  - a11y: date selection readouts, proper roles and focus.
  - Performance: month transitions <16ms average on target devices.

### Epic 5 — Form & Validation Pattern

- Objective: Standardize bottom sheets that contain forms (inputs, toggles, text areas).
- Deliverables:
  - `BottomSheetForm` with labeled fields, validation states, submit/cancel actions.
  - Error presentation aligned to Input/TextArea components.
  - Dismissal guards for unsaved changes.
- Acceptance Criteria:
  - Visual parity with Base; no divergence in spacings/colors.
  - a11y: field labels/hints, error announcements, focus trapping on validation.

### Epic 6 — Migration & Adoption Plan

- Objective: Adopt the standardized system across existing features.
- Deliverables:
  - Refactor `Dropdown`, `AssignedToDropDown`, `TaskActionsBottomSheet` to `BaseBottomSheet` and shared primitives.
  - Add adapter props as needed to avoid breaking external APIs.
  - Audit for other components using bottom sheets (media, calendar) and align.
- Acceptance Criteria:
  - Visual consistency verified across all refactored flows.
  - No regression in navigation, performance, or accessibility.
  - All components use tokens; no hardcoded style values remain.

### Epic 7 — Documentation & Examples

- Objective: Provide developer-facing guidance and examples.
- Deliverables:
  - Component READMEs: BaseBottomSheet, header, lists, actions, media, calendar, forms.
  - Cookbook examples: selection list, actions menu, media picker, calendar, form.
  - Design-to-code guidelines referencing Figma tokens and usage rules.
- Acceptance Criteria:
  - New contributors can implement a bottom sheet variant by composing primitives without new styling.
  - All examples compile and mirror design system visuals.

---

## Technical Requirements

- Single dependency on `@gorhom/bottom-sheet` v5.
- TypeScript-first APIs with explicit prop types; no `any`.
- No inline hardcoded pixel values; use `spacing`, `colors`, and typography from theme.
- Device-safe dynamic sizing; respect `safeAreaInsets`.
- Backdrop opacity and press-to-close are consistent and configurable.

## Accessibility Requirements

- All actionable elements have roles, labels, and state announcements.
- Focus management: initial focus and post-close return to trigger control.
- Readable contrast ratios; touch targets ≥ 44x44.

## Performance Requirements

- Snap calculation and layout work on JS thread only when necessary; prefer memoization.
- Virtualize large lists/grids; throttle expensive operations.
- Avoid unnecessary re-renders via stable callbacks and React.memo where appropriate.

## Risks & Mitigations

- Risk: Refactors introduce regressions.
  - Mitigation: Incremental adoption (Epic 6), visual baselines, snapshot comparisons.
- Risk: Over-generalization increases complexity.
  - Mitigation: Keep primitives small; compose rather than extend monoliths.

## Success Metrics

- 100% bottom sheets share `BaseBottomSheet` foundation and tokens.
- 0 hardcoded style values in refactored sheets.
- a11y audit passes for all bottom sheet flows.
- Visual diff parity across Dropdown, AssignedTo, Actions, Media, Calendar.
