### PhotosGrid

**Role**: Grid layout for displaying photo thumbnails with selection.

### API

- Props in `types.ts` (photos, selectedIds, onSelect, onPress, etc.).

### Usage

```tsx
import { PhotosGrid } from "../../ui";

<PhotosGrid photos={items} onPress={open} />;
```

### Design rules

- Use spacing tokens for gaps.
- Use `overlayColors` for selection overlays.
