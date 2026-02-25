import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Créer le client seulement si les variables sont définies
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fonction helper pour obtenir le client
export function getSupabaseClient() {
  if (!supabase) {
    console.warn('Supabase client not initialized - missing environment variables');
    return null;
  }
  return supabase;
}
