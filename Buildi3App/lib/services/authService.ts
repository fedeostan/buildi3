import { supabase } from '../supabase/client'
import { Profile } from '../supabase/types'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'project_manager' | 'site_supervisor' | 'foreman' | 'worker' | 'manager'
  tradeSpecialty?: 'electrical' | 'plumbing' | 'carpentry' | 'masonry' | 'hvac' | 'general'
}

export interface OnboardingData {
  firstName: string
  lastName: string
  role: string
  useCase: string
  jobDescription: string
}

class AuthService {
  /**
   * Sign up a new user with email/password
   */
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Mobile app doesn't need email redirect
        }
      })
      
      if (error) {
        throw error
      }
      
      return { user: data.user, error: null }
    } catch (error: any) {
      console.error('AuthService.signUp error:', error)
      return { user: null, error }
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw error
      }
      
      return { user: data.user, session: data.session, error: null }
    } catch (error: any) {
      console.error('AuthService.signIn error:', error)
      return { user: null, session: null, error }
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error: any) {
      console.error('AuthService.signOut error:', error)
      return { error }
    }
  }

  /**
   * Complete user onboarding by updating profile
   */
  async completeOnboarding(userId: string, onboardingData: OnboardingData) {
    try {
      // Convert frontend role names to database role names
      const roleMapping: { [key: string]: string } = {
        'manager': 'project_manager',
        'architect': 'project_manager',
        'technician': 'foreman',
        'employee': 'worker'
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: onboardingData.firstName,
          last_name: onboardingData.lastName,
          role: roleMapping[onboardingData.role] || onboardingData.role,
          display_name: `${onboardingData.firstName} ${onboardingData.lastName}`,
          trade_specialty: 'general', // Default trade specialty
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Log onboarding completion
      await this.logActivity(userId, 'profile_completed', 'User completed onboarding')

      return { profile: data, error: null }
    } catch (error: any) {
      console.error('AuthService.completeOnboarding error:', error)
      return { profile: null, error }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Log profile update
      await this.logActivity(userId, 'profile_updated', 'User updated profile')

      return { profile: data, error: null }
    } catch (error: any) {
      console.error('AuthService.updateProfile error:', error)
      return { profile: null, error }
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { profile: null, error: new Error('No authenticated user') }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        throw error
      }

      return { profile: data as Profile, error: null }
    } catch (error: any) {
      console.error('AuthService.getCurrentProfile error:', error)
      return { profile: null, error }
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined, // Mobile app doesn't need redirect
      })
      
      return { error }
    } catch (error: any) {
      console.error('AuthService.resetPassword error:', error)
      return { error }
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error checking onboarding status:', error)
        return false
      }

      return !!(data.first_name && data.last_name && data.role)
    } catch (error) {
      console.error('Error in hasCompletedOnboarding:', error)
      return false
    }
  }

  /**
   * Log user activity
   */
  private async logActivity(userId: string, activityType: string, description: string) {
    try {
      await supabase
        .from('activity_log')
        .insert({
          user_id: userId,
          activity_type: activityType,
          description,
          created_at: new Date().toISOString(),
        })
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  /**
   * Handle authentication errors with user-friendly messages
   */
  getErrorMessage(error: any): string {
    if (!error) return 'An unknown error occurred'

    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please try again.'
      case 'User already registered':
        return 'An account with this email already exists.'
      case 'Signup requires a valid password':
        return 'Please enter a valid password.'
      case 'Unable to validate email address: invalid format':
        return 'Please enter a valid email address.'
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.'
      default:
        return error.message || 'An unexpected error occurred. Please try again.'
    }
  }
}

// Export singleton instance
export const authService = new AuthService()