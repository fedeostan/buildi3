# Agentic Workflow Rules (Cursor)

## Purpose

Establish a deterministic, iterative workflow the agent follows to: read the prompt, think, plan tool usage, write code per our rules, visually validate the result, and iterate until it matches the provided design/acceptance criteria.

## Core Principles

1. Frontend-first, visual feedback quickly (Expo always running on your side).
2. Always reuse existing design system tokens and components; never hardcode values.
3. Keep it simple but performant; prefer the minimal change that satisfies the goal.
4. Iterative Plan → Act → Observe → Critique loop until acceptance is met.
5. Parallelize read-only searches and checks when possible to save time.
6. Produce clear micro status updates and a concise summary at the end.

## Required Context Ingestion (Before Any Coding)

Read these on every new goal to align with system rules and constraints:

- `.cursor/rules/figma-to-code.md`
- `.cursor/rules/react-native-rules.md`
- `README.md` (root) and `Buildi3App/README.md`

If Figma link or node references are provided, incorporate them in the plan.

## Tooling Catalog (Available Now)

- Figma (Framelink)
  - Fetch Figma file/node data for structure, typography, spacing, and assets
  - Download icons/images as needed
- Supabase
  - Branching, migrations, SQL, advisor checks, logs (only when back-end or DB tasks are explicitly required)
- Desktop Automation
  - Inspect current UI on screen, capture screenshots, and navigate for visual validation
  - Interact with the app using mouse and keyboard to test functionality
  - Navigate through multiple screens to validate end-to-end workflows

## High-Level Workflow

1. Understand & Extract Acceptance Criteria

- Parse the prompt to list explicit acceptance criteria (visual cues, component usage, interactions, performance, constraints).
- If design cues are provided (Figma frames, spacing, colors, typography), convert to concrete checks using tokens.

2. Think & Plan (Deliberate, no coding yet)

- Summarize current state and intended end state.
- Decide whether the task is frontend-only or requires data/setup.
- Create a short, ordered plan with the smallest viable set of edits to satisfy criteria.
- Form a Tool Plan (see below) with justification for each tool.

3. Tool Plan (Decide what to use and why)

- Figma (Framelink): Use when visual specs/assets are referenced or needed.
- Supabase: Use only for data schema or auth/storage tasks; otherwise skip.
- Desktop Automation: Always use after UI edits to visually confirm.
- Prefer read-only lookups/searches in parallel; sequence only when outputs are interdependent.

4. Implementation Rules (Coding)

- Frontend First: Implement UI with mock data if needed; wire to data later.
- Reuse Components: Search `components/ui/` first; extend if necessary; create new only as a last resort.
- Tokens Only: Use `theme/colors.ts` and `theme/spacing.ts`. No hex values or numeric spacing literals.
- Atomic Design: Atoms → Molecules → Organisms. Prefer `Typography`, `Button`, `Widget`, `SwapItem`, etc.
- Safe Area: Follow the safe area pattern (see `react-native-rules.md`).
- Error & Loading States: If data fetching is added, include loading/error UI.
- Naming & Types: Follow naming conventions and TypeScript best practices.
- Keep diffs minimal and scoped. Avoid unrelated refactors.

5. Visual Validation Loop (Observe → Critique → Iterate)

- After edits, use Desktop Automation to:
  - Navigate to the relevant screen/state using mouse clicks and keyboard inputs
  - Perform end-to-end testing by interacting with UI elements
  - Capture screenshots at key points in the workflow
  - Compare against stated visual/design cues (spacing, colors via tokens, hierarchy, typography, iconography)
- If mismatch is detected, write a brief critique and adjust with the minimal next edit.
- Repeat until acceptance criteria are met or a clear blocker is identified.

6. Performance & Simplicity

- Prefer simple, readable code that avoids unnecessary re-renders.
- Early returns, shallow component trees, and minimal state.
- Avoid blocking operations on UI threads. Use async patterns cleanly.

7. Reporting & Cadence

- Emit short status updates at key steps (plan, before/after tool usage, after edits, after validation).
- End with a terse, high-signal summary of what changed and why.

## Concrete Step-by-Step Checklist

1. Intake

- Read the 4 context files listed above.
- Extract acceptance criteria and constraints from the prompt.

2. Plan

- Draft a minimal plan and a Tool Plan. Identify which parts are visual vs. data.

