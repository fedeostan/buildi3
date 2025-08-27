### Input

**Role**: Text input with label, helper, and error states.

### API

- Props in `types.ts` (label, value, onChangeText, placeholder, error, secureTextEntry, etc.).

### Usage

```tsx
import { Input } from "../../ui";

<Input label="Email" value={email} onChangeText={setEmail} />;
```

### Design rules

- Use `colors.input*`, `colors.text*`, and `spacing` tokens.
- Focus state uses `colors.inputFocusBackground`.
