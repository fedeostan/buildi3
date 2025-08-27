### BottomSheetTopBar

**Role**: Header for bottom sheets, providing a drag handle, title, and optional actions.

### API

- See `types.ts` for props.

### Usage

```tsx
import { BottomSheetTopBar } from "../../ui";

<BottomSheetTopBar title="Upload" />;
```

### Design rules

- Use `colors` and `spacing` from `theme`.
- Keep layout simple; actions compose from `Icon`/`Button`.
