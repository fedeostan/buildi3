### SegmentedControl

**Role**: Toggle between small set of views/options.

### API

- Props in `types.ts` (segments, value, onChange).

### Usage

```tsx
import { SegmentedControl } from "../../ui";

<SegmentedControl
  segments={["All", "Open"]}
  value={value}
  onChange={setValue}
/>;
```

### Design rules

- Use `colors.segmentedControl*` tokens.
- Ensure accessible contrast for selected state.
