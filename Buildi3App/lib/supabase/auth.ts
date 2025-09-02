/**
 * Enhanced Authentication Service for Buildi3 Construction Management
 * Integrates with Supabase Auth for complete onboarding flow
 */

import { supabase } from './client'
import { AuthError, User } from '@supabase/supabase-js'
import type { Profile, Tables } from './types'

export interface OnboardingData {
  email: string
  verificationCode: string
  firstName: string
  lastName: string
  role: string
  useCase: string
  jobDescription: string
}

export interface AuthResult {
  user: User | null
  error: AuthError | null
  needsVerification?: boolean
}

export interface ProfileResult {
  profile: Profile | null
  error: any
}

class AuthService {
  /**
   * Step 1: Sign up user with email (signup.tsx)
   * Uses Supabase's built-in OTP flow to send verification email
   */
  async signUpWithEmail(email: string): Promise<AuthResult> {
    try {
      console.log('signUpWithEmail called for:', email);
      
      // Use signInWithOtp instead of signUp - this sends an OTP email
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true, // Allow new user creation
          emailRedirectTo: undefined, // Mobile app doesn't need redirect
        }
      })

      if (error) {
        console.log('Signup error details:', error)
        return { user: null, error, needsVerification: false }
      }

      console.log('Signup result: OTP sent successfully')
      
      // With OTP flow, user is null until verification
      return { 
        user: null, 
        error: null, 
        needsVerification: true 
      }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { 
        user: null, 
        error: error as AuthError, 
        needsVerification: false 
      }
    }
  }

  /**
   * Step 2: Verify email with OTP code (verify-email.tsx)
   */
  async verifyEmailOTP(email: string, token: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token,
        type: 'email'
      })

      if (error) {
        return { user: null, error, needsVerification: true }
      }

      return { user: data.user, error: null, needsVerification: false }
    } catch (error: any) {
      console.error('OTP verification error:', error)
      return { 
        user: null, 
        error: error as AuthError, 
        needsVerification: true 
      }
    }
  }

  /**
   * Step 2.1: Resend verification email
   */
  async resendVerification(email: string): Promise<{ error: AuthError | null }> {
    try {
      // Use signInWithOtp again to resend
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: false, // Don't create if user already exists
        }
      })

      return { error }
    } catch (error: any) {
      console.error('Resend verification error:', error)
      return { error: error as AuthError }
    }
  }

  /**
   * Step 3: Set user password after verification (create-password.tsx)
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return { error }
    } catch (error: any) {
      console.error('Password update error:', error)
      return { error: error as AuthError }
    }
  }

  /**
   * Step 4-7: Complete profile during onboarding
   */
  async updateProfile(profileData: Partial<Profile>): Promise<ProfileResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { profile: null, error: new Error('No authenticated user') }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { profile: null, error }
      }

      return { profile: data as Profile, error: null }
    } catch (error: any) {
      console.error('Profile update error:', error)
      return { profile: null, error }
    }
  }

  /**
   * Final Step: Complete onboarding and activate account
   */
  async completeOnboarding(onboardingData: OnboardingData): Promise<ProfileResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { profile: null, error: new Error('No authenticated user') }
      }

      // Convert frontend role/use case to database values
      const databaseRole = this.convertFrontendRole(onboardingData.role)
      const tradeSpecialty = this.convertUseCaseToTrade(onboardingData.useCase)

      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: onboardingData.firstName,
          last_name: onboardingData.lastName,
          role: databaseRole,
          trade_specialty: tradeSpecialty,
          use_case: onboardingData.useCase, // Add the missing use_case field
          display_name: `${onboardingData.firstName} ${onboardingData.lastName}`,
          is_active: true, // Activate the account
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { profile: null, error }
      }

      // Log successful onboarding completion
      await this.logActivity(user.id, 'onboarding_completed', 'User completed full onboarding process')

      return { profile: data as Profile, error: null }
    } catch (error: any) {
      console.error('Complete onboarding error:', error)
      return { profile: null, error }
    }
  }

  /**
   * Login flow (login.tsx)
   */
  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      })

      if (error) {
        return { user: null, error, needsVerification: false }
      }

      return { user: data.user, error: null, needsVerification: false }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { 
        user: null, 
        error: error as AuthError, 
        needsVerification: false 
      }
    }
  }

  /**
   * Get current user profile - Optimized for fast auth checks
   */
  async getCurrentProfile(): Promise<ProfileResult> {
    try {
      const startTime = Date.now()
      
      // Get current session (cached, very fast)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('getCurrentProfile: Session error:', sessionError)
        return { profile: null, error: sessionError }
      }
        
      if (!session?.user) {
        return { profile: null, error: new Error('No authenticated user') }
      }

      // Fetch profile with minimal fields first, then expand if needed
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const fetchTime = Date.now() - startTime
      
      if (error) {
        console.error('getCurrentProfile: Database error:', error)
        return { profile: null, error }
      }

      console.log(`✅ Profile fetched in ${fetchTime}ms for ${session.user.email}`)
      return { profile: data as Profile, error: null }
    } catch (error: any) {
      console.error('getCurrentProfile: Unexpected error:', error)
      return { profile: null, error }
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error: any) {
      console.error('Sign out error:', error)
      return { error: error as AuthError }
    }
  }

  /**
   * Helper: Convert frontend role to database role
   */
  private convertFrontendRole(frontendRole: string): string {
    const roleMapping: { [key: string]: string } = {
      'manager': 'project_manager',
      'architect': 'project_manager', 
      'technician': 'foreman',
      'employee': 'worker'
    }
    
    return roleMapping[frontendRole.toLowerCase()] || 'worker'
  }

  /**
   * Helper: Convert use case to trade specialty
   */
  private convertUseCaseToTrade(useCase: string): string {
    const useCaseMapping: { [key: string]: string } = {
      'construction-general': 'general',
      'renovations': 'general',
      'demolition-rebuild': 'general',
      'small-jobs': 'general',
      'budget-quotations': 'general'
    }
    
    return useCaseMapping[useCase] || 'general'
  }

  /**
   * Helper: Log user activity
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
   * Helper: Get user-friendly error messages
   */
  getErrorMessage(error: AuthError | any): string {
    if (!error) return 'An unknown error occurred'

    const message = error.message || error.toString()

    // Common Supabase Auth errors
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check and try again.'
    }
    
    if (message.includes('User already registered')) {
      return 'An account with this email already exists. Try signing in instead.'
    }
    
    if (message.includes('Email not confirmed')) {
      return 'Please check your email and enter the verification code.'
    }
    
    if (message.includes('Invalid token')) {
      return 'Invalid verification code. Please check and try again.'
    }
    
    if (message.includes('Token has expired')) {
      return 'Verification code has expired. Please request a new one.'
    }
    
    if (message.includes('Signup requires a valid password')) {
      return 'Password must be at least 6 characters long.'
    }
    
    if (message.includes('Unable to validate email address')) {
      return 'Please enter a valid email address.'
    }

    if (message.includes('Email rate limit exceeded')) {
      return 'Too many verification emails sent. Please wait before requesting another.'
    }

    // Default fallback
    return message || 'An unexpected error occurred. Please try again.'
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService