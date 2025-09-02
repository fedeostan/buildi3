# Buildi3 MVP Backend - AI Implementation Plan

**Project**: Buildi3 Mobile App - Construction Management MVP  
**Focus**: Complete Backend Implementation (Auth + Core Features)  
**Architecture**: Supabase-Only (No Timeline - AI Execution Ready)  
**Target**: Launch-Ready MVP with Task & Project Management

## 🎯 MVP Implementation Overview

This document provides **AI-executable PRDs** for implementing the complete backend for Buildi3's React Native construction management app. Based on analysis of the existing frontend, this creates a **minimal viable backend** that supports:

### ✅ **What We're Building (MVP Scope)**

1. **3-Table Database Schema** - Users, Projects, Tasks (not 15+ enterprise tables)
2. **Secure Authentication** - Supabase Auth with proper mobile token storage
3. **Task Management Backend** - Full CRUD supporting existing TaskSection UI
4. **Project Management Backend** - Full CRUD supporting existing ProjectItem UI
5. **Mobile-First Integration** - Optimized for construction sites with poor connectivity

### 🚀 **Key Architectural Decisions (Validated)**

✅ **Supabase-Only** - No separate backend service (cost-effective, simple)  
✅ **Direct React Native Integration** - No API layer needed  
✅ **Mobile Security** - Expo SecureStore (not AsyncStorage)  
✅ **Offline-Friendly** - React Query + optimistic updates for job sites  
✅ **3-Table Design** - User profiles, Projects, Tasks (expandable later)

---

## 📱 Frontend Analysis (Complete)

### ✅ **Built & Working**

- **TaskSection Component** - Stages: not-started, in-progress, completed, blocked
- **ProjectItem Component** - Icons: Building/House/Outdoors + color variants
- **Project Setup Flow** - Upload quote OR create manually workflow
- **Onboarding Screens** - 7-step flow ready for backend integration

### 📊 **Actual Data Requirements (From Code Analysis)**

```typescript
// Tasks (from TaskSection/types.ts)
interface Task {
  id: string;
  title: string;
  projectName: string; // Maps to projects.name
  dueDate: Date;
  stage: "not-started" | "in-progress" | "completed" | "blocked";
  isCompleted: boolean;
}

// Projects (from ProjectItem component)
interface Project {
  name: string;
  iconType: "Building" | "House" | "Outdoors" | "General";
  iconColor: "Blue Light" | "Green Pond" | "Pink" | etc;
  progress: number; // 0-100 percentage
}

// User Profile (from onboarding params)
interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  useCase: string;
  jobDescription: string;
}
```

### Data Collected Through Flow

```typescript
// Complete user data collected across all screens
interface UserOnboardingData {
  email: string; // From signup.tsx
  verificationCode: string; // From verify-email.tsx
  password: string; // From create-password.tsx (hashed)
  firstName: string; // From complete-profile.tsx
  lastName: string; // From complete-profile.tsx
  role: "manager" | "architect" | "technician" | "employee"; // From role-selection.tsx
  useCase:
    | "construction-general"
    | "renovations"
    | "demolition-rebuild"
    | "small-jobs"
    | "budget-quotations"; // From use-case-selection.tsx
  jobDescription:
    | "business-owner"
    | "site-supervisor"
    | "skilled-worker"
    | "project-admin"; // From job-description-selection.tsx
}
```

---

## 🏗️ Simplified Backend Architecture

### Technology Stack

```
Frontend (Existing): React Native + Expo
Backend (New):        Supabase Only (PostgreSQL + Auth + Edge Functions)
Authentication:       Supabase Auth (built-in JWT handling)
Email Service:        Supabase Auth + Resend (for custom templates)
Validation:          Zod schemas (client + edge functions)
```

### Project Structure (Supabase-focused)

```
Buildi3App/                      # React Native App (existing)
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Supabase client config
│   │   ├── auth.ts              # Auth utilities
│   │   └── types.ts             # Database types (generated)
│   ├── validation/
│   │   ├── auth.ts              # Zod schemas for auth
│   │   └── profile.ts           # Zod schemas for profile
│   └── utils/
│       ├── errors.ts            # Error handling
│       └── constants.ts         # App constants

supabase/                        # Supabase project
├── migrations/                  # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── 003_audit_logs.sql
├── functions/                   # Edge Functions (minimal)
│   ├── send-verification-email/
│   └── cleanup-expired-codes/
└── config.toml                  # Supabase config
```

### Key Architectural Benefits

✅ **Simplified**: One backend service instead of two  
✅ **Cost Effective**: No additional hosting for Next.js API  
✅ **Better Performance**: Direct database connection from mobile  
✅ **Built-in Security**: Supabase RLS + JWT handling  
✅ **Real-time Ready**: Supabase real-time subscriptions available  
✅ **Type Safety**: Auto-generated TypeScript types from schema

