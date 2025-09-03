# Bug Resolution Workflow Command

> **Systematic bug resolution using proven Buildi3 patterns and specialized agents**  
> **Usage**: `/bug-resolution-workflow $ARGUMENTS`  
> **Purpose**: Structured approach to identifying, fixing, and preventing bugs

---

## Command Implementation

**I need to systematically resolve this bug using proven patterns and specialized agents.**

### Phase 1: Initial Analysis 🔍

**Bug Assessment:**
- **Error Details**: What is the exact error message and stack trace?
- **Reproduction**: Can the issue be consistently reproduced?
- **Impact**: What functionality is affected?
- **Context**: When did this issue first appear?

**Anti-Pattern Check:**
Review MASTER_LESSONS.md for known anti-patterns:
- [ ] **Enum format mismatches** (kebab-case vs snake_case)
- [ ] **Props interface mismatches** (spreading vs object props)
- [ ] **RLS policy recursion** in database queries
- [ ] **Race conditions** in authentication flow
- [ ] **Component props validation** missing

**Pattern Recognition:**
- Does this match a previously solved issue?
- What category does this bug fall into? (UI, Data, Auth, Navigation, etc.)
- What defensive programming patterns could prevent this?

### Phase 2: Specialized Agent Assignment 🤖

**Route to QA Testing Specialist:**
```
Task tool with:
- subagent_type: "qa-testing-specialist"  
- description: "Debug and resolve [bug type]"
- prompt: "Analyze and fix this bug systematically:
  
  Error: [Provide complete error details]
  Context: [Provide relevant context]
  Reproduction: [Steps to reproduce]
  
  Please:
  1. Identify root cause using defensive programming analysis
  2. Implement fixes that prevent similar issues  
  3. Create test cases to catch this type of error
  4. Apply anti-pattern prevention measures
  5. Update error handling with proper logging"
```

**Alternative Routing:**
- **Data Architecture Agent**: For database/RLS related issues
- **Mobile App Architect**: For React Native platform-specific bugs
- **General Purpose Agent**: For multi-component integration issues

### Phase 3: Solution Implementation 🔧

**Defensive Programming Approach:**
```typescript
// Always implement validation and error handling
if (!data || !data.requiredField) {
  console.warn('Invalid data received:', { data, component: 'ComponentName' })
  return null // or appropriate fallback
}

// Add comprehensive logging for debugging
try {
  // Implementation logic
} catch (error) {
  console.error('❌ Component error:', {
    component: 'ComponentName',
    error: error.message,
    context: relevantContext,
    timestamp: new Date().toISOString()
  })
  // Graceful degradation
}
```

**Testing Strategy:**
```typescript
// Create test cases that prevent regression
describe('Bug Fix Validation', () => {
  test('should handle undefined props gracefully')
  test('should validate required data fields')
  test('should provide meaningful error messages')
  test('should maintain app stability on invalid input')
})
```

### Phase 4: Prevention & Documentation 📚

**Update Context Documentation:**
1. **Add to MASTER_LESSONS.md anti-patterns** if new pattern discovered
2. **Update component README** with new validation requirements
3. **Document in context folder** if significant debugging insights
4. **Update relevant command patterns** if workflow improvements found

**Prevention Measures:**
- [ ] **Add runtime validation** where missing
- [ ] **Implement error boundaries** for component isolation  
- [ ] **Add comprehensive logging** for future debugging
- [ ] **Create test cases** to prevent regression
- [ ] **Review similar components** for same vulnerability

**Knowledge Transfer:**
```markdown
# Add to relevant context file:
## Bug Resolution: [Issue Description]
**Date**: YYYY-MM-DD
**Category**: #bug-fix #[relevant-tag]

### Root Cause
[Detailed analysis of why the bug occurred]

### Solution
[Specific fix implemented with code examples]

### Prevention
[Measures added to prevent similar issues]
```

---

## Usage Examples

### Component Crash Bug
```
/bug-resolution-workflow TaskItem component crashes with "Cannot read property 'title' of undefined"
```

### Database Query Error  
```
/bug-resolution-workflow Supabase RLS policy causing "infinite recursion detected" error
```

### Authentication Flow Issue
```
/bug-resolution-workflow User gets redirected to profile completion despite complete profile
```

### Performance Issue
```
/bug-resolution-workflow App becomes unresponsive when loading large task lists
```

---

## Success Criteria

After completing this workflow:
- [ ] **Bug is completely resolved** with no side effects
- [ ] **Root cause is identified** and documented
- [ ] **Prevention measures are implemented** to avoid recurrence  
- [ ] **Test cases are created** to catch similar issues
- [ ] **Documentation is updated** with lessons learned
- [ ] **Similar components are reviewed** for same vulnerability

---

**Output**: This command provides systematic bug resolution using QA Testing Specialist and proven defensive programming patterns, ensuring both immediate fixes and long-term prevention.