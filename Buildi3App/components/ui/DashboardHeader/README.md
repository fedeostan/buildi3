### DashboardHeader

**Role**: Top header for main app screens with title and quick actions (profile, notifications).

### API

- See `types.ts` for title, actions.

### Usage

```tsx
import { DashboardHeader } from "../../ui";

<DashboardHeader title="Home" />;
```

### Design rules

- Spacing from `componentSpacing.dashboardHeader`.
- Composes `ProfileIcon` and `NotificationIcon`.
