import { Task, TaskStage, TaskPriority } from "../supabase/types";

export interface WorkerContext {
  weather?: "good" | "poor" | "extreme";
  crew?: { available: boolean; skills: string[] };
  materials?: { available: string[]; pending: string[] };
  safetyLevel?: "normal" | "elevated" | "critical";
  timeOfDay?: number; // 0-23 hours
  currentLocation?: string;
  equipmentAvailable?: string[];
}

export interface TaskPrediction {
  predictedCompletion: Date;
  riskFactors: string[];
  recommendedActions: string[];
  confidenceScore: number;
  bottleneckLikelihood: number;
}

export interface AIDecision {
  decision: any;
  reasoning: string;
  confidence: number;
  fallbackUsed: boolean;
  timestamp: Date;
}

export interface ConflictResolution {
  resolvedTask: Partial<Task>;
  reasoning: string;
  confidence: number;
  requiresManualReview: boolean;
}

/**
 * Rule-based task engine for fallback when AI services are unavailable
 * Implements construction industry best practices
 */
class RuleBasedTaskEngine {
  prioritizeTasks(tasks: Task[], context: WorkerContext): Task[] {
    return [...tasks].sort((a, b) => {
      // 1. Safety-critical tasks first (absolute priority)
      if (a.priority === "critical" && b.priority !== "critical") return -1;
      if (b.priority === "critical" && a.priority !== "critical") return 1;

      // 2. Weather-dependent tasks during good weather
      if (context.weather === "good") {
        if (a.weather_dependent && !b.weather_dependent) return -1;
        if (b.weather_dependent && !a.weather_dependent) return 1;
      }

      // 3. Tasks requiring inspection (time-sensitive)
      if (a.inspection_required && !b.inspection_required) return -1;
      if (b.inspection_required && !a.inspection_required) return 1;

      // 4. Standard priority order
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff =
        (priorityOrder[b.priority as TaskPriority] || 0) -
        (priorityOrder[a.priority as TaskPriority] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      // 5. Due date urgency
      if (a.dueDate && b.dueDate) {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return dateA - dateB;
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (b.dueDate && !a.dueDate) return 1;

      // 6. Stage readiness (ready tasks before blocked ones)
      const stageOrder = {
        "in-progress": 5,
        "not-started": 4,
        completed: 1,
        blocked: 2,
      };
      const stageA = stageOrder[a.stage as TaskStage] || 3;
      const stageB = stageOrder[b.stage as TaskStage] || 3;
      return stageB - stageA;
    });
  }

  predictTaskLifecycle(task: Task): TaskPrediction {
    const now = new Date();
    const estimatedHours = task.estimated_hours || 8; // Default 1 day

    // Simple rule-based prediction
    let daysToComplete = Math.ceil(estimatedHours / 8);

    // Adjust for complexity factors
    if (task.weather_dependent) daysToComplete += 1;
    if (task.inspection_required) daysToComplete += 2;
    if (task.priority === "critical")
      daysToComplete = Math.max(1, daysToComplete - 1);

    const predictedCompletion = new Date(
      now.getTime() + daysToComplete * 24 * 60 * 60 * 1000
    );

    const riskFactors: string[] = [];
    if (task.weather_dependent) riskFactors.push("Weather dependent");
    if (
      task.materials_needed &&
      Array.isArray(task.materials_needed) &&
      task.materials_needed.length > 0
    ) {
      riskFactors.push("Material dependencies");
    }
    if (!task.assigned_to) riskFactors.push("No assigned worker");

    return {
      predictedCompletion,
      riskFactors,
      recommendedActions:
        riskFactors.length > 0
          ? ["Review dependencies", "Assign resources"]
          : [],
      confidenceScore: Math.max(0.3, 1 - riskFactors.length * 0.2),
      bottleneckLikelihood: riskFactors.length * 0.25,
    };
  }

  resolveConflict(
    localUpdate: Partial<Task>,
    remoteUpdate: Partial<Task>,
    originalTask: Task
  ): ConflictResolution {
    // Rule-based conflict resolution
    const resolvedTask: Partial<Task> = { ...originalTask };
    let reasoning = "";
    let requiresManualReview = false;

    // Safety updates take precedence
    if (localUpdate.safety_notes || remoteUpdate.safety_notes) {
      resolvedTask.safety_notes =
        localUpdate.safety_notes || remoteUpdate.safety_notes;
      reasoning += "Safety notes preserved. ";
    }

    // Progress updates - use highest completion
    if (localUpdate.stage && remoteUpdate.stage) {
      const stageProgression = [
        "not-started",
        "in-progress",
        "completed",
      ];
      const localIndex = stageProgression.indexOf(localUpdate.stage);
      const remoteIndex = stageProgression.indexOf(remoteUpdate.stage);

      if (localIndex > remoteIndex) {
        resolvedTask.stage = localUpdate.stage;
        reasoning += "Used most advanced stage. ";
      } else {
        resolvedTask.stage = remoteUpdate.stage;
        reasoning += "Used most advanced stage. ";
      }
    }

    // Priority conflicts require manual review
    if (
      localUpdate.priority &&
      remoteUpdate.priority &&
      localUpdate.priority !== remoteUpdate.priority
    ) {
      requiresManualReview = true;
      reasoning += "Priority conflict requires review. ";
    }

    return {
      resolvedTask,
      reasoning: reasoning || "No conflicts detected",
      confidence: requiresManualReview ? 0.5 : 0.8,
      requiresManualReview,
    };
  }
}

/**
 * Construction Task AI Engine with fallback strategies
 * Implements AI-powered task management with rule-based fallbacks
 */
export class ConstructionTaskEngine {
  private fallbackEngine: RuleBasedTaskEngine;
  private cache: Map<string, AIDecision>;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for construction site connectivity
  private readonly AI_TIMEOUT = 3000; // 3 second timeout for mobile responsiveness

  constructor() {
    this.fallbackEngine = new RuleBasedTaskEngine();
    this.cache = new Map();
  }

  /**
   * Prioritize tasks using AI with construction industry logic
   */
  async prioritizeTasks(
    tasks: Task[],
    context: WorkerContext = {}
  ): Promise<Task[]> {
    const cacheKey = `prioritize-${this.generateContextHash(tasks, context)}`;

    // Check cache first
    const cached = this.getCachedDecision(cacheKey);
    if (cached && !cached.fallbackUsed) {
      return cached.decision;
    }

    try {
      // Try AI prioritization with timeout
      const aiResult = await Promise.race([
        this.callAIPrioritization(tasks, context),
        this.createTimeoutPromise(),
      ]);

      if (aiResult && Array.isArray(aiResult)) {
        const validatedResult = this.validateTasksResult(aiResult, tasks);
        this.cacheDecision(cacheKey, {
          decision: validatedResult,
          reasoning: "AI-powered construction prioritization",
          confidence: 0.85,
          fallbackUsed: false,
          timestamp: new Date(),
        });
        return validatedResult;
      }
    } catch (error) {
      console.warn(
        "🤖 AI prioritization failed, using rule-based fallback:",
        error
      );
    }

    // Fallback to rule-based prioritization
    const fallbackResult = this.fallbackEngine.prioritizeTasks(tasks, context);
    this.cacheDecision(cacheKey, {
      decision: fallbackResult,
      reasoning: "Rule-based construction prioritization (AI unavailable)",
      confidence: 0.7,
      fallbackUsed: true,
      timestamp: new Date(),
    });

    return fallbackResult;
  }

  /**
   * Get next recommended task for a worker
   */
  async getNextTask(
    tasks: Task[],
    context: WorkerContext = {}
  ): Promise<Task | null> {
    const prioritizedTasks = await this.prioritizeTasks(tasks, context);

    // Filter for tasks that can be started now
    const availableTasks = prioritizedTasks.filter((task) => {
      // Skip completed or blocked tasks
      if (task.stage === "completed" || task.stage === "blocked") return false;

      // Check weather conditions
      if (task.weather_dependent && context.weather === "poor") return false;

      // Check trade specialization
      if (task.trade_required && context.crew?.skills) {
        if (!context.crew.skills.includes(task.trade_required)) return false;
      }

      // Check material availability
      if (task.materials_needed && context.materials) {
        const needed = Array.isArray(task.materials_needed)
          ? task.materials_needed
          : [];
        const hasAllMaterials = needed.every((material) =>
          context.materials?.available.includes(material.toString())
        );
        if (!hasAllMaterials) return false;
      }

      return true;
    });

    return availableTasks[0] || null;
  }

  /**
   * Predict task lifecycle and bottlenecks
   */
  async predictTaskLifecycle(
    task: Task,
    context: WorkerContext = {}
  ): Promise<TaskPrediction> {
    const cacheKey = `predict-${task.id}`;
    const cached = this.getCachedDecision(cacheKey);

    if (cached) {
      return cached.decision;
    }

    try {
      // Try AI prediction
      const aiResult = await Promise.race([
        this.callAIPrediction(task, context),
        this.createTimeoutPromise(),
      ]);

      if (aiResult) {
        this.cacheDecision(cacheKey, {
          decision: aiResult,
          reasoning: "AI lifecycle prediction",
          confidence: 0.75,
          fallbackUsed: false,
          timestamp: new Date(),
        });
        return aiResult;
      }
    } catch (error) {
      console.warn(
        "🤖 AI prediction failed, using rule-based fallback:",
        error
      );
    }

    // Fallback to rule-based prediction
    const fallbackResult = this.fallbackEngine.predictTaskLifecycle(task);
    this.cacheDecision(cacheKey, {
      decision: fallbackResult,
      reasoning: "Rule-based prediction (AI unavailable)",
      confidence: 0.6,
      fallbackUsed: true,
      timestamp: new Date(),
    });

    return fallbackResult;
  }

  /**
   * Resolve conflicts between simultaneous task updates
   */
  async resolveTaskConflict(
    localUpdate: Partial<Task>,
    remoteUpdate: Partial<Task>,
    originalTask: Task
  ): Promise<ConflictResolution> {
    try {
      // Try AI conflict resolution
      const aiResult = await Promise.race([
        this.callAIConflictResolution(localUpdate, remoteUpdate, originalTask),
        this.createTimeoutPromise(),
      ]);

      if (aiResult) {
        return aiResult;
      }
    } catch (error) {
      console.warn(
        "🤖 AI conflict resolution failed, using rule-based fallback:",
        error
      );
    }

    // Fallback to rule-based resolution
    return this.fallbackEngine.resolveConflict(
      localUpdate,
      remoteUpdate,
      originalTask
    );
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, decision] of this.cache.entries()) {
      if (now - decision.timestamp.getTime() > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  // Private methods

  private async callAIPrioritization(
    tasks: Task[],
    context: WorkerContext
  ): Promise<Task[]> {
    // Mock AI call - in production, this would call actual AI service
    // For now, return null to trigger fallback
    return new Promise((resolve) => {
      setTimeout(() => resolve(null as any), 100);
    });
  }

  private async callAIPrediction(
    task: Task,
    context: WorkerContext
  ): Promise<TaskPrediction | null> {
    // Mock AI call - in production, this would call actual AI service
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 100);
    });
  }

