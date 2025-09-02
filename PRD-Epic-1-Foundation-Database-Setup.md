# Feature: Epic 1 - Foundation & Database Setup

## Context Package
- Previous PRD: N/A (First Epic)
- Dependencies: 
  - Supabase project already exists with tables created
  - React Native app structure complete
  - Expo Router navigation implemented
- Research Docs: Database security analysis reveals 4 tables missing RLS policies
- Related Components: Entire frontend app needs backend integration

## Single Objective
Establish secure, production-ready Supabase backend integration with the React Native frontend, fixing critical security vulnerabilities and enabling rapid MVP testing with proper role-based access control.

## Implementation Requirements

### 1. Critical Security Fixes (Priority: URGENT)
Fix missing Row Level Security policies on 4 tables identified by security audit:

**Tables needing RLS policies:**
- `activity_log` - Missing comprehensive access policies
- `messages` - Missing comprehensive access policies  
- `tool_assignments` - Missing comprehensive access policies
- `task_tools` - Missing comprehensive access policies

**Implementation:**
```sql
-- Fix function search path security warnings
ALTER FUNCTION handle_new_user() SET search_path = '';
ALTER FUNCTION update_timestamp() SET search_path = '';  
ALTER FUNCTION update_updated_at_column() SET search_path = '';

-- Enable leaked password protection
UPDATE auth.config SET 
leaked_password_protection = true,
password_min_length = 8;
```

### 2. Enhanced Role-Based Schema Implementation
Implement construction-focused role hierarchy with clear permissions:

**Role Structure:**
```sql
-- Update profiles role enum with construction hierarchy
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'site_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'safety_officer';

-- Construction role hierarchy (highest to lowest authority):
-- 1. manager (full system access)
-- 2. project_manager (project-wide management)
-- 3. site_supervisor (on-site oversight) 
-- 4. foreman (crew leadership)
-- 5. worker (task execution)
```

**Example Role Policy:**
```sql
-- Workers can only update status of assigned tasks
CREATE POLICY "worker_task_status_update" ON tasks
FOR UPDATE USING (
  assigned_to = auth.uid() 
  AND 
  current_setting('request.jwt.claims', true)::json->>'role' = 'worker'
) 
WITH CHECK (
  OLD.assigned_to = NEW.assigned_to -- Cannot reassign
  AND OLD.created_by = NEW.created_by -- Cannot change creator
);
```

### 3. Supabase Client Configuration for React Native
Create type-safe client configuration with proper environment handling:

**File: `/Users/federicoostan/buildi3/Buildi3App/lib/supabase.ts`**
```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      detectSessionInUrl: false,
      persistSession: true,
      storage: {
        // Use secure storage for React Native
        getItem: (key: string) => Promise.resolve(null),
        setItem: (key: string, value: string) => Promise.resolve(),
        removeItem: (key: string) => Promise.resolve(),
      },
    },
    global: {
      headers: {
        'X-Client-Info': 'buildi3-mobile-app',
      },
    },
  }
);

// Construction-specific helper functions
export const getUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return profile?.role || 'worker';
};

export const isManager = async () => {
  const role = await getUserRole();
  return ['manager', 'project_manager'].includes(role || '');
};
```

### 4. TypeScript Type Generation and Integration
Generate and integrate database types for frontend type safety:

**File: `/Users/federicoostan/buildi3/Buildi3App/lib/database.types.ts`**
```typescript
// Generated types from Supabase CLI
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: 'manager' | 'project_manager' | 'site_supervisor' | 'foreman' | 'worker';
          trade_specialty: 'electrical' | 'plumbing' | 'carpentry' | 'masonry' | 'hvac' | 'general';
          // ... other fields
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'manager' | 'project_manager' | 'site_supervisor' | 'foreman' | 'worker';
          // ... other fields
        };
        Update: {
          email?: string;
          role?: 'manager' | 'project_manager' | 'site_supervisor' | 'foreman' | 'worker';
          // ... other fields
        };
      };
      // ... other tables
    };
  };
}
```

