### Theme (Design Tokens)

**Purpose**: Single source of truth for colors and spacing. All UI must consume tokens from here for consistency and easy theming.

### Files

- `colors.ts` — semantic color tokens and helpers (`withOpacity`, `overlayColors`)
- `spacing.ts` — spacing scale, semantic spacing, and helpers (`createPadding`, `createMargin`)
- `index.ts` — public exports; also proxies some icon sizes from the Icon component

### Principles

- **Semantic names** over raw values (e.g., `colors.textSecondary`, not `#707173`).
- **Add tokens on demand**; do not hardcode values in components.
- **One place to change**: update here and the entire UI updates consistently.

### Usage

```ts
import { colors, spacing, createPadding } from "../theme";

const styles = {
  container: {
    backgroundColor: colors.background,
    ...createPadding.all("sm"),
  },
};
```

### Adding tokens

- Add to the raw palette if needed, then expose a semantic token in `colors`.
- For spacing, extend the scale only if a new size is repeatedly required.
