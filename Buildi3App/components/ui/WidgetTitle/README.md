### WidgetTitle

**Role**: Standardized header row used within `Widget`.

### API

- Props in `types.ts` (title, actions, icon, etc.).

### Usage

```tsx
import { WidgetTitle } from "../../ui";

<WidgetTitle title="Next Task" />;
```

### Design rules

- Compose `Typography` and `Icon`.
- Spacing from tokens; keep alignment consistent across widgets.
