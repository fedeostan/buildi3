# Buildi3 Intelligent Context Acquisition Workflow

**DESIGNED FOR**: Immediate project context acquisition using specialized AI agents

## 🎯 WORKFLOW EXECUTION PATTERN

### Stage 1: Foundation Context Agent
```
Agent: general-purpose
Task: "Buildi3 project context bootstrap"
Files to Read:
- /Users/federicoostan/buildi3/CLAUDE.md
- /Users/federicoostan/buildi3/Planning/Epic3_Handoff_Documentation.md  
- /Users/federicoostan/buildi3/context/component-reuse-analysis.md
- /Users/federicoostan/buildi3/context/epic1-implementation-complete.md

Expected Output:
- Project status summary
- Architecture overview  
- Critical issues identification
- MCP tool inventory
- Next action recommendations
```

### Stage 2: QA Validation Agent  
```
Agent: qa-testing-specialist
Task: "Validate Epic 1 & 2 implementation status"
Focus: Current state assessment and readiness for Epic 3
Dependencies: Stage 1 completion

Expected Output:
- Implementation completeness report
- Critical bug identification
- Epic 3 readiness assessment
- Test coverage analysis
```

### Stage 3: Architecture Deep-Dive Agent
```
Agent: mobile-app-architect  
Task: "React Native architecture analysis"
Focus: Component integration patterns and Epic 3 preparation
Dependencies: Stages 1 & 2

Expected Output:
- Component integration strategy
- Performance optimization recommendations
- Epic 3 implementation roadmap
- Mobile-first architecture guidance
```

### Stage 4: Specialized Domain Agent (Conditional)
```
Agent: construction-domain-expert
Task: "Construction workflow validation"
Trigger: If Epic 3 involves construction-specific features
Dependencies: Stages 1-3

Expected Output:
- Construction workflow validation
- Industry compliance requirements
- Task dependency recommendations
```

## 🤖 AUTOMATED AGENT SEQUENCE

### Sequence A: Project Exploration (New Contributors)
```
1. general-purpose → Project overview and context
2. qa-testing-specialist → Current state validation  
3. research-validation-specialist → Technical verification
4. prd-architect → Epic 3 requirements analysis
```

### Sequence B: Feature Development (Epic 3 Implementation)
```  
1. general-purpose → Context refresh
2. mobile-app-architect → React Native implementation strategy
3. data-architecture-agent → Database integration planning
4. construction-domain-expert → Workflow validation
5. qa-testing-specialist → Testing strategy
```

### Sequence C: Bug Fixing (Critical Issues)
```
1. general-purpose → Issue identification
2. qa-testing-specialist → Bug analysis and reproduction
3. mobile-app-architect → Solution architecture
4. research-validation-specialist → Best practice validation
```

## 📋 CONTEXT COMPLETENESS CHECKLIST

After running the agent workflow, validate these capabilities:

### ✅ Project Knowledge  
- [ ] Can explain Epic 1, 2, 3 status and deliverables
- [ ] Knows the 15-table database schema structure  
- [ ] Understands the 80+ React Native components available
- [ ] Identifies critical enum format mismatch issues

### ✅ Technical Architecture
- [ ] Understands Supabase + React Native integration
- [ ] Knows authentication flow and session management
- [ ] Can navigate component reuse patterns
- [ ] Understands construction domain requirements

### ✅ Development Readiness
- [ ] Knows which MCP servers are available
- [ ] Can select appropriate agents for any task
- [ ] Understands Epic 3 implementation requirements
- [ ] Has clear next steps and priorities

### ✅ Quality Standards
- [ ] Knows testing requirements and patterns
- [ ] Understands code style and conventions
- [ ] Can identify architectural anti-patterns
- [ ] Has performance and security awareness

## 🔄 CONTEXT REFRESH PATTERNS

### Mid-Session Refresh (Context Degradation)
```
1. Use /compact to summarize current session
2. Execute Stage 1 agent (general-purpose) for context refresh
3. Continue with specialized agents as needed
```

### Task Switch Refresh  
```
1. Use /clear to reset context
2. Execute SESSION_INIT.md reading sequence
3. Route to appropriate specialist agent
```

### Daily Session Start
```
1. Read SESSION_INIT.md
2. Execute git status and recent commits check
3. Run Stage 1-2 agents for current state validation
4. Proceed with task-specific agent selection
```

## 🎭 AGENT SELECTION MATRIX

| Task Type | Primary Agent | Supporting Agents | Context Files |
|-----------|---------------|-------------------|---------------|
| **New Feature** | mobile-app-architect | prd-architect, construction-domain-expert | Epic3_Handoff, component-reuse-analysis |
| **Bug Fix** | qa-testing-specialist | general-purpose, research-validation | CLAUDE.md, relevant implementation files |
| **Database** | data-architecture-agent | mobile-app-architect, qa-testing | Database types, migration files |
| **UI/UX** | mobile-app-architect | construction-domain-expert, research-validation | Figma assets, component analysis |
| **Compliance** | localization-compliance-agent | construction-domain-expert | Portuguese requirements |
| **AI Features** | ai-orchestration-engineer | mobile-app-architect, prd-architect | AI workflow specs |

## 🚀 PERFORMANCE OPTIMIZATION

### Context Token Management
- Use agents early to preserve main context window
- Route specialized tasks immediately to appropriate agents  
- Leverage MCP tools instead of manual file reading
- Use /compact when approaching context limits

### Agent Efficiency Patterns
- **Batch Related Tasks**: Group similar work for single agent
- **Sequential Dependency**: Complete foundation before specialization
- **Parallel Processing**: Use multiple agents for independent tasks
- **Context Handoff**: Pass findings between agents efficiently

### Session Optimization
- Start with broad context (general-purpose)
- Narrow to specific expertise (specialist agents)
- Validate with quality assurance (qa-testing-specialist)
- Document learnings for future sessions

---

**USAGE**: Read SESSION_INIT.md first, then execute appropriate agent workflow based on your task. The system is designed for rapid context acquisition and intelligent task routing.