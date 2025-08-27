### NotificationIcon

**Role**: Bell icon with unread badge, used in headers.

### API

- Props in `types.ts` (count, onPress, etc.).

### Usage

```tsx
import { NotificationIcon } from "../../ui";

<NotificationIcon count={3} onPress={openNotifications} />;
```

### Design rules

- Spacing from `componentSpacing.notificationIcon`.
- Colors from `colors` tokens.
