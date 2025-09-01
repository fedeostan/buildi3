# Screen Development (Expo Router)

*See `README.md` in this directory for detailed structure information.*

## Claude Workflow for Screen Development

### Before Creating Any Screen

1. **Check Existing Screens**: Look at similar screens in this directory
2. **Review Navigation**: Understand if it belongs in `(tabs)/` or root level
3. **Identify Components**: Search `components/ui/` for needed UI elements
4. **Plan Layout**: Use existing layout patterns from similar screens

### Screen Development Pattern

#### 1. Start with UI Structure (Frontend First)
```tsx
// ✅ Always start with visual structure using mock data
export default function NewScreen() {
  const mockData = { /* ... */ };
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DashboardHeader title="Screen Title" />
      <ScrollView contentContainerStyle={{ padding: spacing.sm }}>
        {/* UI components here */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

#### 2. Apply Safe Area Pattern
```tsx
// ✅ REQUIRED: Use our standard mobile safe area pattern
const insets = useSafeAreaInsets();

<View style={{
  paddingTop: Math.max(insets.top, 20) + spacing.lg, // 32px base + safe area
  paddingHorizontal: spacing.sm, // 16px consistent horizontal
}}>
```

#### 3. Component Composition Rules
- **Always use**: Components from `components/ui/` barrel imports
- **Always use**: Theme tokens from `theme/` for all styling
- **Never create**: Custom styled components without checking existing
- **Keep screens lean**: Composition over styling; styles live in components

### Navigation Integration

#### Tab Screens (`app/(tabs)/`)
- Must add screen to `app/(tabs)/_layout.tsx`
- Use `Icon` component for `tabBarIcon`
- Use theme colors for tab styling
- Follow existing tab patterns

#### Modal Screens (Root Level)
- Place directly in `app/` directory
- Use for profile, settings, notifications
- Stack navigation handles presentation

#### Route Parameters
```tsx
// ✅ Type-safe route parameters
import { useLocalSearchParams } from 'expo-router';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Use the parameter safely
}
```

### Common Screen Patterns

#### Loading and Error States
```tsx
// ✅ REQUIRED: Always handle loading and error states
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;
```

#### Header Patterns
- **Prefer**: `DashboardHeader` component over native headers
- **Set**: `headerShown: false` in screen options
- **Use**: Consistent header styling from design system

### Screen Checklist

Before completing any screen:
- [ ] Uses safe area handling pattern
- [ ] Imports only from `components/ui/` barrel
- [ ] Uses theme tokens exclusively (no hardcoded values)
- [ ] Handles loading/error states
- [ ] Follows existing navigation patterns
- [ ] Composes existing components vs custom styling
- [ ] Added to navigation if needed (`_layout.tsx`)

### Mobile Optimization

- **ScrollView**: Always use when content might overflow
- **KeyboardAvoidingView**: For screens with inputs
- **Safe Area**: Use insets hook, not SafeAreaView component
- **Performance**: Keep renders efficient with proper state management

**Remember**: Screens are composition layers. Keep them simple and delegate complexity to reusable components.