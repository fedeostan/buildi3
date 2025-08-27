### ProjectList

**Role**: Displays a list/grid of projects using `ProjectItem`.

### API

- Props in `types.ts` (projects array, onPressItem, layout options).

### Usage

```tsx
import { ProjectList } from "../../ui";

<ProjectList projects={projects} onPressItem={openProject} />;
```

### Design rules

- Compose `ProjectItem` and share spacing tokens.
