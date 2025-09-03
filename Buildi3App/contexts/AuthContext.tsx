import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase/client'
import { authService } from '../lib/supabase/auth'
import type { Profile } from '../lib/supabase/types'

interface AuthContextType {
  // Auth state
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean

  // Auth actions
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to fetch profile for a specific user
  // Centralizes profile fetching logic and prevents duplicates
  const fetchProfileForUser = async (userId: string, setLoadingToFalse: boolean = false) => {
    try {
      console.log('🔄 Fetching profile for user:', userId)
      const startTime = Date.now()
      
      const { profile: userProfile, error } = await authService.getCurrentProfile()
      const fetchTime = Date.now() - startTime
      
      if (error) {
        console.error('❌ Profile fetch error:', error)
        // Check if it's a "no profile found" error (user in onboarding)
        if (error.message?.includes('0 rows') || error.message?.includes('No rows')) {
          console.log('ℹ️ Profile not found - user may be in onboarding flow')
          setProfile(null)
        } else {
          console.error('💥 Unexpected profile fetch error:', error)
          setProfile(null)
        }
      } else {
        console.log(`✅ Profile fetched successfully in ${fetchTime}ms:`, {
          firstName: userProfile?.first_name,
          lastName: userProfile?.last_name,
          role: userProfile?.role,
          isActive: userProfile?.is_active
        })
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('💥 Profile fetch exception:', error)
      setProfile(null)
    } finally {
      // ALWAYS set loading to false when requested, regardless of success/failure
      if (setLoadingToFalse) {
        console.log('🏁 Setting loading to false - profile fetch operation completed')
        setLoading(false)
      }
    }
  }

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth()
  }, [])

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      
      if (event === 'SIGNED_OUT' || !session) {
        // Ensure complete cleanup on sign out
        console.log('Cleaning up after sign out...')
        setSession(null)
        setUser(null)
        setProfile(null)
        setLoading(false)
        
        // Clear AsyncStorage
        try {
          await AsyncStorage.removeItem('buildi3-supabase-auth-token')
          console.log('AsyncStorage cleared on auth state change')
        } catch (error) {
          console.error('Error clearing storage on sign out:', error)
        }
      } else {
        // Handle signed in states - set session and user immediately
        setSession(session)
        setUser(session?.user ?? null)
        
        // Profile loading is handled separately by fetchProfileForUser
        // This prevents duplicate API calls and race conditions
        if (session?.user?.email_confirmed_at) {
          console.log('🔄 Auth state change - fetching profile for confirmed user')
          // Don't set loading to false until profile is fetched to prevent race conditions
          // Use await to ensure profile fetch completes before proceeding
          fetchProfileForUser(session.user.id, true)
        } else {
          console.log('User email not confirmed - clearing profile')
          setProfile(null)
          setLoading(false)
        }
      }

      // Log auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ User signed in:', session?.user?.email)
          break
        case 'SIGNED_OUT':
          console.log('🔓 User signed out - state cleaned')
          break
        case 'TOKEN_REFRESHED':
          console.log('🔄 Token refreshed for user:', session?.user?.email)
          break
        case 'USER_UPDATED':
          console.log('👤 User updated:', session?.user?.email)
          break
        case 'INITIAL_SESSION':
          console.log('🚀 Initial session loaded:', session?.user?.email || 'No session')
          break
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)
      console.log('🚀 Starting auth initialization...')
      
      // Get cached session (fastest method)
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Failed to get initial session:', error)
        setUser(null)
        setSession(null)
        setProfile(null)
        setLoading(false) // Set loading false here since no further async ops
      } else if (data.session) {
        console.log('✅ Initial session found:', data.session.user?.email)
        setSession(data.session)
        setUser(data.session.user)
        
        // Load profile if user is confirmed
        if (data.session.user?.email_confirmed_at) {
          console.log('🔄 Fetching profile for confirmed user...')
          // Fetch profile and set loading to false after completion
          // Don't set loading to false here - let fetchProfileForUser handle it
          await fetchProfileForUser(data.session.user.id, true)
          return // Exit early - loading state handled by fetchProfileForUser
        } else {
          console.log('⚠️ User email not confirmed - skipping profile load')
          setProfile(null)
          setLoading(false) // Set loading false here since no further async ops
        }
      } else {
        console.log('ℹ️ No initial session found')
        setUser(null)
        setSession(null)
        setProfile(null)
        setLoading(false) // Set loading false here since no further async ops
      }
    } catch (err) {
      console.error('❌ Auth initialization error:', err)
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false) // Set loading false on error
    }
    // Remove finally block - loading state is now handled explicitly in each path
    console.log('✅ Auth initialization completed')
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('Starting sign out process...')
      
      // Sign out from Supabase with global scope
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      
      if (error) {
        console.error('Supabase sign out error:', error)
      } else {
        console.log('Supabase sign out successful')
      }
      
      // Clear AsyncStorage
      try {
        const allKeys = await AsyncStorage.getAllKeys()
        const supabaseKeys = allKeys.filter(key => key.includes('supabase'))
        if (supabaseKeys.length > 0) {
          await AsyncStorage.multiRemove(supabaseKeys)
          console.log('Cleared Supabase keys from AsyncStorage')
        }
      } catch (storageError) {
        console.error('AsyncStorage clear error:', storageError)
      }
      
      // Clear local state
      setUser(null)
      setSession(null)
      setProfile(null)
      
      console.log('Sign out completed')
    } catch (err) {
      console.error('Sign out error:', err)
      // Always clear local state even on error
      setUser(null)
      setSession(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session refresh error:', error)
        return
      }
      
      setSession(data.session)
      setUser(data.session?.user ?? null)
      
      console.log('Session refreshed successfully')
    } catch (err) {
      console.error('Unexpected session refresh error:', err)
    }
  }

  // Add debug helper for development
  const getAuthDebugInfo = () => {
    return {
      hasUser: !!user,
      userEmail: user?.email,
      userEmailConfirmed: user?.email_confirmed_at,
      hasSession: !!session,
      sessionExpiry: session?.expires_at,
      hasProfile: !!profile,
      profileActive: profile?.is_active,
      profileComplete: !!(profile?.first_name && profile?.last_name && profile?.role),
      profileData: profile ? {
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role,
        isActive: profile.is_active
      } : null,
      loading,
    }
  }

  // Log auth state changes for debugging
  useEffect(() => {
    if (!loading) {
      console.log('🔍 Auth State Debug (Final):', getAuthDebugInfo())
    }
  }, [user, profile, loading])

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hooks for common auth checks
export function useUser(): User | null {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider')
  }
  
  return context.user
}

export function useSession(): Session | null {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider')
  }
  
  return context.session
}

export function useIsAuthenticated(): boolean {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useIsAuthenticated must be used within an AuthProvider')
  }
  
  return !!context.user
}