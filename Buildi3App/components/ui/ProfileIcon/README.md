### ProfileIcon

**Role**: User avatar/icon with optional status/badge.

### API

- Props in `types.ts` (uri, initials fallback, onPress).

### Usage

```tsx
import { ProfileIcon } from "../../ui";

<ProfileIcon onPress={openProfile} />;
```

### Design rules

- Spacing from `componentSpacing.profileIcon`.
- Colors from `colors` tokens.