### 5. Development Environment Setup
Configure development branch and local environment:

**Environment Configuration:**
```bash
# Create .env.local file
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_ENVIRONMENT=development
```

**Package.json Dependencies:**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "react-native-url-polyfill": "^2.0.0"
  }
}
```

## Success Validation

### Binary Test Cases:
- [ ] **Security Test**: All 4 tables have proper RLS policies - verify with `SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('activity_log', 'messages', 'tool_assignments', 'task_tools')`
- [ ] **Auth Test**: User can login and access role-appropriate data only
- [ ] **Type Safety Test**: TypeScript compilation succeeds with no database-related type errors
- [ ] **Connection Test**: Frontend can fetch user profile and projects without errors
- [ ] **Role Test**: Manager can see all projects, worker can only see assigned tasks
- [ ] **Performance Test**: Initial data load completes within 3 seconds on mobile device

## Code Context

### Existing Database Schema:
```sql
-- Current tables with existing RLS:
profiles (7 rows, RLS enabled with policies)
projects (1 row, RLS enabled with policies)  
tasks (0 rows, RLS enabled with policies)
project_members (0 rows, RLS enabled with policies)

-- Tables missing proper RLS policies:
activity_log (0 rows, RLS enabled but insufficient policies)
messages (0 rows, RLS enabled but insufficient policies)
tool_assignments (0 rows, RLS enabled but insufficient policies) 
task_tools (0 rows, RLS enabled but insufficient policies)
```

### React Native App Structure:
```
Buildi3App/
├── app/                     # Expo Router screens
│   ├── (tabs)/             # Tab-based navigation
│   ├── login.tsx           # Authentication screen
│   └── welcome.tsx         # Welcome screen
├── components/ui/          # Design system components
├── theme/                  # Design tokens and styling
└── assets/                 # Static assets
```

## Anti-Requirements

### What NOT to Build:
- Will NOT implement custom authentication (use Supabase Auth)
- Does NOT include real-time subscriptions (Phase 2 feature)
- Will NOT create custom database backup solution
- Does NOT include file upload functionality (existing screens only)
- Excludes payment processing or billing features
- Will NOT implement push notifications (Phase 2)
- Does NOT include offline data synchronization

## Implementation Notes

### Common Pitfalls:
1. **RLS Policy Ordering**: Policies are evaluated with OR logic - ensure specific restrictions come before broad permissions
2. **Role Enum Updates**: Use `ADD VALUE IF NOT EXISTS` to prevent migration failures
3. **Environment Variables**: React Native requires EXPO_PUBLIC_ prefix for client-side access
4. **Type Generation**: Run after all schema changes are complete to avoid incomplete types

### Fallback Approaches:
- If RLS policies are too restrictive, temporarily use `authenticated` role for debugging
- If type generation fails, use partial types and expand incrementally
- If client connection fails, verify CORS settings in Supabase dashboard

### Error Handling Patterns:
```typescript
try {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Database error:', error.message);
    // Handle specific error types
    if (error.code === 'PGRST116') {
      // No rows returned - user not found
    }
    return null;
  }
  
  return data;
} catch (err) {
  console.error('Unexpected error:', err);
  return null;
}
```

### Migration Execution Order:
1. Fix function security warnings first
2. Add new role values to enums  
3. Create/update RLS policies
4. Test with different user roles
5. Generate TypeScript types
6. Update frontend client configuration
7. Test end-to-end authentication flow

### Performance Considerations:
- Use `select('*')` sparingly - specify needed columns
- Implement pagination for list views (20 items per page)
- Cache user role in app state to avoid repeated queries
- Use database indexes for frequently queried fields (already exist)

---

**Implementation Time Estimate**: 8-12 hours for solo developer
**Priority**: CRITICAL - Security fixes must be completed before MVP testing
**Testing Requirements**: Must work without bugs on both iOS and Android
**Success Criteria**: Authenticated users can access role-appropriate data with no security vulnerabilities