import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Créer le client avec le schéma 'core' (DB_Matress_IGC)
// Auth activé avec refresh automatique et persistance de session
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: { schema: 'core' },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  : null;

// Fonction helper pour obtenir le client
export function getSupabaseClient() {
  if (!supabase) {
    console.warn('Supabase client not initialized - missing environment variables');
    return null;
  }
  return supabase;
}

// Vérifie que l'utilisateur est authentifié avant les opérations sensibles
export async function getAuthenticatedUser() {
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Erreur d\'authentification:', error.message);
    return null;
  }
  return user;
}
