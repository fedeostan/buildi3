# Epic 4: Task Database Integration - Complete Backend-to-Frontend Connection

## Context Package

- **Previous PRD**: [Epic 1 Implementation Complete](../context/epic1-implementation-complete.md)
- **Dependencies**: 
  - ✅ Epic 1: Database foundation complete with task schema and security
  - ✅ Task components implemented: TaskItem, TaskSection, TaskRow, NextTaskWidget, UpcomingTaskWidget  
  - ✅ useTasks hook implemented with full CRUD operations
  - ✅ Task detail screen navigation implemented
- **Research Docs**: 
  - Component reuse analysis from MASTER_LESSONS.md
  - Existing patterns from useProjects hook implementation
  - **NEW**: Construction domain expert analysis - expanded task stages and priority logic
  - **NEW**: Mobile architecture patterns for offline construction site usage
  - **NEW**: Data architecture strategy for state synchronization and performance
  - Task schema with enhanced stage management (see Architecture Enhancements section)
- **Related Components**: 
  - `/Buildi3App/hooks/useTasks.ts` - Complete task data layer
  - `/Buildi3App/components/ui/TaskSection/` - Task organization by stage
  - `/Buildi3App/app/task-detail.tsx` - Task detail view
  - `/Buildi3App/app/(tabs)/tasks.tsx` - Main tasks screen
  - `/Buildi3App/app/(tabs)/home.tsx` - Home screen widgets

## Single Objective

**Replace all mock task data with live Supabase database connections across home and tasks screens, enabling construction-optimized task lifecycle management with real-time updates, offline resilience, and mobile-optimized navigation patterns for field workers.**

## Implementation Requirements

### 1. Home Screen Task Widget Integration
**File**: `/Users/federicoostan/buildi3/Buildi3App/app/(tabs)/home.tsx`

Replace mock task data with real database connections:
```typescript
// Current mock implementation (lines 174-201)
<UpcomingTaskWidget
  tasks={[
    {
      id: "task-1",
      title: "Review architectural plans and blueprints",
      // ... mock data
    }
  ]}
/>

// Required implementation with construction-optimized data fetching
const { tasks: allTasks, loading: tasksLoading, error: tasksError } = useTasks({
  includeCompleted: false,
  orderBy: 'due_date',
  orderDirection: 'asc',
  staleTime: 5 * 60 * 1000, // 5 min cache for construction sites
  cacheTime: 30 * 60 * 1000 // 30 min offline support
});

// Construction-optimized task filtering with memoization
const upcomingTasks = useMemo(() => {
  if (!allTasks?.length) return [];
  
  return allTasks
    .filter(task => task.stage !== 'completed' && task.stage !== 'blocked')
    .sort((a, b) => {
      // Construction-specific priority logic
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const dateOrder = new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0) || dateOrder;
    })
    .slice(0, 5); // Increased from 3 to 5 for construction workflows
}, [allTasks]);

// Mobile-optimized navigation (ID-only)
const navigateToTask = useCallback((taskId: string) => {
  router.push({
    pathname: '/task-detail/[id]',
    params: { id: taskId }
  });
}, [router]);

<UpcomingTaskWidget
  tasks={upcomingTasks}
  loading={tasksLoading}
  error={tasksError}
  onTaskPress={(task) => navigateToTask(task.id)}
  showOfflineIndicator={!isOnline && upcomingTasks.length > 0}
/>
```

**Counter-example**: Do NOT create new hooks or data fetching logic - use existing `useTasks` hook

### 2. NextTaskWidget Real Data Integration
**File**: `/Users/federicoostan/buildi3/Buildi3App/app/(tabs)/home.tsx`

