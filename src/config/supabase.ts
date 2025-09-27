
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_PROJECT_URL as string;
const supabaseKey = import.meta.env.VITE_API_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey)


// Create a single supabase client for interacting with your database