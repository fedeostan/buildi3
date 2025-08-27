### NextTaskWidget

**Role**: Compact widget surface that summarizes the next task and key actions.

### API

- Props in `types.ts`.

### Usage

```tsx
import { NextTaskWidget } from "../../ui";

<NextTaskWidget task={task} />;
```

### Design rules

- Composes `Widget` and `WidgetTitle`.
- Tokenized spacing and colors only.
