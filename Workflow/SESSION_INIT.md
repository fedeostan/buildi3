# Buildi3 Project Context Initialization Protocol

**PURPOSE**: This file triggers an intelligent context acquisition workflow that brings any Claude Code session up to full project understanding in seconds.

## 🚀 INITIALIZATION TRIGGER

When starting a new Claude Code session on Buildi3, execute this command:

```bash
# Quick project context acquisition
echo "🎯 Initializing Buildi3 context - reading core files..." && \
cat CLAUDE.md && \
echo "📋 Project status loaded. Ready for agent workflow."
```

## 📖 CRITICAL READING LIST (Execute in Order)

### Phase 1: Foundation Context (MANDATORY - Read First)
```
1. /Users/federicoostan/buildi3/CLAUDE.md - Project rules & MCP servers
2. /Users/federicoostan/buildi3/Planning/Epic3_Handoff_Documentation.md - Current implementation status  
3. /Users/federicoostan/buildi3/context/component-reuse-analysis.md - UI patterns & limitations
4. /Users/federicoostan/buildi3/context/epic1-implementation-complete.md - Backend implementation
```

### Phase 2: Architecture Deep-Dive (Agent-Driven)
```
5. /Users/federicoostan/buildi3/Buildi3App/lib/supabase/types.ts - Database schema (15 tables)
6. /Users/federicoostan/buildi3/Buildi3App/contexts/AuthContext.tsx - Auth implementation
7. /Users/federicoostan/buildi3/Buildi3App/app/(tabs)/tasks/index.tsx - Task management UI
8. /Users/federicoostan/buildi3/Buildi3App/components/TaskSection.tsx - Core task component
```

## 🤖 INTELLIGENT AGENT WORKFLOW

### Step 1: Context Agent Activation
```
Use Task tool with subagent_type: "general-purpose"
Description: "Project context acquisition"
Prompt: "Read the 8 critical files listed in SESSION_INIT.md and provide:
1. Current project status summary
2. Key architectural decisions
3. Available MCP tools and their purposes  
4. Critical issues that need immediate attention
5. Next recommended actions based on project state"
```

### Step 2: Specialized Agent Selection
Based on the task at hand, automatically route to appropriate agents:

**For UI/Component Work:**
- `mobile-app-architect` - React Native architectural guidance
- `construction-domain-expert` - Construction workflow validation

**For Database/Backend Work:**  
- `data-architecture-agent` - Database design and optimization
- `localization-compliance-agent` - Portuguese compliance requirements

**For Features/PRDs:**
- `prd-architect` - Feature specification and requirements
- `ai-orchestration-engineer` - AI workflow implementation

**For Quality/Testing:**
- `qa-testing-specialist` - Feature testing and validation  
- `research-validation-specialist` - Technical research and verification

### Step 3: Context Validation
Execute this validation sequence:
```typescript
// Quick context check - should be answerable immediately after init
1. "What MCP servers are available?" (Answer: Figma, Supabase, Context7, IDE)
2. "What's the current Epic status?" (Answer: Epic 1&2 complete, Epic 3 ready)  
3. "What's the main critical issue?" (Answer: Enum format mismatches)
4. "Which UI components are ready?" (Answer: 80+ including TaskSection, ProjectItem)
```

## 📊 PROJECT STATE SNAPSHOT (As of Sept 2025)

### ✅ COMPLETED IMPLEMENTATIONS
- **Epic 1**: 15-table Supabase schema (exceeds 3-table PRD)
- **Epic 2**: Full authentication system (signup → verify → login)
- **UI Framework**: 80+ React Native components ready
- **Architecture**: Clean, production-ready codebase

### 🚨 CRITICAL ISSUES (Fix Before Any Work)
1. **Enum Mismatches**: Frontend uses `kebab-case`, DB uses `snake_case`
2. **Icon Color Format**: `Blue Light` (frontend) vs `blue_light` (database)
3. **Security Config**: Function security warnings need addressing

