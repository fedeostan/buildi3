### NextTaskContainer

**Role**: Container component for displaying the next actionable task within a widget or screen.

### API

- Types exported via `components/index.ts` (`Task`, `NextTaskContainerProps`).

### Usage

```tsx
import { NextTaskContainer } from "../../ui";

<NextTaskContainer task={task} onPress={goToTask} />;
```

### Design rules

- Uses `Widget`/`WidgetTitle` patterns and spacing from tokens.
- Typography via `Typography` variants.
