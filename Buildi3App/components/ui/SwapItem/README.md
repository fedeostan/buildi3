### SwapItem

**Role**: Selectable row/item often used inside widgets to show a swappable element.

### API

- Props in `types.ts`.

### Usage

```tsx
import { SwapItem } from "../../ui";

<SwapItem title="Primary Sink" onPress={onSwap} />;
```

### Design rules

- Compose `Typography` and `Icon`.
- Use spacing tokens for paddings and gaps.
