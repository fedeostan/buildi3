import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from './types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

console.log('Supabase client initializing with URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('Supabase client initializing with Key:', supabaseAnonKey ? 'SET' : 'MISSING');

// Create Supabase client with React Native optimizations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use AsyncStorage for session persistence
    storage: AsyncStorage,
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist session across app restarts
    persistSession: true,
    // Detect session in URL (web) or AsyncStorage (mobile)
    detectSessionInUrl: false,
    // Custom storage key for React Native
    storageKey: 'buildi3-supabase-auth-token',
  },
  realtime: {
    // Enable realtime for construction site updates
    params: {
      eventsPerSecond: 5, // Limit for mobile data usage
    },
  },
  global: {
    headers: {
      // Custom headers for mobile app identification
      'X-Client-Info': 'buildi3-mobile-app',
      'X-Client-Version': '1.0.0',
    },
  },
})

// Helper function to get current user profile with type safety
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return profile
}

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

// Export types for easier imports
export type { Database, Tables, TablesInsert, TablesUpdate } from './types'