  private async callAIConflictResolution(
    localUpdate: Partial<Task>,
    remoteUpdate: Partial<Task>,
    originalTask: Task
  ): Promise<ConflictResolution | null> {
    // Mock AI call - in production, this would call actual AI service
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 100);
    });
  }

  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI timeout")), this.AI_TIMEOUT);
    });
  }

  private validateTasksResult(aiResult: any[], originalTasks: Task[]): Task[] {
    if (!Array.isArray(aiResult)) return originalTasks;

    // Ensure all original tasks are included
    const resultIds = new Set(aiResult.map((t) => t.id));
    const missing = originalTasks.filter((t) => !resultIds.has(t.id));

    return [...aiResult.filter((t) => t && t.id), ...missing];
  }

  private generateContextHash(tasks: Task[], context: WorkerContext): string {
    const taskIds = tasks
      .map((t) => t.id)
      .sort()
      .join(",");
    const contextStr = JSON.stringify(context);
    return btoa(taskIds + contextStr).slice(0, 16);
  }

  private getCachedDecision(key: string): AIDecision | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp.getTime() > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  private cacheDecision(key: string, decision: AIDecision): void {
    // Limit cache size to prevent memory issues
    if (this.cache.size > 100) {
      const first = this.cache.keys().next();
      if (!first.done) this.cache.delete(first.value);
    }

    this.cache.set(key, decision);
  }
}

// Export singleton instance
export const constructionTaskEngine = new ConstructionTaskEngine();
