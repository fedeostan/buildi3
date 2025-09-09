import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase/client";
import { Tables, Task, TaskStage, TypeConverters } from "../lib/supabase/types";
import { TaskRowProps } from "../components/ui/TaskRow/types";
import { useAuth } from "./useAuth";
import {
  constructionTaskEngine,
  WorkerContext,
  TaskPrediction,
} from "../lib/ai/constructionTaskEngine";

// Database task type for internal use
type DbTask = Tables<"tasks">;

interface UseTasksOptions {
  projectId?: string;
  assignedTo?: string;
  stage?: string;
  includeCompleted?: boolean;
  orderBy?: "title" | "due_date" | "created_at" | "priority";
  orderDirection?: "asc" | "desc";

  // Construction-specific AI options
  weatherConditions?: "good" | "poor" | "extreme";
  crewAvailability?: boolean;
  materialStatus?: "available" | "pending" | "unavailable";

  // Mobile optimization options
  staleTime?: number; // Cache duration (default: 5 min)
  cacheTime?: number; // Offline cache (default: 30 min)
  enableOfflineQueue?: boolean; // Queue updates when offline
}

export const useTasks = (options: UseTasksOptions = {}) => {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    projectId,
    assignedTo,
    stage,
    includeCompleted = true,
    orderBy = "due_date",
    orderDirection = "asc",
  } = options;

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    fetchTasks();

    // Set up real-time subscription for task changes
    const subscription = supabase
      .channel("tasks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: projectId ? `project_id=eq.${projectId}` : undefined,
        },
        (payload) => {
          handleTaskChange(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [
    user,
    projectId,
    assignedTo,
    stage,
    includeCompleted,
    orderBy,
    orderDirection,
  ]);

  const fetchTasks = async (background: boolean = false) => {
    try {
      if (!background) setLoading(true);
      setError(null);

      let query = supabase.from("tasks").select(`
          *,
          project:projects(name),
          assigned_user:profiles!tasks_assigned_to_fkey(first_name, last_name),
          created_user:profiles!tasks_created_by_fkey(first_name, last_name)
        `);

      // Apply filters based on user role and options
      if (profile?.role === "worker") {
        // Workers only see tasks assigned to them
        query = query.eq("assigned_to", user!.id);
      } else if (profile?.role === "foreman") {
        // Foremen see tasks assigned to them or created by them
        query = query.or(
          `assigned_to.eq.${user!.id},created_by.eq.${user!.id}`
        );
      }
      // Managers and supervisors see all tasks (filtered by project if specified)

      // Apply additional filters
      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      if (assignedTo) {
        query = query.eq("assigned_to", assignedTo);
      }

      if (stage) {
        query = query.eq("stage", stage);
      }

      if (!includeCompleted) {
        query = query.neq("stage", "completed");
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === "asc" });

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      // Convert database tasks to frontend tasks
      const frontendTasks = data.map((dbTask) =>
        TypeConverters.taskFromDatabase(dbTask)
      );
      setTasks(frontendTasks);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      setError(err.message || "Failed to fetch tasks");
    } finally {
      if (!background) setLoading(false);
    }
  };

  const handleTaskChange = (payload: any) => {
    const { eventType, new: newTask, old: oldTask } = payload;

    switch (eventType) {
      case "INSERT":
        const newFrontendTask = TypeConverters.taskFromDatabase(newTask);
        setTasks((prev) => [newFrontendTask, ...prev]);
        break;
      case "UPDATE":
        const updatedFrontendTask = TypeConverters.taskFromDatabase(newTask);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === newTask.id ? updatedFrontendTask : task
          )
        );
        break;
      case "DELETE":
        setTasks((prev) => prev.filter((task) => task.id !== oldTask.id));
        break;
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    project_id?: string;
    assigned_to?: string;
    due_date?: string;
    priority?: string;
    trade_required?: string;
    weather_dependent?: boolean;
    estimated_hours?: number;
  }) => {
    if (!user) {
      throw new Error("User must be authenticated to create tasks");
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          created_by: user.id,
          stage: "not-started",
          status: "todo", // For backward compatibility
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: user.id,
        activity_type: "task_created",
        description: `Created task: ${taskData.title}`,
        related_task_id: data.id,
        related_project_id: taskData.project_id,
      });

      return { task: TypeConverters.taskFromDatabase(data), error: null };
    } catch (err: any) {
      console.error("Error creating task:", err);
      return { task: null, error: err.message || "Failed to create task" };
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    console.log(
      `🔄 updateTask called: taskId=${taskId}, updates=`,
      JSON.stringify(updates, null, 2)
    );

    if (!user) {
      console.error("❌ updateTask failed: User not authenticated");
      return { task: null, error: "User not authenticated" };
    }

    try {
      // Update status for backward compatibility
      if (updates.stage) {
        const statusMapping: { [key: string]: string } = {
          "not-started": "todo",
          "in-progress": "in_progress",
          completed: "completed",
          blocked: "todo",
        };
        updates.status = statusMapping[updates.stage];
        console.log(
          `🔄 Stage mapping: ${updates.stage} -> status: ${updates.status}`
        );
      }

      console.log(`🔄 Executing Supabase update for task ${taskId}...`);
      const { data, error } = await supabase
        .from("tasks")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .select()
        .single();

      if (error) {
        console.error(`❌ Supabase update failed for task ${taskId}:`, error);
        throw error;
      }

      console.log(`✅ Supabase update successful for task ${taskId}:`, data);

      // Log activity for significant updates
      if (updates.stage || updates.assigned_to) {
        const activityType = updates.stage
          ? "task_status_updated"
          : "task_assigned";
        const description = updates.stage
          ? `Task status changed to ${updates.stage}`
          : "Task assignment updated";

        console.log(`🔄 Creating activity log entry...`);
        await supabase.from("activity_log").insert({
          user_id: user!.id,
          activity_type: activityType,
          description,
          related_task_id: taskId,
          related_project_id: data.project_id,
        });
        console.log(`✅ Activity log entry created`);
      }

      const result = {
        task: TypeConverters.taskFromDatabase(data),
        error: null,
      };
      console.log(`✅ updateTask completed successfully:`, result);
      return result;
    } catch (err: any) {
      console.error(`❌ updateTask failed for task ${taskId}:`, err);
      return { task: null, error: err.message || "Failed to update task" };
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (err: any) {
      console.error("Error deleting task:", err);
      return { error: err.message || "Failed to delete task" };
    }
  };

  const assignTask = async (taskId: string, userId: string) => {
    return updateTask(taskId, { assigned_to: userId });
  };

  const updateTaskStage = async (taskId: string, newStage: TaskStage) => {
    console.log(
      `🔄 updateTaskStage called: taskId=${taskId}, newStage=${newStage}`
    );

    // Use optimistic updates for immediate UI feedback during drag & drop
    // This provides instant visual feedback while the database update happens in background
    // If the server update fails, the UI will automatically roll back to the original state
    const result = await updateTaskWithAI(taskId, { stage: newStage }, true);
    console.log(`🔄 updateTaskStage result:`, result);
    return result;
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  const refreshTasksSoft = () => {
    fetchTasks(true);
  };

  // Convert unified tasks to TaskRowProps format for UI components
  const getTasksForUI = (): TaskRowProps[] => {
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      projectName: (task as any).project?.name || "No Project",
      dueDate:
        typeof task.dueDate === "string"
          ? new Date(task.dueDate)
          : task.dueDate || new Date(),
      stage: (task.stage as TaskStage) || "not-started",
      isCompleted: task.isCompleted || false,
    }));
  };

  // Group tasks by stage for TaskSection component
  const getTasksByStage = () => {
    const tasksByStage: Record<TaskStage, TaskRowProps[]> = {
      "not-started": [],
      "in-progress": [],
      completed: [],
      blocked: [],
    };

    const uiTasks = getTasksForUI();

    uiTasks.forEach((task) => {
      if (task.stage && tasksByStage[task.stage]) {
        tasksByStage[task.stage].push(task);
      }
    });

    return tasksByStage;
  };

  // AI-enhanced methods that work with existing data
  const getWorkerContext = useCallback((): WorkerContext => {
    const {
      weatherConditions = "good",
      crewAvailability = true,
      materialStatus = "available",
    } = options;

    return {
      weather: weatherConditions,
      crew: {
        available: crewAvailability,
        skills: profile?.trade_specialty
          ? [profile.trade_specialty]
          : ["general"],
      },
      materials: {
        available:
          materialStatus === "available" ? ["concrete", "steel", "lumber"] : [],
        pending: materialStatus === "pending" ? ["concrete", "steel"] : [],
      },
      safetyLevel: "normal",
      timeOfDay: new Date().getHours(),
    };
  }, [options, profile]);

  const getAIPrioritizedTasks = useCallback(
    async (context?: WorkerContext): Promise<Task[]> => {
      if (!tasks?.length) return [];

      try {
        const workerContext = context || getWorkerContext();
        return await constructionTaskEngine.prioritizeTasks(
          tasks,
          workerContext
        );
      } catch (error) {
        console.warn(
          "🤖 AI prioritization failed, using original order:",
          error
        );
        // Fallback to existing sorting logic
        return [...tasks].sort((a, b) => {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          const priorityDiff =
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
          if (priorityDiff !== 0) return priorityDiff;

          if (a.dueDate && b.dueDate) {
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          }
          return 0;
        });
      }
    },
    [tasks, getWorkerContext]
  );

  const getNextTaskForWorker = useCallback(
    async (context?: WorkerContext): Promise<Task | null> => {
      if (!tasks?.length) return null;

      try {
        const workerContext = context || getWorkerContext();
        return await constructionTaskEngine.getNextTask(tasks, workerContext);
      } catch (error) {
        console.warn(
          "🤖 AI next task selection failed, using fallback:",
          error
        );
        // Fallback to first non-completed task
        return (
          tasks.find(
            (task) => task.stage !== "completed" && task.stage !== "blocked"
          ) || null
        );
      }
    },
    [tasks, getWorkerContext]
  );

  const predictTaskLifecycle = useCallback(
    async (
      taskId: string,
      context?: WorkerContext
    ): Promise<TaskPrediction | null> => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return null;

      try {
        const workerContext = context || getWorkerContext();
        return await constructionTaskEngine.predictTaskLifecycle(
          task,
          workerContext
        );
      } catch (error) {
        console.warn("🤖 AI lifecycle prediction failed:", error);
        // Return basic prediction
        const now = new Date();
        const daysToComplete = Math.ceil((task.estimated_hours || 8) / 8);
        const predictedCompletion = new Date(
          now.getTime() + daysToComplete * 24 * 60 * 60 * 1000
        );

        return {
          predictedCompletion,
          riskFactors: task.weather_dependent ? ["Weather dependent"] : [],
          recommendedActions: [],
          confidenceScore: 0.5,
          bottleneckLikelihood: 0.2,
        };
      }
    },
    [tasks, getWorkerContext]
  );

  const getConstructionFilteredTasks = useCallback(
    (weather?: string, crew?: boolean, materials?: string): Task[] => {
      if (!tasks?.length) return [];

      return tasks.filter((task) => {
        // Filter by weather conditions
        if (weather === "poor" && task.weather_dependent) return false;

        // Filter by crew availability
        if (
          crew === false &&
          task.trade_required &&
          task.trade_required !== "general"
        )
          return false;

        // Filter by material status
        if (materials === "unavailable" && task.materials_needed) {
          const needed = Array.isArray(task.materials_needed)
            ? task.materials_needed
            : [];
          if (needed.length > 0) return false;
        }

        return true;
      });
    },
    [tasks]
  );

  // Memoized AI-enhanced task computations for performance
  const upcomingTasks = useMemo(() => {
    if (!tasks?.length) return [];

    return tasks
      .filter((task) => task.stage !== "completed" && task.stage !== "blocked")
      .sort((a, b) => {
        // Construction-specific priority logic
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff =
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        if (priorityDiff !== 0) return priorityDiff;

        const dateOrder =
          new Date(a.dueDate || "").getTime() -
          new Date(b.dueDate || "").getTime();
        return dateOrder;
      })
      .slice(0, 5); // Increased from 3 to 5 for construction workflows
  }, [tasks]);

  // Offline task updates queue (for future implementation)
  const [offlineQueue] = useState<
    Array<{ taskId: string; update: Partial<Task> }>
  >([]);

  const queueOfflineUpdate = useCallback(
    (taskId: string, update: Partial<Task>) => {
      if (options.enableOfflineQueue) {
        offlineQueue.push({ taskId, update });
        console.log("🔄 Queued offline update:", taskId, update);
      }
    },
    [options.enableOfflineQueue, offlineQueue]
  );

  const syncOfflineChanges = useCallback(async () => {
    if (offlineQueue.length === 0) return;

    console.log("🔄 Syncing", offlineQueue.length, "offline changes...");

    for (const { taskId, update } of offlineQueue) {
      try {
        await updateTask(taskId, update);
      } catch (error) {
        console.error("Failed to sync offline update:", taskId, error);
      }
    }

    // Clear queue after sync
    offlineQueue.length = 0;
  }, [offlineQueue, updateTask]);

  // Enhanced task update with optimistic UI and conflict resolution
  const updateTaskWithAI = useCallback(
    async (taskId: string, updates: Partial<Task>, optimistic = true) => {
      console.log(
        `🔄 updateTaskWithAI called: taskId=${taskId}, optimistic=${optimistic}`,
        updates
      );

      // Store original task for potential rollback
      const originalTask = tasks.find((t) => t.id === taskId);

      // Optimistic update for immediate UI feedback
      if (optimistic && originalTask) {
        console.log(`✨ Applying optimistic update for task ${taskId}`);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        );
      }

      try {
        const result = await updateTask(taskId, updates);

        if (result.error && optimistic && originalTask) {
          console.log(
            `❌ Server update failed, rolling back optimistic update for task ${taskId}`
          );
          // Rollback optimistic update on error
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? originalTask : task))
          );
        } else if (result.task) {
          console.log(`✅ Server update successful for task ${taskId}`);
        }

        return result;
      } catch (error) {
        console.error(`❌ updateTaskWithAI failed for task ${taskId}:`, error);

        if (optimistic && originalTask) {
          console.log(`🔄 Rolling back optimistic update due to exception`);
          // Rollback optimistic update on error
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? originalTask : task))
          );
        }
        throw error;
      }
    },
    [updateTask, tasks]
  );

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskStage,
    refreshTasks,
    refreshTasksSoft,
    // UI helper methods
    getTasksForUI,
    getTasksByStage,

    // AI-enhanced methods
    getAIPrioritizedTasks,
    getNextTaskForWorker,
    predictTaskLifecycle,
    getConstructionFilteredTasks,

    // Construction-optimized computed values
    upcomingTasks,

    // Offline support methods
    queueOfflineUpdate,
    syncOfflineChanges,
    updateTaskWithAI,

    // Context helper
    getWorkerContext,
  };
};

// Hook for getting a single task by ID
export const useTask = (taskId: string | null) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      setLoading(false);
      return;
    }

    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("tasks")
        .select(
          `
          *,
          project:projects(name, icon_type, icon_color),
          assigned_user:profiles!tasks_assigned_to_fkey(first_name, last_name, trade_specialty),
          created_user:profiles!tasks_created_by_fkey(first_name, last_name)
        `
        )
        .eq("id", taskId)
        .single();

      if (queryError) {
        throw queryError;
      }

      setTask(TypeConverters.taskFromDatabase(data));
    } catch (err: any) {
      console.error("Error fetching task:", err);
      setError(err.message || "Failed to fetch task");
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshTask = () => {
    fetchTask();
  };

  return {
    task,
    loading,
    error,
    refreshTask,
  };
};
