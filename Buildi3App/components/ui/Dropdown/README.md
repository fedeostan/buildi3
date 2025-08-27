### Dropdown

**Role**: Select input for small option sets.

### API

- Props in `types.ts` (items, value, onChange, placeholder, disabled).

### Usage

```tsx
import { Dropdown } from "../../ui";

<Dropdown items={options} value={value} onChange={setValue} />;
```

### Design rules

- Uses `colors.input*` and `spacing` tokens.
- Keep touch target >= 44px height.
