### UI (Design System)

**Purpose**: Source of truth for reusable UI built with React Native + Expo. Implements Atomic Design using shared tokens from `theme/`.

### Folder pattern

For each component `Foo`:

- `Foo.tsx` — component implementation (logic + JSX only)
- `styles.ts` — style objects only; import tokens from `theme`
- `types.ts` — public props and types (no implementation details)
- `index.ts` — re‑exports default and types

Examples in this folder: `Typography`, `Button`, `Icon`, `Widget`, `ProjectItem`, `TopNavigationBar`, etc.

### Usage rules

- **Tokens first**: use `colors` and `spacing` from `theme/`. Avoid raw hex/number values.
- **Composable**: prefer composing from existing primitives (Typography, Button, Icon) over duplicating styles.
- **Props**: strictly type public props in `types.ts`. Keep sensible defaults.
- **Barrel exports**: add `export { default as Foo } from "./Foo";` in `components/ui/index.ts` to expose new components.

### Add a new component

1. Create a folder `components/ui/Foo/` and add the 4 files.
2. Implement with design tokens and existing primitives.
3. Add an export to `components/ui/index.ts`.
4. Create `README.md` inside `Foo/` using the template below.

### Per‑component README template

Copy into `components/ui/Foo/README.md`:

````md
### Foo

**Role**: What UI problem this component solves and typical placement.

### API

- **Props**: summarize key props from `types.ts`.
- **States**: loading/disabled/selected variants, if any.

### Usage

```tsx
import { Foo } from "../../ui";

<Foo /* props */ />;
```
````

### Design rules

- Uses `colors.*` and `spacing.*` tokens only.
- Composes `Typography`/`Icon`/`Button` as needed.

### Do/Don’t

- Do: reuse tokens and primitives.
- Don’t: hardcode hex values or pixel numbers.

```


```
