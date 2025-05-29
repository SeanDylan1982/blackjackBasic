import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'pdftvqjqwrnwgacmtecc.supabase.co:5432/postgres'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZnR2cWpxd3Jud2dhY210ZWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzQ2OTAsImV4cCI6MjA2NDExMDY5MH0.OkJjvTFSF1iDbG5tdSiFw34CnPfskZOAcJWtztYQicQ'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)