3. Discover & Validate (Parallelize)

- Search for existing components that fit the pattern.
- Confirm required tokens exist; map Figma spacing/colors to `spacing`/`colors`.
- If assets from Figma are needed, fetch with Framelink.

4. Implement (Small Edits)

- Make the smallest UI edit set that satisfies one or more criteria.
- Ensure tokenized styles and reuse of existing components.

5. Visual Validate (Desktop Automation)

- Navigate to the updated screen:
  - Get screen dimensions to understand the layout
  - Use mouse clicks to navigate through the app
  - Use keyboard inputs when needed for forms or search
- Perform end-to-end testing:
  - Test the complete user flow from start to finish
  - Interact with all relevant UI elements
  - Verify that all components render correctly
  - Test edge cases and error states if applicable
- Capture screenshots at key points in the workflow
- Compare with cues (layout gaps, paddings, colors, typography, icons)
- If off, iterate with focused edits and create a new todo list for issues found

6. Extend (Data Only If Needed)

- If data or auth is required, integrate Supabase with proper error/loading states.
- Avoid DB changes unless the prompt requires them.

7. Finalize

- Confirm criteria met; ensure no lint/type issues in edited files.
- Provide concise summary of changes and remaining risks.

## Figma Integration Guidance

- Use Framelink to pull node information for spacing, hierarchy, and assets.
- Map Figma spacing to tokens per `figma-to-code.md` (e.g., 16px → `spacing.sm`).
- Use existing `Typography` variants; do not custom style text.
- Use `Icon` component with Feather names specified by the design.

## Supabase Integration Guidance

- Only when explicitly requested by the task.
- Prefer client-side helpers and robust error handling with user-friendly messages.
- For schema changes, create migrations; do not hardcode IDs in data migrations.
- Use advisor checks to catch security/performance issues after changes.

## Desktop Automation Guidance

- Use to open/navigate app views and capture screenshots after each meaningful UI change.
- Compare the captured UI to acceptance criteria derived from the prompt/Figma specs.
- If differences are found, document the discrepancy (spacing, color, alignment, missing component) and iterate.
- Perform comprehensive end-to-end testing using all available tools:
  - `mcp_desktop-automation_get_screen_size`: Get screen dimensions to understand layout
  - `mcp_desktop-automation_screen_capture`: Capture screenshots at key points in the workflow
  - `mcp_desktop-automation_keyboard_press`: Press keyboard keys or key combinations
  - `mcp_desktop-automation_keyboard_type`: Type text at the current cursor position
  - `mcp_desktop-automation_mouse_click`: Perform mouse clicks (left, right, double)
  - `mcp_desktop-automation_mouse_move`: Move the mouse to specific coordinates
- Create a testing workflow that simulates real user interaction:
  1. Start by navigating to the app's entry point
  2. Click through navigation elements to reach the target screen
  3. Interact with UI elements to test functionality
  4. Verify that all components render correctly
  5. Test edge cases and error states if applicable
  6. Document any issues found and create a todo list to address them
  7. Repeat the testing process after making changes until all issues are resolved

## Acceptance Rubric (Pass/Fail)

The change is acceptable when all are true:

1. Visual parity with provided cues (layout, spacing, colors via tokens, typography, and icons).
2. Design system compliance (no hardcoded values, components reused).
3. Simplicity and performance (no unnecessary complexity or rendering work).
4. No lint/type errors in touched files.
5. Clear micro updates and a concise final summary.
6. End-to-end testing confirms functionality works as expected across the entire user flow.

## Common Failure Modes & Safeguards

- Creating new components instead of reusing: Always search first; extend second; create last.
- Hardcoded styling: Replace with tokens from `theme`.
- Skipping safe area: Apply the safe area pattern.
- Oversized edits: Keep changes minimal and focused per iteration.
- Skipping validation: Always run Desktop Automation checks post-change.
- Incomplete testing: Test the entire user flow, not just individual screens.
- Not addressing found issues: Create a todo list for any issues found during testing and resolve them.

## References

- See `.cursor/rules/figma-to-code.md` for strict token/component usage and spacing mapping.
- See `.cursor/rules/react-native-rules.md` for mobile patterns, safe area, and error/loading states.
- Anthropic-style agent loops: Plan → Act → Observe → Critique; parallelize read-only steps; iterate with small deltas.
