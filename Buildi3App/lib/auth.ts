import { supabase } from './supabase'
import { AuthError, AuthOtpResponse, AuthResponse, Session, User } from '@supabase/supabase-js'

// Custom error types for better error handling
export type AuthErrorType = 
  | 'INVALID_EMAIL'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'NETWORK_ERROR'
  | 'RATE_LIMIT'
  | 'UNKNOWN_ERROR'

export interface AuthErrorDetails {
  type: AuthErrorType
  message: string
  originalError?: AuthError
}

// Auth service class for handling authentication flows
export class AuthService {
  /**
   * Sign up with email - sends OTP to user's email
   */
  static async signUpWithEmail(email: string): Promise<{
    data: AuthOtpResponse['data'] | null
    error: AuthErrorDetails | null
  }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: 'temp-password', // Required by Supabase but not used in OTP flow
        options: {
          emailRedirectTo: undefined, // Disable redirect, use OTP verification
        },
      })

      if (error) {
        return {
          data: null,
          error: this.mapSupabaseError(error)
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error('SignUp error:', err)
      return {
        data: null,
        error: {
          type: 'NETWORK_ERROR',
          message: 'Network error occurred. Please check your connection and try again.',
        }
      }
    }
  }

  /**
   * Verify email OTP code
   */
  static async verifyEmailOTP(email: string, token: string): Promise<{
    data: { user: User | null; session: Session | null } | null
    error: AuthErrorDetails | null
  }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: 'email',
      })

      if (error) {
        return {
          data: null,
          error: this.mapSupabaseError(error)
        }
      }

      // Check if user and session exist
      if (!data.user || !data.session) {
        return {
          data: null,
          error: {
            type: 'INVALID_OTP',
            message: 'Verification failed. Please check your code and try again.',
          }
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error('VerifyOTP error:', err)
      return {
        data: null,
        error: {
          type: 'NETWORK_ERROR',
          message: 'Network error occurred. Please check your connection and try again.',
        }
      }
    }
  }

  /**
   * Resend OTP code
   */
  static async resendOTP(email: string): Promise<{
    data: AuthOtpResponse['data'] | null
    error: AuthErrorDetails | null
  }> {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      })

      if (error) {
        return {
          data: null,
          error: this.mapSupabaseError(error)
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error('ResendOTP error:', err)
      return {
        data: null,
        error: {
          type: 'NETWORK_ERROR',
          message: 'Network error occurred. Please check your connection and try again.',
        }
      }
    }
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<{
    data: { session: Session | null }
    error: AuthErrorDetails | null
  }> {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        return {
          data: { session: null },
          error: this.mapSupabaseError(error)
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error('GetSession error:', err)
      return {
        data: { session: null },
        error: {
          type: 'NETWORK_ERROR',
          message: 'Failed to retrieve session.',
        }
      }
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<{
    error: AuthErrorDetails | null
  }> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { error: this.mapSupabaseError(error) }
      }

      return { error: null }
    } catch (err) {
      console.error('SignOut error:', err)
      return {
        error: {
          type: 'NETWORK_ERROR',
          message: 'Failed to sign out.',
        }
      }
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  /**
   * Map Supabase errors to custom error types
   */
  private static mapSupabaseError(error: AuthError): AuthErrorDetails {
    console.error('Supabase error:', error)

    // Map specific error messages to custom types
    switch (error.message) {
      case 'Invalid login credentials':
      case 'Token has expired or is invalid':
        return {
          type: 'INVALID_OTP',
          message: 'The verification code is invalid or has expired. Please request a new code.',
          originalError: error
        }
        
      case 'Email rate limit exceeded':
      case 'Too many requests':
        return {
          type: 'RATE_LIMIT',
          message: 'Too many attempts. Please wait before requesting another code.',
          originalError: error
        }
        
      case 'User already registered':
        return {
          type: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email already exists. Please sign in instead.',
          originalError: error
        }
        
      default:
        // Check for specific error codes
        if (error.message.includes('email')) {
          return {
            type: 'INVALID_EMAIL',
            message: 'Please enter a valid email address.',
            originalError: error
          }
        }
        
        return {
          type: 'UNKNOWN_ERROR',
          message: error.message || 'An unexpected error occurred. Please try again.',
          originalError: error
        }
    }
  }
}

/**
 * Utility functions for validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export const validateOTPCode = (code: string): boolean => {
  const codeRegex = /^\d{6}$/
  return codeRegex.test(code.trim())
}