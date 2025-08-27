### TopNavigationBar

**Role**: In-screen navigation bar replacing native headers; shows title and actions.

### API

- Props in `types.ts` (title, actions, onBack, etc.).

### Usage

```tsx
import { TopNavigationBar } from "../../ui";

<TopNavigationBar title="Projects" />;
```

### Design rules

- Compose `Icon` and `Typography`.
- Spacing and colors from tokens; avoid inline literals.
