import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'pdftvqjqwrnwgacmtecc.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)