Connect NextTaskWidget to prioritized task data:
```typescript
// Current mock implementation (lines 135-146)  
<NextTaskWidget
  hasTask={true}
  task={{
    id: "task-1",
    title: "Review architectural plans and blueprints",
    // ... mock data
  }}
/>

// Construction-optimized next task calculation
const nextTask = useMemo(() => {
  if (!upcomingTasks?.length) return null;
  
  const activeTasks = upcomingTasks.filter(task => 
    task.stage !== 'completed' && 
    task.stage !== 'blocked' &&
    task.stage !== 'materials-pending' // Skip tasks waiting for materials
  );
  
  if (!activeTasks.length) return null;
  
  return activeTasks
    .sort((a, b) => {
      // 1. Safety-critical tasks first
      if (a.priority === 'critical' && b.priority !== 'critical') return -1;
      if (b.priority === 'critical' && a.priority !== 'critical') return 1;
      
      // 2. Weather-dependent tasks on good weather days
      if (a.weather_dependent && !b.weather_dependent && isGoodWeather) return -1;
      if (b.weather_dependent && !a.weather_dependent && isGoodWeather) return 1;
      
      // 3. Tasks with approaching inspections
      if (a.inspection_due && !b.inspection_due) return -1;
      if (b.inspection_due && !a.inspection_due) return 1;
      
      // 4. Traditional priority and due date
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      const dateOrder = new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
      return dateOrder;
    })[0];
}, [upcomingTasks, isGoodWeather]);

<NextTaskWidget
  hasTask={!!nextTask}
  task={nextTask}
  onViewTask={() => nextTask && navigateToTask(nextTask.id)}
  showWeatherContext={nextTask?.weather_dependent}
  showMaterialStatus={nextTask?.materials_status}
/>
```

### 3. Task Detail Screen Real Data Integration  
**File**: `/Users/federicoostan/buildi3/Buildi3App/app/task-detail.tsx`

Replace route parameter parsing with ID-based database queries:
```typescript
// Mobile-optimized navigation (ID-only parameters)
const params = useLocalSearchParams<{ id: string }>();

// Fetch fresh data using task ID
const { task, loading, error, refreshTask } = useTask(params.id);
const { updateTask, updateTaskStage } = useTasks();

// Optimistic updates for better mobile UX
const [optimisticUpdates, setOptimisticUpdates] = useState<Partial<Task>>({});
const displayTask = { ...task, ...optimisticUpdates };

// Construction-aware stage transitions
const allowedTransitions = useMemo(() => {
  if (!task) return [];
  
  const transitions: Record<TaskStage, TaskStage[]> = {
    'not-started': ['materials-pending', 'crew-assigned', 'blocked'],
    'materials-pending': ['crew-assigned', 'weather-hold'],
    'crew-assigned': ['in-progress'],
    'in-progress': ['inspection-required', 'completed', 'weather-hold'],
    'inspection-required': ['completed', 'blocked'],
    'weather-hold': ['crew-assigned', 'in-progress'],
    'completed': [], // Terminal state
    'blocked': ['not-started'] // Can restart
  };
  
  return transitions[task.stage] || [];
}, [task?.stage]);

// Optimistic update with rollback on error
const handleUpdateTask = async (updates: Partial<Task>) => {
  if (!task) return;
  
  // Optimistic update
  setOptimisticUpdates(prev => ({ ...prev, ...updates }));
  
  try {
    const { error } = await updateTask(task.id, updates);
    if (error) throw error;
    
    // Clear optimistic updates on success
    setOptimisticUpdates({});
  } catch (error) {
    // Rollback optimistic updates
    setOptimisticUpdates({});
    Alert.alert('Update Failed', error.message);
  }
};

// Construction-aware stage change handling
const handleStageChange = async (newStage: TaskStage) => {
  if (!allowedTransitions.includes(newStage)) {
    Alert.alert('Invalid Transition', `Cannot change from ${task.stage} to ${newStage}`);
    return;
  }
  
  await handleUpdateTask({ stage: newStage });
};
```

### 4. Tasks Screen Real Data Verification
**File**: `/Users/federicoostan/buildi3/Buildi3App/app/(tabs)/tasks.tsx`

Verify existing real data integration is working correctly:
- ✅ Already uses `useTasks` hook (lines 30-41)
- ✅ Already implements task stage updates (lines 110-120) 
- ✅ Already handles task navigation (lines 128-141)

**Required verification**: Test drag-and-drop functionality works with database updates
```typescript
// Existing implementation should work (lines 154-159)
const handleTaskDrop = (draggedTask: TaskDragPayload, targetStage: TaskStage) => {
  handleTaskStageChange(draggedTask.id, targetStage);
};
```

### 5. Construction Site Error Handling and Loading States

