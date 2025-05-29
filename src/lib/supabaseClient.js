import { createClient } from '@supabase/supabase-js'

const supabaseUrl = window.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = window.env.REACT_APP_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)