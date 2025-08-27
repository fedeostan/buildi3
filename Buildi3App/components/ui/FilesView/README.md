### FilesView

**Role**: Displays a grid/list of uploaded files with previews and basic actions.

### API

- See `types.ts` for file shape and callbacks.

### Usage

```tsx
import { FilesView } from "../../ui";

<FilesView files={files} onPressFile={open} />;
```

### Design rules

- Reuse `ImagePreview` where possible.
- Use tokens for gaps and borders.
