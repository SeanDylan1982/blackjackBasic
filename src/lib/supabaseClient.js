import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.env.SUPABASE_URL
const supabaseAnonKey = import.env.PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)