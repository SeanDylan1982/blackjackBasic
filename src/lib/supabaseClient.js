import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'pdftvqjqwrnwgacmtecc.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)