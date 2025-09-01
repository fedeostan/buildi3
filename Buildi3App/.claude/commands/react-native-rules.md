# React Native Mobile Development Rules

**Purpose**: Frontend-first React Native development with comprehensive error handling and mobile best practices.

## Core Philosophy

**Frontend First Approach**: Always start with visible UI components for immediate visual feedback. Build the interface first, then add functionality. This ensures rapid learning and better user experience.

## Project Architecture

### Tech Stack
- **React Native 0.79.5** with **React 19.0.0**
- **Expo SDK 53** with **Expo Router 5.1.5** (file-based routing)
- **TypeScript** with strict configuration
- **Theme System**: Comprehensive design tokens in `theme/`
- **Component Library**: Atomic design in `components/ui/`

### Mobile-Specific Patterns

#### Safe Area Implementation (CRITICAL)
```tsx
// ✅ CORRECT: Our standard mobile safe area pattern
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={{
  paddingTop: Math.max(insets.top, 20) + spacing.lg, // 32px base + safe area
  paddingHorizontal: spacing.sm, // 16px consistent horizontal padding
}}>
```

**Why**: Handles notches, status bars, home indicators across iOS/Android automatically

#### Keyboard Handling
```tsx
// ✅ CORRECT: Prevent keyboard from covering input
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
```

## Error Handling Patterns (MANDATORY)

### Complete Error Response Pattern
```tsx
// ✅ EXCELLENT: Structured error handling
const fetchUserData = async (userId: string) => {
  try {
    console.log("Fetching user data for:", userId);
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Database error:", error.message);
      return {
        success: false,
        error: error.message,
        userMessage: "Unable to load user profile. Please try again."
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
      userMessage: "Something went wrong. Please try again later."
    };
  }
};
```

### Loading States (REQUIRED)
```tsx
// ✅ EXCELLENT: Always show loading and error states
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [data, setData] = useState(null);

// Show loading spinner
if (loading) return <LoadingSpinner />;

// Show error with retry option
if (error) return <ErrorMessage message={error} onRetry={loadData} />;

// Show success state
return <DataView data={data} />;
```

## Component Development Rules

### Design System First (CRITICAL)
```tsx
// ✅ CORRECT: Always use our design system
import { Button, Typography, Icon } from '@/components/ui';
import { colors, spacing } from '@/theme';

// ✅ CORRECT: Theme tokens only
backgroundColor: colors.backgroundPrimary,
padding: spacing.md, // 16px
color: colors.text,

// ❌ WRONG: Hardcoded values
backgroundColor: '#FFFFFF',
padding: 16,
color: '#000000',
```

### Component Structure Pattern
```
ComponentName/
├── ComponentName.tsx    # Implementation (logic + JSX only)
├── styles.ts           # StyleSheet using theme tokens
├── types.ts           # Props interfaces and TypeScript types
├── index.ts           # Barrel exports
└── README.md          # Component documentation
```

### Feather Icons Integration
```tsx
// ✅ CORRECT: Use our Icon component with Feather icons
<Icon name="user" size={24} color={colors.primary} />

// Available icons: Check Feather icon set for names
// Common: user, settings, home, search, plus, x, check
```

## Development Workflow

### 1. UI First Development
```tsx
// ✅ STEP 1: Build with mock data for immediate visual feedback
const mockUser = {
  name: "John Doe",
  email: "john@example.com"
};

return (
  <SafeAreaView style={{ flex: 1 }}>
    <Typography variant="headline">{mockUser.name}</Typography>
    <Typography variant="body">{mockUser.email}</Typography>
  </SafeAreaView>
);
```

### 2. Add Navigation (Expo Router)
```tsx
// ✅ STEP 2: File-based routing structure
// Place files in app/ directory for automatic routing
// Use (tabs)/ for bottom tab navigation
// Modal screens go in root app/ directory
```

### 3. Replace with Real Data
```tsx
// ✅ STEP 3: Replace mock data with real API calls
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadUserData();
}, []);

// Maintain same UI, just swap data source
```

## Naming Conventions

### Files and Components
```typescript
// ✅ CORRECT: PascalCase for components
UserProfile.tsx
ChatMessage.tsx
LoginButton.tsx

// ✅ CORRECT: camelCase for utilities
apiHelpers.ts
dateFormatters.ts
validationRules.ts

// ✅ CORRECT: UPPER_SNAKE_CASE for constants
const API_BASE_URL = "https://api.example.com";
const MAX_MESSAGE_LENGTH = 500;
```

### Props Interfaces
```typescript
// ✅ CORRECT: Props interface naming
interface ChatMessageProps {
  message: string;
  userId: string;
  timestamp: Date;
}
```

## Key Principles (MEMORIZE)

1. **Visual First**: Build UI with mock data for immediate feedback
2. **Theme System**: Always use tokens from `theme/` (never hardcode)
3. **Error Handling**: Every API call must handle errors gracefully
4. **Loading States**: Always show loading spinners and error messages
5. **Component Reuse**: Search existing `components/ui/` before creating
6. **Mobile Optimized**: SafeAreaView patterns and keyboard avoidance
7. **Comprehensive Comments**: Explain WHY, not just WHAT
8. **Figma Alignment**: Use existing design system variables and components
9. **No Duplicates**: Search entire codebase before creating new files
10. **Proper Structure**: Follow 4-file component pattern with documentation

## Mobile Safe Area Best Practice

```tsx
// ✅ STANDARD PATTERN: Dynamic safe area handling
const insets = useSafeAreaInsets();

<View style={{
  paddingTop: Math.max(insets.top, 20) + spacing.lg, // 32px base + safe area
  paddingHorizontal: spacing.sm, // 16px consistent horizontal
  paddingBottom: Math.max(insets.bottom, 20), // Handle home indicator
}}>
```

**Benefits**: 
- Handles notches, status bars, home indicators automatically
- Better performance than SafeAreaView component
- Consistent across iOS/Android
- Adaptive to device variations

## Final Reminders

- **No Expo Commands**: Don't run expo commands; development server runs separately
- **Complete Todo Lists**: Finish all todos before stopping
- **Search First**: Always search existing code before creating
- **Frontend Learning**: See results immediately for better understanding
- **Documentation**: Update component READMEs when modifying

**Goal**: Learn by seeing. Build interface first, then add functionality for continuous visual feedback and better learning experience.