---

## 🗄️ MVP Database Schema (3-Table Design)

**Decision**: Minimal viable schema matching your actual frontend components.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT,
    use_case TEXT,
    job_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. PROJECTS (matches ProjectItem component exactly)
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_type TEXT NOT NULL DEFAULT 'General',
    icon_color TEXT NOT NULL DEFAULT 'Blue Light',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Constraints matching frontend assets
    CHECK (icon_type IN ('Building', 'House', 'Outdoors', 'General')),
    CHECK (icon_color IN (
        'Blue Light', 'Blue Darker', 'Green Light', 'Green Pastel',
        'Green Pond', 'Lime', 'Pink Light', 'Pink', 'Purple'
    )),
    CHECK (progress >= 0 AND progress <= 100)
);

-- 3. TASKS (matches TaskSection component exactly)
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    stage TEXT NOT NULL DEFAULT 'not-started',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Constraints matching TaskStage type
    CHECK (stage IN ('not-started', 'in-progress', 'completed', 'blocked'))
);

-- Essential indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_stage ON tasks(stage);
CREATE INDEX idx_tasks_project_stage ON tasks(project_id, stage); -- For TaskSection queries

-- Basic RLS (single-user MVP)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies
CREATE POLICY "Users own data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own project tasks" ON tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.user_id = auth.uid())
);
```

**Rationale**: This schema supports 100% of your current frontend with room to grow. No over-engineering.

### Triggers and Functions

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ language plpgsql security definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Performance Indexes

```sql
-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_company ON public.user_profiles(company_name);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Verification codes indexes
CREATE INDEX idx_verification_codes_user_id ON public.custom_verification_codes(user_id);
CREATE INDEX idx_verification_codes_expires ON public.custom_verification_codes(expires_at);
CREATE INDEX idx_verification_codes_type ON public.custom_verification_codes(code_type);
```

---

## 🎯 Implementation Epics

This section organizes the implementation into clear, digestible deliverables that can be tackled independently while building toward a complete authentication system.

---

## Epic 1: Foundation & Database Setup

**Goal**: Establish Supabase backend infrastructure and database schema  
**Estimated Effort**: 8-12 hours  
**Dependencies**: None

### 🎯 Epic Deliverables

- ✅ **Functional Supabase project** with proper configuration
- ✅ **Complete database schema** with all tables, indexes, and RLS policies
- ✅ **Auto-generated TypeScript types** for the React Native app
- ✅ **Database triggers** for user profile creation and audit logging

### 📋 Epic Tasks

#### 1.1 Supabase Project Setup

```bash
# Create new Supabase project
npx supabase init
npx supabase start
```

#### 1.2 Database Schema Implementation

- **Create migration files** in `supabase/migrations/`:
  - `001_initial_schema.sql` - Core tables and enums
  - `002_rls_policies.sql` - Row Level Security
  - `003_triggers_functions.sql` - Database triggers and functions
  - `004_indexes.sql` - Performance indexes

#### 1.3 Type Generation & Validation

```bash
# Generate TypeScript types
npx supabase gen types typescript --local > lib/database.types.ts
```

#### 1.4 Validation Schemas Setup

- **Create Zod schemas** in `Buildi3App/lib/validation/`:
  - `auth.ts` - Email, password validation
  - `profile.ts` - User profile validation
  - `constants.ts` - Validation constants

### ✅ Epic Acceptance Criteria

- [ ] Supabase project successfully deployed to staging
- [ ] All database tables created with proper constraints
- [ ] RLS policies protecting user data
- [ ] TypeScript types auto-generated and imported
- [ ] Zod validation schemas created and tested

### 🧪 Epic Testing

```typescript
// Test database constraints and RLS
describe("Database Schema", () => {
  test("should enforce email uniqueness");
  test("should prevent unauthorized profile access");
  test("should auto-create profile on user registration");
  test("should validate enum values");
});
```

---

## Epic 2: Authentication System

**Goal**: Implement secure user authentication using Supabase Auth  
**Estimated Effort**: 12-16 hours  
**Dependencies**: Epic 1 (Foundation)

### 🎯 Epic Deliverables

- ✅ **Supabase Auth integration** in React Native app
- ✅ **Complete authentication flow** (signup → verify → login)
- ✅ **Session management** with automatic token refresh
- ✅ **Authentication context** for app-wide user state

### 📋 Epic Tasks

#### 2.1 Supabase Client Setup

```typescript
// Buildi3App/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
```

#### 2.2 Authentication Utilities

- **Create auth helpers** in `Buildi3App/lib/supabase/auth.ts`:
  - `signUpWithEmail(email, password)`
  - `signInWithEmail(email, password)`
  - `signOut()`
  - `resetPassword(email)`
  - `updateProfile(profileData)`

#### 2.3 Authentication Context

```typescript
// Buildi3App/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
}
```

#### 2.4 Session Management

- **Implement automatic session handling**
- **Add session persistence across app restarts**
- **Handle token refresh transparently**

### ✅ Epic Acceptance Criteria

- [ ] Users can sign up with email/password
- [ ] Email confirmation process works end-to-end
- [ ] Users can log in with confirmed accounts
- [ ] Sessions persist across app restarts
- [ ] Token refresh happens automatically
- [ ] Authentication state is available app-wide

### 🧪 Epic Testing

```typescript
describe("Authentication System", () => {
  test("should create user account successfully");
  test("should handle email confirmation");
  test("should authenticate existing users");
  test("should persist session across restarts");
  test("should handle session expiration");
});
```

---

## Epic 3: Profile & Onboarding System

**Goal**: Implement complete user profile management and onboarding flow  
**Estimated Effort**: 10-14 hours  
**Dependencies**: Epic 2 (Authentication)

### 🎯 Epic Deliverables

- ✅ **Profile management system** with full CRUD operations
- ✅ **Multi-step onboarding integration** with existing screens
- ✅ **Onboarding progress tracking** and resume capability
- ✅ **Profile validation and error handling**

### 📋 Epic Tasks

#### 3.1 Profile Management Functions

```typescript
// Buildi3App/lib/supabase/profiles.ts
export async function updateUserProfile(profileData: ProfileUpdateData) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(profileData)
    .eq("id", user.id);
}

