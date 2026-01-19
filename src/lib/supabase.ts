import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const SUPABASE_URL = 'https://jubwnkwqkqsmexcyrark.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_RKaQfy08qo8o12-8uMmUfw_HM6gWov2'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

export function createSupabaseClient(env?: { SUPABASE_URL?: string; SUPABASE_KEY?: string }) {
  const url = env?.SUPABASE_URL || SUPABASE_URL
  const key = env?.SUPABASE_KEY || SUPABASE_ANON_KEY
  return createClient<Database>(url, key)
}
