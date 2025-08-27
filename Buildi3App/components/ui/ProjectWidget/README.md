### ProjectWidget

**Role**: Organism summarizing a project with key stats and actions.

### API

- Props in `types.ts`.

### Usage

```tsx
import { ProjectWidget } from "../../ui";

<ProjectWidget project={project} />;
```

### Design rules

- Composes `Widget`, `WidgetTitle`, `ProjectItem`.
- Tokenized spacing and colors only.
