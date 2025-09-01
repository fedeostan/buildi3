# Learning Loop Workflow

**Purpose**: Create a structured learning loop for systematic code development with proper context awareness and documentation.

## Workflow per Task

### 1. **Read & Understand**
- Parse user request and constraints
- Read all relevant documentation (CLAUDE.md, README files)
- Load `context/index.md` and related files for task domain
- Review folder-specific README files before editing

### 2. **Search & Discover**
- Search existing codebase for similar components/patterns
- Verify theme tokens and design system elements
- Check for existing utilities and helper functions
- Review component patterns in `components/ui/`

### 3. **Plan & Execute**
- Plan implementation using existing design tokens
- Follow atomic design principles (atoms → molecules → organisms)
- Implement with proper error handling and TypeScript types
- Use existing component patterns and barrel exports

### 4. **Reflect & Document**
- Create context file: `context/YYYY-MM-DD__task-slug.md`
- Use `context/_template.md` structure
- Update `context/index.md` with new entry
- Document decisions, patterns, and learnings

## Context Documentation Requirements

**File Naming**: `context/YYYY-MM-DD__task-slug.md`

**Required Sections** (from template):
- **Context**: What was implemented and why
- **Implementation**: Key decisions and patterns used
- **Challenges**: Blockers encountered and solutions
- **Learnings**: What to remember for future tasks
- **References**: Files modified and components used

## Best Practices Enforcement

### Code Quality
- **Theme-first**: Always use tokens from `theme/` (colors, spacing)
- **Component reuse**: Search before creating new components
- **TypeScript strict**: Proper types and interfaces
- **Error handling**: Comprehensive error states and user feedback
- **Mobile-first**: Safe area handling, keyboard avoidance

### Development Process
- **Small increments**: Minimal viable changes with verification
- **Build validation**: Run linting after changes
- **Pattern consistency**: Follow existing component structures
- **Documentation**: Update component READMEs when modified

### Security & Performance
- **No secrets**: Never commit sensitive information
- **Simple solutions**: Choose maintainable over clever
- **Performance**: Optimize for runtime speed and maintainability

## Component Development Rules

### New Component Checklist
- [ ] Searched existing components first
- [ ] Follows 4-file structure (Component.tsx, styles.ts, types.ts, index.ts)
- [ ] Uses theme tokens exclusively
- [ ] Includes component README.md
- [ ] Added to barrel exports in `components/ui/index.ts`
- [ ] Proper TypeScript interfaces

### Mobile Optimization
```tsx
// ✅ CORRECT: Safe area handling
const insets = useSafeAreaInsets();
paddingTop: Math.max(insets.top, 20) + spacing.lg;
paddingHorizontal: spacing.sm; // 16px consistent
```

## Definition of Done

- [ ] Task implemented and tested (builds successfully)
- [ ] Expo development server runs without errors
- [ ] Context documentation created with template
- [ ] `context/index.md` updated with new entry
- [ ] Component documentation updated if modified
- [ ] All hardcoded values replaced with theme tokens

## Failure Handling

If blocked:
1. Document partial progress in context file
2. List specific blockers and proposed solutions
3. Request clarification with detailed context
4. Update learning loop for future prevention

**Usage**: Apply this systematic approach to every development task for consistent, well-documented, and maintainable code.