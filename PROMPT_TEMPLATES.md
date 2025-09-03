# 🚀 Buildi3 Claude Session Templates

> **Copy-paste ready prompts for optimal development workflows**  
> **Based on**: Anthropic 2025 best practices + Buildi3 enhanced structure  
> **Purpose**: Instant context acquisition and task-specific optimization

---

## 🎯 **Session Initialization (Always Start Here)**

### **Context Bootstrap Command**
```
@Workflow/SESSION_INIT.md @context/MASTER_LESSONS.md @Buildi3App/CLAUDE.md @Planning/ACCOMPLISHMENTS_SUMMARY.md

Execute the SESSION_INIT.md protocol. Read all Phase 1 critical files, provide the 4 context validation answers, and summarize project status, architecture, MCP tools, critical issues, and next steps.
```

**✅ Use this for every new session to establish complete project context.**

---

## 📋 **Case 1: New Feature Development**

### **Feature Planning Session**
```
@context/MASTER_LESSONS.md @context/component-reuse-analysis.md @app/(tabs)/[SIMILAR_SCREEN] @components/ui/[RELATED_COMPONENTS] @theme/ 

/ultrathink-development Implement [FEATURE_NAME] following these requirements:

**Requirements:**
- [Specific feature requirements]
- [User stories or acceptance criteria]
- [Design specifications or references]

**Context:**
- Epic Status: [Current epic] 
- Integration Points: [Related systems/components]
- Design System: Must use existing design tokens and components

Please:
1. Analyze similar patterns in existing screens and components
2. Identify reusable components and patterns from component-reuse-analysis
3. Check MASTER_LESSONS for relevant patterns and anti-patterns
4. Design the implementation approach following proven workflows
5. Select appropriate specialist agent for implementation

Don't implement yet - provide comprehensive analysis and implementation strategy first.
```

### **Feature Implementation Session** (After Planning)
```
@[PLANNED_FILES] @components/ui/ @theme/ @types/

/agent-orchestration Implement the planned [FEATURE_NAME] using the analyzed approach:

**Implementation Requirements:**
- Follow the implementation strategy from planning session
- Use identified reusable components and patterns
- Apply defensive programming patterns from MASTER_LESSONS
- Maintain 100% design token compliance
- Include comprehensive error handling and validation

**Success Criteria:**
- [ ] Feature works as specified
- [ ] Follows established patterns
- [ ] Uses existing components where possible  
- [ ] Includes proper TypeScript typing
- [ ] Has appropriate error handling
- [ ] Integrates smoothly with existing architecture

Execute with appropriate specialist agent and create comprehensive test cases.
```

---

## 🔧 **Case 2: Small Upgrade/Enhancement**

### **Small Enhancement Session**
```
@[TARGET_FILE] @context/MASTER_LESSONS.md @components/ui/[RELATED_COMPONENTS] @theme/

Implement small enhancement: [ENHANCEMENT_DESCRIPTION]

**Context:**
- Target: [Specific file/component to modify]
- Scope: [Specific change needed]
- Constraints: [Any limitations or requirements]

**Requirements:**
- Follow existing patterns in the target file
- Use design tokens for any styling changes
- Check MASTER_LESSONS for relevant anti-patterns to avoid
- Implement defensive programming principles
- Maintain backward compatibility

Please:
1. Analyze the current implementation
2. Identify the minimal change needed
3. Check for any anti-patterns from MASTER_LESSONS
4. Implement the enhancement with proper error handling
5. Update relevant documentation if needed

Focus on minimal, clean changes that follow established patterns.
```

---

## 🗄️ **Case 3: Backend and Database Session**

### **Backend Work Session**
```
@context/MASTER_LESSONS.md @lib/supabase/ @types/database.types.ts

/agent-orchestration data-architecture-agent [DATABASE_TASK_DESCRIPTION]

**Database Context:**
- Current Schema: 15-table Supabase schema with RLS
- Security Model: Three-tier permissions (System→Project→Member)
- Performance: 35+ strategic indexes implemented

**Task Requirements:**
- [Specific database/backend requirements]
- [Schema changes needed]
- [Query patterns or optimizations]

**MCP Tool Usage:**
- Use mcp__supabase__list_tables to review current schema
- Use mcp__supabase__get_advisors for security/performance insights
- Use mcp__supabase__apply_migration for schema changes
- Use mcp__supabase__execute_sql for data operations

**Critical Considerations:**
- Must maintain RLS security patterns
- Avoid infinite recursion in policies (use security definer functions)
- Follow established permission hierarchy
- Generate updated TypeScript types after schema changes

Please provide comprehensive analysis including security, performance, and integration implications.
```

### **Database Migration Session**
```
@context/MASTER_LESSONS.md

/agent-orchestration data-architecture-agent Create database migration for: [MIGRATION_DESCRIPTION]

**Migration Requirements:**
- [Specific schema changes needed]
- [Data migration requirements if any]
- [Performance considerations]

**Security Requirements:**
- Maintain existing RLS policies
- Follow three-tier permission model
- Avoid policy recursion patterns
- Update audit logging if needed

**Process:**
1. Review current schema with mcp__supabase__list_tables
2. Design migration following established patterns  
3. Create migration with mcp__supabase__apply_migration
4. Generate updated TypeScript types
5. Update related service files
6. Test with security advisor recommendations

Focus on maintaining data integrity and security throughout the migration.
```

