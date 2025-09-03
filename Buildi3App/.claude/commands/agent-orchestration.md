# Agent Orchestration Command

> **Intelligent agent selection and task delegation using Anthropic 2025 best practices**  
> **Usage**: `/agent-orchestration $ARGUMENTS`  
> **Purpose**: Optimal agent selection and parallel execution for complex multi-step tasks

---

## Command Implementation

**I need to analyze this task and route it to the most appropriate specialist agent(s) for optimal execution.**

### Phase 1: Task Analysis & Agent Selection 🎯

**Task Classification:**
```
Analyze the request to determine:
- Primary domain (UI, Database, Architecture, Testing, etc.)
- Complexity level (Simple, Complex, Multi-step)
- Dependencies (Files, Services, External APIs)
- Expected deliverables (Code, Documentation, Analysis)
```

**Agent Decision Tree:**
```
Bug/Error Issue? 
  → QA Testing Specialist
    - Systematic debugging approach
    - Defensive programming implementation  
    - Test case creation
    - Anti-pattern prevention

Database/RLS/Schema Issue?
  → Data Architecture Agent
    - Schema design and optimization
    - RLS policy creation/fixes
    - Performance optimization
    - Security best practices

Need External Research/Documentation?
  → Research Validation Specialist  
    - Framework research and validation
    - Market analysis and comparisons
    - Current best practices
    - Technical decision validation

Complex Multi-File Analysis?
  → General Purpose Agent
    - Cross-cutting concerns
    - Repository organization
    - Pattern identification
    - Comprehensive analysis

Component/UI Development?
  → Check component reuse analysis first, then:
    - Mobile App Architect (if architecture decisions needed)
    - General Purpose Agent (if existing pattern analysis needed)

Construction Domain Specific?
  → Construction Domain Expert
    - Workflow validation
    - Industry terminology
    - Realistic project estimates

Portuguese/EU Compliance?
  → Localization Compliance Agent  
    - GDPR compliance
    - Portuguese market requirements
    - Moloni.pt integration

PRD/Requirements Creation?
  → PRD Architect
    - LLM-optimized requirements
    - Clear scope definition
    - Implementation breakdown

AI Feature Implementation?
  → AI Orchestration Engineer
    - Prompt engineering
    - AI workflow design
    - Output validation
```

### Phase 2: Execution Strategy 🚀

**Single Agent Execution:**
```
Task tool with:
- subagent_type: "[selected-agent-type]"
- description: "[concise-task-description]"  
- prompt: "[comprehensive-context-with-specific-requirements]"
```

**Parallel Agent Execution (When Applicable):**
```
// Execute multiple agents simultaneously for independent tasks
Task tool with subagent_type: "qa-testing-specialist" (for testing)
Task tool with subagent_type: "data-architecture-agent" (for database)
Task tool with subagent_type: "research-validation-specialist" (for validation)
```

**Sequential Agent Execution (For Dependencies):**
```
1. Research/Analysis Agent → Gather requirements
2. Architecture Agent → Design solution  
3. Implementation Agent → Execute development
4. QA Agent → Validate and test
```

### Phase 3: Context Preparation 📋

**Essential Context for Agents:**
```markdown
## Project Context
- Epic Status: Epic 1-2 complete, Epic 3 ready
- Architecture: React Native + Supabase (15-table schema)
- Security: RLS with role-based permissions
- Components: 80+ with atomic design system

## Task Requirements
[Specific requirements and acceptance criteria]

## Constraints
- Must follow component reuse analysis
- Must use design tokens (no hard-coded values)
- Must implement defensive programming
- Must avoid known anti-patterns from MASTER_LESSONS.md

## Success Criteria
[Measurable outcomes and deliverables]

## Related Context
[Links to relevant documentation and context files]
```

**Agent-Specific Context:**
- **QA Testing**: Include error logs, reproduction steps, expected behavior
- **Data Architecture**: Include schema context, query patterns, performance requirements  
- **Research Validation**: Include specific questions, decision criteria, alternatives
- **General Purpose**: Include file patterns, analysis scope, cross-references

### Phase 4: Quality Assurance & Follow-up 🔍

**Agent Output Validation:**
- [ ] **Deliverables match requirements** 
- [ ] **Follows established patterns** from MASTER_LESSONS.md
- [ ] **Avoids known anti-patterns**
- [ ] **Includes appropriate testing/validation**
- [ ] **Documentation is updated** where relevant

**Context Documentation Update:**
```markdown
## Agent Orchestration Result
**Date**: [current-date]
**Task**: [task-description] 
**Agent Used**: [agent-type]
**Outcome**: [success/issues/lessons]
**Pattern**: [reusable-pattern-if-applicable]
```

**Follow-up Actions:**
- Update MASTER_LESSONS.md if new patterns discovered
- Create context documentation for significant insights  
- Route additional tasks to other agents if needed
- Validate integration with existing codebase

---

## Usage Examples

### Complex Feature Development
```
/agent-orchestration Implement real-time task collaboration with offline sync and conflict resolution
```
**Expected Routing**: Data Architecture Agent → Mobile App Architect → QA Testing Specialist

### Bug Investigation
```  
/agent-orchestration Investigate and fix performance issues when rendering large project lists
```
**Expected Routing**: QA Testing Specialist (with performance focus)

### Architecture Decision
```
/agent-orchestration Evaluate state management solutions for complex form workflows
```
**Expected Routing**: Research Validation Specialist → Mobile App Architect

### Multi-Domain Task
```
/agent-orchestration Create Portuguese invoice generation with GDPR compliance and Moloni.pt integration  
```
**Expected Routing**: Localization Compliance Agent → Data Architecture Agent

### Research Task
```
/agent-orchestration Research and implement best practices for React Native offline data synchronization
```
**Expected Routing**: Research Validation Specialist → Data Architecture Agent

---

## Agent Parallel Execution Patterns

### Independent Tasks (Run Simultaneously)
```
Research current patterns (Research Validation Specialist)
+ 
Analyze existing codebase (General Purpose Agent)
+
Review security implications (Data Architecture Agent)
```

### Dependent Tasks (Run Sequentially)  
```
1. Requirements gathering (Research/Domain Expert)
2. Architecture design (Data/Mobile App Architect)  
3. Implementation (Appropriate specialist)
4. Testing & validation (QA Testing Specialist)
```

---

## Success Metrics

**Optimal Agent Selection When:**
- [ ] **Single-purpose tasks** routed to specialized agents
- [ ] **Multi-domain tasks** broken down appropriately  
- [ ] **Complex tasks** analyzed with "ultrathink" first
- [ ] **Parallel execution** used when tasks are independent
- [ ] **Sequential execution** used when dependencies exist

**Quality Outcomes:**
- [ ] **Faster execution** through specialized expertise
- [ ] **Higher quality results** from domain experts
- [ ] **Consistent patterns** following established practices
- [ ] **Comprehensive coverage** of all task aspects
- [ ] **Proper documentation** and knowledge transfer

---

**Output**: This command intelligently analyzes tasks, selects optimal agents, provides comprehensive context, and ensures high-quality execution following Anthropic 2025 best practices for agent orchestration.