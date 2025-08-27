### MediaUploadBottomSheet

**Role**: Bottom sheet UI for selecting and uploading media.

### API

- Props in `types.ts` (visible, onDismiss, onPick, onUpload, etc.).

### Usage

```tsx
import { MediaUploadBottomSheet } from "../../ui";

<MediaUploadBottomSheet visible onDismiss={close} />;
```

### Design rules

- Compose with `BottomSheetTopBar` and `PhotosGrid`.
- Use `colors.bottomSheetBackground` and spacing tokens.
