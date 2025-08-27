### Typography

**Role**: Text primitives with consistent variants aligned to the design system.

### API

- Props in `types.ts` (variant, style, numberOfLines, children, etc.).

### Usage

```tsx
import { Typography } from "../../ui";

<Typography variant="labelSmall">Home</Typography>;
```

### Design rules

- Colors and spacing from tokens.
- Centralize font sizes/weights within the component to keep screens clean.
