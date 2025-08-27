### ProjectItem

**Role**: Molecule showing a project avatar/icon, name, and optional progress.

### API

- Types in `types.ts` (`ProjectItemProps`) including `projectIconType` and `projectIconColor`.

### Usage

```tsx
import { ProjectItem } from "../../ui";

<ProjectItem
  projectName="Kitchen Remodel"
  projectIconType="House"
  projectIconColor="Blue Light"
/>;
```

### Design rules

- Use SVG project icons from `assets/icons/project_icons` via provided props.
- Tokenized colors and spacing only.
