### Icon

**Role**: Unified icon component supporting Feather icons and sizing via theme.

### API

- Props in `types.ts` (name, color, customSize, style).

### Usage

```tsx
import { Icon } from "../../ui";

<Icon name="home" color={colors.text} />;
```

### Design rules

- Use `colors` from `theme` for color.
- Sizes from `theme` via `iconSizes` and `defaultIconSize`.
