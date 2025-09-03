import { useEffect } from 'react'
import { router } from 'expo-router'
import { useAuth } from '../hooks/useAuth'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '../theme'

/**
 * App Entry Point - Clean Authentication Check and Routing
 * 
 * Fixed deterministic flow:
 * 1. Wait for auth to initialize (loading = false) - now includes profile loading
 * 2. No user → welcome screen
 * 3. User + complete profile → main app  
 * 4. User + incomplete profile → appropriate onboarding step
 * 
 * Race condition fixes:
 * - AuthContext now waits for profile fetch before setting loading=false
 * - This ensures profile state is stable before navigation decisions
 */
export default function IndexScreen() {
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    // Wait for auth initialization to complete (including profile fetch)
    if (loading) {
      console.log('⏳ Auth still loading... waiting for completion')
      return
    }

    console.log('🎯 Determining route:', { 
      hasUser: !!user, 
      userEmail: user?.email,
      hasProfile: !!profile, 
      profileActive: profile?.is_active,
      profileComplete: profile ? !!(profile.first_name && profile.last_name && profile.role && profile.is_active) : false,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      role: profile?.role,
      isActive: profile?.is_active
    })

    // Route 1: No authenticated user → Welcome screen
    if (!user) {
      console.log('→ Welcome (no user)')
      router.replace('/welcome')
      return
    }

    // Route 2: User but no profile → Start onboarding
    if (!profile) {
      console.log('→ Complete Profile (no profile found)')
      router.replace('/complete-profile')
      return
    }

    // Route 3: Check onboarding completion status with detailed logging
    const hasFirstName = !!(profile.first_name && profile.first_name.trim())
    const hasLastName = !!(profile.last_name && profile.last_name.trim())
    const hasRole = !!(profile.role && profile.role.trim())
    const isActive = !!profile.is_active

    console.log('📋 Profile completion check:', {
      hasFirstName,
      hasLastName, 
      hasRole,
      isActive,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
      is_active: profile.is_active
    })

    const isOnboardingComplete = hasFirstName && hasLastName && hasRole && isActive

    if (!isOnboardingComplete) {
      // Resume onboarding from correct step
      if (!hasFirstName || !hasLastName) {
        console.log('→ Complete Profile (missing name data)')
        router.replace('/complete-profile')
      } else if (!hasRole) {
        console.log('→ Role Selection (missing role)')
        router.replace('/role-selection')
      } else if (!isActive) {
        console.log('→ Job Description (account not active)')
        router.replace('/job-description-selection')
      } else {
        console.log('→ Job Description (unknown completion step)')
        router.replace('/job-description-selection')
      }
      return
    }

    // Route 4: Fully onboarded → Main app
    console.log('✅ Profile complete → Main App (fully onboarded)')
    router.replace('/(tabs)/home')
  }, [user, profile, loading])

  // Show loading state while determining route
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}