### Components

**Purpose**: Central place for all reusable UI building blocks following Atomic Design (atoms → molecules → organisms). This folder exposes a single entrypoint via `components/index.ts` and a design‑system subfolder `components/ui/`.

### Structure

- **`index.ts`**: Barrel file exporting selected UI components and common types from `components/ui/`.
- **`ui/`**: Source of truth for the design system. Each component lives in its own folder.

### Conventions

- **Naming**: Folders and components use PascalCase (e.g., `ProjectItem`, `TopNavigationBar`).
- **Files per component** inside `components/ui/<ComponentName>/`:
  - `ComponentName.tsx`: Implementation
  - `styles.ts`: Styles only (no logic)
  - `types.ts`: Public props and types
  - `index.ts`: Re‑exports default and types
- **Tokens first**: Use `theme/colors.ts` and `theme/spacing.ts`. No hardcoded colors or spacing.
- **Imports**: Import via the barrel `components/ui` when consuming components from screens.

### Adding a new UI component

1. Create a folder under `components/ui/<ComponentName>/` with the four files listed above.
2. Reuse existing components where possible (Typography, Button, Icon, Widget, etc.).
3. Wire tokens: import from `theme` (`colors`, `spacing`, helpers like `createPadding`).
4. Add an export in `components/ui/index.ts` if you want it available from the barrel.
5. Add a short `README.md` inside your component folder (template in `components/ui/README.md`).

### LLM/Contributor checklist

- **Reuse** existing components before creating new ones.
- **Reference tokens** from `theme/` instead of hardcoding values.
- **Keep logic out of styles**; styles belong in `styles.ts`.
- **Export types** from `types.ts` and re‑export via `index.ts`.
