import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.SUPABASE_URL
const supabaseAnonKey = import.meta.PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)