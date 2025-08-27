### TextArea

**Role**: Multi-line text input for longer content.

### API

- Props in `types.ts` (label, value, onChangeText, placeholder, error, rows, etc.).

### Usage

```tsx
import { TextArea } from "../../ui";

<TextArea label="Notes" value={notes} onChangeText={setNotes} />;
```

### Design rules

- Use input tokens and spacing from `theme`.
- Maintain adequate line-height and vertical padding.