export async function getUserProfile(userId: string) {
  // Fetch complete user profile
}

export async function completeOnboarding(userId: string) {
  // Mark onboarding as completed
}
```

#### 3.2 Onboarding State Management

- **Create onboarding context** for tracking progress
- **Implement step validation and navigation**
- **Add ability to resume interrupted onboarding**

#### 3.3 Screen Integration

- **Update existing screens** to use Supabase instead of console.log:
  - `complete-profile.tsx` - Save name data
  - `role-selection.tsx` - Save role selection
  - `use-case-selection.tsx` - Save use case
  - `job-description-selection.tsx` - Complete onboarding

#### 3.4 Profile Validation & Error Handling

- **Implement comprehensive input validation**
- **Add user-friendly error messages**
- **Handle network failures gracefully**

### ✅ Epic Acceptance Criteria

- [ ] Users can complete full 7-step onboarding process
- [ ] Profile data is saved correctly to database
- [ ] Onboarding progress is tracked and resumable
- [ ] Input validation works with clear error messages
- [ ] Users can update their profile after onboarding
- [ ] Network failures are handled gracefully

### 🧪 Epic Testing

```typescript
describe("Profile & Onboarding", () => {
  test("should save profile data at each step");
  test("should resume onboarding from last step");
  test("should validate all required fields");
  test("should handle network failures gracefully");
  test("should complete onboarding successfully");
});
```

---

## Epic 4: Security & Validation Enhancement

**Goal**: Implement production-ready security measures and comprehensive validation  
**Estimated Effort**: 8-12 hours  
**Dependencies**: Epic 3 (Profile System)

### 🎯 Epic Deliverables

- ✅ **Comprehensive input validation** with Zod schemas
- ✅ **Rate limiting and abuse prevention**
- ✅ **Security headers and CORS configuration**
- ✅ **Audit logging system** for compliance

### 📋 Epic Tasks

#### 4.1 Enhanced Validation Schemas

```typescript
// Buildi3App/lib/validation/schemas.ts
const signupSchema = z.object({
  email: z.string().email().max(255),
  password: z
    .string()
    .min(12)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .max(128),
});

const profileSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(["manager", "architect", "technician", "employee"]),
  // ... additional validation
});
```

#### 4.2 Rate Limiting Implementation

- **Implement client-side rate limiting**
- **Add progressive backoff for failed attempts**
- **Configure Supabase rate limiting policies**

#### 4.3 Security Headers & Configuration

```typescript
// Supabase Edge Function for enhanced security
export async function handler(req: Request) {
  // Add security headers
  // Validate request origin
  // Log security events
}
```

#### 4.4 Audit Logging System

- **Create audit log Edge Function**
- **Log authentication events**
- **Log profile changes**
- **Implement log retention policies**

### ✅ Epic Acceptance Criteria

- [ ] All inputs are validated with clear error messages
- [ ] Rate limiting prevents abuse
- [ ] Security headers are properly configured
- [ ] Audit logs capture all important events
- [ ] CORS is configured correctly for mobile app
- [ ] Password requirements are enforced

### 🧪 Epic Testing

```typescript
describe("Security & Validation", () => {
  test("should reject weak passwords");
  test("should prevent rapid-fire requests");
  test("should log authentication events");
  test("should validate all profile fields");
  test("should handle malicious input safely");
});
```

---

## Epic 5: Testing & Quality Assurance

**Goal**: Implement comprehensive testing suite and ensure production readiness  
**Estimated Effort**: 12-16 hours  
**Dependencies**: Epic 4 (Security)

### 🎯 Epic Deliverables

- ✅ **Unit tests** for all authentication functions
- ✅ **Integration tests** for complete user flows
- ✅ **End-to-end tests** for onboarding process
- ✅ **Performance testing and optimization**

### 📋 Epic Tasks

#### 5.1 Unit Testing Suite

```typescript
// __tests__/lib/auth.test.ts
describe("Authentication Functions", () => {
  test("signUpWithEmail creates user successfully");
  test("signInWithEmail authenticates user");
  test("updateProfile saves data correctly");
  test("session management works properly");
});
```

#### 5.2 Integration Testing

- **Test complete authentication flows**
- **Test database constraints and RLS**
- **Test error handling scenarios**

#### 5.3 End-to-End Testing

```typescript
// e2e/onboarding.e2e.ts
describe("Complete Onboarding Flow", () => {
  test("user can complete full signup process");
  test("user can resume interrupted onboarding");
  test("user receives proper error messages");
});
```

#### 5.4 Performance Testing & Optimization

- **Test database query performance**
- **Optimize React Native app bundle size**
- **Test app performance on older devices**

### ✅ Epic Acceptance Criteria

- [ ] 90%+ test coverage for authentication code
- [ ] All user flows tested end-to-end
- [ ] Performance benchmarks met
- [ ] App tested on iOS and Android devices
- [ ] Error scenarios properly handled and tested

---

## Epic 6: Production Deployment

**Goal**: Deploy to production with monitoring and rollback capabilities  
**Estimated Effort**: 6-10 hours  
**Dependencies**: Epic 5 (Testing)

### 🎯 Epic Deliverables

- ✅ **Production Supabase environment** with proper configuration
- ✅ **Monitoring and alerting** for critical issues
- ✅ **Backup and recovery procedures**
- ✅ **Documentation** for maintenance and troubleshooting

### 📋 Epic Tasks

#### 6.1 Production Environment Setup

- **Configure production Supabase project**
- **Set up environment variables and secrets**
- **Configure custom domain and SSL**

#### 6.2 Monitoring & Alerting

- **Set up Supabase monitoring dashboards**
- **Configure alerts for failed authentications**
- **Set up error tracking with Sentry**

#### 6.3 Backup & Recovery

- **Configure automatic database backups**
- **Document recovery procedures**
- **Test backup restoration process**

#### 6.4 Documentation & Handoff

- **Create deployment guide**
- **Document troubleshooting procedures**
- **Create monitoring runbook**

### ✅ Epic Acceptance Criteria

- [ ] Production environment is fully functional
- [ ] Monitoring captures all critical metrics
- [ ] Backup and recovery procedures tested
- [ ] Complete documentation provided
- [ ] Production rollback plan defined

---

## 📊 Epic Summary & Timeline

| Epic                             | Estimated Hours | Dependencies | Key Deliverable                    |
| -------------------------------- | --------------- | ------------ | ---------------------------------- |
| **Epic 1: Foundation**           | 8-12 hrs        | None         | Supabase backend + database schema |
| **Epic 2: Authentication**       | 12-16 hrs       | Epic 1       | Complete auth system               |
| **Epic 3: Profile & Onboarding** | 10-14 hrs       | Epic 2       | Full onboarding integration        |
| **Epic 4: Security**             | 8-12 hrs        | Epic 3       | Production-ready security          |
| **Epic 5: Testing**              | 12-16 hrs       | Epic 4       | Comprehensive test suite           |
| **Epic 6: Production**           | 6-10 hrs        | Epic 5       | Live production deployment         |

**Total Estimated Time**: 56-80 hours (7-10 weeks part-time)

### 🎯 Epic-Based Benefits

✅ **Clear Deliverables**: Each epic produces tangible, testable results  
✅ **Flexible Scheduling**: Epics can be tackled based on priority and availability  
✅ **Progress Visibility**: Stakeholders can see concrete progress after each epic  
✅ **Risk Mitigation**: Issues are caught early within each epic's scope  
✅ **Quality Focus**: Each epic includes its own testing and validation

---

**Status**: Ready for Epic 1 Implementation  
**Next Steps**: Begin Foundation & Database Setup  
**Recommended Approach**: Complete one epic fully before starting the next
