export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          related_project_id: string | null
          related_task_id: string | null
          related_tool_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          related_project_id?: string | null
          related_task_id?: string | null
          related_tool_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          related_project_id?: string | null
          related_task_id?: string | null
          related_tool_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      inspections: {
        Row: {
          completed_date: string | null
          created_at: string | null
          findings: Json | null
          id: string
          inspection_type: string
          inspector_id: string
          next_action_required: string | null
          notes: string | null
          photos: string[] | null
          scheduled_date: string | null
          status: string
          task_id: string
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          findings?: Json | null
          id?: string
          inspection_type: string
          inspector_id: string
          next_action_required?: string | null
          notes?: string | null
          photos?: string[] | null
          scheduled_date?: string | null
          status?: string
          task_id: string
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          findings?: Json | null
          id?: string
          inspection_type?: string
          inspector_id?: string
          next_action_required?: string | null
          notes?: string | null
          photos?: string[] | null
          scheduled_date?: string | null
          status?: string
          task_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      material_requests: {
        Row: {
          actual_cost: number | null
          approved_by: string | null
          created_at: string | null
          delivery_date: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          material_name: string
          needed_by_date: string | null
          priority: string | null
          project_id: string
          quantity: number
          requested_by: string
          status: string
          supplier_info: Json | null
          task_id: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          approved_by?: string | null
          created_at?: string | null
          delivery_date?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          material_name: string
          needed_by_date?: string | null
          priority?: string | null
          project_id: string
          quantity: number
          requested_by: string
          status?: string
          supplier_info?: Json | null
          task_id?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          approved_by?: string | null
          created_at?: string | null
          delivery_date?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          material_name?: string
          needed_by_date?: string | null
          priority?: string | null
          project_id?: string
          quantity?: number
          requested_by?: string
          status?: string
          supplier_info?: Json | null
          task_id?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_requests_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string | null
          related_project_id: string | null
          related_task_id: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string | null
          related_project_id?: string | null
          related_task_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string | null
          related_project_id?: string | null
          related_task_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          certifications: Json | null
          created_at: string | null
          display_name: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          role: string | null
          trade_specialty: string | null
          updated_at: string | null
          use_case: string | null
          weather_preferences: Json | null
        }
        Insert: {
          avatar_url?: string | null
          certifications?: Json | null
          created_at?: string | null
          display_name?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          trade_specialty?: string | null
          updated_at?: string | null
          use_case?: string | null
          weather_preferences?: Json | null
        }
        Update: {
          avatar_url?: string | null
          certifications?: Json | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          trade_specialty?: string | null
          updated_at?: string | null
          use_case?: string | null
          weather_preferences?: Json | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_completion_date: string | null
          budget: number | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          estimated_completion_date: string | null
          icon_color: string | null
          icon_type: string | null
          id: string
          inspection_schedule: Json | null
          location: string | null
          name: string
          progress_percentage: number | null
          safety_requirements: Json | null
          start_date: string | null
          status: string | null
          trade_categories: string[] | null
          updated_at: string | null
          weather_dependent: boolean | null
        }
        Insert: {
          actual_completion_date?: string | null
          budget?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          estimated_completion_date?: string | null
          icon_color?: string | null
          icon_type?: string | null
          id?: string
          inspection_schedule?: Json | null
          location?: string | null
          name: string
          progress_percentage?: number | null
          safety_requirements?: Json | null
          start_date?: string | null
          status?: string | null
          trade_categories?: string[] | null
          updated_at?: string | null
          weather_dependent?: boolean | null
        }
        Update: {
          actual_completion_date?: string | null
          budget?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          estimated_completion_date?: string | null
          icon_color?: string | null
          icon_type?: string | null
          id?: string
          inspection_schedule?: Json | null
          location?: string | null
          name?: string
          progress_percentage?: number | null
          safety_requirements?: Json | null
          start_date?: string | null
          status?: string | null
          trade_categories?: string[] | null
          updated_at?: string | null
          weather_dependent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_config_log: {
        Row: {
          applied_at: string | null
          id: string
          notes: string | null
          setting_name: string
          setting_value: string
        }
        Insert: {
          applied_at?: string | null
          id?: string
          notes?: string | null
          setting_name: string
          setting_value: string
        }
        Update: {
          applied_at?: string | null
          id?: string
          notes?: string | null
          setting_name?: string
          setting_value?: string
        }
        Relationships: []
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          dependency_type: string | null
          id: string
          lag_days: number | null
          prerequisite_task_id: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_type?: string | null
          id?: string
          lag_days?: number | null
          prerequisite_task_id: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          dependency_type?: string | null
          id?: string
          lag_days?: number | null
          prerequisite_task_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_prerequisite_task_id_fkey"
            columns: ["prerequisite_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_tools: {
        Row: {
          task_id: string
          tool_id: string
        }
        Insert: {
          task_id: string
          tool_id: string
        }
        Update: {
          task_id?: string
          tool_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          completion_notes: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          inspection_required: boolean | null
          location_details: string | null
          materials_needed: Json | null
          priority: string | null
          project_id: string | null
          safety_notes: string | null
          stage: string | null
          status: string | null
          title: string
          trade_required: string | null
          updated_at: string | null
          weather_dependent: boolean | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          completion_notes?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          inspection_required?: boolean | null
          location_details?: string | null
          materials_needed?: Json | null
          priority?: string | null
          project_id?: string | null
          safety_notes?: string | null
          stage?: string | null
          status?: string | null
          title: string
          trade_required?: string | null
          updated_at?: string | null
          weather_dependent?: boolean | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          completion_notes?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          inspection_required?: boolean | null
          location_details?: string | null
          materials_needed?: Json | null
          priority?: string | null
          project_id?: string | null
          safety_notes?: string | null
          stage?: string | null
          status?: string | null
          title?: string
          trade_required?: string | null
          updated_at?: string | null
          weather_dependent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_assignments: {
        Row: {
          checked_in_at: string | null
          checked_out_at: string | null
          created_at: string | null
          expected_return_date: string | null
          id: string
          notes: string | null
          project_id: string | null
          tool_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          created_at?: string | null
          expected_return_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          tool_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          created_at?: string | null
          expected_return_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          tool_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          assigned_to: string | null
          category: string | null
          certification_expiry: string | null
          condition_rating: number | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          last_maintenance_date: string | null
          location: string | null
          name: string
          next_maintenance_date: string | null
          purchase_date: string | null
          replacement_cost: number | null
          safety_certified: boolean | null
          serial_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          certification_expiry?: string | null
          condition_rating?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          last_maintenance_date?: string | null
          location?: string | null
          name: string
          next_maintenance_date?: string | null
          purchase_date?: string | null
          replacement_cost?: number | null
          safety_certified?: boolean | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          certification_expiry?: string | null
          condition_rating?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          last_maintenance_date?: string | null
          location?: string | null
          name?: string
          next_maintenance_date?: string | null
          purchase_date?: string | null
          replacement_cost?: number | null
          safety_certified?: boolean | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tools_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tools_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_conditions: {
        Row: {
          affected_trades: string[] | null
          conditions: string
          created_at: string | null
          date: string
          id: string
          precipitation_chance: number | null
          project_id: string
          safety_notes: string | null
          temperature_high: number | null
          temperature_low: number | null
          wind_speed: number | null
          work_suitable: boolean | null
        }
        Insert: {
          affected_trades?: string[] | null
          conditions: string
          created_at?: string | null
          date: string
          id?: string
          precipitation_chance?: number | null
          project_id: string
          safety_notes?: string | null
          temperature_high?: number | null
          temperature_low?: number | null
          wind_speed?: number | null
          work_suitable?: boolean | null
        }
        Update: {
          affected_trades?: string[] | null
          conditions?: string
          created_at?: string | null
          date?: string
          id?: string
          precipitation_chance?: number | null
          project_id?: string
          safety_notes?: string | null
          temperature_high?: number | null
          temperature_low?: number | null
          wind_speed?: number | null
          work_suitable?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_conditions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_task_safe: {
        Args: {
          assignee_uuid: string
          check_prerequisites?: boolean
          task_uuid: string
        }
        Returns: Json
      }
      calculate_project_progress: {
        Args: { project_uuid: string }
        Returns: number
      }
      get_available_tools: {
        Args: { category_filter?: string; project_uuid?: string }
        Returns: {
          category: string
          condition_rating: number
          id: string
          last_maintenance_date: string
          location: string
          name: string
          safety_certified: boolean
        }[]
      }
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          trade: string
          user_id: string
          user_role: string
        }[]
      }
      get_material_requests_needing_attention: {
        Args: Record<PropertyKey, never>
        Returns: {
          days_until_needed: number
          estimated_cost: number
          id: string
          material_name: string
          needed_by_date: string
          priority: string
          project_name: string
          requested_by_name: string
          status: string
        }[]
      }
      get_overdue_tasks: {
        Args: { project_uuid?: string }
        Returns: {
          assigned_to_name: string
          days_overdue: number
          due_date: string
          id: string
          priority: string
          project_name: string
          stage: string
          title: string
        }[]
      }
      get_pending_inspections: {
        Args: { inspector_uuid?: string }
        Returns: {
          days_until_due: number
          id: string
          inspection_type: string
          project_name: string
          scheduled_date: string
          status: string
          task_title: string
        }[]
      }
      get_project_dashboard: {
        Args: { project_uuid: string }
        Returns: {
          pending_inspections: number
          pending_material_requests: number
          progress_percentage: number
          project_name: string
          tasks_completed: number
          tasks_in_progress: number
          tasks_overdue: number
          tasks_total: number
          weather_suitable: boolean
        }[]
      }
      get_ready_tasks: {
        Args: { project_uuid?: string; user_uuid?: string }
        Returns: {
          due_date: string
          estimated_hours: number
          id: string
          priority: string
          project_id: string
          project_name: string
          title: string
          trade_required: string
        }[]
      }
      get_user_workload: {
        Args: { user_uuid: string }
        Returns: {
          active_tasks: number
          overdue_tasks: number
          pending_inspections: number
          tools_checked_out: number
          total_estimated_hours: number
          user_name: string
        }[]
      }
      task_dependencies_met: {
        Args: { task_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// =============================================================================
// FRONTEND-COMPATIBLE TYPE EXPORTS
// =============================================================================
// These types provide frontend-compatible interfaces that align with existing
// component expectations while maintaining compatibility with database schema

/**
 * Frontend-compatible Task interface that matches component expectations
 * Maps database fields to frontend naming conventions
 */
export interface Task {
  /** Unique task identifier (maps to database 'id') */
  id: string;
  /** Task title (maps to database 'title') */
  title: string;
  /** Task description (maps to database 'description') */
  description?: string | null;
  /** Task due date (maps to database 'due_date') */
  dueDate?: Date | string | null;
  /** Task completion status (derived from database 'status') */
  isCompleted?: boolean;
  /** Task priority level (maps to database 'priority') */
  priority?: string | null;
  /** Project ID this task belongs to (maps to database 'project_id') */
  projectId?: string | null;
  /** Task stage/status (maps to database 'stage') */
  stage?: string | null;
  /** Task status (maps to database 'status') */
  status?: string | null;
  /** User assigned to task (maps to database 'assigned_to') */
  assigned_to?: string | null;
  /** Task creation timestamp */
  created_at?: string | null;
  /** Task update timestamp */
  updated_at?: string | null;
  /** User who created the task */
  created_by?: string;
  /** Estimated hours for completion */
  estimated_hours?: number | null;
  /** Actual hours spent */
  actual_hours?: number | null;
  /** Whether inspection is required */
  inspection_required?: boolean | null;
  /** Location details */
  location_details?: string | null;
  /** Materials needed (JSON data) */
  materials_needed?: any;
  /** Safety notes */
  safety_notes?: string | null;
  /** Trade required */
  trade_required?: string | null;
  /** Weather dependent flag */
  weather_dependent?: boolean | null;
  /** Completion notes */
  completion_notes?: string | null;
}

/**
 * Frontend-compatible Project interface
 * Maps database fields to frontend naming conventions
 */
export interface Project {
  /** Unique project identifier */
  id: string;
  /** Project name */
  name: string;
  /** Project description */
  description?: string | null;
  /** Project status */
  status?: string | null;
  /** Project progress percentage */
  progress_percentage?: number | null;
  /** Project start date */
  start_date?: string | null;
  /** Project end date */
  end_date?: string | null;
  /** Estimated completion date */
  estimated_completion_date?: string | null;
  /** Actual completion date */
  actual_completion_date?: string | null;
  /** Project budget */
  budget?: number | null;
  /** Project location */
  location?: string | null;
  /** Icon type for project display */
  icon_type?: string | null;
  /** Icon color for project display */
  icon_color?: string | null;
  /** User who created the project */
  created_by: string;
  /** Project creation timestamp */
  created_at?: string | null;
  /** Project update timestamp */
  updated_at?: string | null;
  /** Trade categories involved */
  trade_categories?: string[] | null;
  /** Weather dependency flag */
  weather_dependent?: boolean | null;
  /** Safety requirements (JSON data) */
  safety_requirements?: any;
  /** Inspection schedule (JSON data) */
  inspection_schedule?: any;
  
  // Frontend-specific computed properties
  /** Whether to show progress percentage in UI */
  hasPercentage?: boolean;
  /** Progress percentage for UI display (0-100) */
  percentage?: number;
  /** Icon name for legacy compatibility */
  iconName?: string;
  /** Icon color for UI display */
  iconColor?: string;
  /** Project icon type for SVG assets */
  projectIconType?: string;
  /** Project icon color variant */
  projectIconColor?: string;
}

/**
 * Frontend-compatible Profile interface
 * Maps database fields to frontend naming conventions
 */
export interface Profile {
  /** Unique user identifier */
  id: string;
  /** User email address */
  email: string;
  /** User first name */
  first_name?: string | null;
  /** User last name */
  last_name?: string | null;
  /** User display name */
  display_name?: string | null;
  /** User phone number */
  phone?: string | null;
  /** User role (project_manager, foreman, worker, etc.) */
  role?: string | null;
  /** User trade specialty */
  trade_specialty?: string | null;
  /** User use case */
  use_case?: string | null;
  /** Avatar URL */
  avatar_url?: string | null;
  /** Whether user account is active */
  is_active?: boolean | null;
  /** User certifications (JSON data) */
  certifications?: any;
  /** Weather preferences (JSON data) */
  weather_preferences?: any;
  /** Profile creation timestamp */
  created_at?: string | null;
  /** Profile update timestamp */
  updated_at?: string | null;
}

/**
 * Task stage enumeration matching database schema constraints
 * Supports all 4 core stages defined in tasks table
 */
export type TaskStage = "not-started" | "in-progress" | "completed" | "blocked";

/**
 * Task priority enumeration
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Project status enumeration
 */
export type ProjectStatus = "planning" | "active" | "on-hold" | "completed" | "cancelled";

/**
 * User role enumeration matching database constraints
 */
export type UserRole = "project_manager" | "foreman" | "worker" | "inspector" | "admin";

/**
 * Type conversion utilities for transforming between database and frontend formats
 */
export const TypeConverters = {
  /**
   * Convert database task row to frontend Task interface
   */
  taskFromDatabase: (dbTask: Tables<'tasks'>): Task => ({
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    dueDate: dbTask.due_date,
    isCompleted: dbTask.status === 'completed',
    priority: dbTask.priority,
    projectId: dbTask.project_id,
    stage: dbTask.stage,
    status: dbTask.status,
    assigned_to: dbTask.assigned_to,
    created_at: dbTask.created_at,
    updated_at: dbTask.updated_at,
    created_by: dbTask.created_by,
    estimated_hours: dbTask.estimated_hours,
    actual_hours: dbTask.actual_hours,
    inspection_required: dbTask.inspection_required,
    location_details: dbTask.location_details,
    materials_needed: dbTask.materials_needed,
    safety_notes: dbTask.safety_notes,
    trade_required: dbTask.trade_required,
    weather_dependent: dbTask.weather_dependent,
    completion_notes: dbTask.completion_notes,
  }),

  /**
   * Convert frontend Task to database insert format
   */
  taskToDatabase: (task: Partial<Task>): TablesInsert<'tasks'> => ({
    title: task.title!,
    description: task.description,
    due_date: typeof task.dueDate === 'string' ? task.dueDate : task.dueDate?.toISOString(),
    priority: task.priority,
    project_id: task.projectId,
    stage: task.stage,
    status: task.status,
    assigned_to: task.assigned_to,
    created_by: task.created_by!,
    estimated_hours: task.estimated_hours,
    actual_hours: task.actual_hours,
    inspection_required: task.inspection_required,
    location_details: task.location_details,
    materials_needed: task.materials_needed,
    safety_notes: task.safety_notes,
    trade_required: task.trade_required,
    weather_dependent: task.weather_dependent,
    completion_notes: task.completion_notes,
  }),

  /**
   * Convert database project row to frontend Project interface
   */
  projectFromDatabase: (dbProject: Tables<'projects'>): Project => ({
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    status: dbProject.status,
    progress_percentage: dbProject.progress_percentage,
    start_date: dbProject.start_date,
    end_date: dbProject.end_date,
    estimated_completion_date: dbProject.estimated_completion_date,
    actual_completion_date: dbProject.actual_completion_date,
    budget: dbProject.budget,
    location: dbProject.location,
    icon_type: dbProject.icon_type,
    icon_color: dbProject.icon_color,
    created_by: dbProject.created_by,
    created_at: dbProject.created_at,
    updated_at: dbProject.updated_at,
    trade_categories: dbProject.trade_categories,
    weather_dependent: dbProject.weather_dependent,
    safety_requirements: dbProject.safety_requirements,
    inspection_schedule: dbProject.inspection_schedule,
    // Frontend computed properties
    hasPercentage: dbProject.progress_percentage !== null,
    percentage: dbProject.progress_percentage || 0,
    projectIconType: dbProject.icon_type || undefined,
    projectIconColor: dbProject.icon_color || undefined,
  }),

  /**
   * Convert frontend Project to database insert format
   */
  projectToDatabase: (project: Partial<Project>): TablesInsert<'projects'> => ({
    name: project.name!,
    description: project.description,
    status: project.status,
    progress_percentage: project.progress_percentage,
    start_date: project.start_date,
    end_date: project.end_date,
    estimated_completion_date: project.estimated_completion_date,
    actual_completion_date: project.actual_completion_date,
    budget: project.budget,
    location: project.location,
    icon_type: project.icon_type || project.projectIconType,
    icon_color: project.icon_color || project.projectIconColor,
    created_by: project.created_by!,
    trade_categories: project.trade_categories,
    weather_dependent: project.weather_dependent,
    safety_requirements: project.safety_requirements,
    inspection_schedule: project.inspection_schedule,
  }),

  /**
   * Convert database profile row to frontend Profile interface
   */
  profileFromDatabase: (dbProfile: Tables<'profiles'>): Profile => ({
    id: dbProfile.id,
    email: dbProfile.email,
    first_name: dbProfile.first_name,
    last_name: dbProfile.last_name,
    display_name: dbProfile.display_name,
    phone: dbProfile.phone,
    role: dbProfile.role,
    trade_specialty: dbProfile.trade_specialty,
    use_case: dbProfile.use_case,
    avatar_url: dbProfile.avatar_url,
    is_active: dbProfile.is_active,
    certifications: dbProfile.certifications,
    weather_preferences: dbProfile.weather_preferences,
    created_at: dbProfile.created_at,
    updated_at: dbProfile.updated_at,
  }),
}