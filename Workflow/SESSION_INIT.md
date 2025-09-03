# 🚀 Buildi3 Session Initialization Protocol

> **Comprehensive onboarding protocol for new Claude sessions**  
> **Version**: 2.0 | **Based on**: Anthropic 2025 Best Practices  
> **Purpose**: Instant context acquisition and task readiness

---

## ⚡ **Phase 1: Critical File Reading (MANDATORY)**

### **🔥 Essential Context Files**
Read these files in order to establish complete project understanding:

#### **1. Project Rules & MCP Configuration**
```
/Users/federicoostan/buildi3/Buildi3App/CLAUDE.md
```
**Purpose**: Core project rules, MCP servers, component reuse protocol

#### **2. Current Implementation Status**  
```
/Users/federicoostan/buildi3/context/MASTER_LESSONS.md
```
**Purpose**: All development patterns, anti-patterns, and architectural decisions

#### **3. Component Reuse Analysis**
```
/Users/federicoostan/buildi3/context/component-reuse-analysis.md
```
**Purpose**: MCP Figma limitations and component composition strategies

#### **4. Epic Implementation Status**
```
/Users/federicoostan/buildi3/Planning/ACCOMPLISHMENTS_SUMMARY.md
```
**Purpose**: Complete project status, completed epics, and readiness assessment

---

## 🎯 **Phase 2: Context Validation Questions**

After reading all Phase 1 files, answer these questions to confirm context acquisition:

### **Question 1: "What MCP servers are available?"**
**Expected Answer**: Figma Dev Mode (design-to-code + localhost assets), Supabase (database operations + migrations + advisors), Context7 (documentation lookup), IDE (diagnostics)

### **Question 2: "What's the current Epic status?"**  
**Expected Answer**: Epic 1-2 COMPLETED (15-table backend + 8-step auth), Epic 3 READY FOR IMPLEMENTATION

### **Question 3: "What's the main critical issue to watch for?"**
**Expected Answer**: Enum format mismatches (frontend kebab-case vs database formats), component reuse requirements before creating new implementations

### **Question 4: "Which UI components are ready and what's the development approach?"**
**Expected Answer**: 80+ components with atomic design (TaskSection, ProjectItem, etc.), always search existing patterns first, use MCP Figma with localhost assets

---

## 🏗️ **Phase 3: Architecture Understanding**

### **✅ Technology Stack**
- **Frontend**: React Native + Expo SDK 53, 80+ design system components
- **Backend**: Supabase-only (15-table schema with RLS security)
- **Database**: PostgreSQL with role-based permissions and audit logging  
- **Auth**: Complete 8-step onboarding with session persistence
- **Navigation**: Expo Router v5 with type-safe routing

### **🔐 Security Model**
```typescript
// Three-tier permission hierarchy
profiles.role → 'project_manager', 'manager'  // System level
projects.created_by                           // Project ownership
project_members.role                          // Project-specific roles
```

### **🎨 Design System**
- **100% design token compliance** - never use hard-coded values
- **Figma Dev Mode integration** - use localhost assets when available
- **Component composition priority** - search existing before creating
- **Atomic design implementation** - atoms → molecules → organisms

---

## 🤖 **Phase 4: Agent Orchestration Mastery**

### **🎯 Agent Selection Decision Tree**
```
Bug/Error Issue? → QA Testing Specialist
Database/RLS Problem? → Data Architecture Agent  
Need External Research? → Research Validation Specialist
Complex Multi-File Task? → General Purpose Agent
Construction Domain Question? → Construction Domain Expert
Mobile App Architecture? → Mobile App Architect
PRD Creation Needed? → PRD Architect
AI Feature Implementation? → AI Orchestration Engineer
Portuguese/EU Compliance? → Localization Compliance Agent
```

### **⚡ Agent Usage Patterns (2025 Best Practices)**
- **Parallel execution**: Use multiple agents simultaneously when possible
- **Think-first approach**: Start complex tasks with "ultrathink" mode
- **Specialized delegation**: Route tasks to domain experts immediately
- **Context preservation**: Agents are stateless - provide complete context

---

## 🔧 **Phase 5: MCP Tool Mastery**

### **🎨 Figma Dev Mode Best Practices**

#### **Icon Usage Strategy**
```typescript
// ✅ CORRECT: Use existing icon libraries first
import { Icon } from '@/components/ui';  // Uses Feather icons from @expo/vector-icons

// ✅ ACCEPTABLE: For specific icons not in Feather
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// ✅ PREFERRED: Use localhost assets when available from Figma
<Image source={{ uri: "http://localhost:3000/asset.svg" }} />

// ❌ WRONG: Import additional external packages
import { SomeIcon } from 'react-native-vector-icons'
```

#### **Component Naming Convention**
```typescript
// ✅ CORRECT: Figma frames/components should match repository names
// Figma: "TaskItem" → Repository: components/ui/TaskItem
// Figma: "ProjectWidget" → Repository: components/ui/ProjectWidget
// Figma: "TopNavigationBar" → Repository: components/ui/TopNavigationBar

// This enables easy component discovery and reuse
```

