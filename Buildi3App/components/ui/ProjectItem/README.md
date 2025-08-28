### ProjectItem

**Role**: Molecule showing a project avatar/icon, name, and optional progress.

### API

- Types in `types.ts` (`ProjectItemProps`) including `projectIconType` and `projectIconColor`.
- SVG icons are rendered at 44x44px size to match Figma design specifications.

### Usage

```tsx
import { ProjectItem } from "../../ui";

// With SVG Project Icon
<ProjectItem
  projectName="Kitchen Remodel"
  projectIconType="House"
  projectIconColor="Blue Light"
/>;

// With progress indicator
<ProjectItem
  projectName="Kitchen Remodel"
  projectIconType="House"
  projectIconColor="Blue Light"
  hasPercentage={true}
  percentage={65}
/>;

// With Feather icon fallback
<ProjectItem
  projectName="New Project"
  iconName="home"
  iconColor="primaryLight"
/>;
```

### Design rules

- Use SVG project icons from `assets/icons/project_icons` via provided props.
- SVG icons follow a naming convention: `Project={Type}, Color={Color}.svg`
- Available project icon types: "Building", "General", "House", "Outdoors", "Project5", "Project6", "Project8"
- Available color variants: "Blue Darker", "Blue Light", "Green Light", "Green Pastel", "Green Pond", "Lime", "Pink Light", "Pink", "Purple"
- Icons are rendered at 44x44px for visual consistency
- Tokenized colors and spacing only.