Add construction-optimized error handling and offline support:
```typescript
// Mobile-optimized loading states for construction sites
const TaskLoadingSkeleton = () => (
  <View style={styles.skeletonContainer}>
    {/* Larger skeleton items for gloved hands */}
    {[1, 2, 3, 4, 5].map(i => (
      <View key={i} style={[styles.skeletonItem, { height: 60 }]} />
    ))}
  </View>
);

// Construction site appropriate error states
const TaskErrorState = ({ error, onRetry, cachedDataCount }) => {
  const isNetworkError = error?.message?.includes('network') || error?.message?.includes('fetch');
  
  return (
    <View style={styles.errorContainer}>
      <Icon name="alert-triangle" size="lg" color="warning" />
      <Typography variant="h6" style={styles.errorTitle}>
        {isNetworkError ? 'Connection Issue' : 'Data Error'}
      </Typography>
      <Typography variant="bodyMedium" style={styles.errorMessage}>
        {isNetworkError 
          ? `Can't sync with server. Working offline with ${cachedDataCount} cached tasks.`
          : error?.message || 'Something went wrong loading task data.'
        }
      </Typography>
      
      <Button 
        title={isNetworkError ? "Try Again" : "Retry"}
        onPress={onRetry}
        style={styles.largeRetryButton} // Larger for construction site use
        variant="primary"
      />
      
      {isNetworkError && (
        <Typography variant="bodySmall" style={styles.offlineHint}>
          Changes will sync when connection returns
        </Typography>
      )}
    </View>
  );
};

// App state aware real-time subscriptions for battery optimization
const useConstructionTaskSubscriptions = () => {
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active');
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setIsAppActive(nextAppState === 'active');
    });
    
    return () => subscription?.remove();
  }, []);
  
  // Disconnect real-time subscriptions when backgrounded to save battery
  return isAppActive;
};
```

### 6. Mobile-Optimized Navigation Architecture

Implement ID-based navigation for better performance and deep linking:
```typescript
// Mobile-first navigation pattern (ID-only)
const navigateToTaskDetail = useCallback((taskId: string) => {
  router.push({
    pathname: '/task-detail/[id]',
    params: { id: taskId }
  });
}, [router]);

// Deep linking support for construction site QR codes
// Format: buildi3://task-detail/[uuid]
const handleDeepLink = useCallback((url: string) => {
  const taskId = url.split('/').pop();
  if (taskId && isValidUUID(taskId)) {
    navigateToTaskDetail(taskId);
  } else {
    Alert.alert('Invalid Link', 'This task link is not valid or expired.');
    router.push('/tasks');
  }
}, [navigateToTaskDetail, router]);

// Pre-cache task data for offline access (construction sites)
const preCacheTaskForOffline = useCallback(async (taskId: string) => {
  try {
    await queryClient.prefetchQuery({
      queryKey: ['task', taskId],
      queryFn: () => fetchTask(taskId),
      staleTime: 30 * 60 * 1000, // 30 minutes cache
    });
  } catch (error) {
    console.warn('Failed to pre-cache task:', error);
  }
}, [queryClient]);

// Enhanced navigation with pre-caching
const navigateWithPreCache = useCallback(async (taskId: string) => {
  // Start navigation immediately
  navigateToTaskDetail(taskId);
  
  // Pre-cache in background for offline access
  await preCacheTaskForOffline(taskId);
}, [navigateToTaskDetail, preCacheTaskForOffline]);
```

## Architecture Enhancements (Based on Expert Analysis)

### Construction-Optimized Task Stages
Expanded from basic 4 stages to construction-realistic 8 stages:
```typescript
export type TaskStage = 
  | "not-started"           // Ready to begin
  | "materials-pending"     // Waiting for material delivery
  | "crew-assigned"         // Crew assigned, ready to work
  | "in-progress"          // Active work in progress
  | "inspection-required"   // Work complete, awaiting inspection
  | "weather-hold"         // Weather-dependent task delayed
  | "completed"            // Work finished and approved
  | "blocked";             // Cannot proceed due to dependencies