#### **Pre-built Component Priority**
```typescript
// ✅ MANDATORY: Search existing components before creating new ones
// 1. Search for existing patterns in components/ui/
// 2. Use component composition over custom implementation
// 3. Follow component reuse analysis guidelines
// 4. Match Figma component names to repository component names
```

### **🗄️ Supabase Operations**
```typescript
// Essential MCP commands
mcp__supabase__list_tables           // Check schema
mcp__supabase__execute_sql           // Data operations
mcp__supabase__apply_migration       // DDL changes
mcp__supabase__get_advisors          // Security/performance
mcp__supabase__get_logs             // Debug (last minute only)
```

### **📚 Context7 Integration**
```typescript  
// Always resolve library ID first
mcp__context7__resolve_library_id({ libraryName: "react-query" })
// Then get focused documentation
mcp__context7__get_library_docs({ 
  context7CompatibleLibraryID: "/tanstack/react-query",
  topic: "mutations"
})
```

---

## 🎯 **Phase 6: Development Workflow Understanding**

### **🔄 Proven Development Flow (Anthropic 2025)**
```
Complex Task → ultrathink → plan → implement → test → commit
```

### **📋 Component Development Protocol**
1. **Search existing patterns** (MANDATORY via component reuse analysis)
2. **Check MCP Figma assets** for localhost sources
3. **Follow atomic design principles** (atoms → molecules → organisms)  
4. **Implement with design tokens** (100% compliance required)
5. **Add comprehensive tests** with edge case coverage
6. **Document with README template** following established patterns

### **🐛 Bug Resolution Workflow**
1. **QA Testing Specialist** for systematic analysis
2. **Check MASTER_LESSONS anti-patterns** for known issues
3. **Implement defensive programming** fixes
4. **Add test cases** to prevent regression
5. **Update context documentation** with findings

---

## 🎓 **Phase 7: Critical Anti-Patterns to Avoid**

### **❌ Known Issues & Solutions**

#### **1. Enum Format Mismatches**
```typescript
// ❌ WRONG: Mixed formats
Database: 'not_started' | 'blue_light'  
Frontend: 'not-started' | 'Blue Light'

// ✅ CORRECT: Unified kebab-case
'not-started' | 'blue-light'
```

#### **2. Component Props Mismatches**  
```typescript
// ❌ WRONG: Spreading vs object expectation
<TaskItem {...task} />               // Spreads properties
const TaskItem = ({ task }) => ...   // Expects object

// ✅ CORRECT: Consistent interfaces
<TaskItem task={task} />
```

#### **3. RLS Policy Recursion**
```sql
-- ❌ WRONG: Circular dependencies
projects policy → CHECK project_members
project_members policy → CHECK project_members

-- ✅ CORRECT: Security definer functions
CREATE FUNCTION is_project_member() SECURITY DEFINER
```

---

## 📈 **Success Metrics**

### **✅ Context Acquisition Complete When:**
- [ ] All 4 validation questions answered correctly
- [ ] MCP servers and capabilities understood
- [ ] Agent selection decision tree memorized  
- [ ] Anti-patterns and solutions known
- [ ] Current Epic status and next steps clear
- [ ] Development workflow patterns understood

### **🎯 Session Readiness Indicators:**
- **Can immediately route any task** to appropriate specialist agent
- **Can explain project status** and architectural decisions
- **Can identify and avoid known anti-patterns**
- **Can leverage MCP tools** effectively for task requirements
- **Can follow proven development workflows** without guidance

---

## 🚀 **Phase 8: Task Readiness Protocol**

### **🎯 For Any Development Task:**
1. **Check MASTER_LESSONS.md** for relevant patterns
2. **Select appropriate specialist agent** using decision tree
3. **Use "ultrathink" mode** for complex multi-step tasks
4. **Apply component reuse protocol** for UI development
5. **Follow defensive programming patterns** for reliability

### **⚡ Quick Task Routing:**
- **Bug reports** → QA Testing Specialist (with error logs)
- **New features** → Appropriate domain expert (with requirements)
- **Database issues** → Data Architecture Agent (with schema context)
- **Architecture questions** → Review MASTER_LESSONS + specialist if needed

---

## 🎯 **Expected Outcome**

After completing this protocol, you should have:

✅ **Complete project understanding** - Epic status, architecture, and current implementation  
✅ **Tool mastery** - All MCP servers and their optimal usage patterns  
✅ **Agent orchestration expertise** - Know which specialist for which task  
✅ **Pattern recognition** - Identify and avoid known anti-patterns  
✅ **Development workflow fluency** - Follow proven Anthropic 2025 patterns  
✅ **Immediate task readiness** - Route any request to optimal execution path

---

**🏆 Success Indicator**: Within 2 minutes of completing this protocol, you should be able to immediately explain the project status and route any development task to the right specialist agent with complete context and appropriate methodology.**