---

## 🐛 **Case 4: Bug Fix**

### **Bug Investigation Session**
```
@context/MASTER_LESSONS.md @[PROBLEMATIC_FILE] @[RELATED_TEST_FILES]

/bug-resolution-workflow [ERROR_DESCRIPTION]

**Error Details:**
- Error Message: [Exact error message]
- Stack Trace: [Complete stack trace]
- Reproduction Steps: [How to reproduce consistently]
- Expected Behavior: [What should happen instead]

**Context:**
- Affected Components: [Files/components involved]
- Recent Changes: [Any recent modifications to related code]
- Environment: [iOS/Android/Web, versions, etc.]

**Known Anti-Patterns Check:**
Please first check MASTER_LESSONS.md anti-patterns for:
- [ ] Enum format mismatches (kebab-case vs snake_case)
- [ ] Props interface mismatches (spreading vs object props)  
- [ ] RLS policy recursion in database queries
- [ ] Race conditions in authentication flow
- [ ] Component props validation missing

**Investigation Approach:**
1. Route to QA Testing Specialist for systematic analysis
2. Identify root cause using defensive programming analysis
3. Implement fixes that prevent similar issues
4. Create test cases to catch this type of error
5. Update relevant anti-patterns in MASTER_LESSONS if new pattern discovered

Priority: Fix the immediate issue AND prevent future occurrences.
```

### **Critical Bug Session** (Production Issues)
```
@context/MASTER_LESSONS.md @[CRITICAL_FILES]

URGENT: /bug-resolution-workflow [CRITICAL_ERROR_DESCRIPTION]

**Critical Error Context:**
- Impact: [User impact/business impact]
- Frequency: [How often it occurs]
- Environment: [Production/staging/development]
- Error: [Complete error details with logs]

**Immediate Requirements:**
- Provide hotfix for immediate resolution
- Identify root cause comprehensively
- Implement long-term prevention measures
- Update monitoring/logging for early detection

**Process:**
1. QA Testing Specialist for emergency analysis
2. Implement minimal viable fix first
3. Comprehensive root cause analysis
4. Defensive programming improvements
5. Enhanced error handling and logging
6. Update MASTER_LESSONS anti-patterns

Focus on immediate stabilization followed by comprehensive prevention.
```

---

## 🎯 **Case 5: Strategic Planning**

### **Strategic Feature Planning**
```
@context/MASTER_LESSONS.md @Planning/ACCOMPLISHMENTS_SUMMARY.md @context/epic1-implementation-complete.md

/ultrathink-development Strategic planning for: [STRATEGIC_INITIATIVE]

**Strategic Context:**
- Current Epic Status: Epic 1-2 complete, Epic 3 ready
- Architecture Foundation: React Native + Supabase with 15-table schema
- Component Library: 80+ components with atomic design system
- Security: Production-ready RLS with role-based permissions

**Planning Requirements:**
- [High-level strategic goals]
- [Business objectives/outcomes]
- [Technical constraints/requirements]
- [Timeline considerations]
- [Resource constraints]

**Analysis Needed:**
1. Architectural impact assessment
2. Component reuse opportunities analysis
3. Database schema implications
4. Security and performance considerations
5. Development effort estimation
6. Risk assessment and mitigation strategies
7. Integration complexity evaluation

**Deliverables:**
- Comprehensive strategic plan with phases
- Technical architecture recommendations
- Resource and timeline estimates
- Risk mitigation strategies
- Implementation roadmap with dependencies

Use research-validation-specialist for market analysis and technical validation as needed.
```

### **Epic Planning Session**
```
@context/MASTER_LESSONS.md @Planning/ACCOMPLISHMENTS_SUMMARY.md @context/component-reuse-analysis.md

/agent-orchestration prd-architect Create comprehensive Epic plan for: [EPIC_NAME]

**Epic Context:**
- Project Phase: [Current development phase]
- Prerequisites: [What must be complete first]
- Business Value: [Expected outcomes/value]
- Technical Scope: [High-level technical requirements]

**Planning Scope:**
- Feature breakdown with clear deliverables
- Component reuse analysis and net-new development
- Database schema changes and migrations needed
- Security model implications and enhancements
- Performance optimization requirements
- Testing and quality assurance strategy
- Documentation and knowledge transfer needs

**Success Criteria:**
- Clear, implementable user stories
- Technical specifications with acceptance criteria
- Effort estimates with confidence intervals
- Risk assessment with mitigation plans
- Dependencies clearly identified and sequenced
- Rollback and contingency planning

**LLM-Optimized Output:**
- Ensure all requirements are LLM-friendly for future implementation
- Include comprehensive context for agent execution
- Provide clear handoff documentation for development phases

Create a production-ready Epic plan that can be executed systematically.
```

### **Architecture Decision Session**
```
@context/MASTER_LESSONS.md @context/epic1-implementation-complete.md

/ultrathink-development Architecture decision for: [DECISION_CONTEXT]

**Decision Context:**
- Current Architecture: [Relevant architectural context]
- Problem/Opportunity: [What needs to be decided]
- Constraints: [Technical, business, timeline constraints]
- Stakeholders: [Who is affected by this decision]

**Analysis Requirements:**
1. Research current best practices with research-validation-specialist
2. Analyze impact on existing architecture with data-architecture-agent
3. Evaluate mobile-specific implications with mobile-app-architect
4. Consider security implications and compliance requirements
5. Assess performance and scalability implications
6. Evaluate development and maintenance complexity
7. Consider integration with existing MCP tools and workflows

**Decision Factors:**
- Technical feasibility and complexity
- Performance and scalability implications
- Development effort and timeline impact
- Maintenance and operational complexity
- Security and compliance considerations
- Cost implications (development + operational)
- Risk assessment and mitigation strategies

**Deliverables:**
- Comprehensive architecture decision record (ADR)
- Implementation recommendations with phases
- Risk assessment with mitigation strategies
- Success metrics and monitoring recommendations
- Rollback plan and contingency options

Document the decision rationale for future reference in MASTER_LESSONS.md.
```

---

## 🔧 **Specialized Workflow Sessions**

### **MCP Tool Integration Session**
```
@context/MASTER_LESSONS.md @Buildi3App/CLAUDE.md

Working with [MCP_SERVER_NAME] for: [INTEGRATION_PURPOSE]

**MCP Context:**
- Available Servers: Figma Dev Mode, Supabase, Context7, IDE
- Current Integration: [Current usage patterns]
- Requirements: [What needs to be accomplished]

**Tool-Specific Approach:**
For Figma Dev Mode:
- Use localhost asset serving (never import external packages)
- Follow 100% design token compliance
- Check component reuse analysis before creating new components

For Supabase:
- Use advisors for security/performance recommendations
- Follow established RLS patterns from MASTER_LESSONS
- Generate TypeScript types after schema changes

For Context7:
- Always resolve-library-id first before documentation
- Specify topic for focused documentation
- Validate against current project patterns

**Process:**
1. Verify MCP server connectivity and permissions
2. Review current integration patterns in MASTER_LESSONS
3. Execute with appropriate MCP commands
4. Validate outputs against established patterns
5. Update documentation with new integration insights

Focus on leveraging MCP capabilities while maintaining consistency with project patterns.
```

### **Performance Optimization Session**
```
@context/MASTER_LESSONS.md @[PERFORMANCE_CRITICAL_FILES]

/agent-orchestration mobile-app-architect Performance optimization for: [PERFORMANCE_ISSUE]

**Performance Context:**
- Current Issue: [Specific performance problem]
- Measurement Data: [Metrics, benchmarks, user reports]
- Target Improvement: [Specific performance goals]
- Constraints: [Technical/UX constraints]

**Optimization Areas:**
- Component rendering efficiency
- Data loading and caching strategies
- Memory usage and leak prevention
- Network request optimization
- Database query performance
- Image and asset optimization
- Bundle size and code splitting

**Analysis Required:**
1. Profile current performance with appropriate tools
2. Identify bottlenecks using systematic analysis
3. Review existing optimization patterns in MASTER_LESSONS
4. Design optimization strategy following mobile best practices
5. Implement changes with benchmarking validation
6. Create monitoring strategy for ongoing performance tracking

**Success Criteria:**
- [ ] Measurable performance improvement
- [ ] No degradation in functionality or UX
- [ ] Follows established patterns and doesn't introduce anti-patterns
- [ ] Includes monitoring for performance regression prevention
- [ ] Documentation updated with optimization patterns

Focus on sustainable performance improvements that can be maintained and extended.
```

---

## 🎓 **Session Management Best Practices**

### **Session Transition Commands**
```bash
# Between different work types
/clear

# Continuing related work
--continue [previous-session-context]

# Adding context mid-session
@[additional-files]
```

### **Context Validation Checklist**
Before starting any session:
- [ ] SESSION_INIT.md protocol executed
- [ ] 4 validation questions answered correctly
- [ ] Relevant files tagged with @
- [ ] MCP servers verified as available
- [ ] Appropriate specialist agent identified
- [ ] Success criteria clearly defined

### **Quality Gates**
After completing any session:
- [ ] Deliverables match requirements
- [ ] Follows established patterns from MASTER_LESSONS
- [ ] Avoids known anti-patterns
- [ ] Includes appropriate testing/validation
- [ ] Documentation updated where relevant
- [ ] Context documented for future sessions

---

**🚀 Usage Instructions:**
1. **Copy** the relevant template for your use case
2. **Customize** the bracketed placeholders with your specific details
3. **Tag** the appropriate files using @ syntax
4. **Paste** and execute for optimal development workflow

**🎯 Success Metric:** Each template should provide immediate context acquisition and task-specific optimization for maximum development productivity.**