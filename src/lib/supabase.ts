import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const SUPABASE_URL = 'https://jubwnkwqkqsmexcyrark.supabase.co'
// Use JWT anon key instead of publishable key
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1Yndua3dxa3FzbWV4Y3lyYXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Mzc0MTYsImV4cCI6MjA4NDQxMzQxNn0.2Pz1D-o5jE4Iw-72gfu4CMk0Daaj5nMm-jWrt8zhpjo'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

export function createSupabaseClient(env?: { SUPABASE_URL?: string; SUPABASE_KEY?: string }) {
  const url = env?.SUPABASE_URL || SUPABASE_URL
  const key = env?.SUPABASE_KEY || SUPABASE_ANON_KEY
  return createClient<Database>(url, key)
}
