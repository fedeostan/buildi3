import { Alert } from 'react-native'
import { AuthErrorDetails, AuthErrorType } from './auth'

/**
 * Error Handler utility for consistent error display across the app
 */
export class ErrorHandler {
  /**
   * Display error message to user with appropriate UI
   */
  static showError(error: AuthErrorDetails, options?: {
    showAlert?: boolean
    alertTitle?: string
    onConfirm?: () => void
  }) {
    const { showAlert = false, alertTitle = 'Error', onConfirm } = options || {}

    // Log error for debugging
    console.error(`[${error.type}] ${error.message}`, error.originalError)

    if (showAlert) {
      Alert.alert(
        alertTitle,
        error.message,
        [
          {
            text: 'OK',
            onPress: onConfirm,
          },
        ]
      )
    }

    return error.message
  }

  /**
   * Get user-friendly error message for auth errors
   */
  static getErrorMessage(errorType: AuthErrorType, context?: string): string {
    const errorMessages: Record<AuthErrorType, string> = {
      INVALID_EMAIL: 'Please enter a valid email address.',
      EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Please sign in instead.',
      INVALID_OTP: 'The verification code is incorrect or has expired. Please check your code or request a new one.',
      OTP_EXPIRED: 'Your verification code has expired. Please request a new one.',
      NETWORK_ERROR: 'Unable to connect. Please check your internet connection and try again.',
      RATE_LIMIT: 'Too many attempts. Please wait a moment before trying again.',
      UNKNOWN_ERROR: 'Something went wrong. Please try again later.',
    }

    let message = errorMessages[errorType] || errorMessages.UNKNOWN_ERROR

    // Add context-specific messaging
    if (context === 'signup' && errorType === 'EMAIL_ALREADY_EXISTS') {
      message += ' You can also try resetting your password if you forgot it.'
    }

    return message
  }

  /**
   * Handle network connectivity issues
   */
  static handleNetworkError(callback?: () => void) {
    Alert.alert(
      'Connection Problem',
      'Please check your internet connection and try again.',
      [
        {
          text: 'Retry',
          onPress: callback,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    )
  }

  /**
   * Show success message for auth actions
   */
  static showSuccess(message: string, options?: {
    showAlert?: boolean
    alertTitle?: string
    onConfirm?: () => void
  }) {
    const { showAlert = false, alertTitle = 'Success', onConfirm } = options || {}

    console.log(`[SUCCESS] ${message}`)

    if (showAlert) {
      Alert.alert(
        alertTitle,
        message,
        [
          {
            text: 'OK',
            onPress: onConfirm,
          },
        ]
      )
    }
  }
}

/**
 * Loading state management utility
 */
export class LoadingManager {
  private static loadingStates = new Map<string, boolean>()

  static setLoading(key: string, loading: boolean) {
    this.loadingStates.set(key, loading)
  }

  static isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false
  }

  static isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(loading => loading)
  }

  static clearAll() {
    this.loadingStates.clear()
  }
}

/**
 * Validation utilities with error handling
 */
export class ValidationHelper {
  /**
   * Validate email with detailed error response
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || email.trim().length === 0) {
      return {
        isValid: false,
        error: 'Email is required'
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email.trim())

    return {
      isValid,
      error: isValid ? undefined : 'Please enter a valid email address'
    }
  }

  /**
   * Validate OTP code with detailed error response
   */
  static validateOTPCode(code: string): { isValid: boolean; error?: string } {
    if (!code || code.trim().length === 0) {
      return {
        isValid: false,
        error: 'Verification code is required'
      }
    }

    const codeRegex = /^\d{6}$/
    const isValid = codeRegex.test(code.trim())

    return {
      isValid,
      error: isValid ? undefined : 'Please enter a 6-digit verification code'
    }
  }
}