### Tag

**Role**: Visual indicator tag with 3 color variants for task due date status.

### API

**Tag Component:**
- `variant: 'red' | 'yellow' | 'green'` - Tag color variant
- `text: string` - Tag text content
- `style?: ViewStyle` - Custom container style override
- `textStyle?: TextStyle` - Custom text style override
- `accessibilityLabel?: string` - Label for screen readers

**DateTag Component (Smart):**
- `dueDate: Date` - Due date for automatic variant/text calculation
- `currentDate?: Date` - Current date (defaults to now)
- `style?: ViewStyle` - Custom container style override
- `textStyle?: TextStyle` - Custom text style override
- `accessibilityLabel?: string` - Label for screen readers

### Usage

```tsx
import { Tag, DateTag } from "../../components/ui";

// Basic tag usage
<Tag variant="red" text="Overdue" />
<Tag variant="yellow" text="Today" />
<Tag variant="green" text="15 Sep" />

// Smart date tag (recommended)
<DateTag dueDate={new Date('2024-09-15')} />
<DateTag dueDate={taskDueDate} currentDate={new Date()} />
```

### Date Logic

**Red Tag (Overdue):**
- Due date is in the past
- Text: "Yesterday" (if 1 day past) or formatted date "11 Sep"

**Yellow Tag (Urgent):**
- Due date is today or tomorrow
- Text: "Today" or "Tomorrow"

**Green Tag (Future):**
- Due date is 2+ days in the future
- Text: Formatted date "15 Sep"

### Design rules

- Uses `colors.tagRed*`, `colors.tagYellow*`, `colors.tagGreen*` tokens exclusively
- 12px border radius for rounded appearance
- 8px horizontal padding, 4px vertical padding for compact size
- 12px font size with 500 weight for readability
- Border styling for better visual separation

### Atomic Design Classification

- **Atom**: Basic visual indicator
- **Self-contained**: No dependencies on other components
- **Reusable**: Can be used in Task Items, notifications, status indicators
- **Smart variant**: DateTag automatically handles business logic

### Date Formatting

- Format: `<number> <3-letter month>` (e.g., "11 Sep", "3 Oct")
- No year display (assumes current year)
- Special cases: "Today", "Tomorrow", "Yesterday"
- Handles date calculations accurately across month/year boundaries