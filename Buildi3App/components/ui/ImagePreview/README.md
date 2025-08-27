### ImagePreview

**Role**: Displays a single image preview with optional overlay/actions.

### API

- See `types.ts` for props and callbacks.

### Usage

```tsx
import { ImagePreview } from "../../ui";

<ImagePreview uri={uri} onPress={open} />;
```

### Design rules

- Use `overlayColors` from `theme` for overlays.
- Spacing from `spacing` tokens.
