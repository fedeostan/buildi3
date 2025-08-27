### Button

**Role**: Primary action component with semantic variants aligned to Figma.

### API

- Props in `types.ts` (variant, disabled, loading, onPress, etc.).

### Usage

```tsx
import { Button } from "../../ui";

<Button label="Continue" onPress={handleContinue} />;
```

### Design rules

- Colors from `colors.button*` tokens; spacing from `spacing`.
- Labels use `Typography` variants.
