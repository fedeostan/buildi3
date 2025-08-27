### Widget

**Role**: Container organism for card-like UI with header and content area.

### API

- Props in `types.ts`.

### Usage

```tsx
import { Widget } from "../../ui";

<Widget title="Next Task">{content}</Widget>;
```

### Design rules

- Backgrounds from `colors.widget*` tokens.
- Spacing from `componentSpacing.widget`.
