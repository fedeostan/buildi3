import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://nmjnasilxosrghilwwno.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tam5hc2lseG9zcmdoaWx3d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjY5NzYsImV4cCI6MjA2MTI0Mjk3Nn0.ZzldIq_qwt8xYgVSnco-dHeHpI8Ty_l6Yh9opXW_e9A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use AsyncStorage for token persistence in React Native
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for React Native
  },
})

export type Database = {
  // Add your database types here if needed
}