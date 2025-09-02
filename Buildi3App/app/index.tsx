import { useEffect } from 'react'
import { router } from 'expo-router'
import { useAuth } from '../hooks/useAuth'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '../theme'

/**
 * App Entry Point - Clean Authentication Check and Routing
 * 
 * Simple deterministic flow:
 * 1. Wait for auth to initialize (loading = false)
 * 2. No user → welcome screen
 * 3. User + complete profile → main app  
 * 4. User + incomplete profile → appropriate onboarding step
 */
export default function IndexScreen() {
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    // Wait for auth initialization to complete
    if (loading) {
      return
    }

    console.log('🎯 Determining route:', { 
      hasUser: !!user, 
      hasProfile: !!profile, 
      profileActive: profile?.is_active 
    })

    // Route 1: No authenticated user → Welcome screen
    if (!user) {
      console.log('→ Welcome (no user)')
      router.replace('/welcome')
      return
    }

    // Route 2: User but no profile → Start onboarding
    if (!profile) {
      console.log('→ Complete Profile (no profile)')
      router.replace('/complete-profile')
      return
    }

    // Route 3: Check onboarding completion status
    const isOnboardingComplete = !!(
      profile.first_name && 
      profile.last_name && 
      profile.role &&
      profile.is_active
    )

    if (!isOnboardingComplete) {
      // Resume onboarding from correct step
      if (!profile.first_name || !profile.last_name) {
        console.log('→ Complete Profile (missing name)')
        router.replace('/complete-profile')
      } else if (!profile.role) {
        console.log('→ Role Selection (missing role)')
        router.replace('/role-selection')
      } else {
        console.log('→ Job Description (finalizing)')
        router.replace('/job-description-selection')
      }
      return
    }

    // Route 4: Fully onboarded → Main app
    console.log('→ Main App (fully onboarded)')
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