```

### Enhanced Priority Logic
Construction-specific factors now influence task prioritization:
1. **Safety-critical tasks** (priority: critical) always first
2. **Weather-dependent tasks** prioritized during good weather
3. **Inspection deadlines** boost priority for approaching due dates
4. **Material availability** affects task readiness
5. **Crew coordination** ensures assigned workers can proceed

### Mobile Performance Optimizations
- **ID-only navigation** reduces route parameter overhead
- **Memoized filtering** prevents unnecessary re-calculations
- **App-state aware subscriptions** conserve battery when backgrounded
- **Optimistic updates** provide immediate UI feedback
- **Strategic caching** supports offline construction site work

### Offline-First Construction Support
- **30-minute cache** for typical construction site connectivity issues
- **Offline queue** for task updates made without connection
- **Visual offline indicators** inform users of sync status
- **Pre-caching strategy** based on project context and worker assignments

## Success Validation

### Binary Test Cases

**✅ Home Screen Integration**:
- [ ] NextTaskWidget shows construction-prioritized task (safety > weather > inspection > priority)
- [ ] UpcomingTaskWidget displays real upcoming tasks (max 5 for construction workflows)
- [ ] Tapping task widgets navigates via ID-only parameters
- [ ] Loading states show construction-appropriate skeletons (larger touch targets)
- [ ] Empty states handle no tasks gracefully with offline context
- [ ] Weather-dependent tasks show weather context when applicable
- [ ] Materials-pending tasks display material status indicators

**✅ Task Detail Integration**:
- [ ] Task detail loads fresh data via ID-only navigation
- [ ] Optimistic updates provide immediate feedback before server confirmation
- [ ] Construction-aware stage transitions prevent invalid workflow changes
- [ ] Task metadata includes construction-specific fields (weather, materials, crew)
- [ ] Error states handle invalid task IDs with graceful fallback to tasks list
- [ ] Offline editing queues changes for sync when connection returns
- [ ] Stage transition validation enforces construction workflow logic

**✅ Navigation Flow**:
- [ ] Home → Task Detail → Back maintains proper navigation stack
- [ ] Tasks → Task Detail → Back returns to tasks screen with preserved state
- [ ] All task navigation uses ID-only parameters for performance
- [ ] Deep linking supports construction site QR code scanning
- [ ] Invalid task ID links redirect gracefully with user-friendly errors
- [ ] Pre-caching enables offline task detail access

**✅ Real-time Updates & Offline Resilience**:
- [ ] Task changes propagate across all views via React Query invalidation
- [ ] Drag-and-drop stage changes respect construction workflow transitions
- [ ] Optimistic updates work offline with sync queue for reconnection
- [ ] Real-time subscriptions pause when app backgrounded (battery optimization)
- [ ] Multi-user updates show appropriate conflict resolution for simultaneous edits
- [ ] Push notifications for safety-critical events (inspection required, blocked tasks)

**✅ Construction Site Error Resilience**:
- [ ] Network errors show offline mode with cached task count
- [ ] Invalid task IDs redirect to tasks list with clear explanation
- [ ] Poor connectivity scenarios gracefully degrade to offline mode
- [ ] Large touch targets and high contrast for outdoor/gloved use
- [ ] Battery-optimized real-time subscriptions for all-day field use
- [ ] Critical safety information always available offline

## Code Context

### Existing Database Schema
```sql
-- Tasks table (Epic 1 complete)
tasks (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  stage text DEFAULT 'not-started', -- 'not-started' | 'in-progress' | 'completed' | 'blocked' 
  status text DEFAULT 'todo',        -- For backward compatibility
  priority text DEFAULT 'medium',   -- 'low' | 'medium' | 'high' | 'critical'
  due_date date,
  project_id uuid REFERENCES projects(id),
  assigned_to uuid REFERENCES profiles(id),
  created_by uuid NOT NULL REFERENCES profiles(id),
  -- ... additional construction-specific fields
);
```

### Enhanced useTasks Hook Interface
```typescript
// Enhanced with construction-specific options
const {
  tasks,                    // Task[] - All tasks for user
  loading,                  // boolean - Loading state  
  error,                    // string | null - Error message
  createTask,               // (data) => Promise<{task, error}>
  updateTask,               // (id, updates) => Promise<{task, error}>
  updateTaskStage,          // (id, stage) => Promise<{task, error}>
  deleteTask,               // (id) => Promise<{error}>
  getTasksForUI,            // () => TaskRowProps[] - UI formatted
  getTasksByStage,          // () => Record<TaskStage, TaskRowProps[]>
  refreshTasks,             // () => void - Manual refresh
  
  // NEW: Construction-specific enhancements
  getTasksForConstruction,  // (weather?, crew?, materials?) => Task[]
  getNextTaskForWorker,     // () => Task | null - Construction-prioritized
  queueOfflineUpdate,       // (taskId, update) => void - Offline support
  syncOfflineChanges,       // () => Promise<void> - Reconnection sync
} = useTasks({
  // Enhanced options
  includeCompleted?: boolean;
  orderBy?: 'due_date' | 'priority' | 'stage';
  orderDirection?: 'asc' | 'desc';
  
  // NEW: Construction context options
  weatherConditions?: 'good' | 'poor' | 'extreme';
  crewAvailability?: boolean;
  materialStatus?: 'available' | 'pending' | 'unavailable';
  
  // NEW: Mobile optimization options
  staleTime?: number;       // Cache duration (default: 5 min)
  cacheTime?: number;       // Offline cache (default: 30 min)
  enableOfflineQueue?: boolean; // Queue updates when offline
});
```

### Component Interfaces
```typescript
// TaskItem expects
interface TaskItemProps {
  task: {
    id: string;
    title: string;
    dueDate: Date | string | null;
    isCompleted?: boolean;
    stage?: string;
  };
  onTaskPress?: (task) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

// NextTaskWidget expects  
interface NextTaskWidgetProps {
  hasTask: boolean;
  task?: NextTask;
  onViewTask?: () => void;
}
```

## Anti-Requirements

### Will NOT Include
- **New hooks or data fetching logic** - Enhance existing `useTasks` hook only
- **Major database schema changes** - Add construction fields via migration if needed
- **New component creation** - Extend existing components with new props only
- **Task creation flow** - Reserved for Epic 5 (Add Task Flow)
- **Advanced task features** - Subtasks, dependencies, attachments remain mock for now
- **Complete offline redesign** - Enhance existing React Query patterns only

### Scope Boundaries
- **Focus**: Connect existing components to existing database via existing hooks
- **Limit**: Home and Tasks screen integration only
- **Exclude**: New features, new components, new database changes
- **Defer**: Task creation/editing flows (Epic 5), advanced task management features

## Implementation Notes

### Common Pitfalls
1. **Props Interface Mismatch**: Ensure Task interface from database matches component expectations exactly
2. **Navigation Parameter Format**: Use consistent string serialization for route params (dates as ISO strings, booleans as strings)  
3. **Loading State Management**: Handle loading states for all async operations to prevent blank screens
4. **Error Boundary**: Network failures should not crash the app - provide retry mechanisms

### Fallback Strategies
- **No Tasks State**: Show appropriate empty states with actions to create tasks
- **Network Errors**: Cache last known good state and show "offline" indicators
- **Invalid Task IDs**: Redirect to tasks list with user-friendly error message
- **Permission Errors**: Handle cases where user cannot access specific tasks

### Construction Site Performance Considerations
- **Debounced updates**: Task editing debounces saves (300ms) for poor connectivity
- **Strategic pagination**: UpcomingTaskWidget shows 5 tasks (increased for construction workflows)
- **Memoization**: All filtering and sorting operations memoized for large task datasets
- **Battery optimization**: Real-time subscriptions pause when app backgrounded
- **Offline caching**: 30-minute cache duration for typical construction site connectivity
- **Optimistic updates**: Immediate UI feedback with server sync in background
- **Touch targets**: Larger buttons/touch areas for gloved hands outdoor use

---

**Implementation Priority**: High - This epic completes core MVP with construction-industry optimizations based on domain expert analysis.

**Complexity**: Medium-High - Data integration plus construction-specific enhancements and mobile optimization patterns.

**Risk Level**: Low-Medium - Core infrastructure proven, construction enhancements are additive and use established patterns.

**Expert Analysis Integration**: This plan incorporates feedback from construction domain expert (workflow realism), data architecture agent (performance and state management), and mobile app architect (React Native optimization and offline patterns).