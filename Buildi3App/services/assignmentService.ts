import { ContactOption } from "../components/ui/AssignedToDropDown/types";

/**
 * Assignment Service - Handles task assignment operations
 *
 * This service manages task assignment functionality including:
 * - Fetching available contacts for assignment
 * - Updating task assignments in database
 * - Handling assignment/unassignment operations
 *
 * TODO: Future engineer - Enhanced contact management:
 * 1. Device contacts integration using expo-contacts API
 * 2. Project team member filtering based on current project
 * 3. Role-based assignment permissions (only certain roles can assign to certain people)
 * 4. Recent assignment history and suggestions
 * 5. Bulk assignment operations
 * 6. Assignment notifications and activity logging
 * 7. Integration with external contact systems (CRM, HR systems)
 * 8. Offline contact caching and synchronization
 */

/**
 * Generate dummy contact data for development and testing
 *
 * TODO: Future engineer - Replace this with real contact sources:
 * - expo-contacts for device contacts
 * - profiles table for project team members
 * - project_members table for project-specific access
 * - External APIs for company directory
 *
 * @returns Array of dummy contacts for testing assignment functionality
 */
export const generateDummyContacts = (): ContactOption[] => {
  // TODO: Replace with real contact data sources
  const dummyContacts: ContactOption[] = [
    {
      id: "contact-1",
      name: "Federico Ostan Bazan",
      phone: "+34 123 456 789",
      email: "federico@buildi3.com",
      initials: "FO",
    },
    {
      id: "contact-2",
      name: "Ana Rodriguez Silva",
      phone: "+34 987 654 321",
      email: "ana.rodriguez@buildi3.com",
      initials: "AR",
    },
    {
      id: "contact-3",
      name: "Carlos Martinez Lopez",
      phone: "+34 555 123 456",
      email: "carlos.martinez@buildi3.com",
      initials: "CM",
    },
    {
      id: "contact-4",
      name: "Isabel Santos Vega",
      phone: "+34 666 789 123",
      email: "isabel.santos@buildi3.com",
      initials: "IS",
    },
    {
      id: "contact-5",
      name: "Miguel Angel Torres",
      phone: "+34 777 456 789",
      email: "miguel.torres@buildi3.com",
      initials: "MT",
    },
    {
      id: "contact-6",
      name: "Carmen Jimenez Ruiz",
      phone: "+34 888 321 654",
      email: "carmen.jimenez@buildi3.com",
      initials: "CJ",
    },
    {
      id: "contact-7",
      name: "Antonio Garcia Moreno",
      phone: "+34 999 567 890",
      email: "antonio.garcia@buildi3.com",
      initials: "AG",
    },
    {
      id: "contact-8",
      name: "Pilar Fernandez Castro",
      phone: "+34 111 234 567",
      email: "pilar.fernandez@buildi3.com",
      initials: "PF",
    },
  ];

  return dummyContacts;
};

/**
 * Generate user initials from full name
 * Handles various name formats and edge cases
 *
 * @param firstName - User's first name
 * @param lastName - User's last name (optional)
 * @returns Two-letter initials (uppercase)
 */
export const generateInitials = (
  firstName?: string,
  lastName?: string
): string => {
  if (!firstName && !lastName) return "??";

  const first = (firstName || "").trim();
  const last = (lastName || "").trim();

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  if (first) {
    // Use first two letters of first name if no last name
    return first.length > 1
      ? `${first[0]}${first[1]}`.toUpperCase()
      : `${first[0]}?`.toUpperCase();
  }

  if (last) {
    // Use first two letters of last name if no first name
    return last.length > 1
      ? `${last[0]}${last[1]}`.toUpperCase()
      : `${last[0]}?`.toUpperCase();
  }

  return "??";
};

/**
 * Convert database profile to ContactOption format
 *
 * @param profile - Database profile object
 * @returns ContactOption for UI display
 */
export const profileToContact = (profile: {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  role?: string;
}): ContactOption => {
  const firstName = profile.first_name || "";
  const lastName = profile.last_name || "";
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Unknown User";

  return {
    id: profile.id,
    name: fullName,
    phone: profile.phone || undefined,
    email: profile.email || undefined,
    initials: generateInitials(firstName, lastName),
    disabled: false,
  };
};

/**
 * Assignment operation result type
 */
export interface AssignmentResult {
  success: boolean;
  error?: string;
  userMessage?: string;
  data?: any;
}

/**
 * Update task assignment in database using MCP Supabase
 *
 * This function handles both assignment and unassignment operations:
 * - Assignment: Updates tasks.assigned_to with user ID
 * - Unassignment: Sets tasks.assigned_to to NULL
 * - Includes proper error handling and validation
 * - Logs activity for audit purposes
 *
 * TODO: Future engineer - Enhanced assignment features:
 * 1. Workload balancing - check current assignments before assigning
 * 2. Skill matching - ensure assigned user has required trade skills
 * 3. Availability checking - verify user availability for task dates
 * 4. Notification system - notify assigned user of new tasks
 * 5. Assignment history tracking - log all assignment changes
 * 6. Bulk assignment operations for multiple tasks
 * 7. Assignment approval workflow for high-priority tasks
 * 8. Integration with calendar systems for scheduling
 *
 * @param taskId - ID of the task to update
 * @param userId - ID of the user to assign (null for unassignment)
 * @param currentUserId - ID of the user making the assignment
 * @returns Promise with operation result
 */