### 🎯 NEXT PHASE READY
- **Epic 3**: Profile & Onboarding System Integration
- **Target**: Connect 80+ UI components to 15-table backend
- **Goal**: Launch-ready construction management MVP

## 🛠 MCP TOOLS AVAILABLE

### Core Development Tools
- **Figma Dev Mode**: Design-to-code generation, asset management
- **Supabase**: Database operations, migrations, edge functions
- **Context7**: Up-to-date library documentation and references
- **IDE**: Diagnostics, code execution, debugging

### Specialized Agents (Use Frequently!)
- **mobile-app-architect**: React Native/Expo architectural guidance
- **data-architecture-agent**: Database design and real-time sync
- **construction-domain-expert**: Construction industry workflow validation
- **prd-architect**: Feature specification and requirement analysis
- **qa-testing-specialist**: Comprehensive testing and validation
- **ai-orchestration-engineer**: AI workflow design and optimization

## ⚡ RAPID CONTEXT COMMANDS

### Quick Status Check
```bash
# Get current git status and recent commits
git status --short && git log --oneline -5

# Check Supabase connection
npx supabase status
```

### Instant Architecture Overview
```bash
# Core file structure
find Buildi3App -name "*.tsx" -type f | grep -E "(contexts|lib|components)" | head -10
```

### MCP Server Validation
```bash
# Verify MCP servers are active (Claude will show available tools)
echo "MCP servers should be visible in Claude Code tool list"
```

## 🧠 CONTEXT OPTIMIZATION RULES

### DO - Context Best Practices
- ✅ Use subagents early and often to preserve main context
- ✅ Read this file first in every new session
- ✅ Route specialized tasks to appropriate agents immediately
- ✅ Use `/clear` between major context shifts
- ✅ Leverage MCP tools instead of manual file reading
- ✅ Reference existing patterns in `context/` folder

### DON'T - Context Anti-Patterns  
- ❌ Assume any context from previous sessions
- ❌ Read random files without following the initialization sequence
- ❌ Implement new patterns without checking existing components
- ❌ Skip agent usage - they preserve context and provide expertise
- ❌ Ignore the critical issues list - fix those first
- ❌ Create new files without understanding existing architecture

## 🎭 AGENT UTILIZATION STRATEGY

### When to Use Each Agent Type

**Immediate Usage (Start of Session):**
```
1. general-purpose: Project exploration and context building
2. qa-testing-specialist: Validate current implementation status
3. research-validation-specialist: Verify technical decisions
```

**Feature Development:**
```
1. prd-architect: Define requirements and acceptance criteria
2. mobile-app-architect: Design React Native implementation
3. data-architecture-agent: Plan database integration
4. construction-domain-expert: Validate construction workflows
```

**Quality Assurance:**
```
1. qa-testing-specialist: Test features and validate requirements
2. research-validation-specialist: Research best practices
```

**Specialized Tasks:**
```
1. ai-orchestration-engineer: AI workflow implementation  
2. localization-compliance-agent: Portuguese/EU compliance
```

## 🚀 SUCCESS METRICS

After executing this initialization protocol, you should be able to:

1. ✅ Explain the current project status and architecture
2. ✅ Identify the top 3 critical issues that need fixing
3. ✅ Know which MCP servers are available and their purposes
4. ✅ Route any development task to the appropriate specialist agent
5. ✅ Understand the Epic 3 requirements and next steps
6. ✅ Navigate the codebase structure and key components

## 📞 EMERGENCY CONTEXT RECOVERY

If context is lost or corrupted mid-session:
```bash
# Reset and reinitialize
echo "🔄 Context recovery initiated" && cat /Users/federicoostan/buildi3/Workflow/SESSION_INIT.md
```

Then execute the Phase 1 reading list and context validation sequence.

---

**REMEMBER**: This protocol is designed for maximum efficiency. Follow the sequence, use the agents, and you'll have full project context in under 2 minutes of session time.