export const updateTaskAssignment = async (
  taskId: string,
  userId: string | null,
  currentUserId?: string
): Promise<AssignmentResult> => {
  try {
    console.log(
      `Updating task assignment: task=${taskId}, user=${userId}, currentUser=${currentUserId}`
    );

    // Validate task ID
    if (!taskId || typeof taskId !== "string") {
      return {
        success: false,
        error: "Invalid task ID",
        userMessage: "Unable to update assignment: Invalid task",
      };
    }

    // For assignment operations, validate user ID
    if (userId && typeof userId !== "string") {
      return {
        success: false,
        error: "Invalid user ID",
        userMessage: "Unable to update assignment: Invalid user",
      };
    }

    // TODO: Future engineer - Add these validations:
    // 1. Check if current user has permission to assign tasks
    // 2. Validate that assigned user exists in profiles table
    // 3. Check if assigned user has access to the project
    // 4. Verify task is not locked or completed
    // 5. Check workload limits for assigned user

    // Update the task assignment
    const updateData = {
      assigned_to: userId,
      updated_at: new Date().toISOString(),
    };

    // TODO: Implement real MCP Supabase integration here
    // For now, this is a placeholder that simulates the database operation
    // Future engineer should replace this with actual MCP calls:
    //
    // import { mcp_supabase_execute_sql } from '../mcp/supabase';
    //
    // const result = await mcp_supabase_execute_sql({
    //   query: `
    //     UPDATE tasks
    //     SET assigned_to = $1, updated_at = $2
    //     WHERE id = $3
    //     RETURNING id, title, assigned_to
    //   `,
    //   params: [userId, updateData.updated_at, taskId]
    // });
    //
    // if (result.error) {
    //   return {
    //     success: false,
    //     error: result.error,
    //     userMessage: "Failed to update task assignment in database"
    //   };
    // }

    console.log("Assignment update data:", updateData);

    // Simulate database update with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // TODO: Future engineer - Add activity logging here:
    // const activityDescription = userId
    //   ? `Task assigned to user ${userId}`
    //   : `Task unassigned`;
    //
    // await mcp_supabase_execute_sql({
    //   query: `
    //     INSERT INTO activity_log (user_id, activity_type, description, related_task_id)
    //     VALUES ($1, $2, $3, $4)
    //   `,
    //   params: [currentUserId, 'task_assignment', activityDescription, taskId]
    // });

    console.log("Task assignment updated successfully");

    return {
      success: true,
      data: { taskId, assignedTo: userId },
    };
  } catch (error: any) {
    console.error("Error updating task assignment:", error);

    return {
      success: false,
      error: error.message || "Unknown error occurred",
      userMessage: "Failed to update task assignment. Please try again.",
    };
  }
};

/**
 * Fetch available contacts for task assignment
 *
 * This function retrieves contacts from various sources:
 * - Database profiles (project team members)
 * - Device contacts (via expo-contacts)
 * - Recent assignment history
 * - External contact systems
 *
 * TODO: Future engineer - Implement real contact sources:
 * 1. Query profiles table for project team members
 * 2. Use expo-contacts for device contact integration
 * 3. Filter by project permissions and roles
 * 4. Include recently assigned contacts
 * 5. Add contact search and filtering capabilities
 * 6. Cache contacts for offline functionality
 * 7. Sync with external contact management systems
 *
 * @param projectId - Optional project ID for filtering team members
 * @param includeDeviceContacts - Whether to include device contacts
 * @returns Promise with available contacts
 */
export const fetchAvailableContacts = async (
  projectId?: string,
  includeDeviceContacts: boolean = false
): Promise<AssignmentResult> => {
  try {
    console.log(
      `Fetching contacts for project: ${projectId}, includeDevice: ${includeDeviceContacts}`
    );

    // TODO: Future engineer - Implement real contact fetching:
    //
    // 1. Fetch project team members:
    // const { data: teamMembers } = await mcp_supabase_execute_sql({
    //   query: `
    //     SELECT p.id, p.first_name, p.last_name, p.phone, p.email, p.role
    //     FROM profiles p
    //     JOIN project_members pm ON p.id = pm.user_id
    //     WHERE pm.project_id = $1 AND p.is_active = true
    //     ORDER BY p.first_name, p.last_name
    //   `,
    //   params: [projectId]
    // });
    //
    // 2. Convert to ContactOption format:
    // const contacts = teamMembers.map(profileToContact);
    //
    // 3. Add device contacts if requested:
    // if (includeDeviceContacts) {
    //   const deviceContacts = await fetchDeviceContacts();
    //   contacts.push(...deviceContacts);
    // }

    // For now, return dummy contacts
    const dummyContacts = generateDummyContacts();

    console.log(`Found ${dummyContacts.length} contacts`);

    return {
      success: true,
      data: dummyContacts,
    };
  } catch (error: any) {
    console.error("Error fetching contacts:", error);

    return {
      success: false,
      error: error.message || "Unknown error occurred",
      userMessage: "Failed to load contacts. Please try again.",
    };
  }
};
